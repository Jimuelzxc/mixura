"use client";

import { LayoutGrid, Tag, Hash } from 'lucide-react';
import type { Board, ViewSettings } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ViewOptions } from './view-options';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface FilterToolbarProps {
  boards: Board[];
  tags: string[];
  selectedBoards: string[];
  onBoardSelect: (boardId: string) => void;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  viewSettings: ViewSettings;
  onViewSettingsChange: (settings: Partial<ViewSettings>) => void;
  onClearTagFilters: () => void;
}

export default function FilterToolbar({
  boards,
  tags,
  selectedBoards,
  onBoardSelect,
  selectedTags,
  onTagSelect,
  viewSettings,
  onViewSettingsChange,
  onClearTagFilters,
}: FilterToolbarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <LayoutGrid className="h-4 w-4" />
            Boards:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {boards.map(board => (
              <Button
                key={board.id}
                variant={selectedBoards.includes(board.id) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onBoardSelect(board.id)}
                className="rounded-full"
              >
                {board.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
           {tags.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Tag className="mr-2 h-4 w-4" />
                  Tags
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full p-0">{selectedTags.length}</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium leading-none">Filter by Tag</h4>
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
