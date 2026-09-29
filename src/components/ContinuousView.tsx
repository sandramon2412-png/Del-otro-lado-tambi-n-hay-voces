import React, { useRef, useEffect } from 'react';
import { BookPage } from '../data/bookMeta';
import { PageRenderer } from './PageRenderer';
import { SavedHighlight, SavedNote } from '../data/userInteractions';

interface ContinuousViewProps {
  pages: BookPage[];
  currentPage: number;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  theme: 'paper' | 'sepia' | 'dark' | 'white';
  fontFamily: 'serif' | 'sans';
  bookmarkedPages: number[];
  onToggleBookmark: (page: number) => void;
  onReadPage: (text: string) => void;
  onPageInView: (page: number) => void;
  highlights?: SavedHighlight[];
  onToggleHighlightParagraph?: (pageNumber: number, paragraphIndex: number, text: string) => void;
  onOpenNotesPanel?: (pageNumber: number) => void;
  notes?: SavedNote[];
  // Live reading highlight
  currentReadingPage?: number | null;
  currentReadingParagraphIndex?: number | null;
  onReadFromParagraph?: (pageNumber: number, paragraphIndex: number) => void;
}

export const ContinuousView: React.FC<ContinuousViewProps> = ({
  pages,
  currentPage,
  fontSize,
  theme,
  fontFamily,
  bookmarkedPages,
  onToggleBookmark,
  onReadPage,
  onPageInView,
  highlights = [],
  onToggleHighlightParagraph,
  onOpenNotesPanel,
  notes = [],
  currentReadingPage,
  currentReadingParagraphIndex,
  onReadFromParagraph,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const getThemeBg = () => {
    switch (theme) {
      case 'sepia': return 'bg-[#F4EFE6] text-[#2C241E]';
      case 'dark': return 'bg-[#1C1917] text-[#E7E5E4]';
      case 'white': return 'bg-[#FFFFFF] text-[#0F172A]';
      case 'paper':
      default: return 'bg-[#FBF9F5] text-[#1C1917]';
    }
  };

  // Scroll to current page if changed from outside
  useEffect(() => {
    const el = pageRefs.current.get(currentPage);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Track page intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = Number(entry.target.getAttribute('data-page'));
            if (pageNum) {
              onPageInView(pageNum);
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    pageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [onPageInView, pages]);

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto py-6 px-3 sm:px-6 space-y-8">
      {pages.map((p) => (
        <div
          key={p.pageNumber}
          data-page={p.pageNumber}
          ref={(el) => {
            if (el) pageRefs.current.set(p.pageNumber, el);
            else pageRefs.current.delete(p.pageNumber);
          }}
          className={`w-full min-h-[600px] ${getThemeBg()} shadow-lg rounded-xl overflow-hidden border border-stone-300/60 transition-colors duration-300`}
        >
          <PageRenderer
            page={p}
            fontSize={fontSize}
            theme={theme}
            fontFamily={fontFamily}
            isBookmarked={bookmarkedPages.includes(p.pageNumber)}
            onToggleBookmark={onToggleBookmark}
            onReadPage={onReadPage}
            highlights={highlights}
            onToggleHighlightParagraph={onToggleHighlightParagraph}
            onOpenNotesPanel={onOpenNotesPanel}
            notesCount={notes.filter(n => n.pageNumber === p.pageNumber).length}
            currentReadingPage={currentReadingPage}
            currentReadingParagraphIndex={currentReadingParagraphIndex}
            onReadFromParagraph={onReadFromParagraph}
          />
        </div>
      ))}
    </div>
  );
};
