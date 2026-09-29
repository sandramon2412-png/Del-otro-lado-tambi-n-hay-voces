import React, { useState } from 'react';
import { 
  Highlighter, 
  StickyNote, 
  Trash2, 
  Check, 
  Plus, 
  Bookmark,
  Share2,
  Copy
} from 'lucide-react';
import { SavedHighlight, SavedNote } from '../data/userInteractions';

interface PageInteractionsPanelProps {
  pageNumber: number;
  highlights: SavedHighlight[];
  onAddHighlight: (highlight: Omit<SavedHighlight, 'id' | 'createdAt'>) => void;
  onRemoveHighlight: (id: string) => void;
  notes: SavedNote[];
  onAddNote: (text: string) => void;
  onRemoveNote: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const PageInteractionsPanel: React.FC<PageInteractionsPanelProps> = ({
  pageNumber,
  highlights,
  onAddHighlight,
  onRemoveHighlight,
  notes,
  onAddNote,
  onRemoveNote,
  isOpen,
  onClose,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [copiedQuote, setCopiedQuote] = useState(false);

  if (!isOpen) return null;

  const pageHighlights = highlights.filter(h => h.pageNumber === pageNumber);
  const pageNotes = notes.filter(n => n.pageNumber === pageNumber);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-stone-50 border-l border-stone-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-amber-700" />
          <h3 className="font-serif font-bold text-stone-900 text-base">
            Notas y Reflexiones (Folio {pageNumber})
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* Notes form */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2.5 shadow-2xs">
          <h4 className="text-xs uppercase font-bold text-stone-700 tracking-wider flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            Añadir Apunte Personal
          </h4>
          <form onSubmit={handleCreateNote} className="space-y-2">
            <textarea
              rows={3}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Escribe tu reflexión, memoria o pregunta sobre este pasaje..."
              className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:border-amber-600 text-stone-800"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Guardar Apunte
              </button>
            </div>
          </form>
        </div>

        {/* Existing notes on this page */}
        <div>
          <h4 className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
            Tus Notas Guardadas en esta Página ({pageNotes.length})
          </h4>
          {pageNotes.length === 0 ? (
            <div className="p-4 bg-stone-100/70 border border-dashed border-stone-200 rounded-lg text-center text-xs text-stone-400">
              No has añadido notas en este folio aún.
            </div>
          ) : (
            <div className="space-y-2">
              {pageNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl relative group text-xs text-stone-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-amber-800 font-mono">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => onRemoveNote(note.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors p-1"
                      title="Eliminar apunte"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-serif italic leading-relaxed text-stone-800">
                    "{note.text}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Highlighted quotes on this page */}
        <div>
          <h4 className="text-xs uppercase font-bold text-stone-500 tracking-wider mb-2">
            Pasajes Destacados ({pageHighlights.length})
          </h4>
          {pageHighlights.length === 0 ? (
            <div className="p-4 bg-stone-100/70 border border-dashed border-stone-200 rounded-lg text-center text-xs text-stone-400">
              Toca el botón de subrayar en los párrafos para coleccionar citas memorables.
            </div>
          ) : (
            <div className="space-y-2">
              {pageHighlights.map((hl) => (
                <div
                  key={hl.id}
                  className="p-3 bg-white border border-stone-200 rounded-xl text-xs space-y-1 group"
                >
                  <div className="flex items-center justify-between text-[10px] text-stone-400">
                    <span className="font-mono">Párrafo #{hl.paragraphIndex + 1}</span>
                    <button
                      onClick={() => onRemoveHighlight(hl.id)}
                      className="text-stone-400 hover:text-red-600 p-1"
                      title="Quitar subrayado"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-serif text-stone-700 italic border-l-2 border-amber-500 pl-2">
                    {hl.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
