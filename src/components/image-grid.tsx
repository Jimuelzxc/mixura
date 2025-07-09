"use client";

import type { ImageItem } from '@/lib/types';
import ImageCard from './image-card';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  images: ImageItem[];
  onImageSelect: (image: ImageItem) => void;
  onTagClick: (tag: string) => void;
  gridColumns: number;
}

export default function ImageGrid({ images, onImageSelect, onTagClick, gridColumns }: ImageGridProps) {
  const columnClasses: { [key: number]: string } = {
    1: 'columns-1',
    2: 'columns-2',
    3: 'columns-3',
    4: 'columns-4',
    5: 'columns-5',
  };
  
  return (
    <div
      className={cn("gap-4", columnClasses[gridColumns] || 'columns-3')}
    >
      {images.map((image) => (
        <ImageCard key={image.id} image={image} onSelect={() => onImageSelect(image)} onTagClick={onTagClick} />
      ))}
    </div>
  );
}
