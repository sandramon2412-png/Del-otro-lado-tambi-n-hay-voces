import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookPage } from '../data/bookMeta';
import { PageRenderer } from './PageRenderer';
import { soundManager } from '../utils/audioUtils';
import { SavedHighlight, SavedNote } from '../data/userInteractions';

interface SinglePageViewProps {
  page: BookPage;
  totalPages: number;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  theme: 'paper' | 'sepia' | 'dark' | 'white';
  fontFamily: 'serif' | 'sans';
  isBookmarked: boolean;
  onToggleBookmark: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onReadPage: (text: string) => void;
  onSelectPage?: (page: number) => void;
  isReading?: boolean;
  // Interactivity
  highlights?: SavedHighlight[];
  onToggleHighlightParagraph?: (pageNumber: number, paragraphIndex: number, text: string) => void;
  onOpenNotesPanel?: (pageNumber: number) => void;
  notes?: SavedNote[];
  // Live reading highlight
  currentReadingPage?: number | null;
  currentReadingParagraphIndex?: number | null;
  onReadFromParagraph?: (pageNumber: number, paragraphIndex: number) => void;
}

export const SinglePageView: React.FC<SinglePageViewProps> = ({
  page,
  totalPages,
  fontSize,
  theme,
  fontFamily,
  isBookmarked,
  onToggleBookmark,
  onPrevPage,
  onNextPage,
  onReadPage,
  onSelectPage,
  isReading = false,
  highlights = [],
  onToggleHighlightParagraph,
  onOpenNotesPanel,
  notes = [],
  currentReadingPage,
  currentReadingParagraphIndex,
  onReadFromParagraph,
}) => {
  const getThemeBg = () => {
    switch (theme) {
      case 'sepia': return 'bg-[#F4EFE6] text-[#2C241E]';
      case 'dark': return 'bg-[#1C1917] text-[#E7E5E4]';
      case 'white': return 'bg-[#FFFFFF] text-[#0F172A]';
      case 'paper':
      default: return 'bg-[#FBF9F5] text-[#1C1917]';
    }
  };

  const handlePrev = () => {
    soundManager.playPageTurn();
    onPrevPage();
  };

  const handleNext = () => {
    soundManager.playPageTurn();
    onNextPage();
  };

  const canGoPrev = page.pageNumber > 1;
  const canGoNext = page.pageNumber < totalPages;

  return (
    <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center py-4 px-2 sm:px-4">
      {/* Prev button */}
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
        className={`absolute left-0 sm:-left-5 z-30 p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-200 ${
          canGoPrev 
            ? 'bg-stone-900/90 hover:bg-stone-950 text-amber-100 hover:scale-105 active:scale-95 cursor-pointer' 
            : 'bg-stone-300/40 text-stone-400 cursor-not-allowed opacity-0 pointer-events-none'
        }`}
        title="Página anterior"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Single Page Frame */}
      <div className={`w-full h-[600px] sm:h-[660px] lg:h-[720px] overflow-hidden ${getThemeBg()} shadow-xl rounded-lg border border-stone-300/60 relative transition-colors duration-300`}>
        <PageRenderer
          page={page}
          fontSize={fontSize}
          theme={theme}
          fontFamily={fontFamily}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          onReadPage={onReadPage}
          onSelectPage={onSelectPage}
          isReading={isReading}
          highlights={highlights}
          onToggleHighlightParagraph={onToggleHighlightParagraph}
          onOpenNotesPanel={onOpenNotesPanel}
          notesCount={notes.filter(n => n.pageNumber === page.pageNumber).length}
          currentReadingPage={currentReadingPage}
          currentReadingParagraphIndex={currentReadingParagraphIndex}
          onReadFromParagraph={onReadFromParagraph}
        />
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className={`absolute right-0 sm:-right-5 z-30 p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-200 ${
          canGoNext 
            ? 'bg-stone-900/90 hover:bg-stone-950 text-amber-100 hover:scale-105 active:scale-95 cursor-pointer' 
            : 'bg-stone-300/40 text-stone-400 cursor-not-allowed opacity-0 pointer-events-none'
        }`}
        title="Página siguiente"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};
