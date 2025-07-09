"use client";

import { Tag, Hash, Search, Palette } from 'lucide-react';
import React from 'react';
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
import { cn, basicColorMap } from '@/lib/utils';

interface FilterToolbarProps {
  boards: Board[];
  allBoards: Board[];
  tags: string[];
  allColors: string[];
  selectedBoards: string[];
  onBoardSelect: (boardId: string) => void;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  selectedColors: string[];
  onColorSelect: (color: string) => void;
  viewSettings: ViewSettings;
  onViewSettingsChange: (settings: Partial<ViewSettings>) => void;
  onClearFilters: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddImage: (image: Omit<ImageItem, 'id'>, newBoardName?: string) => void;
  itemCount: number;
}

export default function FilterToolbar({
  boards,
  allBoards,
  tags,
  allColors,
  selectedBoards,
  onBoardSelect,
  selectedTags,
  onTagSelect,
  selectedColors,
  onColorSelect,
  viewSettings,
  onViewSettingsChange,
  onClearFilters,
  searchTerm,
  onSearchChange,
  onAddImage,
  itemCount,
}: FilterToolbarProps) {
  const activeFilterCount = selectedTags.length + selectedColors.length;

  const sortedColors = React.useMemo(() => {
    const colorOrder = Object.keys(basicColorMap);
    return allColors.sort((a, b) => colorOrder.indexOf(a) - colorOrder.indexOf(b));
  }, [allColors]);

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Row 1: Boards and Search/Add */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Left: Boards */}
        <div className="flex items-center gap-2 flex-wrap">
          {boards.length > 0 && (
            <span className="text-sm font-medium text-muted-foreground mr-2">All boards</span>
          )}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Tag className="mr-2 h-4 w-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full p-0">{activeFilterCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium leading-none">Filters</h4>
                    <p className="text-sm text-muted-foreground">
                      Filter by tags and colors.
                    </p>
                  </div>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={onClearFilters}>Clear</Button>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h5 className="mb-2 text-xs font-medium text-muted-foreground flex items-center"><Hash className="w-3 h-3 mr-1.5"/> Tags</h5>
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {tags.map(tag => (
                        <Button
                          key={tag}
                          variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => onTagSelect(tag)}
                          className="rounded-full px-2 h-7"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No tags available yet.</p>
                  )}
                </div>

                {sortedColors.length > 0 && (
                  <>
                  <Separator />
                  <div>
                    <h5 className="mb-2 text-xs font-medium text-muted-foreground flex items-center"><Palette className="w-3 h-3 mr-1.5"/> Colors</h5>
                    <div className="flex flex-wrap gap-2">
                        {sortedColors.map(color => (
                            <button
                                key={color}
                                onClick={() => onColorSelect(color)}
                                className={cn(
                                    "w-6 h-6 rounded-full border-2 transition-all",
                                    selectedColors.includes(color) ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-card hover:border-muted-foreground',
                                    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                )}
                                style={{ backgroundColor: basicColorMap[color] || '#000000' }}
                                title={color}
                                aria-label={`Filter by color ${color}`}
                            />
                        ))}
                    </div>
                  </div>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <ViewOptions settings={viewSettings} onChange={onViewSettingsChange} />
        </div>
      </div>
    </div>
  );
}
