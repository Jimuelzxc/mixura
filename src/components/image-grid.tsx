"use client";

import type { ImageItem } from '@/lib/types';
import ImageCard from './image-card';

interface ImageGridProps {
  images: ImageItem[];
  onImageSelect: (image: ImageItem) => void;
  onTagClick: (tag: string) => void;
}

export default function ImageGrid({ images, onImageSelect, onTagClick }: ImageGridProps) {
  return (
    <div
      className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5"
    >
      {images.map((image) => (
        <ImageCard key={image.id} image={image} onSelect={() => onImageSelect(image)} onTagClick={onTagClick} />
      ))}
    </div>
  );
}
