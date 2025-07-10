"use client";

import { SlidersHorizontal, Hash, Search, Palette, ImagePlus } from 'lucide-react';
import React from 'react';
import type { ViewSettings, ImageItem } from '@/lib/types';
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
import { cn, basicColorMap } from '@/lib/utils';

interface FilterToolbarProps {
  allTags: string[];
  allColors: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  selectedColors: string[];
  onColorSelect: (color: string) => void;
  viewSettings: ViewSettings;
  onViewSettingsChange: (settings: Partial<ViewSettings>) => void;
  onClearFilters: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddImageClick: () => void;
  itemCount: number;
}

export default function FilterToolbar({
  allTags,
  allColors,
  selectedTags,
  onTagSelect,
  selectedColors,
  onColorSelect,
  viewSettings,
  onViewSettingsChange,
  onClearFilters,
  searchTerm,
  onSearchChange,
  onAddImageClick,
  itemCount,
}: FilterToolbarProps) {
  const activeFilterCount = selectedTags.length + selectedColors.length;

  const sortedColors = React.useMemo(() => {
    const colorOrder = Object.keys(basicColorMap);
    return allColors.sort((a, b) => colorOrder.indexOf(a) - colorOrder.indexOf(b));
  }, [allColors]);

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Row 1: Search/Add */}
      <div className="flex items-center justify-end gap-4 flex-wrap">
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
          <Button variant="default" onClick={onAddImageClick}>
            <ImagePlus className="mr-2 h-5 w-5" />
            Add Image
          </Button>
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
                <SlidersHorizontal className="mr-2 h-4 w-4" />
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
                  {allTags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {allTags.map(tag => (
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
