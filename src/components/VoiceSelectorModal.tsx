import React, { useState } from 'react';
import { X, Volume2, Check, Play, Square, Sparkles, User, Settings2 } from 'lucide-react';
import { VOICE_PROFILES, VoiceProfile, speechEngine } from '../utils/speechUtils';

interface VoiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProfileId: string;
  onSelectProfileId: (id: string) => void;
  selectedVoiceURI: string | null;
  onSelectVoiceURI: (uri: string | null) => void;
  availableVoices: SpeechSynthesisVoice[];
  autoTurnOnVoiceEnd: boolean;
  onToggleAutoTurnOnVoiceEnd: () => void;
  speedMultiplier: number;
  onChangeSpeedMultiplier: (speed: number) => void;
}

export const VoiceSelectorModal: React.FC<VoiceSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedProfileId,
  onSelectProfileId,
  selectedVoiceURI,
  onSelectVoiceURI,
  availableVoices,
  autoTurnOnVoiceEnd,
  onToggleAutoTurnOnVoiceEnd,
  speedMultiplier,
  onChangeSpeedMultiplier,
}) => {
  const [testingVoiceId, setTestingVoiceId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestVoice = (profile: VoiceProfile) => {
    if (testingVoiceId === profile.id) {
      speechEngine.stop();
      setTestingVoiceId(null);
      return;
    }

    setTestingVoiceId(profile.id);
    speechEngine.testVoice(profile, () => {
      setTestingVoiceId(null);
    });
  };

  const currentProfile = VOICE_PROFILES.find((p) => p.id === selectedProfileId) || VOICE_PROFILES[0];
  const spanishVoices = availableVoices.filter((v) => v.lang.startsWith('es'));
  const otherVoices = availableVoices.filter((v) => !v.lang.startsWith('es'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-600 rounded-xl text-white">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Selector de Voces de Narración
              </h3>
              <p className="text-xs text-amber-200/80">
                Elige la voz y entonación para la lectura en voz alta
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              speechEngine.stop();
              onClose();
            }}
            className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Voice Personas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              1. Selecciona el Personaje de Voz
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VOICE_PROFILES.map((profile) => {
                const isSelected = selectedProfileId === profile.id;
                const isTesting = testingVoiceId === profile.id;

                return (
                  <div
                    key={profile.id}
                    onClick={() => onSelectProfileId(profile.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/70 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{profile.icon}</span>
                          <div>
                            <span className="font-serif font-bold text-stone-900 text-sm block">
                              {profile.name}
                            </span>
                            <span className="text-[11px] font-medium text-amber-900/80 block">
                              {profile.role}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 leading-snug my-2">
                        {profile.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 mt-1 flex justify-end">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTestVoice(profile);
                        }}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isTesting
                            ? 'bg-amber-600 text-white shadow-xs animate-pulse'
                            : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-300'
                        }`}
                        title="Probar cómo suena esta voz"
                      >
                        {isTesting ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Detener</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Probar Voz</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Speed & Pitch Controls */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Ajuste de Velocidad de Lectura
            </label>
            <div className="flex items-center justify-between gap-2">
              {[0.8, 1.0, 1.2, 1.4].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onChangeSpeedMultiplier(speed)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    Math.abs(speedMultiplier - speed) < 0.05
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                  }`}
                >
                  {speed === 1.0 ? 'Normal (1x)' : `${speed}x`}
                </button>
              ))}
            </div>

            {/* Auto-turn on voice finish toggle */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-stone-900 block">
                  Pase automático al terminar la narración
                </span>
                <span className="text-[11px] text-stone-500 block">
                  Al terminar de leer el folio actual, avanza la página y continúa leyendo
                </span>
              </div>
              <button
                onClick={onToggleAutoTurnOnVoiceEnd}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  autoTurnOnVoiceEnd ? 'bg-amber-600' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    autoTurnOnVoiceEnd ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Optional System Voice Engine Details */}
          {availableVoices.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                3. Sintetizador del Navegador (Opcional)
              </label>
              <select
                value={selectedVoiceURI || ''}
                onChange={(e) => onSelectVoiceURI(e.target.value || null)}
                className="w-full text-xs p-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 focus:outline-hidden focus:border-amber-600"
              >
                <option value="">Automático (Recomendado según personaje)</option>
                {spanishVoices.length > 0 && (
                  <optgroup label="Voces en Español">
                    {spanishVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </optgroup>
                )}
                {otherVoices.length > 0 && (
                  <optgroup label="Otras voces instaladas">
                    {otherVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500 italic">
            Voz actual: <strong className="text-stone-800">{currentProfile.name}</strong> ({currentProfile.role})
          </span>
          <button
            onClick={() => {
              speechEngine.stop();
              onClose();
            }}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Listo y Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
