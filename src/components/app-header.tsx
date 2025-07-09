
"use client";

import { ThemeToggle } from './theme-toggle';
import { Logo } from './assets/logo';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
            <Logo className="h-12 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
