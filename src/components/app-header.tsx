
"use client";

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
import { Menu, Plus, Upload, Download, Trash2 } from 'lucide-react';

interface AppHeaderProps {
  onAddImageClick: () => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onDeleteAllClick: () => void;
  isAddDisabled: boolean;
}

export default function AppHeader({ 
  onAddImageClick, 
  onImportClick, 
  onExportClick, 
  onDeleteAllClick,
  isAddDisabled
}: AppHeaderProps) {

  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
            <LogoWithText className="h-[120px] w-auto translate-x-[-15px]" />
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
