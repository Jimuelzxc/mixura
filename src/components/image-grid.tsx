
"use client";

import type { ImageItem, ViewSettings } from '@/lib/types';
import ImageCard from './image-card';
import { cn } from '@/lib/utils';
import ImageListItem from './image-list-item';
import FreedomGrid from './freedom-grid';


interface ImageGridProps {
  images: ImageItem[];
  onImageSelect: (image: ImageItem) => void;
  onTagClick: (tag: string) => void;
  viewSettings: ViewSettings | undefined;
  onUpdateImage: (image: ImageItem, showToast?: boolean) => void;
}

export default function ImageGrid({ images, onImageSelect, onTagClick, viewSettings, onUpdateImage }: ImageGridProps) {
  if (!viewSettings) {
    return null; // Or a loading skeleton
  }
  
  const { viewMode, gridColumns } = viewSettings;

  const columnClasses: { [key: number]: string } = {
    1: 'columns-1',
    2: 'columns-2',
    3: 'columns-3',
    4: 'columns-4',
    5: 'columns-5',
  };

  const gridClasses: { [key: number]: string } = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
  };

  if (viewMode === 'moodboard') {
    return (
      <div className={cn("gap-4", columnClasses[gridColumns] || 'columns-3')}>
        {images.map((image) => (
          <ImageCard key={image.id} image={image} onSelect={() => onImageSelect(image)} onTagClick={onTagClick} viewMode="moodboard" />
        ))}
      </div>
    );
  }

  if (viewMode === 'cards') {
    return (
        <div className={cn("grid gap-4", gridClasses[gridColumns] || 'grid-cols-3')}>
            {images.map((image) => (
                <ImageCard key={image.id} image={image} onSelect={() => onImageSelect(image)} onTagClick={onTagClick} viewMode="cards" />
            ))}
        </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {images.map((image) => (
          <ImageListItem key={image.id} image={image} onSelect={() => onImageSelect(image)} onTagClick={onTagClick} settings={viewSettings} />
        ))}
      </div>
    );
  }
  
  if (viewMode === 'freedom') {
    return (
      <FreedomGrid images={images} onImageSelect={onImageSelect} onUpdateImage={onUpdateImage} />
    )
  }

  return null;
}
