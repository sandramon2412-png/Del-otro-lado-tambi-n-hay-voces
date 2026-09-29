// Hybrid Neural Studio Voice & Natural Browser Engine with Quota Detection

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

export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'elena-female',
    name: 'Elena',
    role: 'Voz Femenina Serena',
    description: 'Tono cálido, empático y maternal. Ritmo reposado para relatos testimoniales.',
    gender: 'female',
    geminiVoice: 'Kore',
    stylePrompt: 'Lee con voz humana femenina, cálida, reflexiva y suavemente emotiva en español latinoamericano',
    pitch: 1.05,
    rate: 0.94,
    icon: '👩',
  },
  {
    id: 'carlos-male',
    name: 'Carlos',
    role: 'Voz Masculina Reflexiva',
    description: 'Tono grave, solemne y pausado con presencia de memoria histórica.',
    gender: 'male',
    geminiVoice: 'Fenrir',
    stylePrompt: 'Lee con voz humana masculina grave, solemne, pausada y respetuosa en español',
    pitch: 0.82,
    rate: 0.88,
    icon: '👨',
  },
  {
    id: 'daniela-young',
    name: 'Daniela',
    role: 'Voz Joven Documental',
    description: 'Tono ágil, claro y directo, propio de la investigación y juventud.',
    gender: 'young',
    geminiVoice: 'Aoede',
    stylePrompt: 'Lee con voz humana joven, lúcida, compasiva y fluida en español',
    pitch: 1.18,
    rate: 1.0,
    icon: '👧',
  },
  {
    id: 'cronica-radio',
    name: 'Crónica Andina',
    role: 'Locución Editorial / Documental',
    description: 'Voz literaria uniforme, dicción clara para lectura inmersiva continua.',
    gender: 'male',
    geminiVoice: 'Puck',
    stylePrompt: 'Lee con voz de narrador literario de audiolibro, clara, solemne y envolvente en español',
    pitch: 0.92,
    rate: 0.95,
    icon: '🎙️',
  },
];

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

class SpeechEngine {
  private audioCtx: AudioContext | null = null;
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private heartbeatInterval: number | null = null;
  private isCancelled: boolean = false;
  private onEndCallback: (() => void) | null = null;
  private onStartCallback: (() => void) | null = null;
  private quotaExceeded: boolean = false;
  private isUsingStudioAi: boolean = false;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const all = window.speechSynthesis.getVoices();
    return [...all].sort((a, b) => {
      // Prioritize natural Spanish voices
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

  // Speak: tries Studio AI Voice first, smoothly falls back if quota exhausted
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
    onError?: (err: unknown) => void;
  }) {
    this.stop();
    this.isCancelled = false;
    this.onEndCallback = onEnd || null;
    this.onStartCallback = onStart || null;

    const ctx = this.getAudioContext();

    // If quota hasn't previously failed, try Studio AI Voice
    if (!this.quotaExceeded) {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            voiceName: profile.geminiVoice,
            stylePrompt: profile.stylePrompt,
          }),
        });

        if (res.status === 429) {
          console.warn('Gemini API Quota exceeded (429). Falling back to natural browser synthesis.');
          this.quotaExceeded = true;
          this.speakFallback(text, profile, voiceURI, speedMultiplier);
          return;
        }

        if (!res.ok) {
          throw new Error(`TTS server error: ${res.status}`);
        }

        const data = await res.json();
        if (!data.audioBase64) {
          throw new Error('No audio returned');
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
          this.onEndCallback?.();
        };

        this.currentSourceNode = source;
        this.isUsingStudioAi = true;
        this.onStartCallback?.();
        source.start(0);
        return;
      } catch (err) {
        console.warn('Studio AI Voice failed, falling back to browser synthesis:', err);
      }
    }

    // Fallback to optimized natural browser speech synthesis
    this.speakFallback(text, profile, voiceURI, speedMultiplier);
  }

  private speakFallback(
    text: string,
    profile: VoiceProfile,
    voiceURI?: string | null,
    speedMultiplier: number = 1.0
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.onEndCallback?.();
      return;
    }

    this.isUsingStudioAi = false;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[\n\r]+/g, ' ').replace(/[«»“”]/g, '"').trim();
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
        console.warn('Speech synthesis error:', e);
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
  }
}

export const speechEngine = new SpeechEngine();
