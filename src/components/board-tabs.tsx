
"use client";

import type { Board } from '@/lib/types';
import { Button } from './ui/button';
import { LayoutGrid, Pencil, Plus, Trash, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface BoardTabsProps {
  boards: Board[];
  activeBoardId: string | null;
  onNewBoard: () => void;
  onSwitchBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onRenameBoard: (boardId: string) => void;
  isAllBoardsView: boolean;
}

export default function BoardTabs({ 
  boards,
  activeBoardId,
  onNewBoard,
  onSwitchBoard,
  onDeleteBoard,
  onRenameBoard,
  isAllBoardsView
}: BoardTabsProps) {

  return (
    <div className="bg-muted/40 h-10 flex items-center px-2 border-b">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
                variant={isAllBoardsView ? "ghost" : "ghost"} 
                size="sm"
                onClick={() => onSwitchBoard('all')}
                className={cn(
                  "flex items-center gap-2 h-full rounded-none px-3 border-b-2",
                  isAllBoardsView ? "bg-background text-foreground border-primary" : "border-transparent"
                )}
            >
                <LayoutGrid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>All Boards View</p>
          </TooltipContent>
        </Tooltip>
        
        <div className="h-6 w-px bg-border mx-1" />

        {boards.map(board => (
            <div key={board.id} className="group relative h-full">
                <Button 
                    variant={activeBoardId === board.id ? "ghost" : "ghost"} 
                    size="sm" 
                    onClick={() => onSwitchBoard(board.id)}
                    className={cn(
                      "h-full rounded-none flex items-center justify-between gap-4 w-40 pr-2 border-b-2",
                      activeBoardId === board.id ? 'bg-background text-foreground border-primary' : 'border-transparent'
                    )}
                >
                    <span className="truncate">{board.name}</span>
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
                </Button>
            </div>
        ))}
         <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2" onClick={onNewBoard}>
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">New Board</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent><p>New Board</p></TooltipContent>
         </Tooltip>
      </TooltipProvider>
    </div>
  );
}
