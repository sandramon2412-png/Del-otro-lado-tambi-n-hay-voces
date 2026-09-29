import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';
import { searchInBook, SearchResult } from '../data/bookData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (pageNumber: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const res = searchInBook(query);
    setResults(res);
  }, [query]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/70 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Search header input */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3 bg-stone-50">
          <Search className="w-5 h-5 text-amber-700 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar palabras o testimonios (ej. 'memoria', 'hospital', 'Cruz Roja', 'Pasto')..."
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-stone-200 rounded text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Results area */}
        <div className="p-4 overflow-y-auto divide-y divide-stone-100 flex-1">
          {query.trim().length < 2 ? (
            <div className="py-8 text-center text-stone-500 text-sm">
              <BookOpen className="w-8 h-8 mx-auto text-stone-300 mb-2" />
              <p>Escribe al menos dos letras para explorar los 64 folios del libro.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['Cumbitara', 'soldado', 'memoria', 'familia', 'Virgen de las Lajas', 'herida'].map((sample) => (
                  <button
                    key={sample}
                    onClick={() => setQuery(sample)}
                    className="text-xs px-2.5 py-1 bg-stone-100 hover:bg-amber-100 text-stone-700 rounded-md transition-colors"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-stone-500 text-sm">
              <p>No se encontraron pasajes con la palabra “{query}”.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-stone-500 font-medium pb-1">
                {results.length} {results.length === 1 ? 'coincidencia encontrada' : 'coincidencias encontradas'}:
              </div>
              {results.map((res, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelectResult(res.pageNumber);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-amber-50/60 transition-colors group border border-transparent hover:border-amber-200 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between text-xs text-amber-900 font-medium">
                    <span className="font-serif">{res.chapterTitle}</span>
                    <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600 group-hover:bg-amber-100">
                      Pág. {res.pageNumber}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 font-serif leading-relaxed line-clamp-2">
                    {res.matchedText}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
