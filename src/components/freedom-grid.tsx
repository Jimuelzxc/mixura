
"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ImageItem } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Plus, Minus, RefreshCcw, Expand, Minimize } from 'lucide-react';
import { Button } from './ui/button';

interface FreedomGridProps {
  images: ImageItem[];
  onImageSelect: (image: ImageItem) => void;
  onUpdateImage: (image: ImageItem, showToast?: boolean) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

interface DraggableImageProps {
  image: ImageItem;
  onSelect: (image: ImageItem) => void;
  onUpdate: (image: ImageItem, showToast?: boolean) => void;
  scale: number;
  isSelected: boolean;
  onSelectForResize: (id: string | null) => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ image, onSelect, onUpdate, scale, isSelected, onSelectForResize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: image.x || 100, y: image.y || 100 });
  const [size, setSize] = useState({ width: image.width || 256, height: image.height || 256 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const wasDraggedRef = useRef(false);

  useEffect(() => {
    setPosition({ x: image.x || 100, y: image.y || 100 });
    setSize({ width: image.width || 256, height: image.height || 256 });
  }, [image.x, image.y, image.width, image.height]);

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const imgAspectRatio = naturalWidth / naturalHeight;
    setAspectRatio(imgAspectRatio);

    if (!image.width || !image.height) {
        // If no width/height is set, initialize it based on aspect ratio
        const initialWidth = 256;
        const initialHeight = initialWidth / imgAspectRatio;
        setSize({ width: initialWidth, height: initialHeight });
    } else {
        // If width/height is set, ensure it respects the aspect ratio
        setSize(prevSize => {
            const newHeight = prevSize.width / imgAspectRatio;
            if (Math.abs(newHeight - prevSize.height) > 1) { // allow for small floating point differences
                return { width: prevSize.width, height: newHeight };
            }
            return prevSize;
        });
    }
  };


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    
    e.preventDefault();
    e.stopPropagation();

    onSelectForResize(image.id);

    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale,
      };
      setIsDragging(true);
      wasDraggedRef.current = false;
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!aspectRatio) return;

    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Dispatch a synthetic event to keep the custom cursor in sync
      const customEvent = new MouseEvent('mousemove', {
        clientX: e.clientX,
        clientY: e.clientY,
        bubbles: true,
      });
      window.dispatchEvent(customEvent);

      if (isDragging && dragRef.current) {
        wasDraggedRef.current = true;
        e.stopPropagation();
        const parentRect = dragRef.current.parentElement?.getBoundingClientRect();
        if (!parentRect) return;
        let newX = (e.clientX - parentRect.left) / scale - offsetRef.current.x;
        let newY = (e.clientY - parentRect.top) / scale - offsetRef.current.y;
        setPosition({ x: newX, y: newY });
      } else if (isResizing && dragRef.current && aspectRatio) {
        wasDraggedRef.current = true;
        e.stopPropagation();

        const dx = (e.clientX - resizeStartRef.current.x) / scale;
        
        const newWidth = resizeStartRef.current.width + dx;
        const newHeight = newWidth / aspectRatio;

        setSize({
            width: Math.max(50, newWidth),
            height: Math.max(50 / aspectRatio, newHeight)
        });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        e.stopPropagation();
        setIsDragging(false);
        if (wasDraggedRef.current) {
          onUpdate({ ...image, x: position.x, y: position.y }, false);
        }
      }
      if (isResizing) {
        e.stopPropagation();
        setIsResizing(false);
        if (wasDraggedRef.current) {
            onUpdate({ ...image, x: position.x, y: position.y, width: size.width, height: size.height }, false);
        }
      }
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, scale, image, onUpdate, position, size, aspectRatio]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!wasDraggedRef.current) {
          onSelectForResize(image.id)
      }
  }

  const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect(image);
  };
  
  const containerStyle = {
    left: position.x,
    top: position.y,
    width: size.width,
    height: size.height,
    aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
  };

  return (
    <div
      ref={dragRef}
      className={cn(
        "absolute cursor-grab group/image p-0",
        isDragging && 'z-10 !cursor-grabbing',
        isSelected && 'ring-2 ring-primary ring-offset-background ring-offset-2'
      )}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <Image
          src={image.url}
          alt={image.title}
          fill
          className="object-contain pointer-events-none"
          unoptimized
          onLoad={handleImageLoad}
      />
      {isSelected && (
        <div 
          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-background cursor-se-resize z-20"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
};

const Controls = ({ onToggleFullscreen, isFullscreen }: { onToggleFullscreen: () => void, isFullscreen: boolean }) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => zoomIn()}><Plus /></Button>
      <Button variant="outline" size="icon" onClick={() => zoomOut()}><Minus /></Button>
      <Button variant="outline" size="icon" onClick={() => resetTransform()}><RefreshCcw /></Button>
      <Button variant="outline" size="icon" onClick={onToggleFullscreen}>
        {isFullscreen ? <Minimize /> : <Expand />}
      </Button>
    </div>
  );
};


export default function FreedomGrid({ images, onImageSelect, onUpdateImage, isFullscreen, onToggleFullscreen }: FreedomGridProps) {
  const [currentScale, setCurrentScale] = useState(1);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleCanvasClick = () => {
    setSelectedImageId(null);
  }

  return (
    <div className={cn("relative w-full border rounded-md bg-card/50 overflow-hidden touch-none flex-grow", isFullscreen && "h-full")}>
       <TransformWrapper
        minScale={0.1}
        maxScale={8}
        initialScale={1}
        limitToBounds={false}
        onTransformed={(ref) => setCurrentScale(ref.state.scale)}
        panning={{
            disabled: false,
            velocityDisabled: true,
        }}
        doubleClick={{
            disabled: true,
        }}
       >
        <Controls onToggleFullscreen={onToggleFullscreen} isFullscreen={isFullscreen} />
        <TransformComponent
            wrapperClass="!w-full !h-full"
            contentClass="relative"
        >
            <div className="w-full h-full" onClick={handleCanvasClick}>
                {images.map(image => (
                    <DraggableImage 
                        key={image.id}
                        image={image} 
                        onSelect={onImageSelect}
                        onUpdate={onUpdateImage}
                        scale={currentScale}
                        isSelected={selectedImageId === image.id}
                        onSelectForResize={setSelectedImageId}
                    />
                ))}
            </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}

    