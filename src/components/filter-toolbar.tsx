"use client";

import { Tag, Hash, Search } from 'lucide-react';
import type { Board, ViewSettings, ImageItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ViewOptions } from './view-options';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Input } from '@/components/ui/input';
import AddLinkDialog from './add-link-dialog';

interface FilterToolbarProps {
  boards: Board[];
  allBoards: Board[];
  tags: string[];
  selectedBoards: string[];
  onBoardSelect: (boardId: string) => void;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  viewSettings: ViewSettings;
  onViewSettingsChange: (settings: Partial<ViewSettings>) => void;
  onClearTagFilters: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddImage: (image: Omit<ImageItem, 'id'>, newBoardName?: string) => void;
  itemCount: number;
}

export default function FilterToolbar({
  boards,
  allBoards,
  tags,
  selectedBoards,
  onBoardSelect,
  selectedTags,
  onTagSelect,
  viewSettings,
  onViewSettingsChange,
  onClearTagFilters,
  searchTerm,
  onSearchChange,
  onAddImage,
  itemCount,
}: FilterToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Row 1: Boards and Search/Add */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Boards */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground mr-2">All boards</span>
          {boards.map(board => (
            <Button
              key={board.id}
              variant={selectedBoards.includes(board.id) ? 'default' : 'outline'}
              size="sm"
              onClick={() => onBoardSelect(board.id)}
              className="rounded-md"
            >
              {board.name}
            </Button>
          ))}
        </div>
        
        {/* Right: Search and Add */}
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search images..."
              className="w-full rounded-md bg-background pl-9"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <AddLinkDialog onAddImage={onAddImage} boards={allBoards} allTags={tags} />
        </div>
      </div>

      {/* Row 2: Item Count and Filter/View */}
      <div className="flex items-center justify-between gap-4 flex-wrap mt-2">
        {/* Left: Item Count */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">{itemCount} items</p>
        </div>
        
        {/* Right: Filter and View */}
        <div className="flex items-center gap-2">
           {tags.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Tag className="mr-2 h-4 w-4" />
                  Filters
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full p-0">{selectedTags.length}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium leading-none">Filters</h4>
                      <p className="text-sm text-muted-foreground">
                        Select one or more tags.
                      </p>
                    </div>
                    {selectedTags.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={onClearTagFilters}>Clear</Button>
                    )}
                  </div>
                  <Separator />
                  <div className="flex flex-wrap gap-1">
                    {tags.map(tag => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onTagSelect(tag)}
                        className="rounded-full"
                      >
                        <Hash className="w-3 h-3 mr-1"/>
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
          <ViewOptions settings={viewSettings} onChange={onViewSettingsChange} />
        </div>
      </div>
    </div>
  );
}
