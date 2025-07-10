"use client";

import type { Board } from '@/lib/types';
import { ThemeToggle } from './theme-toggle';
import { LogoWithText } from './assets/logo-with-text';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { Menu, Plus, Upload, Download, Trash2, Check, CopyPlus, Trash } from 'lucide-react';


interface AppHeaderProps {
  onAddImageClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onDeleteAllClick: () => void;
  boards: Board[];
  activeBoardId: string | null;
  onNewBoard: () => void;
  onSwitchBoard: (boardId: string) => void;
  onDeleteBoard: () => void;
}

export default function AppHeader({ 
  onAddImageClick, 
  onImportClick, 
  onExportClick, 
  onDeleteAllClick,
  boards,
  activeBoardId,
  onNewBoard,
  onSwitchBoard,
  onDeleteBoard,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
            <LogoWithText className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuLabel>File</DropdownMenuLabel>
              <DropdownMenuItem onClick={onAddImageClick}>
                <Plus className="mr-2" />
                <span>New Image</span>
                <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuLabel>Board</DropdownMenuLabel>
               <DropdownMenuSub>
                <DropdownMenuSubTrigger>Switch Board</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={activeBoardId || ''} onValueChange={onSwitchBoard}>
                    {boards.map(board => (
                      <DropdownMenuRadioItem key={board.id} value={board.id}>
                        {board.name}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuItem onClick={onNewBoard}>
                <CopyPlus className="mr-2" />
                <span>New Board</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDeleteBoard} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash className="mr-2" />
                <span>Delete Current Board...</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Data</DropdownMenuLabel>
               <DropdownMenuItem onClick={onImportClick}>
                <Upload className="mr-2" />
                <span>Import from JSON...</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportClick}>
                <Download className="mr-2" />
                <span>Export to JSON...</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDeleteAllClick} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2" />
                <span>Delete All Data...</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
