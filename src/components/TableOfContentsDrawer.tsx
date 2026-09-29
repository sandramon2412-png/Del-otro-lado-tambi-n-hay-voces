import React, { useState } from 'react';
import { X, BookOpen, Bookmark, Info, ArrowRight, Trash2 } from 'lucide-react';
import { CHAPTERS, BOOK_METADATA } from '../data/bookData';

interface TableOfContentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: number;
  onSelectPage: (page: number) => void;
  bookmarkedPages: number[];
  onRemoveBookmark: (page: number) => void;
}

export const TableOfContentsDrawer: React.FC<TableOfContentsDrawerProps> = ({
  isOpen,
  onClose,
  currentPage,
  onSelectPage,
  bookmarkedPages,
  onRemoveBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'toc' | 'bookmarks' | 'about'>('toc');
  const [jumpInput, setJumpInput] = useState('');

  if (!isOpen) return null;

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpInput, 10);
    if (!isNaN(p) && p >= 1 && p <= BOOK_METADATA.totalPages) {
      onSelectPage(p);
      setJumpInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative ml-auto w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col z-10 border-l border-stone-200">
        
        {/* Header */}
        <div className="p-4 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif font-bold text-stone-900 text-lg">
              Navegación del Libro
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-stone-100 text-stone-500 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1 gap-1">
          <button
            onClick={() => setActiveTab('toc')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'toc' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Índice
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'bookmarks' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Marcadores ({bookmarkedPages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'about' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Créditos</span>
          </button>
        </div>

        {/* Quick jump to page input */}
        <div className="p-3 border-b border-stone-200 bg-white">
          <form onSubmit={handleJump} className="flex gap-2">
            <input
              type="number"
              min={1}
              max={BOOK_METADATA.totalPages}
              placeholder={`Ir a página (1-${BOOK_METADATA.totalPages})...`}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-md focus:outline-hidden focus:border-amber-700"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-100 text-xs font-medium rounded-md flex items-center gap-1 shrink-0"
            >
              <span>Ir</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          
          {/* TAB: TOC */}
          {activeTab === 'toc' && (
            <div className="space-y-2.5">
              {CHAPTERS.map((chap) => {
                const isActive = currentPage >= chap.startPage && currentPage <= chap.endPage;
                return (
                  <button
                    key={chap.id}
                    onClick={() => {
                      onSelectPage(chap.startPage);
                      onClose();
                    }}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all ${
                      isActive 
                        ? 'bg-amber-50/80 border-amber-300 shadow-xs' 
                        : 'bg-white border-stone-200/80 hover:border-amber-200 hover:bg-stone-50/60'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-serif font-bold text-stone-900 text-sm">
                        {chap.title}
                      </span>
                      <span className="text-xs font-mono text-stone-500 shrink-0">
                        pág. {chap.startPage}{chap.startPage !== chap.endPage ? ` - ${chap.endPage}` : ''}
                      </span>
                    </div>
                    {chap.subtitle && (
                      <div className="text-xs text-amber-800 font-serif italic mt-0.5">
                        {chap.subtitle}
                      </div>
                    )}
                    <p className="text-xs text-stone-600 font-sans mt-1.5 line-clamp-2 leading-relaxed">
                      {chap.summary}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB: BOOKMARKS */}
          {activeTab === 'bookmarks' && (
            <div>
              {bookmarkedPages.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-sm">
                  <Bookmark className="w-8 h-8 mx-auto text-stone-300 mb-2" />
                  <p>Aún no tienes páginas marcadas.</p>
                  <p className="text-xs text-stone-400 mt-1">Haz clic en el icono de marcador en cualquier página para guardarla aquí.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {bookmarkedPages.sort((a, b) => a - b).map((pNum) => (
                    <div
                      key={pNum}
                      className="flex items-center justify-between p-3 bg-white border border-stone-200 rounded-lg hover:border-amber-300 transition-colors"
                    >
                      <button
                        onClick={() => {
                          onSelectPage(pNum);
                          onClose();
                        }}
                        className="text-left flex-1"
                      >
                        <div className="text-sm font-serif font-semibold text-stone-900">
                          Página {pNum}
                        </div>
                        <div className="text-xs text-stone-500">
                          {pNum === 1 ? 'Portada' : pNum <= 3 ? 'Presentación' : pNum <= 9 ? 'Introducción' : pNum <= 17 ? 'Relato 1' : pNum <= 27 ? 'Relato 2' : pNum <= 60 ? 'Relato 3' : 'Cierre'}
                        </div>
                      </button>
                      <button
                        onClick={() => onRemoveBookmark(pNum)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        title="Eliminar marcador"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ABOUT / CREDITS */}
          {activeTab === 'about' && (
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed font-sans bg-white p-4 rounded-xl border border-stone-200">
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-sm mb-1">
                  Acerca de esta obra
                </h4>
                <p>
                  Esta antología digital surge del proyecto de investigación <em>“Rupturas y reconstrucción: estrategias de reparación simbólica en el tejido social de militares víctimas del conflicto armado en Colombia”</em>.
                </p>
              </div>

              <div className="border-t border-stone-100 pt-3 space-y-1.5">
                <div className="font-semibold text-stone-900">Institución Académica:</div>
                <div>{BOOK_METADATA.institution}</div>
                <div>{BOOK_METADATA.program}</div>
                <div>{BOOK_METADATA.location}</div>
              </div>

              <div className="border-t border-stone-100 pt-3 space-y-1.5">
                <div className="font-semibold text-stone-900">Investigadores y Autores:</div>
                <ul className="list-disc pl-4 space-y-1">
                  {BOOK_METADATA.authors.map((a, i) => (
                    <li key={i}>{a.name}</li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-stone-100 pt-3 space-y-1.5">
                <div className="font-semibold text-stone-900">Fundamentación Metodológica:</div>
                <p>
                  Principios de la escritura autobiográfica reflexiva según Louise DeSalvo y marcos de reparación simbólica en Trabajo Social.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-stone-200 bg-stone-100 text-center text-xs text-stone-500 font-mono">
          Página actual: {currentPage} de {BOOK_METADATA.totalPages}
        </div>
      </div>
    </div>
  );
};
