
"use client"

import React, { useState, useRef, useEffect } from 'react';
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
  
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, aspectRatio: 1 });
  const wasDraggedRef = useRef(false);

  useEffect(() => {
    setPosition({ x: image.x || 100, y: image.y || 100 });
    setSize({ width: image.width || 256, height: image.height || 256 });
  }, [image.x, image.y, image.width, image.height]);

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
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      aspectRatio: size.width / size.height
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
      } else if (isResizing && dragRef.current) {
        wasDraggedRef.current = true;
        e.stopPropagation();

        const dx = (e.clientX - resizeStartRef.current.x) / scale;
        
        const newWidth = resizeStartRef.current.width + dx;
        const newHeight = newWidth / resizeStartRef.current.aspectRatio;

        setSize({
            width: Math.max(50, newWidth),
            height: Math.max(50, newHeight)
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
  }, [isDragging, isResizing, scale, image, onUpdate, position, size]);

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

  return (
    <div
      ref={dragRef}
      className={cn(
        "absolute cursor-grab group/image",
        isDragging && 'z-10 !cursor-grabbing'
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
        <Image
            src={image.url}
            alt={image.title}
            width={size.width}
            height={size.height}
            className={cn(
                "object-cover pointer-events-none w-full h-full transition-shadow duration-200",
                isDragging ? 'shadow-2xl' : 'shadow-md group-hover/image:shadow-lg',
                isSelected && 'ring-2 ring-primary ring-offset-background ring-offset-2 z-10'
            )}
            unoptimized
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
    <div className={cn("relative w-full border rounded-md bg-card/50 overflow-hidden touch-none", isFullscreen ? "h-full" : "flex-grow")}>
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
