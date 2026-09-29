import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BookPage } from '../data/bookMeta';
import { PageRenderer } from './PageRenderer';
import { soundManager } from '../utils/audioUtils';
import { SavedHighlight, SavedNote } from '../data/userInteractions';

interface TwoPageViewProps {
  leftPage?: BookPage;
  rightPage?: BookPage;
  totalPages: number;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  theme: 'paper' | 'sepia' | 'dark' | 'white';
  fontFamily: 'serif' | 'sans';
  bookmarkedPages: number[];
  onToggleBookmark: (page: number) => void;
  onPrevPages: () => void;
  onNextPages: () => void;
  onReadPage: (text: string) => void;
  onSelectPage: (page: number) => void;
  currentReadingText: string | null;
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

export const TwoPageView: React.FC<TwoPageViewProps> = ({
  leftPage,
  rightPage,
  totalPages,
  fontSize,
  theme,
  fontFamily,
  bookmarkedPages,
  onToggleBookmark,
  onPrevPages,
  onNextPages,
  onReadPage,
  onSelectPage,
  currentReadingText,
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
    onPrevPages();
  };

  const handleNext = () => {
    soundManager.playPageTurn();
    onNextPages();
  };

  const canGoPrev = (leftPage?.pageNumber || 1) > 1;
  const canGoNext = (rightPage?.pageNumber || leftPage?.pageNumber || 1) < totalPages;

  return (
    <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center py-4 sm:py-6 px-2 sm:px-4">
      {/* Navigation button Left */}
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
        className={`absolute left-0 sm:-left-3 z-30 p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-200 ${
          canGoPrev 
            ? 'bg-stone-900/90 hover:bg-stone-950 text-amber-100 hover:scale-105 active:scale-95 cursor-pointer' 
            : 'bg-stone-300/40 text-stone-400 cursor-not-allowed opacity-0 pointer-events-none'
        }`}
        title="Páginas anteriores (Flecha Izquierda)"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Book Container with 3D spine and shadow */}
      <div className="relative w-full flex flex-col md:flex-row shadow-2xl rounded-lg overflow-hidden border border-stone-300/70 bg-stone-900 items-stretch">
        
        {/* Left Page */}
        <div className={`w-full md:w-1/2 h-[600px] sm:h-[660px] lg:h-[720px] overflow-hidden ${getThemeBg()} flex flex-col relative border-b md:border-b-0 md:border-r border-stone-300/40 transition-colors duration-300`}>
          {leftPage ? (
            <PageRenderer
              page={leftPage}
              fontSize={fontSize}
              theme={theme}
              fontFamily={fontFamily}
              isBookmarked={bookmarkedPages.includes(leftPage.pageNumber)}
              onToggleBookmark={onToggleBookmark}
              onReadPage={onReadPage}
              onSelectPage={onSelectPage}
              isReading={Boolean(currentReadingText && currentReadingText.includes(leftPage.paragraphs[0] || ''))}
              highlights={highlights}
              onToggleHighlightParagraph={onToggleHighlightParagraph}
              onOpenNotesPanel={onOpenNotesPanel}
              notesCount={notes.filter(n => n.pageNumber === leftPage.pageNumber).length}
              currentReadingPage={currentReadingPage}
              currentReadingParagraphIndex={currentReadingParagraphIndex}
              onReadFromParagraph={onReadFromParagraph}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8 opacity-40">
              <span className="font-serif italic text-sm text-stone-500">Página en blanco</span>
            </div>
          )}
          {/* Spine Fold Gradient shadow on right of left page */}
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-l from-black/15 to-transparent" />
        </div>

        {/* Realistic Book Spine (Center divider) */}
        <div className="hidden md:block w-px bg-stone-400/40 shadow-inner z-20 relative" />

        {/* Right Page */}
        <div className={`w-full md:w-1/2 h-[600px] sm:h-[660px] lg:h-[720px] overflow-hidden ${getThemeBg()} flex flex-col relative transition-colors duration-300`}>
          {rightPage ? (
            <PageRenderer
              page={rightPage}
              fontSize={fontSize}
              theme={theme}
              fontFamily={fontFamily}
              isBookmarked={bookmarkedPages.includes(rightPage.pageNumber)}
              onToggleBookmark={onToggleBookmark}
              onReadPage={onReadPage}
              onSelectPage={onSelectPage}
              isReading={Boolean(currentReadingText && currentReadingText.includes(rightPage.paragraphs[0] || ''))}
              highlights={highlights}
              onToggleHighlightParagraph={onToggleHighlightParagraph}
              onOpenNotesPanel={onOpenNotesPanel}
              notesCount={notes.filter(n => n.pageNumber === rightPage.pageNumber).length}
              currentReadingPage={currentReadingPage}
              currentReadingParagraphIndex={currentReadingParagraphIndex}
              onReadFromParagraph={onReadFromParagraph}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8 opacity-40">
              <span className="font-serif italic text-sm text-stone-500">Fin del volumen</span>
            </div>
          )}
          {/* Spine Fold Gradient shadow on left of right page */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-8 pointer-events-none bg-gradient-to-r from-black/15 to-transparent" />
        </div>

      </div>

      {/* Navigation button Right */}
      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className={`absolute right-0 sm:-right-3 z-30 p-2.5 sm:p-3 rounded-full shadow-lg transition-all duration-200 ${
          canGoNext 
            ? 'bg-stone-900/90 hover:bg-stone-950 text-amber-100 hover:scale-105 active:scale-95 cursor-pointer' 
            : 'bg-stone-300/40 text-stone-400 cursor-not-allowed opacity-0 pointer-events-none'
        }`}
        title="Páginas siguientes (Flecha Derecha)"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};
