export interface Board {
  id: string;
  name: string;
}

export interface ImageItem {
  id: string;
  url: string;
  title: string;
  notes: string;
  tags: string[];
  boardId: string;
}
