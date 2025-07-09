import type { Board, ImageItem } from './types';

export const mockBoards: Board[] = [
  { id: 'board-1', name: 'Inspiration' },
  { id: 'board-2', name: 'Design Resources' },
  { id: 'board-3', name: 'Personal Projects' },
  { id: 'board-4', name: 'Travel Ideas' },
];

export const mockImages: ImageItem[] = [
  {
    id: 'img-1',
    url: 'https://placehold.co/600x800.png',
    title: 'Abstract Architecture',
    notes: 'Interesting use of light and shadow in this building.',
    tags: ['architecture', 'modern', 'brutalism'],
    boardId: 'board-1',
  },
  {
    id: 'img-2',
    url: 'https://placehold.co/600x400.png',
    title: 'Mountain Landscape',
    notes: 'A serene mountain view, great for a wallpaper.',
    tags: ['nature', 'mountains', 'landscape'],
    boardId: 'board-4',
  },
  {
    id: 'img-3',
    url: 'https://placehold.co/600x600.png',
    title: 'UI Kit Concept',
    notes: 'A clean and minimal UI kit for a new project. Includes buttons, forms, and cards.',
    tags: ['ui', 'design', 'inspiration'],
    boardId: 'board-2',
  },
  {
    id: 'img-4',
    url: 'https://placehold.co/600x700.png',
    title: 'Vintage Car',
    notes: 'Classic car with a beautiful color.',
    tags: ['car', 'vintage', 'classic'],
    boardId: 'board-3',
  },
  {
    id: 'img-5',
    url: 'https://placehold.co/600x450.png',
    title: 'Forest Path',
    notes: 'A calming walk through the woods.',
    tags: ['nature', 'forest', 'path'],
    boardId: 'board-4',
  },
  {
    id: 'img-6',
    url: 'https://placehold.co/600x900.png',
    title: 'Gradient Wallpaper',
    notes: 'Smooth gradient for a phone background.',
    tags: ['gradient', 'design', 'wallpaper'],
    boardId: 'board-2',
  },
  {
    id: 'img-7',
    url: 'https://placehold.co/600x500.png',
    title: 'Workspace Setup',
    notes: 'Minimalist desk setup for productivity.',
    tags: ['workspace', 'desk', 'tech'],
    boardId: 'board-1',
  },
  {
    id: 'img-8',
    url: 'https://placehold.co/600x750.png',
    title: 'City at Night',
    notes: 'Vibrant city lights, could be Tokyo or NYC.',
    tags: ['city', 'night', 'urban'],
    boardId: 'board-4',
  },
];
