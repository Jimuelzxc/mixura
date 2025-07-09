"use client";

import Image from 'next/image';
import type { ImageItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';

interface ImageCardProps {
  image: ImageItem;
  onSelect: () => void;
}

export default function ImageCard({ image, onSelect }: ImageCardProps) {
  return (
    <div
      className="group mb-4 break-inside-avoid cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()}
    >
      <Card className="overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-xl">
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
    </div>
  );
}
