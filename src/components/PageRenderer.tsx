import React, { useRef, useEffect } from 'react';
import { BookPage } from '../data/bookMeta';
import { Bookmark, Volume2, Quote, Sparkles, Highlighter, StickyNote, Play } from 'lucide-react';
import { SavedHighlight } from '../data/userInteractions';

interface PageRendererProps {
  page: BookPage;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  theme: 'paper' | 'sepia' | 'dark' | 'white';
  fontFamily: 'serif' | 'sans';
  isBookmarked: boolean;
  onToggleBookmark: (pageNumber: number) => void;
  onReadPage: (text: string) => void;
  onSelectPage?: (pageNumber: number) => void;
  isReading?: boolean;
  // Interactivity
  highlights?: SavedHighlight[];
  onToggleHighlightParagraph?: (pageNumber: number, paragraphIndex: number, text: string) => void;
  onOpenNotesPanel?: (pageNumber: number) => void;
  notesCount?: number;
  // Live Narration Highlighting
  currentReadingPage?: number | null;
  currentReadingParagraphIndex?: number | null;
  onReadFromParagraph?: (pageNumber: number, paragraphIndex: number) => void;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  page,
  fontSize,
  theme,
  fontFamily,
  isBookmarked,
  onToggleBookmark,
  onReadPage,
  onSelectPage,
  isReading = false,
  highlights = [],
  onToggleHighlightParagraph,
  onOpenNotesPanel,
  notesCount = 0,
  currentReadingPage,
  currentReadingParagraphIndex,
  onReadFromParagraph,
}) => {
  const activeParagraphRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentReadingPage === page.pageNumber && currentReadingParagraphIndex !== null && currentReadingParagraphIndex !== undefined && activeParagraphRef.current) {
      activeParagraphRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentReadingPage, currentReadingParagraphIndex, page.pageNumber]);
  const totalChars = page.paragraphs.reduce((acc, p) => acc + p.length, 0);
  const isDensePage = totalChars > 1900;
  const isShortPage = totalChars < 700 && page.type !== 'cover' && page.type !== 'story-cover';

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': 
        return isDensePage ? 'text-xs sm:text-[13px] leading-relaxed' : 'text-xs sm:text-sm leading-relaxed';
      case 'lg': 
        return isDensePage ? 'text-base sm:text-lg leading-relaxed' : 'text-lg sm:text-xl leading-relaxed';
      case 'xl': 
        return isDensePage ? 'text-lg sm:text-xl leading-relaxed' : 'text-xl sm:text-2xl leading-loose';
      case 'md':
      default: 
        return isDensePage ? 'text-[13.5px] sm:text-[14.5px] leading-relaxed' : 'text-sm sm:text-base leading-relaxed';
    }
  };

  const getFontFamilyClass = () => {
    return fontFamily === 'serif' ? 'font-serif' : 'font-sans';
  };

  const fullTextToRead = [
    page.title || '',
    page.subtitle || '',
    page.storyQuote || '',
    page.authorNote || '',
    ...page.paragraphs
  ].filter(Boolean).join('. ') || (page.title || 'Página ' + page.pageNumber);

  // COVER PAGE (PAGE 1)
  if (page.type === 'cover') {
    return (
      <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden">
        {page.image && (
          <div className="absolute inset-0 z-0">
            <img 
              src={page.image} 
              alt="Portada Del otro lado también hay voces" 
              className="w-full h-full object-cover object-center filter brightness-[0.97]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/40" />
          </div>
        )}

        <div className="relative z-10 flex justify-between items-start">
          <span className="text-xs uppercase tracking-widest text-amber-100/90 font-medium px-2 py-1 bg-black/40 backdrop-blur-xs rounded">
            Antología testimonial · Nariño
          </span>
          <button
            onClick={() => onToggleBookmark(page.pageNumber)}
            title={isBookmarked ? "Eliminar marcador" : "Marcar página"}
            className="p-2 rounded-full bg-black/40 text-amber-200 hover:bg-black/60 transition-colors"
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        <div className="relative z-10 my-auto text-center px-4 py-8">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-md">
            Del otro lado <br />
            <span className="text-amber-200 italic font-medium">también hay voces</span>
          </h1>
          <div className="w-16 h-0.5 bg-amber-300 mx-auto my-4 opacity-80" />
          <p className="font-serif italic text-lg sm:text-2xl text-stone-100 tracking-wide drop-shadow">
            Relatos de vida, memoria y conflicto armado
          </p>
        </div>

        <div className="relative z-10 text-center space-y-3 bg-black/40 backdrop-blur-xs p-4 rounded-lg">
          <div className="text-sm sm:text-base font-serif font-medium text-stone-100">
            Daniela Alejandra González Soto · Carlos Eduardo Vallejo Montezuma
          </div>
          <div className="text-xs tracking-wider text-amber-200/80 uppercase">
            Programa de Trabajo Social · Universidad Mariana
          </div>
          <div className="pt-1 flex justify-center">
            <button
              onClick={() => onReadPage('Del otro lado también hay voces. Relatos de vida, memoria y conflicto armado. Por Daniela Alejandra González Soto y Carlos Eduardo Vallejo Montezuma. Programa de Trabajo Social, Universidad Mariana, San Juan de Pasto.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-amber-200 hover:bg-black/80 text-xs transition-colors cursor-pointer border border-amber-300/30"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isReading ? 'text-amber-400 animate-pulse' : ''}`} />
              <span>{isReading ? 'Escuchando presentación...' : 'Escuchar presentación del libro'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EPIGRAPH (PAGE 2)
  if (page.type === 'epigraph') {
    return (
      <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 overflow-hidden select-none">
        {page.image && (
          <div className="absolute inset-0 z-0">
            <img 
              src={page.image} 
              alt="Epígrafe de José Saramago" 
              className="w-full h-full object-cover object-center filter brightness-[0.96]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-stone-900/40" />
          </div>
        )}

        <div className="relative z-10 flex justify-end">
          <button
            onClick={() => onToggleBookmark(page.pageNumber)}
            className="p-2 rounded-full bg-black/40 text-amber-200 hover:bg-black/60 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
          </button>
        </div>

        <div className="relative z-10 max-w-md mx-auto my-auto text-center space-y-5 bg-black/40 backdrop-blur-xs p-6 rounded-2xl border border-white/10 shadow-xl">
          <Quote className="w-8 h-8 mx-auto text-amber-300 rotate-180 drop-shadow" />
          <blockquote className="font-serif italic text-lg sm:text-2xl text-white leading-relaxed drop-shadow">
            “Hay que recuperar, mantener y transmitir la memoria histórica, porque se empieza por el olvido y se termina en la indiferencia.”
          </blockquote>
          <div className="w-12 h-px bg-amber-300/60 mx-auto" />
          <cite className="block text-sm sm:text-base font-serif font-semibold tracking-wide text-amber-200 not-italic">
            José Saramago
          </cite>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-stone-200 font-mono">
          <button
            onClick={() => onReadPage(fullTextToRead)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 text-amber-200 hover:bg-black/80 transition-colors"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isReading ? 'text-amber-400 animate-pulse' : ''}`} />
            <span>{isReading ? 'Escuchando...' : 'Escuchar epígrafe'}</span>
          </button>
          <span>Pág. 2</span>
        </div>
      </div>
    );
  }

  // INTRO COVER / PRESENTATION (PAGE 6)
  if (page.pageNumber === 6) {
    return (
      <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 overflow-hidden select-none">
        {page.image && (
          <div className="absolute inset-0 z-0">
            <img 
              src={page.image} 
              alt="Introducción Antes de escuchar estas voces" 
              className="w-full h-full object-cover object-center filter brightness-[0.96]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/25 to-stone-900/40" />
          </div>
        )}

        <div className="relative z-10 flex justify-between items-start">
          <span className="text-xs uppercase tracking-widest text-amber-200 font-semibold bg-black/40 px-3 py-1 rounded backdrop-blur-xs">
            INTRODUCCIÓN
          </span>
          <button
            onClick={() => onToggleBookmark(page.pageNumber)}
            className="p-2 rounded-full bg-black/40 text-amber-200 hover:bg-black/60 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        <div className="relative z-10 my-auto text-center space-y-4 px-4 bg-black/35 backdrop-blur-xs p-6 rounded-xl border border-white/10 shadow-xl">
          <span className="text-xs font-serif uppercase tracking-widest text-amber-300">
            Apertura y memoria
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow">
            Antes de escuchar estas voces
          </h2>
          <div className="w-12 h-0.5 bg-amber-400/80 mx-auto" />
          <p className="text-xs sm:text-sm text-stone-200 max-w-md mx-auto leading-relaxed">
            Una reflexión testimonial y académica sobre el acercamiento al conflicto armado, los sesgos y la dignidad humana.
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-stone-200 font-mono">
          <button
            onClick={() => onSelectPage?.(7)}
            className="px-3 py-1.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors"
          >
            Comenzar lectura →
          </button>
          <span>Pág. 6</span>
        </div>
      </div>
    );
  }

  // BACK COVER (PAGE 64)
  if (page.type === 'back-cover') {
    return (
      <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 overflow-hidden select-none">
        {page.image && (
          <div className="absolute inset-0 z-0">
            <img 
              src={page.image} 
              alt="Contracubierta Del otro lado también hay voces" 
              className="w-full h-full object-cover object-center filter brightness-[0.96]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-stone-900/50" />
          </div>
        )}

        <div className="relative z-10 flex justify-between items-start">
          <span className="text-xs uppercase tracking-widest text-amber-200 font-semibold bg-black/40 px-3 py-1 rounded backdrop-blur-xs">
            CONTRACUBIERTA · FOLIO FINAL
          </span>
          <button
            onClick={() => onToggleBookmark(page.pageNumber)}
            className="p-2 rounded-full bg-black/40 text-amber-200 hover:bg-black/60 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        <div className="relative z-10 my-auto text-center space-y-4 px-4 bg-black/40 backdrop-blur-xs p-6 rounded-xl border border-white/10 shadow-xl max-w-lg mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Del otro lado también hay voces
          </h2>
          <div className="w-12 h-px bg-amber-400 mx-auto" />
          <blockquote className="font-serif italic text-base sm:text-lg text-amber-200 leading-relaxed">
            «...nosotros solo fuimos un puente, porque ustedes fueron y siempre serán la verdadera voz.»
          </blockquote>
          <p className="text-xs text-stone-300 pt-2 border-t border-white/10">
            Universidad Mariana · Facultad de Ciencias Humanas y Sociales<br />
            Programa de Trabajo Social · San Juan de Pasto
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-stone-300 font-mono">
          <button
            onClick={() => onReadPage('Del otro lado también hay voces. En esta construcción, nosotros solo fuimos un puente, porque ustedes fueron y siempre serán la verdadera voz. Universidad Mariana, Facultad de Ciencias Humanas y Sociales, Programa de Trabajo Social, San Juan de Pasto.')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-amber-200 hover:bg-black/80 transition-colors cursor-pointer"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isReading ? 'text-amber-400 animate-pulse' : ''}`} />
            <span>Escuchar contracubierta</span>
          </button>
          <button
            onClick={() => onSelectPage?.(1)}
            className="px-3 py-1.5 rounded-full bg-black/50 text-amber-200 hover:bg-black/80 transition-colors cursor-pointer"
          >
            Volver a la portada ↺
          </button>
          <span>Pág. 64</span>
        </div>
      </div>
    );
  }

  // STORY COVERS (PAGE 10, 18, 28, 61)
  if (page.type === 'story-cover' || page.type === 'closing-cover') {
    return (
      <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
        {page.image && (
          <div className="absolute inset-0 z-0">
            <img 
              src={page.image} 
              alt={page.title || 'Ilustración del relato'} 
              className="w-full h-full object-cover object-center filter brightness-[0.95]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 via-stone-900/30 to-stone-900/50" />
          </div>
        )}

        <div className="relative z-10 flex justify-between items-start">
          <span className="text-xs uppercase tracking-widest text-amber-200 font-semibold bg-black/40 px-3 py-1 rounded backdrop-blur-xs">
            {page.storyNumber ? `RELATO ${page.storyNumber}` : 'CIERRE EDITORIAL'}
          </span>
          <button
            onClick={() => onToggleBookmark(page.pageNumber)}
            className="p-2 rounded-full bg-black/40 text-amber-200 hover:bg-black/60 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        <div className="relative z-10 my-auto text-center space-y-4 px-4 bg-black/30 backdrop-blur-xs p-6 rounded-xl border border-white/10">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow">
            {page.title}
          </h2>
          {page.storyQuote && (
            <p className="font-serif italic text-lg sm:text-xl text-amber-200 max-w-lg mx-auto">
              {page.storyQuote}
            </p>
          )}
          {page.authorNote && (
            <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed pt-2">
              {page.authorNote}
            </p>
          )}
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-stone-200 font-mono">
          <button
            onClick={() => onReadPage(fullTextToRead)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 text-amber-200 hover:bg-black/80 transition-colors"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isReading ? 'text-amber-400 animate-pulse' : ''}`} />
            <span>{isReading ? 'Escuchando...' : 'Escuchar presentación'}</span>
          </button>
          <span>Pág. {page.pageNumber}</span>
        </div>
      </div>
    );
  }

  // TABLE OF CONTENTS (PAGE 3)
  if (page.type === 'toc') {
    const tocItems = [
      { title: 'Nota preliminar', pageNum: 4 },
      { title: 'Antes de escuchar estas voces', pageNum: 7 },
      { title: 'El cuerpo no lo olvida', pageNum: 11 },
      { title: 'Hasta ahora yo lo extraño', pageNum: 19 },
      { title: 'Entre la espera y el regreso', pageNum: 29 },
      { title: 'Lo que permanece', pageNum: 62 },
    ];

    return (
      <div className={`relative w-full h-full flex flex-col justify-between p-6 sm:p-12 ${getFontFamilyClass()}`}>
        <div className="flex justify-between items-center pb-3 border-b border-stone-200/70 text-xs tracking-wider text-stone-500 font-sans">
          <span className="uppercase font-medium">Índice General</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReadPage('Índice general. Nota preliminar, página 4. Antes de escuchar estas voces, página 7. El cuerpo no lo olvida, relato 1, página 11. Hasta ahora yo lo extraño, relato 2, página 19. Entre la espera y el regreso, relato 3, página 29. Lo que permanece, página 62.')}
              title="Escuchar índice"
              className="p-1 rounded hover:bg-stone-200/50 text-stone-500 hover:text-amber-800 transition-colors cursor-pointer"
            >
              <Volume2 className={`w-4 h-4 ${isReading ? 'text-amber-700 animate-pulse' : ''}`} />
            </button>
            <button
              onClick={() => onToggleBookmark(page.pageNumber)}
              className="p-1 rounded hover:bg-stone-200/50 transition-colors cursor-pointer"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-700 text-amber-700' : 'text-stone-400'}`} />
            </button>
          </div>
        </div>

        <div className="my-auto max-w-md mx-auto w-full py-6">
          <h2 className="font-serif text-3xl font-bold text-center text-stone-900 mb-8 tracking-tight">
            Índice
          </h2>

          <div className="space-y-4">
            {tocItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPage?.(item.pageNum)}
                className="w-full flex items-baseline justify-between group hover:text-amber-800 transition-colors text-left py-1 border-b border-stone-200/40"
              >
                <span className="font-serif text-base sm:text-lg font-medium text-stone-900 group-hover:text-amber-800 group-hover:translate-x-1 transition-transform">
                  {item.title}
                </span>
                <span className="font-mono text-sm text-stone-500 group-hover:text-amber-700 font-semibold">
                  {item.pageNum}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-stone-200/60 flex justify-between items-center text-xs text-stone-500 font-mono">
          <span className="italic font-serif text-[11px] text-stone-400">Del otro lado también hay voces</span>
          <span className="font-semibold text-stone-700">3</span>
        </div>
      </div>
    );
  }

  // STANDARD CONTENT PAGES (PAGE 3 TO 64)
  return (
    <div className={`relative w-full h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 ${getFontFamilyClass()}`}>
      {/* Top running header */}
      <div className="flex justify-between items-center pb-3 border-b border-stone-200/70 text-xs tracking-wider text-stone-500 font-sans">
        <span className="truncate max-w-[200px] sm:max-w-xs uppercase font-medium">
          {page.chapterTitle}
        </span>
        <div className="flex items-center gap-2">
          {onOpenNotesPanel && (
            <button
              onClick={() => onOpenNotesPanel(page.pageNumber)}
              title="Apuntes y notas personales"
              className="p-1.5 rounded-md hover:bg-amber-100 text-stone-600 hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1"
            >
              <StickyNote className="w-4 h-4 text-amber-600" />
              {notesCount > 0 && (
                <span className="text-[10px] bg-amber-600 text-white font-bold px-1 rounded-full">
                  {notesCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => onReadPage(fullTextToRead)}
            title="Leer esta página en voz alta"
            className="p-1.5 rounded-md hover:bg-amber-100 text-stone-600 hover:text-amber-900 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Volume2 className={`w-4 h-4 ${isReading ? 'text-amber-700 animate-pulse' : ''}`} />
            <span className="hidden sm:inline text-[11px] font-sans">Leer</span>
          </button>
          <button
            onClick={() => onToggleBookmark(page.pageNumber)}
            title={isBookmarked ? "Eliminar marcador" : "Marcar página"}
            className="p-1.5 rounded-md hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-700 text-amber-700' : 'text-stone-400'}`} />
          </button>
        </div>
      </div>

      {/* Main Reading Flow - Top-aligned with natural editorial rhythm */}
      <div className="flex-1 flex flex-col justify-start py-3 overflow-y-auto max-w-prose mx-auto w-full pr-1.5 space-y-3.5 scrollbar-thin">
        {page.title && (
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight pb-2 border-b border-stone-200/40">
            {page.title}
          </h2>
        )}
        {page.subtitle && (
          <p className="text-sm sm:text-base font-serif italic text-amber-900 font-medium">
            {page.subtitle}
          </p>
        )}

        <div className={`space-y-3 text-stone-800 ${getFontSizeClass()} text-justify`}>
          {page.paragraphs.map((p, idx) => {
            const isFirstParagraph = idx === 0 && (page.type === 'intro' || page.type === 'story' || page.type === 'closing');
            const isDialogue = p.startsWith('«') || p.startsWith('“');
            const isNote = p.startsWith('Nota:');
            const isHighlighted = highlights.some(h => h.pageNumber === page.pageNumber && h.paragraphIndex === idx);

            if (isNote) {
              return (
                <div key={idx} className="p-3 bg-amber-50/70 border-l-2 border-amber-600 rounded-r text-xs text-stone-600 font-sans italic my-2">
                  {p}
                </div>
              );
            }

            const isCurrentlyBeingRead = currentReadingPage === page.pageNumber && currentReadingParagraphIndex === idx;

            return (
              <div 
                key={idx} 
                ref={isCurrentlyBeingRead ? activeParagraphRef : undefined}
                className={`group/para relative transition-all duration-300 rounded-r ${
                  isCurrentlyBeingRead
                    ? 'bg-amber-100/90 dark:bg-amber-950/70 border-l-4 border-amber-600 pl-3.5 py-1.5 -ml-3.5 shadow-sm ring-2 ring-amber-400/50'
                    : ''
                }`}
              >
                {/* Live reading indicator badge */}
                {isCurrentlyBeingRead && (
                  <div className="flex items-center gap-1.5 mb-1.5 select-none">
                    <span className="inline-flex items-center gap-1 text-[10px] font-sans font-bold uppercase tracking-wider text-amber-900 bg-amber-200/90 px-2 py-0.5 rounded-full shadow-2xs">
                      <Volume2 className="w-3 h-3 animate-pulse text-amber-700" />
                      <span>Leyendo ahora</span>
                    </span>
                  </div>
                )}

                {isDialogue ? (
                  <p className={`pl-4 border-l-2 border-amber-700/30 italic text-stone-900 font-serif ${isHighlighted ? 'bg-amber-100/70 rounded p-1' : ''}`}>
                    {p}
                  </p>
                ) : isFirstParagraph ? (
                  <p className={`first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:text-amber-900 ${isHighlighted ? 'bg-amber-100/70 rounded p-1' : ''}`}>
                    {p}
                  </p>
                ) : (
                  <p className={isHighlighted ? 'bg-amber-100/70 rounded p-1' : ''}>
                    {p}
                  </p>
                )}

                {/* Paragraph action buttons (Play from here & Highlight) */}
                <div className="absolute -right-8 sm:-right-10 top-1 opacity-0 group-hover/para:opacity-100 transition-opacity flex items-center gap-1 z-10">
                  {onReadFromParagraph && (
                    <button
                      onClick={() => onReadFromParagraph(page.pageNumber, idx)}
                      title="Escuchar desde este párrafo"
                      className="p-1 rounded hover:bg-amber-200/80 text-amber-800 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                  {onToggleHighlightParagraph && (
                    <button
                      onClick={() => onToggleHighlightParagraph(page.pageNumber, idx, p)}
                      title={isHighlighted ? "Quitar subrayado" : "Subrayar este pasaje"}
                      className={`p-1 rounded hover:bg-stone-200/70 cursor-pointer ${
                        isHighlighted ? '!opacity-100 text-amber-700' : 'text-stone-400'
                      }`}
                    >
                      <Highlighter className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Literary Decorative Vignette on short pages to balance the editorial spread */}
        {isShortPage && (
          <div className="mt-auto pt-8 pb-4 flex flex-col items-center justify-center opacity-60 select-none">
            <div className="flex items-center gap-3 text-stone-400">
              <span className="w-12 h-px bg-stone-300"></span>
              <span className="text-xs font-serif italic text-amber-800 tracking-widest">✦ ❦ ✦</span>
              <span className="w-12 h-px bg-stone-300"></span>
            </div>
            <span className="text-[11px] font-serif italic text-stone-400 mt-1">
              Universidad Mariana · Trabajo Social
            </span>
          </div>
        )}
      </div>

      {/* Bottom Page Number */}
      <div className="pt-3 border-t border-stone-200/60 flex justify-between items-center text-xs text-stone-500 font-mono">
        <span className="italic font-serif text-[11px] text-stone-400">Del otro lado también hay voces</span>
        <span className="font-semibold text-stone-700">{page.pageNumber}</span>
      </div>
    </div>
  );
};
