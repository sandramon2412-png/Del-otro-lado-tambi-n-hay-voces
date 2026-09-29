export interface SavedHighlight {
  id: string;
  pageNumber: number;
  paragraphIndex: number;
  text: string;
  color: 'amber' | 'emerald' | 'sky' | 'rose';
  createdAt: number;
}

export interface SavedNote {
  id: string;
  pageNumber: number;
  text: string;
  createdAt: number;
}

export interface ReadingStats {
  pagesRead: number[];
  minutesSpent: number;
  lastSession: number;
}
