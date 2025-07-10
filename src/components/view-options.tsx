
"use client";

import { List, LayoutGrid, Move, Grid3x3 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ViewSettings, ViewMode } from '@/lib/types';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { cn } from '@/lib/utils';

interface ViewOptionsProps {
  settings: ViewSettings;
  onChange: (newSettings: Partial<ViewSettings>) => void;
}

const viewOptions: { value: ViewMode, label: string, icon: React.ElementType }[] = [
    { value: 'moodboard', label: 'Moodboard', icon: Grid3x3 },
    { value: 'list', label: 'List', icon: List },
    { value: 'canvas', label: 'Canvas', icon: Move },
]

export function ViewOptions({ settings, onChange }: ViewOptionsProps) {
  const isListMode = settings.viewMode === 'list';
  const showSlider = settings.viewMode === 'moodboard';
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
            <LayoutGrid className="mr-2 h-4 w-4" />
            View
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">View</h4>
            <p className="text-sm text-muted-foreground">
              Choose a layout for your content.
            </p>
          </div>
          <div className="grid gap-2">
            <RadioGroup
              value={settings.viewMode}
              onValueChange={(value: string) => onChange({ viewMode: value as ViewMode })}
              className="grid grid-cols-3 gap-2"
            >
              {viewOptions.map((option) => (
                  <Label
                      key={option.value}
                      htmlFor={`view-${option.value}`}
                      className={cn(
                          "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer w-24 h-24",
                          settings.viewMode === option.value ? 'border-primary' : ''
                      )}
                  >
                      <RadioGroupItem value={option.value} id={`view-${option.value}`} className="sr-only" />
                      <option.icon className="mb-2 h-6 w-6" />
                      {option.label}
                  </Label>
              ))}
            </RadioGroup>
          </div>
          
          {showSlider && (
            <>
            <Separator />
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="columns">Columns</Label>
                    <div className="flex items-center gap-4">
                        <Slider
                            id="columns"
                            value={[settings.gridColumns]}
                            onValueChange={(value) => onChange({ gridColumns: value[0] })}
                            min={1}
                            max={5}
                            step={1}
                            className="w-full"
                        />
                        <span className="text-sm font-medium text-muted-foreground w-4 text-center">{settings.gridColumns}</span>
                    </div>
                </div>
            </div>
            </>
          )}

          {isListMode && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Show in list</h4>
                <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="show-cover" checked={settings.listShowCover} onCheckedChange={(checked) => onChange({listShowCover: !!checked})} />
                        <label htmlFor="show-cover" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cover</label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="show-title" checked={settings.listShowTitle} onCheckedChange={(checked) => onChange({listShowTitle: !!checked})} />
                        <label htmlFor="show-title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Title</label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="show-notes" checked={settings.listShowNotes} onCheckedChange={(checked) => onChange({listShowNotes: !!checked})} />
                        <label htmlFor="show-notes" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Notes</label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="show-tags" checked={settings.listShowTags} onCheckedChange={(checked) => onChange({listShowTags: !!checked})} />
                        <label htmlFor="show-tags" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tags</label>
                    </div>
                </div>
              </div>

              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Cover Position</h4>
                <RadioGroup 
                    value={settings.listCoverPosition} 
                    onValueChange={(value) => onChange({listCoverPosition: value as 'left' | 'right'})}
                    className="flex gap-4"
                    disabled={!settings.listShowCover}
                >
                    <div>
                        <RadioGroupItem value="left" id="cover-left" className="peer sr-only" />
                        <Label htmlFor="cover-left" className="rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary">Left</Label>
                    </div>
                     <div>
                        <RadioGroupItem value="right" id="cover-right" className="peer sr-only" />
                        <Label htmlFor="cover-right" className="rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary">Right</Label>
                    </div>
                </RadioGroup>
              </div>
            </>
          )}

        </div>
      </PopoverContent>
    </Popover>
  );
}
