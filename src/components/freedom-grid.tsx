
"use client"

import React, { useState, useRef, useEffect } from 'react';
import type { ImageItem } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
}

const DraggableImage: React.FC<DraggableImageProps> = ({ image, onSelect, onUpdate, boundsRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: image.x || 100, y: image.y || 100 });
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const wasDraggedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Left click only
    if (e.button !== 0) return;
    
    e.preventDefault();
    if (dragRef.current) {
      const rect = dragRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setIsDragging(true);
      wasDraggedRef.current = false;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && dragRef.current && boundsRef.current) {
      wasDraggedRef.current = true;
      const boundsRect = boundsRef.current.getBoundingClientRect();
      let newX = e.clientX - boundsRect.left - offsetRef.current.x;
      let newY = e.clientY - boundsRect.top - offsetRef.current.y;
      
      const itemRect = dragRef.current.getBoundingClientRect();
      newX = Math.max(0, Math.min(newX, boundsRect.width - itemRect.width));
      newY = Math.max(0, Math.min(newY, boundsRect.height - itemRect.height));

      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Only call update if the position actually changed during the drag
      if (wasDraggedRef.current) {
        onUpdate({ ...image, x: position.x, y: position.y }, false); // Pass false to not show toast
      }
    }
  };
  
  const handleClick = () => {
      // Only treat as a click if it wasn't dragged
      if (!wasDraggedRef.current) {
          onSelect(image);
      }
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp, { once: true });
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={dragRef}
      className={cn(
        "absolute w-64 cursor-grab transition-shadow duration-200",
        isDragging ? 'shadow-2xl z-10 cursor-grabbing' : 'shadow-md hover:shadow-lg'
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
  return (
    <div ref={containerRef} className="relative w-full h-[150vh] border rounded-md bg-card/50 overflow-hidden">
      {images.map(image => (
        <DraggableImage 
            key={image.id}
            image={image} 
            onSelect={onImageSelect}
            onUpdate={onUpdateImage}
            boundsRef={containerRef}
        />
      ))}
    </div>
  );
}
