"use client";

import { Triangle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AddLinkDialog from './add-link-dialog';
import type { Board, ImageItem } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';

interface AppHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddImage: (image: Omit<ImageItem, 'id'>, newBoardName?: string) => void;
  boards: Board[];
  allTags: string[];
}

export default function AppHeader({ searchTerm, onSearchChange, onAddImage, boards, allTags }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Triangle className="h-6 w-6 text-foreground" fill="currentColor"/>
          <h1 className="text-xl font-bold tracking-tight text-foreground">TARS</h1>
        </div>
        <div className="flex flex-1 items-center justify-center px-8 md:px-16">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by keyword, tag, or board..."
              className="w-full rounded-full bg-secondary border-transparent pl-10 text-foreground transition-colors focus:border-primary focus:bg-background"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddLinkDialog onAddImage={onAddImage} boards={boards} allTags={allTags} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
