"use client";

import { ThemeToggle } from './theme-toggle';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <svg
            viewBox="0 0 976 660"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
          >
            <path
              d="M921.01 605L572.435 256.425V605C572.435 605 197.981 -115.058 95.0986 127.664C16.6205 312.811 226.619 605 226.619 605"
              stroke="currentColor"
              strokeWidth="155"
            />
          </svg>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Mixura</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
