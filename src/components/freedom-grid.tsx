
"use client"

import React, { useState, useRef, useEffect } from 'react';
import type { ImageItem } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Hand } from 'lucide-react';

interface FreedomGridProps {
  images: ImageItem[];
  onImageSelect: (image: ImageItem) => void;
  onUpdateImage: (image: ImageItem, showToast?: boolean) => void;
}

interface DraggableImageProps {
  image: ImageItem;
  onSelect: (image: ImageItem) => void;
  onUpdate: (image: ImageItem, showToast?: boolean) => void;
  boundsRef: React.RefObject<HTMLDivElement>;
  scale: number;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ image, onSelect, onUpdate, boundsRef, scale }) => {
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
      document.body.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragRef.current && boundsRef.current) {
      wasDraggedRef.current = true;
      
      const parentRect = boundsRef.current.getBoundingClientRect();

      let newX = (e.clientX - parentRect.left) / scale - offsetRef.current.x;
      let newY = (e.clientY - parentRect.top) / scale - offsetRef.current.y;

      // Ensure the image stays within the canvas bounds (adjust if canvas is larger than viewport)
      // This logic can be enhanced, but for now, it keeps it within the initial canvas area.
      const imgWidth = dragRef.current.offsetWidth;
      const imgHeight = dragRef.current.offsetHeight;
      
      const canvasWidth = boundsRef.current.scrollWidth;
      const canvasHeight = boundsRef.current.scrollHeight;

      newX = Math.max(0, Math.min(newX, canvasWidth - imgWidth));
      newY = Math.max(0, Math.min(newY, canvasHeight - imgHeight));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      if (wasDraggedRef.current) {
        onUpdate({ ...image, x: position.x, y: position.y }, false);
      }
       document.body.style.cursor = '';
    }
  };
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      if (!wasDraggedRef.current) {
          onSelect(image);
      }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isDragging]);

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


export default function FreedomGrid({ images, onImageSelect, onUpdateImage }: FreedomGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.altKey) {
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        const zoomSpeed = 0.1;
        const delta = e.deltaY > 0 ? -1 : 1;
        const newScale = Math.min(Math.max(0.1, scale + delta * zoomSpeed), 5);
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newPanX = mouseX - (mouseX - pan.x) * (newScale / scale);
        const newPanY = mouseY - (mouseY - pan.y) * (newScale / scale);
        
        setScale(newScale);
        setPan({ x: newPanX, y: newPanY });
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && !isPanningRef.current) {
            e.preventDefault();
            isPanningRef.current = true;
            document.body.style.cursor = 'grab';
        }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            isPanningRef.current = false;
            document.body.style.cursor = 'default';
        }
    }
    
    const handleMouseDown = (e: MouseEvent) => {
        if (isPanningRef.current) {
            e.preventDefault();
            document.body.style.cursor = 'grabbing';
            panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseup', handleMouseUp, { once: true });
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        setPan({
            x: e.clientX - panStartRef.current.x,
            y: e.clientY - panStartRef.current.y
        });
    };

    const handleMouseUp = () => {
        document.body.style.cursor = 'grab';
        container.removeEventListener('mousemove', handleMouseMove);
    };


    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    container.addEventListener('mousedown', handleMouseDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
    };
  }, [scale, pan]);

  return (
    <div 
        ref={containerRef} 
        className="relative w-full h-[150vh] border rounded-md bg-card/50 overflow-hidden touch-none"
        style={{ cursor: isPanningRef.current ? 'grab' : 'default' }}
    >
        <div
            ref={canvasRef}
            className="absolute top-0 left-0"
            style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
                transformOrigin: '0 0'
            }}
        >
          {images.map(image => (
            <DraggableImage 
                key={image.id}
                image={image} 
                onSelect={onImageSelect}
                onUpdate={onUpdateImage}
                boundsRef={canvasRef}
                scale={scale}
            />
          ))}
        </div>
        
        <div className="absolute bottom-4 right-4 bg-background/80 text-foreground text-xs rounded-md px-2 py-1 shadow-md pointer-events-none">
            Zoom: {Math.round(scale * 100)}%
        </div>
        
        <div 
            className={cn(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground transition-opacity duration-300 pointer-events-none",
                isPanningRef.current ? "opacity-100" : "opacity-0"
            )}
        >
            <Hand className="w-16 h-16"/>
        </div>
    </div>
  );
}
