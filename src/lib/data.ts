import type { Board, ImageItem } from './types';

export const mockBoards: Board[] = [
  { id: 'board-1', name: 'UI Inspiration' },
  { id: 'board-2', name: 'Branding Logos' },
  { id: 'board-3', name: 'Typography' },
  { id: 'board-4', name: 'Personal Projects' },
];

export const mockImages: ImageItem[] = [
  {
    id: 'img-1',
    url: 'https://placehold.co/600x400.png',
    title: 'Abstract UI Concept',
    notes: 'A cool concept for a mobile app dashboard.',
    tags: ['minimalist', 'ui', 'dashboard'],
    boardId: 'board-1',
  },
  {
    id: 'img-2',
    url: 'https://placehold.co/400x600.png',
    title: 'Geometric Logo',
    notes: 'A logo idea for a tech startup.',
    tags: ['logo', 'geometric', 'branding'],
    boardId: 'board-2',
  },
  {
    id: 'img-3',
    url: 'https://placehold.co/600x600.png',
    title: 'Serif Typeface Sample',
    notes: 'Beautiful serif font for long-form reading.',
    tags: ['typography', 'serif', 'font'],
    boardId: 'board-3',
  },
   {
    id: 'img-4',
    url: 'https://placehold.co/800x400.png',
    title: 'Web App Layout',
    notes: 'A layout for a personal project.',
    tags: ['ui', 'layout', 'web'],
    boardId: 'board-4',
  },
   {
    id: 'img-5',
    url: 'https://placehold.co/500x500.png',
    title: 'Minimalist Branding',
    notes: 'Another logo, but more minimal.',
    tags: ['logo', 'minimalist', 'branding'],
    boardId: 'board-2',
  },
];
