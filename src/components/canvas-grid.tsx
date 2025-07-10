
"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ImageItem, ViewSettings, BackgroundPattern } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Plus, Minus, RefreshCcw, Expand, Minimize, AppWindow } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface CanvasGridProps {
  images: ImageItem[];
  onImageSelect: (image: ImageItem) => void;
  onUpdateImage: (image: ImageItem, showToast?: boolean) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  viewSettings: ViewSettings;
  onUpdateViewSettings: (settings: Partial<ViewSettings>) => void;
}

interface DraggableImageProps {
  image: ImageItem;
  onSelect: (image: ImageItem) => void;
  onUpdate: (image: ImageItem, showToast?: boolean) => void;
  scale: number;
  isSelected: boolean;
  onSelectForResize: (id: string | null) => void;
}

type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br';


const DraggableImage: React.FC<DraggableImageProps> = ({ image, onSelect, onUpdate, scale, isSelected, onSelectForResize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [activeResizeHandle, setActiveResizeHandle] = useState<ResizeHandle | null>(null);
  const [position, setPosition] = useState({ x: image.x || 100, y: image.y || 100 });
  const [size, setSize] = useState({ width: image.width || 256, height: image.height || 256 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });
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
        const initialWidth = 256;
        const initialHeight = initialWidth / imgAspectRatio;
        setSize({ width: initialWidth, height: initialHeight });
    } else {
        setSize(prevSize => {
            const newHeight = prevSize.width / imgAspectRatio;
            if (Math.abs(newHeight - prevSize.height) > 1) { 
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

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    if (!aspectRatio) return;

    setActiveResizeHandle(handle);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y,
    };
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
      } else if (activeResizeHandle && dragRef.current && aspectRatio) {
        wasDraggedRef.current = true;
        e.stopPropagation();

        const dx = (e.clientX - resizeStartRef.current.x) / scale;
        const dy = (e.clientY - resizeStartRef.current.y) / scale;
        
        let newWidth = resizeStartRef.current.width;
        let newHeight = resizeStartRef.current.height;
        let newX = resizeStartRef.current.posX;
        let newY = resizeStartRef.current.posY;

        switch (activeResizeHandle) {
          case 'br':
            newWidth = resizeStartRef.current.width + dx;
            newHeight = newWidth / aspectRatio;
            break;
          case 'bl':
            newWidth = resizeStartRef.current.width - dx;
            newHeight = newWidth / aspectRatio;
            newX = resizeStartRef.current.posX + dx;
            break;
          case 'tr':
            newWidth = resizeStartRef.current.width + dx;
            newHeight = newWidth / aspectRatio;
            newY = resizeStartRef.current.posY - (newHeight - resizeStartRef.current.height);
            break;
          case 'tl':
            newWidth = resizeStartRef.current.width - dx;
            newHeight = newWidth / aspectRatio;
            newX = resizeStartRef.current.posX + dx;
            newY = resizeStartRef.current.posY + (resizeStartRef.current.height - newHeight);
            break;
        }

        if (newWidth >= 50 && newHeight >= 50 / aspectRatio) {
          setSize({ width: newWidth, height: newHeight });
          setPosition({ x: newX, y: newY });
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const wasResizing = !!activeResizeHandle;
      if (isDragging) {
        e.stopPropagation();
        setIsDragging(false);
        if (wasDraggedRef.current) {
          onUpdate({ ...image, x: position.x, y: position.y }, false);
        }
      }
      if (wasResizing) {
        e.stopPropagation();
        setActiveResizeHandle(null);
        if (wasDraggedRef.current) {
            onUpdate({ ...image, x: position.x, y: position.y, width: size.width, height: size.height }, false);
        }
      }
    };
    
    if (isDragging || activeResizeHandle) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeResizeHandle, scale, image, onUpdate, position, size, aspectRatio]);

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

  const handleBaseClasses = "absolute w-4 h-4 rounded-full bg-primary border-2 border-background z-20";
  const handleScaleStyle = {
    transform: `scale(${1 / scale})`,
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
          <>
            <div 
              className={cn(handleBaseClasses, "-top-1 -left-1 cursor-nwse-resize")}
              style={{ ...handleScaleStyle, transformOrigin: 'top left' }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'tl')}
            />
            <div 
              className={cn(handleBaseClasses, "-top-1 -right-1 cursor-nesw-resize")}
              style={{ ...handleScaleStyle, transformOrigin: 'top right' }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'tr')}
            />
            <div 
              className={cn(handleBaseClasses, "-bottom-1 -left-1 cursor-nesw-resize")}
              style={{ ...handleScaleStyle, transformOrigin: 'bottom left' }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'bl')}
            />
            <div 
              className={cn(handleBaseClasses, "-bottom-1 -right-1 cursor-nwse-resize")}
              style={{ ...handleScaleStyle, transformOrigin: 'bottom right' }}
              onMouseDown={(e) => handleResizeMouseDown(e, 'br')}
            />
          </>
        )}
    </div>
  );
};

const PatternSelector = ({
  currentPattern,
  onPatternChange,
}: {
  currentPattern: BackgroundPattern;
  onPatternChange: (pattern: BackgroundPattern) => void;
}) => {
  const patterns: { name: BackgroundPattern; label: string }[] = [
    { name: 'none', label: 'None' },
    { name: 'dots', label: 'Dots' },
    { name: 'grid', label: 'Grid' },
    { name: 'lines', label: 'Lines' },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <AppWindow />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1">
        <div className="flex flex-col gap-1">
          {patterns.map((p) => (
            <Button
              key={p.name}
              variant={currentPattern === p.name ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onPatternChange(p.name)}
              className="justify-start"
            >
              {p.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};


const Controls = ({ 
  onToggleFullscreen, 
  isFullscreen,
  viewSettings,
  onUpdateViewSettings,
}: { 
  onToggleFullscreen: () => void; 
  isFullscreen: boolean;
  viewSettings: ViewSettings;
  onUpdateViewSettings: (settings: Partial<ViewSettings>) => void;
}) => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <>
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => zoomIn()}><Plus /></Button>
        <Button variant="outline" size="icon" onClick={() => zoomOut()}><Minus /></Button>
        <Button variant="outline" size="icon" onClick={() => resetTransform()}><RefreshCcw /></Button>
      </div>
       <div className="absolute top-4 right-4 z-20">
        <Button variant="outline" size="icon" onClick={onToggleFullscreen}>
          {isFullscreen ? <Minimize /> : <Expand />}
        </Button>
      </div>
      <div className="absolute bottom-4 right-4 z-20">
        <PatternSelector 
          currentPattern={viewSettings.backgroundPattern || 'none'}
          onPatternChange={(pattern) => onUpdateViewSettings({ backgroundPattern: pattern })}
        />
      </div>
    </>
  );
};


export default function CanvasGrid({ 
  images, 
  onImageSelect, 
  onUpdateImage, 
  isFullscreen, 
  onToggleFullscreen,
  viewSettings,
  onUpdateViewSettings
}: CanvasGridProps) {
  const [currentScale, setCurrentScale] = useState(1);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleCanvasClick = () => {
    setSelectedImageId(null);
  }

  const backgroundClass = {
    'dots': 'bg-dots',
    'grid': 'bg-grid',
    'lines': 'bg-lines',
    'none': '',
  }[viewSettings.backgroundPattern || 'none'];

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
        <Controls 
          onToggleFullscreen={onToggleFullscreen} 
          isFullscreen={isFullscreen} 
          viewSettings={viewSettings}
          onUpdateViewSettings={onUpdateViewSettings}
        />
        <TransformComponent
            wrapperClass="!w-full !h-full"
            contentClass="!w-[500vw] !h-[500vh]"
        >
            <div className={cn("w-full h-full relative", backgroundClass)} onClick={handleCanvasClick}>
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
