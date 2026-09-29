import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ALL_PAGES, BOOK_METADATA, getPage, getChapterByPage } from './data/bookData';
import { BookNavbar } from './components/BookNavbar';
import { TwoPageView } from './components/TwoPageView';
import { SinglePageView } from './components/SinglePageView';
import { ContinuousView } from './components/ContinuousView';
import { TableOfContentsDrawer } from './components/TableOfContentsDrawer';
import { SearchModal } from './components/SearchModal';
import { ReaderSettingsModal } from './components/ReaderSettingsModal';
import { PageScrubber } from './components/PageScrubber';
import { AudioNarrationBar } from './components/AudioNarrationBar';
import { VoiceSelectorModal } from './components/VoiceSelectorModal';
import { AutoFlipWidget } from './components/AutoFlipWidget';
import { PageInteractionsPanel } from './components/PageInteractionsPanel';
import { SavedHighlight, SavedNote } from './data/userInteractions';
import { soundManager } from './utils/audioUtils';
import { speechEngine, VOICE_PROFILES } from './utils/speechUtils';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const saved = localStorage.getItem('del_otro_lado_page');
    return saved ? Math.min(Math.max(1, parseInt(saved, 10)), BOOK_METADATA.totalPages) : 1;
  });

  const [viewMode, setViewMode] = useState<'double' | 'single' | 'scroll'>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'single';
    }
    return 'double';
  });

  const [theme, setTheme] = useState<'paper' | 'sepia' | 'dark' | 'white'>('paper');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');

  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('del_otro_lado_bookmarks');
      return saved ? JSON.parse(saved) : [1, 2, 7, 10, 18, 28, 62];
    } catch {
      return [1, 2, 7, 10, 18, 28, 62];
    }
  });

  // User interactions: Highlights & Notes
  const [highlights, setHighlights] = useState<SavedHighlight[]>(() => {
    try {
      const saved = localStorage.getItem('del_otro_lado_highlights');
      return saved ? JSON.parse(saved) : [
        {
          id: 'hl-sample-1',
          pageNumber: 2,
          paragraphIndex: 0,
          text: '“Hay que recuperar, mantener y transmitir la memoria histórica, porque se empieza por el olvido y se termina en la indiferencia.”',
          color: 'amber',
          createdAt: Date.now() - 86400000,
        },
        {
          id: 'hl-sample-2',
          pageNumber: 10,
          paragraphIndex: 0,
          text: '«El monte enseña a aguantar el hambre, pero también a no encariñarse con nada ni con nadie.»',
          color: 'emerald',
          createdAt: Date.now() - 36000000,
        }
      ];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<SavedNote[]>(() => {
    try {
      const saved = localStorage.getItem('del_otro_lado_notes');
      return saved ? JSON.parse(saved) : [
        {
          id: 'note-sample-1',
          pageNumber: 10,
          text: 'Reflexión clave sobre el desarraigo y la deshumanización que impone la guerra en la juventud.',
          createdAt: Date.now() - 36000000,
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeNotesPage, setActiveNotesPage] = useState<number | null>(null);

  // Auto-flip & Auto-read
  const [isAutoFlipEnabled, setIsAutoFlipEnabled] = useState<boolean>(false);
  const [autoFlipSeconds, setAutoFlipSeconds] = useState<number>(8);
  const [autoTurnOnVoiceEnd, setAutoTurnOnVoiceEnd] = useState<boolean>(true);

  // Voice profiles and synthesis
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(() => {
    return localStorage.getItem('del_otro_lado_profile_id') || 'elena-female';
  });
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(() => {
    return localStorage.getItem('del_otro_lado_voice_uri');
  });
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(() => {
    const saved = localStorage.getItem('del_otro_lado_speed');
    return saved ? parseFloat(saved) : 1.0;
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [textToRead, setTextToRead] = useState<string | null>(null);
  const [currentReadingPage, setCurrentReadingPage] = useState<number | null>(null);
  const [currentReadingParagraphIndex, setCurrentReadingParagraphIndex] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Load voices on mount
  useEffect(() => {
    const updateVoices = () => {
      const v = speechEngine.getVoices();
      setAvailableVoices(v);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('del_otro_lado_page', currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('del_otro_lado_bookmarks', JSON.stringify(bookmarkedPages));
  }, [bookmarkedPages]);

  useEffect(() => {
    localStorage.setItem('del_otro_lado_highlights', JSON.stringify(highlights));
  }, [highlights]);

  useEffect(() => {
    localStorage.setItem('del_otro_lado_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('del_otro_lado_profile_id', selectedProfileId);
  }, [selectedProfileId]);

  useEffect(() => {
    if (selectedVoiceURI) {
      localStorage.setItem('del_otro_lado_voice_uri', selectedVoiceURI);
    }
  }, [selectedVoiceURI]);

  useEffect(() => {
    localStorage.setItem('del_otro_lado_speed', speedMultiplier.toString());
  }, [speedMultiplier]);

  // Turn page forward
  const handleNextPage = useCallback(() => {
    const step = viewMode === 'double' ? 2 : 1;
    setCurrentPage((prev) => {
      const next = prev + step;
      if (next <= BOOK_METADATA.totalPages) {
        soundManager.playPageTurn();
        return next;
      }
      return prev;
    });
  }, [viewMode]);

  // Turn page backward
  const handlePrevPage = useCallback(() => {
    const step = viewMode === 'double' ? 2 : 1;
    setCurrentPage((prev) => {
      const next = Math.max(1, prev - step);
      if (next !== prev) {
        soundManager.playPageTurn();
      }
      return next;
    });
  }, [viewMode]);

  // Auto-flip trigger callback
  const handleAutoFlipTrigger = useCallback(() => {
    const step = viewMode === 'double' ? 2 : 1;
    setCurrentPage((prev) => {
      const next = prev + step;
      if (next <= BOOK_METADATA.totalPages) {
        soundManager.playPageTurn();
        return next;
      } else {
        // Reached end of book
        setIsAutoFlipEnabled(false);
        return prev;
      }
    });
  }, [viewMode]);

  // Keyboard navigation & interaction shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        return;
      }
      if (isSearchOpen || isSettingsOpen || isTocOpen || isVoiceModalOpen || activeNotesPage !== null) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevPage();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setIsAutoFlipEnabled((prev) => !prev);
      } else if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setIsVoiceModalOpen(true);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsAmbientPlaying(soundManager.toggleAmbient());
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setActiveNotesPage(currentPage);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, isSettingsOpen, isTocOpen, isVoiceModalOpen, activeNotesPage, handleNextPage, handlePrevPage, currentPage]);

  const toggleBookmark = useCallback((pageNum: number) => {
    setBookmarkedPages((prev) => 
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]
    );
  }, []);

  const handleToggleAmbient = () => {
    const nextState = soundManager.toggleAmbient();
    setIsAmbientPlaying(nextState);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleReadFromParagraph = useCallback((pageNumber: number, paragraphIndex: number) => {
    const pageObj = getPage(pageNumber);
    if (!pageObj) return;

    const targetText = pageObj.paragraphs[paragraphIndex] || [pageObj.title, pageObj.subtitle].filter(Boolean).join('. ');
    if (!targetText) return;

    // Navigate to page if not in view
    if (viewMode === 'double') {
      const isLeft = currentPage % 2 === 1 ? currentPage === pageNumber : currentPage - 1 === pageNumber;
      const isRight = (currentPage % 2 === 1 ? currentPage + 1 : currentPage) === pageNumber;
      if (!isLeft && !isRight) {
        setCurrentPage(pageNumber);
      }
    } else if (currentPage !== pageNumber) {
      setCurrentPage(pageNumber);
    }

    setCurrentReadingPage(pageNumber);
    setCurrentReadingParagraphIndex(paragraphIndex);
    setTextToRead(targetText);
  }, [currentPage, viewMode]);

  const handleReadPage = useCallback((fullText: string) => {
    // Find which page this text belongs to
    const targetPage = ALL_PAGES.find(p => {
      const textMatch = [p.title, p.subtitle, ...p.paragraphs].join(' ');
      return textMatch.includes(fullText.slice(0, 30)) || fullText.includes(p.paragraphs[0] || '___');
    });

    const pageNum = targetPage ? targetPage.pageNumber : currentPage;

    if (currentReadingPage === pageNum && currentReadingParagraphIndex !== null) {
      speechEngine.stop();
      setTextToRead(null);
      setCurrentReadingPage(null);
      setCurrentReadingParagraphIndex(null);
      return;
    }

    const pageObj = getPage(pageNum);
    if (!pageObj) return;

    if (pageObj.paragraphs.length > 0) {
      handleReadFromParagraph(pageNum, 0);
    } else {
      const fallback = [pageObj.title, pageObj.subtitle, pageObj.storyQuote, pageObj.authorNote].filter(Boolean).join('. ');
      setCurrentReadingPage(pageNum);
      setCurrentReadingParagraphIndex(0);
      setTextToRead(fallback || 'Página ' + pageNum);
    }
  }, [currentReadingPage, currentReadingParagraphIndex, currentPage, handleReadFromParagraph]);

  // Synchronized callback when current paragraph narration ends
  const handleNarrationParagraphEnd = useCallback(() => {
    if (currentReadingPage === null || currentReadingParagraphIndex === null) {
      setTextToRead(null);
      return;
    }

    const pageObj = getPage(currentReadingPage);
    if (!pageObj) {
      setTextToRead(null);
      setCurrentReadingPage(null);
      setCurrentReadingParagraphIndex(null);
      return;
    }

    // Advance to next paragraph on the same page
    const nextParaIdx = currentReadingParagraphIndex + 1;
    if (nextParaIdx < pageObj.paragraphs.length) {
      setCurrentReadingParagraphIndex(nextParaIdx);
      setTextToRead(pageObj.paragraphs[nextParaIdx]);
      return;
    }

    // Page finished! Advance page if autoTurnOnVoiceEnd is enabled
    if (autoTurnOnVoiceEnd) {
      const step = viewMode === 'double' ? 2 : 1;
      const nextPage = currentReadingPage + step;

      if (nextPage <= BOOK_METADATA.totalPages) {
        soundManager.playPageTurn();
        setCurrentPage(nextPage);

        const nextPageObj = getPage(nextPage);
        if (nextPageObj && nextPageObj.paragraphs.length > 0) {
          setTimeout(() => {
            setCurrentReadingPage(nextPage);
            setCurrentReadingParagraphIndex(0);
            setTextToRead(nextPageObj.paragraphs[0]);
          }, 450);
        } else {
          setTextToRead(null);
          setCurrentReadingPage(null);
          setCurrentReadingParagraphIndex(null);
        }
      } else {
        setTextToRead(null);
        setCurrentReadingPage(null);
        setCurrentReadingParagraphIndex(null);
      }
    } else {
      setTextToRead(null);
      setCurrentReadingPage(null);
      setCurrentReadingParagraphIndex(null);
    }
  }, [currentReadingPage, currentReadingParagraphIndex, autoTurnOnVoiceEnd, viewMode]);

  const handleNextParagraph = useCallback(() => {
    if (currentReadingPage === null || currentReadingParagraphIndex === null) return;
    const pageObj = getPage(currentReadingPage);
    if (!pageObj) return;

    if (currentReadingParagraphIndex + 1 < pageObj.paragraphs.length) {
      const nextIdx = currentReadingParagraphIndex + 1;
      setCurrentReadingParagraphIndex(nextIdx);
      setTextToRead(pageObj.paragraphs[nextIdx]);
    }
  }, [currentReadingPage, currentReadingParagraphIndex]);

  const handlePrevParagraph = useCallback(() => {
    if (currentReadingPage === null || currentReadingParagraphIndex === null) return;
    const pageObj = getPage(currentReadingPage);
    if (!pageObj) return;

    if (currentReadingParagraphIndex > 0) {
      const prevIdx = currentReadingParagraphIndex - 1;
      setCurrentReadingParagraphIndex(prevIdx);
      setTextToRead(pageObj.paragraphs[prevIdx]);
    }
  }, [currentReadingPage, currentReadingParagraphIndex]);

  const handleStopReading = useCallback(() => {
    speechEngine.stop();
    setTextToRead(null);
    setCurrentReadingPage(null);
    setCurrentReadingParagraphIndex(null);
  }, []);

  // Highlights handlers
  const handleToggleHighlightParagraph = useCallback((pageNumber: number, paragraphIndex: number, text: string) => {
    setHighlights((prev) => {
      const exists = prev.find(h => h.pageNumber === pageNumber && h.paragraphIndex === paragraphIndex);
      if (exists) {
        return prev.filter(h => h.id !== exists.id);
      } else {
        const newHighlight: SavedHighlight = {
          id: `hl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          pageNumber,
          paragraphIndex,
          text,
          color: 'amber',
          createdAt: Date.now(),
        };
        return [...prev, newHighlight];
      }
    });
  }, []);

  const handleRemoveHighlight = useCallback((id: string) => {
    setHighlights((prev) => prev.filter(h => h.id !== id));
  }, []);

  // Notes handlers
  const handleAddNote = useCallback((text: string) => {
    if (!activeNotesPage) return;
    const newNote: SavedNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      pageNumber: activeNotesPage,
      text,
      createdAt: Date.now(),
    };
    setNotes((prev) => [newNote, ...prev]);
  }, [activeNotesPage]);

  const handleRemoveNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter(n => n.id !== id));
  }, []);

  // Two-page calculation
  const leftPageNum = currentPage % 2 === 1 ? currentPage : currentPage - 1;
  const rightPageNum = leftPageNum + 1 <= BOOK_METADATA.totalPages ? leftPageNum + 1 : undefined;

  const leftPage = getPage(leftPageNum);
  const rightPage = rightPageNum ? getPage(rightPageNum) : undefined;
  const currentChapter = getChapterByPage(currentPage);

  const activeVoiceProfile = VOICE_PROFILES.find((p) => p.id === selectedProfileId) || VOICE_PROFILES[0];

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-stone-950 text-stone-100' : 'bg-[#EAE5DE] text-stone-900'} antialiased select-none`}>
      
      {/* Top Navigation Bar with Direct Voice & Auto-Flip Controls */}
      <BookNavbar
        currentChapter={currentChapter}
        currentPage={currentPage}
        totalPages={BOOK_METADATA.totalPages}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenToc={() => setIsTocOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onJumpToPage={(p) => setCurrentPage(p)}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={handleToggleAmbient}
        bookmarksCount={bookmarkedPages.length}
        onOpenBookmarks={() => setIsTocOpen(true)}
        isAutoFlipEnabled={isAutoFlipEnabled}
        onToggleAutoFlip={() => setIsAutoFlipEnabled((prev) => !prev)}
        autoFlipSeconds={autoFlipSeconds}
        voiceProfileName={activeVoiceProfile.name}
        voiceProfileIcon={activeVoiceProfile.icon}
        onOpenVoiceSelector={() => setIsVoiceModalOpen(true)}
      />

      {/* Floating Auto-Flip Countdown Widget when auto-flip is active */}
      {isAutoFlipEnabled && (
        <AutoFlipWidget
          isEnabled={isAutoFlipEnabled}
          onToggle={() => setIsAutoFlipEnabled(false)}
          secondsInterval={autoFlipSeconds}
          onChangeSeconds={setAutoFlipSeconds}
          onTriggerFlip={handleAutoFlipTrigger}
          currentPage={currentPage}
          totalPages={BOOK_METADATA.totalPages}
        />
      )}

      {/* Main Reading Canvas */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 pb-24 select-text overflow-hidden">
        {viewMode === 'double' ? (
          <TwoPageView
            leftPage={leftPage}
            rightPage={rightPage}
            totalPages={BOOK_METADATA.totalPages}
            fontSize={fontSize}
            theme={theme}
            fontFamily={fontFamily}
            bookmarkedPages={bookmarkedPages}
            onToggleBookmark={toggleBookmark}
            onPrevPages={handlePrevPage}
            onNextPages={handleNextPage}
            onReadPage={handleReadPage}
            onSelectPage={(p) => setCurrentPage(p)}
            currentReadingText={textToRead}
            highlights={highlights}
            onToggleHighlightParagraph={handleToggleHighlightParagraph}
            onOpenNotesPanel={(p) => setActiveNotesPage(p)}
            notes={notes}
            currentReadingPage={currentReadingPage}
            currentReadingParagraphIndex={currentReadingParagraphIndex}
            onReadFromParagraph={handleReadFromParagraph}
          />
        ) : viewMode === 'single' ? (
          <SinglePageView
            page={getPage(currentPage) || ALL_PAGES[0]}
            totalPages={BOOK_METADATA.totalPages}
            fontSize={fontSize}
            theme={theme}
            fontFamily={fontFamily}
            isBookmarked={bookmarkedPages.includes(currentPage)}
            onToggleBookmark={toggleBookmark}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onReadPage={handleReadPage}
            onSelectPage={(p) => setCurrentPage(p)}
            isReading={Boolean(textToRead)}
            highlights={highlights}
            onToggleHighlightParagraph={handleToggleHighlightParagraph}
            onOpenNotesPanel={(p) => setActiveNotesPage(p)}
            notes={notes}
            currentReadingPage={currentReadingPage}
            currentReadingParagraphIndex={currentReadingParagraphIndex}
            onReadFromParagraph={handleReadFromParagraph}
          />
        ) : (
          <ContinuousView
            pages={ALL_PAGES}
            currentPage={currentPage}
            fontSize={fontSize}
            theme={theme}
            fontFamily={fontFamily}
            bookmarkedPages={bookmarkedPages}
            onToggleBookmark={toggleBookmark}
            onReadPage={handleReadPage}
            onPageInView={(p) => setCurrentPage(p)}
            highlights={highlights}
            onToggleHighlightParagraph={handleToggleHighlightParagraph}
            onOpenNotesPanel={(p) => setActiveNotesPage(p)}
            notes={notes}
            currentReadingPage={currentReadingPage}
            currentReadingParagraphIndex={currentReadingParagraphIndex}
            onReadFromParagraph={handleReadFromParagraph}
          />
        )}
      </main>

      {/* Floating Audio Narration Bar with Voice selector, paragraph counter & skip controls */}
      <AudioNarrationBar
        textToRead={textToRead}
        onStop={handleStopReading}
        currentPageNumber={currentReadingPage || currentPage}
        onPageEnd={handleNarrationParagraphEnd}
        autoTurnOnVoiceEnd={autoTurnOnVoiceEnd}
        selectedProfileId={selectedProfileId}
        selectedVoiceURI={selectedVoiceURI}
        speedMultiplier={speedMultiplier}
        onOpenVoiceSelector={() => setIsVoiceModalOpen(true)}
        paragraphIndex={currentReadingParagraphIndex}
        totalParagraphs={currentReadingPage ? (getPage(currentReadingPage)?.paragraphs.length || 0) : 0}
        onNextParagraph={handleNextParagraph}
        onPrevParagraph={handlePrevParagraph}
      />

      {/* Bottom Scrubber & Progress Bar with Auto-flip quick button */}
      <PageScrubber
        currentPage={currentPage}
        totalPages={BOOK_METADATA.totalPages}
        currentChapter={currentChapter}
        onPageChange={(p) => setCurrentPage(p)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isAutoFlipEnabled={isAutoFlipEnabled}
        onToggleAutoFlip={() => setIsAutoFlipEnabled((prev) => !prev)}
        autoFlipSeconds={autoFlipSeconds}
      />

      {/* Dedicated Voice Selector Modal */}
      <VoiceSelectorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        selectedProfileId={selectedProfileId}
        onSelectProfileId={setSelectedProfileId}
        selectedVoiceURI={selectedVoiceURI}
        onSelectVoiceURI={setSelectedVoiceURI}
        availableVoices={availableVoices}
        autoTurnOnVoiceEnd={autoTurnOnVoiceEnd}
        onToggleAutoTurnOnVoiceEnd={() => setAutoTurnOnVoiceEnd(prev => !prev)}
        speedMultiplier={speedMultiplier}
        onChangeSpeedMultiplier={setSpeedMultiplier}
      />

      {/* Interactive Notes & Reflections Drawer */}
      <PageInteractionsPanel
        pageNumber={activeNotesPage || currentPage}
        highlights={highlights}
        onAddHighlight={(hl) => {
          const newHighlight: SavedHighlight = {
            ...hl,
            id: `hl-${Date.now()}`,
            createdAt: Date.now(),
          };
          setHighlights(prev => [...prev, newHighlight]);
        }}
        onRemoveHighlight={handleRemoveHighlight}
        notes={notes}
        onAddNote={handleAddNote}
        onRemoveNote={handleRemoveNote}
        isOpen={activeNotesPage !== null}
        onClose={() => setActiveNotesPage(null)}
      />

      {/* Table of Contents Drawer */}
      <TableOfContentsDrawer
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        currentPage={currentPage}
        onSelectPage={(p) => setCurrentPage(p)}
        bookmarkedPages={bookmarkedPages}
        onRemoveBookmark={toggleBookmark}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(p) => setCurrentPage(p)}
      />

      {/* Settings Modal */}
      <ReaderSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        fontSize={fontSize}
        onChangeFontSize={setFontSize}
        theme={theme}
        onChangeTheme={setTheme}
        fontFamily={fontFamily}
        onChangeFontFamily={setFontFamily}
        isAutoFlipEnabled={isAutoFlipEnabled}
        onToggleAutoFlip={() => setIsAutoFlipEnabled(prev => !prev)}
        autoFlipSeconds={autoFlipSeconds}
        onChangeAutoFlipSeconds={setAutoFlipSeconds}
        autoTurnOnVoiceEnd={autoTurnOnVoiceEnd}
        onToggleAutoTurnOnVoiceEnd={() => setAutoTurnOnVoiceEnd(prev => !prev)}
        availableVoices={availableVoices}
        selectedVoiceURI={selectedVoiceURI}
        onChangeVoiceURI={setSelectedVoiceURI}
      />

    </div>
  );
}
