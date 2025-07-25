
"use client";

import Image from 'next/image';
import type { ImageItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ImageCardProps {
  image: ImageItem;
  onSelect: () => void;
  onTagClick: (tag: string) => void;
}

export default function ImageCard({ image, onSelect, onTagClick }: ImageCardProps) {
  const isGif = image.url.toLowerCase().endsWith('.gif');
  
  return (
    <div
      className="group relative break-inside-avoid cursor-pointer mb-4"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
        {/* Content Layer */}
        <div className="relative overflow-hidden">
            <div className="w-full">
                <Image
                src={image.url}
                alt={image.title}
                width={500}
                height={500}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                data-ai-hint="abstract texture"
                unoptimized={isGif}
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
                 <div className="mt-2 space-y-2">
                    {image.tags && image.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            {image.tags.map((tag) => (
                                <Badge
                                key={tag}
                                variant="outline"
                                className="border-white/40 bg-white/20 text-white backdrop-blur-sm cursor-pointer px-3 py-1 text-xs font-normal transition-colors hover:bg-white/30"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTagClick(tag);
                                }}
                                >
                                {tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}
