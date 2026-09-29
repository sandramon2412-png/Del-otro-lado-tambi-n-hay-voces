import React from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Play, Pause, FastForward } from 'lucide-react';
import { Chapter } from '../data/bookMeta';
import { soundManager } from '../utils/audioUtils';

interface PageScrubberProps {
  currentPage: number;
  totalPages: number;
  currentChapter?: Chapter;
  onPageChange: (page: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isAutoFlipEnabled?: boolean;
  onToggleAutoFlip?: () => void;
  autoFlipSeconds?: number;
}

export const PageScrubber: React.FC<PageScrubberProps> = ({
  currentPage,
  totalPages,
  currentChapter,
  onPageChange,
  isFullscreen,
  onToggleFullscreen,
  isAutoFlipEnabled = false,
  onToggleAutoFlip,
  autoFlipSeconds = 8,
}) => {
  const percentage = Math.round((currentPage / totalPages) * 100);

  const handlePrev = () => {
    soundManager.playPageTurn();
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    soundManager.playPageTurn();
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 bg-stone-900/90 border-t border-stone-800 text-stone-300 py-2.5 px-4 backdrop-blur-md select-none">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Previous page button */}
        <button
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-md hover:bg-stone-800 text-stone-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Auto-flip Quick Button */}
        {onToggleAutoFlip && (
          <button
            onClick={onToggleAutoFlip}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
              isAutoFlipEnabled 
                ? 'bg-amber-600 text-white shadow-xs animate-pulse ring-1 ring-amber-400' 
                : 'text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800'
            }`}
            title={isAutoFlipEnabled ? `Pausar auto-avance (${autoFlipSeconds}s)` : `Iniciar pase automático de páginas cada ${autoFlipSeconds}s`}
          >
            {isAutoFlipEnabled ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Auto ON ({autoFlipSeconds}s)</span>
                <span className="sm:hidden text-[10px]">Auto</span>
              </>
            ) : (
              <>
                <FastForward className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pase Auto</span>
                <span className="sm:hidden text-[10px]">Auto</span>
              </>
            )}
          </button>
        )}

        {/* Central Scrubber & Slider */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] sm:text-xs">
            <span className="font-serif italic text-amber-200 truncate max-w-[200px] sm:max-w-xs">
              {currentChapter?.title || 'Del otro lado también hay voces'}
            </span>
            <span className="font-mono text-stone-400 shrink-0">
              Página <strong className="text-white">{currentPage}</strong> de {totalPages} ({percentage}%)
            </span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                onPageChange(Number(e.target.value));
              }}
              className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Next page button */}
        <button
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-md hover:bg-stone-800 text-stone-300 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          title="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          className="hidden sm:flex p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
          title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

      </div>
    </footer>
  );
};
