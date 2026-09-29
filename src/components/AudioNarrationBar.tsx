import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Square, FastForward, Loader2, SkipBack, SkipForward } from 'lucide-react';
import { speechEngine, VOICE_PROFILES } from '../utils/speechUtils';

interface AudioNarrationBarProps {
  textToRead: string | null;
  onStop: () => void;
  currentPageNumber: number;
  onPageEnd?: () => void;
  autoTurnOnVoiceEnd?: boolean;
  selectedProfileId: string;
  selectedVoiceURI: string | null;
  speedMultiplier: number;
  onOpenVoiceSelector: () => void;
  paragraphIndex?: number | null;
  totalParagraphs?: number;
  onNextParagraph?: () => void;
  onPrevParagraph?: () => void;
}

export const AudioNarrationBar: React.FC<AudioNarrationBarProps> = ({
  textToRead,
  onStop,
  currentPageNumber,
  onPageEnd,
  autoTurnOnVoiceEnd = true,
  selectedProfileId,
  selectedVoiceURI,
  speedMultiplier,
  onOpenVoiceSelector,
  paragraphIndex = null,
  totalParagraphs = 0,
  onNextParagraph,
  onPrevParagraph,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const activeReadingTextRef = useRef<string | null>(null);

  const activeProfile = VOICE_PROFILES.find((p) => p.id === selectedProfileId) || VOICE_PROFILES[0];

  useEffect(() => {
    if (!textToRead) {
      if (activeReadingTextRef.current !== null) {
        speechEngine.stop();
        activeReadingTextRef.current = null;
        setIsPlaying(false);
        setIsLoading(false);
      }
      return;
    }

    // Only initiate speaking if the text has actually changed
    if (activeReadingTextRef.current === textToRead) {
      return;
    }

    activeReadingTextRef.current = textToRead;
    setIsLoading(true);

    speechEngine.speak({
      text: textToRead,
      profile: activeProfile,
      voiceURI: selectedVoiceURI,
      speedMultiplier,
      onStart: () => {
        setIsLoading(false);
        setIsPlaying(true);
      },
      onEnd: () => {
        setIsPlaying(false);
        setIsLoading(false);
        activeReadingTextRef.current = null;
        if (onPageEnd) {
          onPageEnd();
        } else {
          onStop();
        }
      },
      onError: () => {
        setIsPlaying(false);
        setIsLoading(false);
        activeReadingTextRef.current = null;
        onStop();
      },
    });
  }, [textToRead, selectedProfileId, selectedVoiceURI, speedMultiplier, onPageEnd, onStop, activeProfile]);

  // Clean up when unmounting
  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, []);

  if (!textToRead) return null;

  const handleTogglePlayPause = () => {
    if (isPlaying) {
      speechEngine.pause();
      setIsPlaying(false);
    } else {
      speechEngine.resume();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    speechEngine.stop();
    activeReadingTextRef.current = null;
    setIsPlaying(false);
    setIsLoading(false);
    onStop();
  };

  return (
    <div className="fixed bottom-16 sm:bottom-14 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center animate-in slide-in-from-bottom-3 duration-200">
      <div className="bg-stone-900/95 text-stone-100 border border-amber-500/80 rounded-full px-4 py-2 shadow-2xl flex items-center gap-2 sm:gap-3 backdrop-blur-md">
        
        {/* Folio and Paragraph Indicator with live pulse */}
        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium pr-2 border-r border-stone-700">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
          )}
          <span className="whitespace-nowrap">
            {isLoading 
              ? 'Preparando...' 
              : paragraphIndex !== null && totalParagraphs > 0
                ? `Folio ${currentPageNumber} · Párrafo ${paragraphIndex + 1}/${totalParagraphs}`
                : `Folio ${currentPageNumber}`
            }
          </span>
        </div>

        {/* Skip Previous Paragraph */}
        {onPrevParagraph && (
          <button
            onClick={onPrevParagraph}
            disabled={isLoading || (paragraphIndex !== null && paragraphIndex <= 0)}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            title="Párrafo anterior"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Play/Pause */}
        <button
          onClick={handleTogglePlayPause}
          disabled={isLoading}
          className="p-1.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white transition-colors cursor-pointer disabled:opacity-50"
          title={isPlaying ? "Pausar narración" : "Reanudar narración"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
        </button>

        {/* Skip Next Paragraph */}
        {onNextParagraph && (
          <button
            onClick={onNextParagraph}
            disabled={isLoading || (paragraphIndex !== null && totalParagraphs > 0 && paragraphIndex >= totalParagraphs - 1)}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            title="Siguiente párrafo"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Stop */}
        <button
          onClick={handleStop}
          className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
          title="Detener narración"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>

        {/* Voice persona button that opens selector */}
        <button
          onClick={onOpenVoiceSelector}
          className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-amber-200 hover:text-white transition-colors cursor-pointer border border-stone-700"
          title="Cambiar voz de narración"
        >
          <span className="text-xs">{activeProfile.icon}</span>
          <span className="font-semibold hidden sm:inline">{activeProfile.name}</span>
          <span className="opacity-60 font-mono text-[10px]">({speedMultiplier}x)</span>
        </button>

        {/* Auto-turn indicator */}
        {autoTurnOnVoiceEnd && (
          <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800/80 hidden md:flex items-center gap-1">
            <FastForward className="w-2.5 h-2.5" />
            <span>Pasa hoja solo</span>
          </span>
        )}
      </div>
    </div>
  );
};
