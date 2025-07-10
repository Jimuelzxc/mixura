
"use client";

import Image from 'next/image';
import type { ImageItem, ViewSettings } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn, basicColorMap } from '@/lib/utils';
import { Notebook, Tag, Palette } from 'lucide-react';

interface ImageListItemProps {
  image: ImageItem;
  settings: ViewSettings;
  onSelect: () => void;
  onTagClick: (tag: string) => void;
}

export default function ImageListItem({ image, settings, onSelect, onTagClick }: ImageListItemProps) {
  const { listShowCover, listShowTitle, listShowNotes, listShowTags, listCoverPosition } = settings;
  const isGif = image.url.toLowerCase().endsWith('.gif');

  return (
    <div
      className={cn(
        "flex gap-4 p-4 border bg-card text-card-foreground shadow-sm cursor-pointer hover:bg-accent transition-colors",
        listCoverPosition === 'right' ? 'flex-row-reverse' : 'flex-row'
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      {listShowCover && (
        <div className="w-32 md:w-48 flex-shrink-0">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={image.url}
              alt={image.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 128px, 192px"
              unoptimized={isGif}
            />
          </div>
        </div>
      )}
      <div className="flex-grow space-y-2">
        {listShowTitle && (
            <h3 className="font-bold text-lg">{image.title}</h3>
        )}
        {listShowNotes && image.notes && (
          <div className="flex items-start gap-2 text-muted-foreground">
             <Notebook className="h-4 w-4 mt-1 flex-shrink-0"/>
            <p className="text-sm">{image.notes}</p>
          </div>
        )}
        {listShowTags && image.tags.length > 0 && (
          <div className="flex items-start gap-2">
            <Tag className="h-4 w-4 mt-1.5 flex-shrink-0 text-muted-foreground"/>
            <div className="flex flex-wrap gap-2">
              {image.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(tag);
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
         {listShowTags && image.colors && image.colors.length > 0 && (
            <div className="flex items-start gap-2">
            <Palette className="h-4 w-4 mt-1.5 flex-shrink-0 text-muted-foreground"/>
            <div className="flex flex-wrap items-center gap-4">
                {image.colors.map((color) => (
                <div key={color} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border" style={{backgroundColor: basicColorMap[color] || '#000000'}} />
                    <span className="text-sm">{color}</span>
                </div>
                ))}
            </div>
            </div>
        )}
      </div>
    </div>
  );
}

    