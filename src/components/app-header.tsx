
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
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { Menu, Plus, Upload, Download, Trash2, CopyPlus, Trash, LayoutGrid, ChevronsUpDown, Pencil } from 'lucide-react';


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
  const activeBoard = boards.find(b => b.id === activeBoardId);
  const activeBoardName = isAllBoardsView ? "All Boards" : (activeBoard?.name || "Select Board");

  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
            <LogoWithText className="h-[120px] w-auto translate-x-[-15px]" />
        </div>
        <div className="flex items-center gap-2">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between">
                    <span className="truncate">{activeBoardName}</span>
                    <ChevronsUpDown className="h-4 w-4 opacity-50"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
                <DropdownMenuItem onSelect={() => onSwitchBoard('all')} className="justify-between">
                    <div className="flex items-center">
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      <span>All Boards</span>
                    </div>
                    {activeBoardId === 'all' && <div className="w-2 h-2 rounded-full bg-primary" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Your Boards</DropdownMenuLabel>
                {boards.map(board => (
                  <DropdownMenuItem key={board.id} onSelect={() => onSwitchBoard(board.id)} className="group justify-between">
                    <span className="truncate pr-2">{board.name}</span>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                    {activeBoardId === board.id && <div className="w-2 h-2 rounded-full bg-primary opacity-100 group-hover:opacity-0" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onNewBoard}>
                  <CopyPlus className="mr-2 h-4 w-4" />
                  <span>New Board</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Data</DropdownMenuLabel>
               <DropdownMenuItem onClick={onImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                <span>Import from JSON...</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportClick}>
                <Download className="mr-2 h-4 w-4" />
                <span>Export to JSON...</span>
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
