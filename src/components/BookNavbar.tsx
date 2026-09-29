import React from 'react';
import { Search, BookOpen, Layers, Volume2, Bookmark, SlidersHorizontal, VolumeX, FastForward, Pause } from 'lucide-react';
import { Chapter } from '../data/bookMeta';

interface BookNavbarProps {
  currentChapter?: Chapter;
  currentPage: number;
  totalPages: number;
  viewMode: 'double' | 'single' | 'scroll';
  onChangeViewMode: (mode: 'double' | 'single' | 'scroll') => void;
  onOpenToc: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onJumpToPage: (page: number) => void;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
  bookmarksCount: number;
  onOpenBookmarks: () => void;
  // Auto-flip & Voices
  isAutoFlipEnabled: boolean;
  onToggleAutoFlip: () => void;
  autoFlipSeconds: number;
  voiceProfileName: string;
  voiceProfileIcon: string;
  onOpenVoiceSelector: () => void;
}

export const BookNavbar: React.FC<BookNavbarProps> = ({
  currentChapter,
  currentPage,
  totalPages,
  viewMode,
  onChangeViewMode,
  onOpenToc,
  onOpenSearch,
  onOpenSettings,
  onJumpToPage,
  isAmbientPlaying,
  onToggleAmbient,
  bookmarksCount,
  onOpenBookmarks,
  isAutoFlipEnabled,
  onToggleAutoFlip,
  autoFlipSeconds,
  voiceProfileName,
  voiceProfileIcon,
  onOpenVoiceSelector,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-3">
        
        {/* Zone 1: Brand title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onJumpToPage(1)}
            className="text-left group flex items-center gap-2 text-amber-100 hover:text-white transition-colors cursor-pointer"
          >
            <span className="font-serif text-base sm:text-lg font-bold tracking-tight truncate max-w-[200px] sm:max-w-none">
              Del otro lado también hay voces
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-4 text-xs uppercase tracking-wider text-stone-300 font-medium">
          <button 
            onClick={() => onJumpToPage(4)}
            className="hover:text-amber-200 transition-colors whitespace-nowrap"
          >
            Nota preliminar
          </button>
          <button 
            onClick={() => onJumpToPage(7)}
            className="hover:text-amber-200 transition-colors whitespace-nowrap"
          >
            Introducción
          </button>
          <button 
            onClick={() => onJumpToPage(10)}
            className="hover:text-amber-200 transition-colors whitespace-nowrap"
          >
            Relato 1
          </button>
          <button 
            onClick={() => onJumpToPage(18)}
            className="hover:text-amber-200 transition-colors whitespace-nowrap"
          >
            Relato 2
          </button>
          <button 
            onClick={() => onJumpToPage(28)}
            className="hover:text-amber-200 transition-colors whitespace-nowrap"
          >
            Relato 3
          </button>
          <button 
            onClick={() => onJumpToPage(61)}
            className="hover:text-amber-200 transition-colors whitespace-nowrap"
          >
            Lo que permanece
          </button>
        </nav>

        {/* Zone 3: Functional Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Quick Auto-Flip Pages button */}
          <button
            onClick={onToggleAutoFlip}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
              isAutoFlipEnabled 
                ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-400 font-bold' 
                : 'text-stone-300 hover:text-white bg-stone-800/90 hover:bg-stone-800 border border-stone-700/60'
            }`}
            title={isAutoFlipEnabled ? `Pausar pase automático (${autoFlipSeconds}s)` : `Pasar hojas solas cada ${autoFlipSeconds}s (Tecla A)`}
          >
            {isAutoFlipEnabled ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current animate-pulse text-amber-200" />
                <span>Auto ({autoFlipSeconds}s)</span>
              </>
            ) : (
              <>
                <FastForward className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Pasar Hojas Solas</span>
                <span className="sm:hidden">Auto</span>
              </>
            )}
          </button>

          {/* Quick Voice Selector button */}
          <button
            onClick={onOpenVoiceSelector}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-200 hover:text-white bg-stone-800/90 hover:bg-stone-800 rounded-md transition-colors cursor-pointer border border-stone-700/60"
            title="Cambiar personaje de voz (Elena, Carlos, Daniela, etc.)"
          >
            <span className="text-sm">{voiceProfileIcon}</span>
            <span className="hidden md:inline font-semibold">Voz: {voiceProfileName}</span>
            <span className="md:hidden font-semibold">Voz</span>
          </button>

          {/* Table of Contents Drawer */}
          <button
            onClick={onOpenToc}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800 rounded-md transition-colors"
            title="Índice y Capítulos"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Índice</span>
          </button>

          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="p-1.5 text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800 rounded-md transition-colors"
            title="Buscar en todo el libro (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-amber-400" />
          </button>

          {/* Ambient Audio Toggle */}
          <button
            onClick={onToggleAmbient}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              isAmbientPlaying 
                ? 'bg-amber-600 text-white font-medium shadow-xs' 
                : 'text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800'
            }`}
            title={isAmbientPlaying ? "Pausar atmósfera sonora andina" : "Reproducir atmósfera sonora (viento andino)"}
          >
            {isAmbientPlaying ? (
              <Volume2 className="w-3.5 h-3.5 text-white animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span className="hidden sm:inline text-[11px]">
              {isAmbientPlaying ? 'Sonido ON' : 'Sonido'}
            </span>
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenBookmarks}
            className="relative p-1.5 text-stone-300 hover:text-white bg-stone-800/80 rounded-md transition-colors"
            title="Marcadores guardados"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-[10px] text-white font-bold rounded-full flex items-center justify-center">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Reader Appearance Settings */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-stone-300 hover:text-white bg-stone-800/80 rounded-md transition-colors"
            title="Ajustes de lectura y tipografía"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
