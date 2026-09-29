import React, { useState } from 'react';
import { X, Check, Clock, Play, Pause, Volume2, User, Sliders } from 'lucide-react';

interface ReaderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode: 'double' | 'single' | 'scroll';
  onChangeViewMode: (mode: 'double' | 'single' | 'scroll') => void;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  onChangeFontSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  theme: 'paper' | 'sepia' | 'dark' | 'white';
  onChangeTheme: (theme: 'paper' | 'sepia' | 'dark' | 'white') => void;
  fontFamily: 'serif' | 'sans';
  onChangeFontFamily: (font: 'serif' | 'sans') => void;
  // Auto-flip & Auto-read props
  isAutoFlipEnabled: boolean;
  onToggleAutoFlip: () => void;
  autoFlipSeconds: number;
  onChangeAutoFlipSeconds: (sec: number) => void;
  autoTurnOnVoiceEnd: boolean;
  onToggleAutoTurnOnVoiceEnd: () => void;
  // Voices props
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
  onChangeVoiceURI: (uri: string) => void;
}

export const ReaderSettingsModal: React.FC<ReaderSettingsModalProps> = ({
  isOpen,
  onClose,
  viewMode,
  onChangeViewMode,
  fontSize,
  onChangeFontSize,
  theme,
  onChangeTheme,
  fontFamily,
  onChangeFontFamily,
  isAutoFlipEnabled,
  onToggleAutoFlip,
  autoFlipSeconds,
  onChangeAutoFlipSeconds,
  autoTurnOnVoiceEnd,
  onToggleAutoTurnOnVoiceEnd,
  availableVoices,
  selectedVoiceURI,
  onChangeVoiceURI,
}) => {
  const [activeTab, setActiveTab] = useState<'reading' | 'audio' | 'autoflip'>('reading');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <h3 className="font-serif font-bold text-stone-900 text-lg">
            Ajustes de Lectura e Interactividad
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-stone-200 text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('reading')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'reading' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Formato y Papel
          </button>
          <button
            onClick={() => setActiveTab('autoflip')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'autoflip' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Paso Automático</span>
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'audio' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-600" />
            <span>Voces y Narrador</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 space-y-6 overflow-y-auto flex-1">
          
          {/* TAB 1: FORMAT & PAPER */}
          {activeTab === 'reading' && (
            <div className="space-y-5">
              {/* Mode Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
                  Modo de Visualización
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'double', label: 'Libro Abierto', desc: 'Doble página' },
                    { id: 'single', label: 'Página Simple', desc: 'Enfoque individual' },
                    { id: 'scroll', label: 'Flujo Continuo', desc: 'Desplazamiento' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => onChangeViewMode(m.id as 'double' | 'single' | 'scroll')}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        viewMode === m.id
                          ? 'border-amber-600 bg-amber-50/70 text-stone-900 ring-1 ring-amber-600'
                          : 'border-stone-200 hover:border-stone-300 text-stone-600'
                      }`}
                    >
                      <div className="text-xs font-semibold">{m.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paper Theme */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
                  Tonalidad del Papel
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { id: 'paper', label: 'Archivo', bg: 'bg-[#FBF9F5]', border: 'border-stone-300' },
                    { id: 'sepia', label: 'Marfil', bg: 'bg-[#F4EFE6]', border: 'border-amber-200' },
                    { id: 'white', label: 'Blanco Puro', bg: 'bg-white', border: 'border-stone-300' },
                    { id: 'dark', label: 'Noche', bg: 'bg-[#1C1917]', text: 'text-stone-200', border: 'border-stone-700' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onChangeTheme(t.id as 'paper' | 'sepia' | 'dark' | 'white')}
                      className={`p-2 rounded-lg border flex items-center justify-between text-xs font-medium cursor-pointer ${t.bg} ${t.text || 'text-stone-800'} ${
                        theme === t.id ? 'ring-2 ring-amber-600 font-bold' : t.border
                      }`}
                    >
                      <span>{t.label}</span>
                      {theme === t.id && <Check className="w-3.5 h-3.5 text-amber-700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
                  Tamaño de Letra
                </label>
                <div className="flex border border-stone-200 rounded-lg p-1 bg-stone-50 gap-1">
                  {[
                    { id: 'sm', label: 'A-', title: 'Pequeña' },
                    { id: 'md', label: 'A', title: 'Normal' },
                    { id: 'lg', label: 'A+', title: 'Grande' },
                    { id: 'xl', label: 'A++', title: 'Muy Grande' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onChangeFontSize(s.id as 'sm' | 'md' | 'lg' | 'xl')}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        fontSize === s.id ? 'bg-white shadow-xs text-stone-900 font-bold' : 'text-stone-600 hover:text-stone-900'
                      }`}
                      title={s.title}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography style */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
                  Familia Tipográfica
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onChangeFontFamily('serif')}
                    className={`p-2.5 rounded-lg border font-serif text-sm transition-all text-left cursor-pointer ${
                      fontFamily === 'serif' ? 'border-amber-600 bg-amber-50 text-stone-900 ring-1 ring-amber-600' : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <div className="font-bold text-stone-900">Serif Editorial</div>
                    <div className="text-[11px] text-stone-500">Clásica, literaria, inmersiva</div>
                  </button>
                  <button
                    onClick={() => onChangeFontFamily('sans')}
                    className={`p-2.5 rounded-lg border font-sans text-sm transition-all text-left cursor-pointer ${
                      fontFamily === 'sans' ? 'border-amber-600 bg-amber-50 text-stone-900 ring-1 ring-amber-600' : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <div className="font-bold text-stone-900">Sans-Serif</div>
                    <div className="text-[11px] text-stone-500">Moderna, nítida, limpia</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AUTO-FLIP & AUTO-ADVANCE */}
          {activeTab === 'autoflip' && (
            <div className="space-y-6">
              {/* Option A: Timed Auto-Flip */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Paso Automático por Tiempo</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Pasa las páginas del libro automáticamente como presentación o lectura continua.
                    </p>
                  </div>
                  <button
                    onClick={onToggleAutoFlip}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      isAutoFlipEnabled 
                        ? 'bg-amber-600 text-white shadow-xs' 
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {isAutoFlipEnabled ? 'Activo' : 'Desactivado'}
                  </button>
                </div>

                {isAutoFlipEnabled && (
                  <div className="pt-2 border-t border-stone-200 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs text-stone-700">
                      <span>Intervalo entre páginas:</span>
                      <strong className="text-amber-800 font-mono text-sm">{autoFlipSeconds} segundos</strong>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      step={5}
                      value={autoFlipSeconds}
                      onChange={(e) => onChangeAutoFlipSeconds(Number(e.target.value))}
                      className="w-full h-1.5 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                      <span>5 seg (rápido)</span>
                      <span>30 seg</span>
                      <span>60 seg (pausado)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Option B: Voice Auto-Turn */}
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">Pasar Página al Terminar Narración</h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Cuando la voz termine de leer el texto del folio actual, el libro avanza automáticamente a la siguiente página y continúa leyendo (Audiolibro continuo).
                    </p>
                  </div>
                  <button
                    onClick={onToggleAutoTurnOnVoiceEnd}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ml-3 ${
                      autoTurnOnVoiceEnd 
                        ? 'bg-amber-600 text-white shadow-xs' 
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {autoTurnOnVoiceEnd ? 'Activo' : 'Desactivado'}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
                <strong>💡 Tip interactivo:</strong> También puedes usar el atajo de la barra espaciadora en cualquier momento para pausar o reanudar el paso automático.
              </div>
            </div>
          )}

          {/* TAB 3: VOICES & SYNTHESIZER */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-500 font-semibold mb-1">
                  Voces del Sistema Instaladas ({availableVoices.length})
                </label>
                <p className="text-xs text-stone-600 mb-3">
                  Selecciona la voz en español que prefieras (femenina, masculina o por acento regional).
                </p>

                {availableVoices.length === 0 ? (
                  <div className="p-4 bg-stone-100 rounded-lg text-center text-xs text-stone-500">
                    Buscando voces disponibles en tu navegador...
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-1.5 border border-stone-200 rounded-xl p-2 bg-stone-50/50">
                    {availableVoices.map((v) => {
                      const isSelected = selectedVoiceURI === v.voiceURI;
                      const isSpanish = v.lang.startsWith('es');
                      return (
                        <button
                          key={v.voiceURI}
                          onClick={() => onChangeVoiceURI(v.voiceURI)}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between text-xs cursor-pointer ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50 text-stone-900 font-bold'
                              : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <User className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-700' : 'text-stone-400'}`} />
                            <span className="truncate">{v.name}</span>
                            {isSpanish && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-normal">
                                Español
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-stone-400 font-mono uppercase">{v.lang}</span>
                            {isSelected && <Check className="w-4 h-4 text-amber-700" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-3 bg-stone-100 rounded-lg text-xs text-stone-600">
                Las opciones de voces provienen del sintetizador de voz integrado en tu sistema operativo (Google, Microsoft, Apple o Android).
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
          <div className="text-xs text-stone-500">
            {isAutoFlipEnabled && (
              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                <Clock className="w-3.5 h-3.5 animate-spin" /> Paso auto cada {autoFlipSeconds}s
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 text-amber-100 text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
