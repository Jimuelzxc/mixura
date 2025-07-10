
"use client";

import { ThemeToggle } from './theme-toggle';
import { Logo } from './assets/logo';
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
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { Menu, Plus, Upload, Download, Trash2 } from 'lucide-react';


interface AppHeaderProps {
  onAddImageClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onDeleteAllClick: () => void;
}

export default function AppHeader({ onAddImageClick, onImportClick, onExportClick, onDeleteAllClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
            <Logo className="h-8 w-auto" />
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
              <DropdownMenuItem onClick={onAddImageClick}>
                <Plus className="mr-2" />
                <span>New Image</span>
                <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
