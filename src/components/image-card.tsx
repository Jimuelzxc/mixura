
"use client";

import Image from 'next/image';
import type { ImageItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn, basicColorMap } from '@/lib/utils';

interface ImageCardProps {
  image: ImageItem;
  onSelect: () => void;
  onTagClick: (tag: string) => void;
  viewMode: 'moodboard' | 'cards';
}

export default function ImageCard({ image, onSelect, onTagClick, viewMode }: ImageCardProps) {
  return (
    <div
      className={cn(
        "group relative break-inside-avoid cursor-pointer overflow-hidden shadow-lg",
        viewMode === 'cards' && 'mb-4', // Masonry handles its own bottom margin
        viewMode === 'moodboard' && 'mb-4'
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      <div className={cn(
        "w-full",
        viewMode === 'cards' && "aspect-[4/3]"
      )}>
        <Image
          src={image.url}
          alt={image.title}
          width={500}
          height={viewMode === 'cards' ? 375 : 500}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="abstract texture"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-all duration-300 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
        <h3 className="font-bold text-lg truncate drop-shadow-md">{image.title}</h3>
        {image.notes && (
          <p className="text-sm mt-1 truncate opacity-90 drop-shadow-sm">
            {image.notes}
          </p>
        )}
        {(image.tags?.length > 0 || image.colors?.length > 0) && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {image.tags && image.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-white/40 bg-white/20 text-white backdrop-blur-sm cursor-pointer px-2 py-0.5 text-xs font-normal transition-colors hover:bg-white/30"
                  onClick={(e) => {
                      e.stopPropagation();
                      onTagClick(tag);
                  }}
                >
                  {tag}
                </Badge>
              ))}
              {image.colors && image.colors.map((color) => (
                  <div key={color} className="w-3 h-3 rounded-full border border-white/50" style={{ backgroundColor: basicColorMap[color] || '#000000' }} title={color} />
              ))}
            </div>
        )}
      </div>
    </div>
  );
}
