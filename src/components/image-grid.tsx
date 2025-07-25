
"use client";

import type { ImageItem, ViewSettings } from '@/lib/types';
import ImageCard from './image-card';
import { cn } from '@/lib/utils';
import ImageListItem from './image-list-item';
import CanvasGrid from './canvas-grid';


interface ImageGridProps {
  images: ImageItem[];
  onImageSelect: (image: ImageItem) => void;
  onTagClick: (tag: string) => void;
  viewSettings: ViewSettings | undefined;
  onUpdateImage: (image: ImageItem, showToast?: boolean) => void;
  isCanvasFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onUpdateViewSettings?: (settings: Partial<ViewSettings>) => void;
}

export default function ImageGrid({ 
  images, 
  onImageSelect, 
  onTagClick, 
  viewSettings, 
  onUpdateImage, 
  isCanvasFullscreen = false, 
  onToggleFullscreen = () => {},
  onUpdateViewSettings = () => {}
}: ImageGridProps) {
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

  if (viewMode === 'moodboard') {
    return (
      <div className={cn("gap-4", columnClasses[gridColumns] || 'columns-3')}>
        {images.map((image) => (
          <ImageCard key={image.id} image={image} onSelect={() => onImageSelect(image)} onTagClick={onTagClick} />
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
  
  if (viewMode === 'canvas') {
    return (
      <CanvasGrid 
        images={images} 
        onImageSelect={onImageSelect} 
        onUpdateImage={onUpdateImage} 
        isFullscreen={isCanvasFullscreen}
        onToggleFullscreen={onToggleFullscreen}
        viewSettings={viewSettings}
        onUpdateViewSettings={onUpdateViewSettings}
      />
    )
  }

  return null;
}
