export interface ImageItem {
  id:string;
  url: string;
  title: string;
  notes: string;
  tags: string[];
  colors?: string[];
}

export type ViewMode = 'moodboard' | 'list' | 'cards' | 'headlines';

export interface ViewSettings {
  viewMode: ViewMode;
  gridColumns: number;
  listShowCover: boolean;
  listShowTitle: boolean;
  listShowNotes: boolean;
  listShowTags: boolean;
  listCoverPosition: 'left' | 'right';
}
