"use client";

import { LayoutGrid, Tag, Hash, Grid3x3 } from 'lucide-react';
import type { Board } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface FilterToolbarProps {
  boards: Board[];
  tags: string[];
  selectedBoards: string[];
  onBoardSelect: (boardId: string) => void;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  gridColumns: number;
  onGridColumnsChange: (columns: number) => void;
}

export default function FilterToolbar({
  boards,
  tags,
  selectedBoards,
  onBoardSelect,
  selectedTags,
  onTagSelect,
  gridColumns,
  onGridColumnsChange
}: FilterToolbarProps) {
  return (
    <div className="px-4 md:px-6 space-y-4 mb-8">
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
      {tags.length > 0 && (
         <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Tag className="h-4 w-4" />
              Tags:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
            {tags.map(tag => (
                <Button
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTagSelect(tag)}
                className="rounded-full"
                >
                  <Hash />
                  {tag}
                </Button>
            ))}
            </div>
        </div>
      )}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Grid3x3 className="h-4 w-4" />
          Columns
        </span>
        <Slider
            value={[gridColumns]}
            onValueChange={(value) => onGridColumnsChange(value[0])}
            min={1}
            max={5}
            step={1}
            className="w-[150px]"
        />
        <span className="text-sm font-medium text-muted-foreground w-4 text-center">{gridColumns}</span>
      </div>
    </div>
  );
}
