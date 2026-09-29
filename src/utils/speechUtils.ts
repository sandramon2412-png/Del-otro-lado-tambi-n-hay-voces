// Hybrid Neural Studio Voice & Natural Browser Engine with Enhanced Error Handling & Optimization

export interface VoiceProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  gender: 'female' | 'male' | 'young';
  geminiVoice: 'Kore' | 'Fenrir' | 'Aoede' | 'Puck' | 'Charon';
  stylePrompt: string;
  pitch: number;
  rate: number;
  icon: string;
}

// Optimized voice profiles with natural, conversational prompts
export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'elena-female',
    name: 'Elena',
    role: 'Voz Femenina Serena',
    description: 'Cálida, empática y maternal. Perfecta para testimonios.',
    gender: 'female',
    geminiVoice: 'Kore',
    stylePrompt: 'Eres una mujer madura contando historias de vida con empatía. Lee lentamente, con pausas naturales entre frases. Respiración audible pero sutil. Énfasis en palabras clave sin dramatismo. Tono reflexivo, cálido, sereno. Español latinoamericano claro. Parece un podcast donde alguien comparte experiencias reales con sensibilidad. Muy natural, nunca robótica.',
    pitch: 1.0,
    rate: 0.88,
    icon: '👩',
  },
  {
    id: 'carlos-male',
    name: 'Carlos',
    role: 'Voz Masculina Reflexiva',
    description: 'Grave, solemne y pausado. Para memoria histórica.',
    gender: 'male',
    geminiVoice: 'Fenrir',
    stylePrompt: 'Eres un historiador que comparte testimonios importantes. Voz profunda pero accesible. Habla muy lentamente, con largas pausas entre párrafos. Respiración natural. Tono solemne pero cálido, nunca frío. Énfasis en la gravedad de las palabras, pero con humanidad. Español latinoamericano educado. Parece alguien leyendo un documento histórico en un acto académico respetuoso. Muy natural y emotivo.',
    pitch: 0.78,
    rate: 0.82,
    icon: '👨',
  },
  {
    id: 'daniela-young',
    name: 'Daniela',
    role: 'Voz Joven Documental',
    description: 'Ágil, clara y directa. Para investigación y análisis.',
    gender: 'young',
    geminiVoice: 'Aoede',
    stylePrompt: 'Eres una investigadora joven apasionada por contar historias verdaderas. Voz clara, fluida, energética pero controlada. Pronunciación perfecta. Pausas naturales. Tono conversacional como en una entrevista de radio. Respiración natural. Énfasis en detalles importantes. Español claro y educado. Parece una periodista contando una historia que importa. Muy natural, nunca artificial.',
    pitch: 1.12,
    rate: 0.95,
    icon: '👧',
  },
  {
    id: 'cronica-radio',
    name: 'Crónica Andina',
    role: 'Locución Editorial Profesional',
    description: 'Voz de audiolibro. Para lectura completa inmersiva.',
    gender: 'male',
    geminiVoice: 'Puck',
    stylePrompt: 'Eres un narrador profesional de audiolibros. Voz clara, profunda y envolvente. Pronunciación impecable. Pausas naturales al fin de párrafos. Tono neutro pero con matices emocionales sutiles. Respira naturalmente. Español latinoamericano fluido. Parece una producción de radio de calidad profesional donde la voz es instrumento del relato. Nunca robótico, siempre humano.',
    pitch: 0.90,
    rate: 0.90,
    icon: '🎙️',
  },
];

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  try {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (err) {
    console.error('Error decoding base64 audio:', err);
    throw new Error('Failed to decode audio data');
  }
}

class SpeechEngine {
  private audioCtx: AudioContext | null = null;
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private heartbeatInterval: number | null = null;
  private isCancelled: boolean = false;
  private onEndCallback: (() => void) | null = null;
  private onStartCallback: (() => void) | null = null;
  private onErrorCallback: ((err: Error) => void) | null = null;
  private quotaExceeded: boolean = false;
  private isUsingStudioAi: boolean = false;
  private networkErrorCount: number = 0;
  private maxNetworkRetries: number = 2;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch((err) => console.warn('Failed to resume audio context:', err));
    }
    return this.audioCtx;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const all = window.speechSynthesis.getVoices();
    return [...all].sort((a, b) => {
      const aEs = a.lang.startsWith('es');
      const bEs = b.lang.startsWith('es');
      const aNat = a.name.toLowerCase().includes('natural') || a.name.toLowerCase().includes('online');
      const bNat = b.name.toLowerCase().includes('natural') || b.name.toLowerCase().includes('online');
      if (aNat && !bNat) return -1;
      if (!aNat && bNat) return 1;
      if (aEs && !bEs) return -1;
      if (!aEs && bEs) return 1;
      return a.name.localeCompare(b.name);
    });
  }

  public getBestVoiceForProfile(
    profile: VoiceProfile,
    preferredVoiceURI?: string | null
  ): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    if (voices.length === 0) return null;

    if (preferredVoiceURI) {
      const found = voices.find((v) => v.voiceURI === preferredVoiceURI);
      if (found) return found;
    }

    const esVoices = voices.filter((v) => v.lang.startsWith('es'));
    const candidates = esVoices.length > 0 ? esVoices : voices;

    if (profile.gender === 'female' || profile.gender === 'young') {
      const naturalFemale = candidates.find(
        (v) =>
          (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online')) &&
          (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('sabina') || v.name.toLowerCase().includes('helena') || v.name.toLowerCase().includes('monica'))
      );
      if (naturalFemale) return naturalFemale;

      const anyFemale = candidates.find(
        (v) =>
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('monica') ||
          v.name.toLowerCase().includes('helena') ||
          v.name.toLowerCase().includes('sabina') ||
          v.name.toLowerCase().includes('paulina') ||
          v.name.toLowerCase().includes('lucia') ||
          v.name.toLowerCase().includes('elena')
      );
      if (anyFemale) return anyFemale;
    } else {
      const naturalMale = candidates.find(
        (v) =>
          (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online')) &&
          (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('jorge') || v.name.toLowerCase().includes('raul'))
      );
      if (naturalMale) return naturalMale;

      const anyMale = candidates.find(
        (v) =>
          v.name.toLowerCase().includes('male') ||
          v.name.toLowerCase().includes('jorge') ||
          v.name.toLowerCase().includes('pablo') ||
          v.name.toLowerCase().includes('raul') ||
          v.name.toLowerCase().includes('carlos')
      );
      if (anyMale) return anyMale;
    }

    return candidates[0] || null;
  }

  public async speak({
    text,
    profile,
    voiceURI,
    speedMultiplier = 1.0,
    onStart,
    onEnd,
    onError,
  }: {
    text: string;
    profile: VoiceProfile;
    voiceURI?: string | null;
    speedMultiplier?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: Error) => void;
  }) {
    this.stop();
    this.isCancelled = false;
    this.onEndCallback = onEnd || null;
    this.onStartCallback = onStart || null;
    this.onErrorCallback = onError || null;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      const err = new Error('Text is required and cannot be empty');
      this.onErrorCallback?.(err);
      this.onEndCallback?.();
      return;
    }

    const cleanText = text.trim().substring(0, 2000);
    const ctx = this.getAudioContext();

    if (!this.quotaExceeded && this.networkErrorCount < this.maxNetworkRetries) {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            voiceName: profile.geminiVoice,
            stylePrompt: profile.stylePrompt,
          }),
          signal: AbortSignal.timeout(30000),
        });

        if (res.status === 429) {
          console.warn('Gemini API Quota exceeded. Falling back to browser synthesis.');
          this.quotaExceeded = true;
          this.speakFallback(cleanText, profile, voiceURI, speedMultiplier);
          return;
        }

        if (res.status === 503 || res.status === 502) {
          throw new Error(`Service temporarily unavailable (${res.status}). Trying again...`);
        }

        if (!res.ok) {
          throw new Error(`TTS server error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        if (!data.audioBase64) {
          throw new Error('No audio generated by model');
        }

        if (this.isCancelled) return;

        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        const arrayBuffer = base64ToArrayBuffer(data.audioBase64);
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

        if (this.isCancelled) return;

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.playbackRate.value = Math.max(0.5, Math.min(2.0, speedMultiplier || 1.0));

        const gain = ctx.createGain();
        gain.gain.value = 1.0;

        source.connect(gain);
        gain.connect(ctx.destination);

        source.onended = () => {
          this.currentSourceNode = null;
          this.networkErrorCount = 0;
          this.onEndCallback?.();
        };

        source.onerror = (err) => {
          console.error('Audio playback error:', err);
          this.currentSourceNode = null;
          this.onErrorCallback?.(new Error('Error during audio playback'));
          this.onEndCallback?.();
        };

        this.currentSourceNode = source;
        this.isUsingStudioAi = true;
        this.onStartCallback?.();
        source.start(0);
        return;
      } catch (err) {
        this.networkErrorCount++;
        const errMsg = err instanceof Error ? err.message : String(err);
        console.warn(`Studio AI Voice failed (attempt ${this.networkErrorCount}/${this.maxNetworkRetries}): ${errMsg}`);
        
        if (this.networkErrorCount < this.maxNetworkRetries) {
          console.log('Retrying with browser synthesis...');
          this.speakFallback(cleanText, profile, voiceURI, speedMultiplier);
          return;
        }
      }
    }

    this.speakFallback(cleanText, profile, voiceURI, speedMultiplier);
  }

  private speakFallback(
    text: string,
    profile: VoiceProfile,
    voiceURI?: string | null,
    speedMultiplier: number = 1.0
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      const err = new Error('Speech synthesis not available in this browser');
      this.onErrorCallback?.(err);
      this.onEndCallback?.();
      return;
    }

    this.isUsingStudioAi = false;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[\n\r]+/g, ' ').replace(/[«»""]/g, '"').trim();
    if (!cleanText) {
      this.onEndCallback?.();
      return;
    }

    const matchedVoice = this.getBestVoiceForProfile(profile, voiceURI);
    const finalPitch = Math.max(0.5, Math.min(2.0, profile.pitch));
    const finalRate = Math.max(0.5, Math.min(2.0, profile.rate * (speedMultiplier || 1.0)));

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = matchedVoice ? matchedVoice.lang : 'es-CO';
    if (matchedVoice) utterance.voice = matchedVoice;
    utterance.pitch = finalPitch;
    utterance.rate = finalRate;

    utterance.onstart = () => {
      console.log(`Speech synthesis started with profile: ${profile.name}`);
      this.onStartCallback?.();
    };

    utterance.onend = () => {
      this.clearHeartbeat();
      this.activeUtterance = null;
      this.onEndCallback?.();
    };

    utterance.onerror = (e) => {
      this.clearHeartbeat();
      this.activeUtterance = null;
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('Speech synthesis error:', e.error);
        this.onErrorCallback?.(new Error(`Speech error: ${e.error}`));
      }
      this.onEndCallback?.();
    };

    this.heartbeatInterval = window.setInterval(() => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 4000);

    this.activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public testVoice(profile: VoiceProfile, onComplete?: () => void) {
    const sample = `Hola, soy ${profile.name}. Estaré leyendo para ti: Del otro lado también hay voces.`;
    this.speak({
      text: sample,
      profile,
      onEnd: onComplete,
    });
  }

  public pause() {
    if (this.currentSourceNode && this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend().catch(() => {});
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (this.currentSourceNode && this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  public stop() {
    this.isCancelled = true;
    this.clearHeartbeat();
    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.stop();
        this.currentSourceNode.disconnect();
      } catch {}
      this.currentSourceNode = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.activeUtterance = null;
  }

  private clearHeartbeat() {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  public get isStudioAiActive() {
    return this.isUsingStudioAi;
  }

  public get hasQuotaExceeded() {
    return this.quotaExceeded;
  }

  public resetQuotaFlag() {
    this.quotaExceeded = false;
    this.networkErrorCount = 0;
  }
}

export const speechEngine = new SpeechEngine();
