"use client";

import type { ImageItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Link } from 'lucide-react';

interface ImageHeadlineItemProps {
  image: ImageItem;
  onSelect: () => void;
}

export default function ImageHeadlineItem({ image, onSelect }: ImageHeadlineItemProps) {
  return (
    <div
      className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-accent transition-colors"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
        <h3 className="font-semibold text-lg">{image.title}</h3>
        <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
            <Link className="h-3 w-3" />
            <span className="truncate">{image.url}</span>
        </div>
    </div>
  );
}
