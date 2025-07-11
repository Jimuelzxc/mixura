
"use client";

import type { Board } from '@/lib/types';
import { Button } from './ui/button';
import { LayoutGrid, Pencil, Plus, Trash, X, Menu, Upload, Download, Trash2, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Logo } from './assets/logo';
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"
import { Separator } from './ui/separator';


interface BoardTabsProps {
  boards: Board[];
  activeBoardId: string | null;
  onNewBoard: () => void;
  onSwitchBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onRenameBoard: (boardId: string) => void;
  isAllBoardsView: boolean;
  onAddImageClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onDeleteAllClick: () => void;
  isAddDisabled: boolean;
}

export default function BoardTabs({ 
  boards,
  activeBoardId,
  onNewBoard,
  onSwitchBoard,
  onDeleteBoard,
  onRenameBoard,
  isAllBoardsView,
  onAddImageClick, 
  onImportClick, 
  onExportClick, 
  onDeleteAllClick,
  isAddDisabled
}: BoardTabsProps) {
  const { setTheme } = useTheme();

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm h-10 flex items-center px-2 border-b">
      <div className="flex items-center gap-2 px-2">
        <Logo className="h-5 w-auto" />
      </div>
      <div className="h-full border-l"></div>
      <TooltipProvider delayDuration={300}>
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex items-center h-10 pl-2">
                <div
                  onClick={() => onSwitchBoard('all')}
                  className={cn(
                    "group relative h-full flex items-center gap-2 w-auto px-3 border-b-2 text-sm font-medium cursor-pointer",
                    isAllBoardsView ? 'bg-background text-foreground border-primary' : 'border-transparent text-muted-foreground hover:bg-accent'
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="truncate">All Boards</span>
                </div>
        
                {boards.map(board => (
                    <div
                      key={board.id}
                      onClick={() => onSwitchBoard(board.id)}
                      className={cn(
                        "group relative h-full flex items-center justify-between gap-4 w-40 pr-2 border-b-2 text-sm font-medium cursor-pointer",
                        activeBoardId === board.id ? 'bg-background text-foreground border-primary' : 'border-transparent text-muted-foreground hover:bg-accent'
                      )}
                    >
                      <span className="truncate pl-3">{board.name}</span>
                      <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => { e.stopPropagation(); onRenameBoard(board.id); }}
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Rename</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                              onClick={(e) => { e.stopPropagation(); onDeleteBoard(board.id); }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Delete</p></TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                ))}
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 ml-1" onClick={onNewBoard}>
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">New Board</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>New Board</p></TooltipContent>
                 </Tooltip>
            </div>
            <ScrollBar orientation="horizontal" className="h-2 p-px" />
        </ScrollArea>
        
        <div className="flex items-center gap-2 pl-2 ml-auto">
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
             <DropdownMenuLabel>File</DropdownMenuLabel>
            <DropdownMenuItem onClick={onAddImageClick} disabled={isAddDisabled}>
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
             <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onDeleteAllClick} className="text-destructive focus:text-destructive focus:bg-destructive/10">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete All Data...</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </TooltipProvider>
    </div>
  );
}
