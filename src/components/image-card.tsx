"use client";

import Image from 'next/image';
import type { ImageItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ImageCardProps {
  image: ImageItem;
  onSelect: () => void;
  onTagClick: (tag: string) => void;
}

export default function ImageCard({ image, onSelect, onTagClick }: ImageCardProps) {
  return (
    <div
      className="group mb-4 break-inside-avoid cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      <Card className="overflow-hidden rounded-md border-transparent bg-transparent transition-all hover:border-primary">
        <CardContent className="p-0">
          <div className="relative w-full">
            <Image
              src={image.url}
              alt={image.title}
              width={500}
              height={500}
              className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="abstract texture"
            />
          </div>
        </CardContent>
      </Card>
      <div className="pt-3 px-1">
        <h3 className="font-semibold text-primary truncate">{image.title}</h3>
        {image.notes && (
          <p className="text-sm text-muted-foreground mt-1 truncate">
            {image.notes}
          </p>
        )}
        {image.tags && image.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {image.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer px-2 py-0.5 text-xs font-normal transition-colors hover:bg-primary hover:text-primary-foreground"
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
  );
}
