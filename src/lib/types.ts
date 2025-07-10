
export type BackgroundPattern = 'none' | 'dots' | 'grid' | 'lines';

export interface ImageItem {
  id:string;
  url: string;
  title: string;
  notes: string;
  tags: string[];
  colors?: string[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export type ViewMode = 'moodboard' | 'list' | 'cards' | 'freedom';

export interface ViewSettings {
  viewMode: ViewMode;
  gridColumns: number;
  listShowCover: boolean;
  listShowTitle: boolean;
  listShowNotes: boolean;
  listShowTags: boolean;
  listCoverPosition: 'left' | 'right';
  backgroundPattern?: BackgroundPattern;
}

export interface Board {
  id: string;
  name: string;
  images: ImageItem[];
  viewSettings: ViewSettings;
}
