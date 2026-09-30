import { BOOK_METADATA, CHAPTERS, BookPage, Chapter } from './bookMeta';

const bookImageAssets = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp,avif,gif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function resolveBookImageUrl(imagePath?: string): string | undefined {
  if (!imagePath) return undefined;
  if (/^(https?:|data:)/i.test(imagePath)) return imagePath;
  if (!imagePath.startsWith('/src/assets/')) return imagePath;

  const fileName = imagePath.split('/').pop();
  if (!fileName) return imagePath;

  const resolved = bookImageAssets[`../assets/images/${fileName}`];
  return typeof resolved === 'string' ? resolved : imagePath;
}

export const ALL_PAGES: BookPage[] = [
  ...PAGES_PART_1,
  ...PAGES_PART_2,
  ...PAGES_PART_3,
  ...PAGES_PART_4
].map((page) => ({
  ...page,
  image: resolveBookImageUrl(page.image),
}));

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
