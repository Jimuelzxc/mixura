
"use client"

import React, { useState, useRef, useEffect } from 'react';
import type { ImageItem } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { Plus, Minus, Maximize, RefreshCcw, Expand, Minimize } from 'lucide-react';
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
}

const DraggableImage: React.FC<DraggableImageProps> = ({ image, onSelect, onUpdate, scale }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: image.x || 100, y: image.y || 100 });
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const wasDraggedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    
    e.preventDefault();
    e.stopPropagation();

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        wasDraggedRef.current = true;
        
        e.stopPropagation();

        const parentRect = dragRef.current.parentElement?.getBoundingClientRect();
        if (!parentRect) return;

        let newX = (e.clientX - parentRect.left) / scale - offsetRef.current.x;
        let newY = (e.clientY - parentRect.top) / scale - offsetRef.current.y;
        
        setPosition({ x: newX, y: newY });
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
    };
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, scale, image, onUpdate, position.x, position.y]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!wasDraggedRef.current) {
          onSelect(image);
      }
  }

  return (
    <div
      ref={dragRef}
      className={cn(
        "absolute w-64 cursor-grab transition-shadow duration-200",
        isDragging ? 'shadow-2xl z-10 !cursor-grabbing' : 'shadow-md hover:shadow-lg'
      )}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className="w-full h-auto relative overflow-hidden rounded-md">
        <Image
            src={image.url}
            alt={image.title}
            width={256}
            height={256}
            className="object-cover pointer-events-none w-full h-auto"
        />
      </div>
    </div>
  );
};

const Controls = ({ onToggleFullscreen, isFullscreen }: { onToggleFullscreen: () => void, isFullscreen: boolean }) => {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls();
  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => zoomIn()}><Plus /></Button>
      <Button variant="outline" size="icon" onClick={() => zoomOut()}><Minus /></Button>
      <Button variant="outline" size="icon" onClick={() => resetTransform()}><RefreshCcw /></Button>
      <Button variant="outline" size="icon" onClick={() => centerView()}><Maximize /></Button>
      <Button variant="outline" size="icon" onClick={onToggleFullscreen}>
        {isFullscreen ? <Minimize /> : <Expand />}
      </Button>
    </div>
  );
};


export default function FreedomGrid({ images, onImageSelect, onUpdateImage, isFullscreen, onToggleFullscreen }: FreedomGridProps) {
  const [currentScale, setCurrentScale] = useState(1);
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
          {images.map(image => (
            <DraggableImage 
                key={image.id}
                image={image} 
                onSelect={onImageSelect}
                onUpdate={onUpdateImage}
                scale={currentScale}
            />
          ))}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
