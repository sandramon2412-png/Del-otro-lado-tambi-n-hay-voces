import { PAGES_PART_1 } from './pagesPart1';
import { PAGES_PART_2 } from './pagesPart2';
import { PAGES_PART_3 } from './pagesPart3';
import { PAGES_PART_4 } from './pagesPart4';
import { BOOK_METADATA, CHAPTERS, BookPage, Chapter } from './bookMeta';

export const ALL_PAGES: BookPage[] = [
  ...PAGES_PART_1,
  ...PAGES_PART_2,
  ...PAGES_PART_3,
  ...PAGES_PART_4
];

export function getPage(pageNumber: number): BookPage | undefined {
  return ALL_PAGES.find(p => p.pageNumber === pageNumber);
}

export function getChapterByPage(pageNumber: number): Chapter | undefined {
  return CHAPTERS.find(c => pageNumber >= c.startPage && pageNumber <= c.endPage);
}

export interface SearchResult {
  pageNumber: number;
  chapterTitle: string;
  matchedText: string;
  paragraphIndex: number;
}

export function searchInBook(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];
  const cleanQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const page of ALL_PAGES) {
    page.paragraphs.forEach((p, index) => {
      const lower = p.toLowerCase();
      const matchPos = lower.indexOf(cleanQuery);
      if (matchPos !== -1) {
        const start = Math.max(0, matchPos - 40);
        const end = Math.min(p.length, matchPos + cleanQuery.length + 50);
        const snippet = (start > 0 ? '...' : '') + p.slice(start, end).trim() + (end < p.length ? '...' : '');
        results.push({
          pageNumber: page.pageNumber,
          chapterTitle: page.chapterTitle || 'Página ' + page.pageNumber,
          matchedText: snippet,
          paragraphIndex: index
        });
      }
    });
  }

  return results.slice(0, 30);
}

export { BOOK_METADATA, CHAPTERS };
export type { BookPage, Chapter };
