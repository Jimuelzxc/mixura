"use client";

import { LayoutGrid, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AddLinkDialog from './add-link-dialog';
import type { Board, ImageItem } from '@/lib/types';

interface AppHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddImage: (image: Omit<ImageItem, 'id'>) => void;
  boards: Board[];
}

export default function AppHeader({ searchTerm, onSearchChange, onAddImage, boards }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <LayoutGrid className="h-7 w-7" />
          <h1 className="text-xl font-bold tracking-tight">LinkBoard</h1>
        </div>
        <div className="flex flex-1 items-center justify-center px-8 md:px-16">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by keyword, tag, or board..."
              className="w-full rounded-full bg-background/90 pl-10 text-foreground"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <AddLinkDialog onAddImage={onAddImage} boards={boards} />
      </div>
    </header>
  );
}
