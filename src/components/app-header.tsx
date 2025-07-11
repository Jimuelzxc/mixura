
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
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { Menu, Plus, Upload, Download, Trash2, CopyPlus, Trash, LayoutGrid, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';


interface AppHeaderProps {
  onAddImageClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onDeleteAllClick: () => void;
  boards: Board[];
  activeBoardId: string | null;
  onNewBoard: () => void;
  onSwitchBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onRenameBoard: (boardId: string) => void;
  isAllBoardsView: boolean;
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
  onRenameBoard,
  isAllBoardsView
}: AppHeaderProps) {

  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
            <LogoWithText className="h-[120px] w-auto translate-x-[-15px]" />
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 p-1 rounded-lg bg-muted">
                <Button 
                    variant={isAllBoardsView ? "secondary" : "ghost"} 
                    size="sm"
                    onClick={() => onSwitchBoard('all')}
                    className="flex items-center gap-2"
                >
                    <LayoutGrid className="h-4 w-4" />
                    <span>All Boards</span>
                </Button>
                <div className="h-6 w-px bg-border" />
                {boards.map(board => (
                    <div key={board.id} className="group relative">
                        <Button 
                            variant={activeBoardId === board.id ? "secondary" : "ghost"} 
                            size="sm" 
                            onClick={() => onSwitchBoard(board.id)}
                            className="pr-8"
                        >
                            {board.name}
                        </Button>
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6" 
                                onClick={(e) => { e.stopPropagation(); onRenameBoard(board.id); }}
                            >
                                <Pencil className="h-3 w-3" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 hover:bg-destructive/10 text-destructive"
                                onClick={(e) => { e.stopPropagation(); onDeleteBoard(board.id); }}
                            >
                                <Trash className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                ))}
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNewBoard}>
                    <CopyPlus className="h-4 w-4" />
                    <span className="sr-only">New Board</span>
                </Button>
           </div>
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
              <DropdownMenuItem onClick={onAddImageClick} disabled={isAllBoardsView}>
                <Plus className="mr-2 h-4 w-4" />
                <span>New Image</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Data</DropdownMenuLabel>
               <DropdownMenuItem onClick={onImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                <span>Import</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportClick}>
                <Download className="mr-2 h-4 w-4" />
                <span>Export</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDeleteAllClick} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete All Data...</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
