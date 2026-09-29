import React, { useState, useEffect } from 'react';
import { Play, Pause, FastForward, Clock, ChevronDown, Check } from 'lucide-react';

interface AutoFlipWidgetProps {
  isEnabled: boolean;
  onToggle: () => void;
  secondsInterval: number;
  onChangeSeconds: (sec: number) => void;
  onTriggerFlip: () => void;
  currentPage: number;
  totalPages: number;
}

export const AutoFlipWidget: React.FC<AutoFlipWidgetProps> = ({
  isEnabled,
  onToggle,
  secondsInterval,
  onChangeSeconds,
  onTriggerFlip,
  currentPage,
  totalPages,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(secondsInterval);
  const [showIntervalMenu, setShowIntervalMenu] = useState<boolean>(false);

  // Reset seconds left whenever interval changes or is toggled on or page changes
  useEffect(() => {
    setSecondsLeft(secondsInterval);
  }, [secondsInterval, isEnabled, currentPage]);

  // Second-by-second countdown
  useEffect(() => {
    if (!isEnabled) {
      setSecondsLeft(secondsInterval);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Time to flip!
          onTriggerFlip();
          return secondsInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isEnabled, secondsInterval, onTriggerFlip]);

  const percentage = Math.max(0, Math.min(100, ((secondsInterval - secondsLeft) / secondsInterval) * 100));

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto">
      <div 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 ${
          isEnabled
            ? 'bg-amber-950/90 border-amber-500/80 text-amber-100 ring-2 ring-amber-500/30'
            : 'bg-stone-900/80 border-stone-700/80 text-stone-300 hover:bg-stone-900'
        }`}
      >
        {/* Toggle play/pause */}
        <button
          onClick={onToggle}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isEnabled 
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs' 
              : 'hover:text-white hover:bg-stone-800 text-amber-300'
          }`}
          title={isEnabled ? "Pausar pase automático de páginas" : "Iniciar pase automático de páginas"}
        >
          {isEnabled ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pausar Auto</span>
            </>
          ) : (
            <>
              <FastForward className="w-3.5 h-3.5" />
              <span>Pasar Hojas Solas</span>
            </>
          )}
        </button>

        {/* Live Countdown & Progress Bar when active */}
        {isEnabled && (
          <div className="flex items-center gap-2 pl-1 pr-1 border-l border-amber-700/50">
            <span className="text-xs font-mono font-bold text-amber-300 min-w-[28px] text-center">
              {secondsLeft}s
            </span>
            <div className="w-14 h-1.5 bg-stone-800 rounded-full overflow-hidden border border-amber-900/50">
              <div 
                className="h-full bg-amber-400 transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Interval dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowIntervalMenu(!showIntervalMenu)}
            className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Cambiar intervalo de segundos"
          >
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{secondsInterval}s</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          {showIntervalMenu && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-stone-900 text-stone-100 border border-stone-700 rounded-xl p-1.5 shadow-2xl z-50 animate-in fade-in duration-100">
              <span className="text-[10px] uppercase font-bold text-stone-400 px-2 py-1 block">
                Cada cuántos seg:
              </span>
              {[5, 8, 12, 18, 25].map((sec) => (
                <button
                  key={sec}
                  onClick={() => {
                    onChangeSeconds(sec);
                    setShowIntervalMenu(false);
                  }}
                  className={`w-full text-left px-2 py-1 rounded-md text-xs flex items-center justify-between transition-colors ${
                    secondsInterval === sec
                      ? 'bg-amber-600 text-white font-bold'
                      : 'hover:bg-stone-800 text-stone-300'
                  }`}
                >
                  <span>{sec} segundos</span>
                  {secondsInterval === sec && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
