// High-Fidelity Organic Andean Soundscape & Acoustic Page-Turn Engine
class SoundService {
  private ctx: AudioContext | null = null;
  private isAmbientPlaying = false;
  private masterAmbientGain: GainNode | null = null;
  private fluteTimer: number | null = null;
  private droneOscs: OscillatorNode[] = [];

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  // Realistic crisp paper page-turn acoustic effect
  playPageTurn() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.22);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pinkish shaped noise burst for natural paper grain
      let b0 = 0, b1 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const progress = i / bufferSize;
        const env = Math.sin(progress * Math.PI) * Math.exp(-progress * 2.0);
        const white = Math.random() * 2 - 1;
        b0 = 0.92 * b0 + white * 0.08;
        b1 = 0.85 * b1 + white * 0.15;
        data[i] = (b0 + b1) * 3.5 * env;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Realistic paper rustle filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(750, now + 0.2);
      filter.Q.setValueAtTime(1.8, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.22);
    } catch {
      // Audio fallback
    }
  }

  // Play a soft, natural acoustic Andean Quena (bamboo flute) melodic note
  private playSoftQuenaNote(freq: number, duration: number, delayMs: number = 0) {
    if (!this.isAmbientPlaying) return;

    setTimeout(() => {
      try {
        const ctx = this.getContext();
        if (!ctx || !this.isAmbientPlaying || !this.masterAmbientGain) return;

        const now = ctx.currentTime;

        // Fundamental tone
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Breath vibrato (human breath wobble)
        const vibrato = ctx.createOscillator();
        vibrato.frequency.setValueAtTime(4.5, now);
        const vibratoGain = ctx.createGain();
        vibratoGain.gain.setValueAtTime(freq * 0.015, now);
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibrato.start(now);

        // Overtone harmonic for wooden hollow flute timbre
        const overtone = ctx.createOscillator();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2, now);

        // Breath envelope (clearly audible, gentle attack and warm decay)
        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.28, now + 0.4);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        const overtoneGain = ctx.createGain();
        overtoneGain.gain.setValueAtTime(0.001, now);
        overtoneGain.gain.linearRampToValueAtTime(0.08, now + 0.4);
        overtoneGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(noteGain);
        overtone.connect(overtoneGain);
        noteGain.connect(this.masterAmbientGain);
        overtoneGain.connect(this.masterAmbientGain);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + duration);
        overtone.stop(now + duration);
        vibrato.stop(now + duration);
      } catch {}
    }, delayMs);
  }

  // Pentatonic melodies of the Andes
  private scheduleAndeanMelodies() {
    if (!this.isAmbientPlaying) return;

    // Frequencies (Pentatonic Minor: C4, Eb4, F4, G4, Bb4, C5)
    const notes = [
      { f: 311.13, dur: 3.2 }, // Eb4
      { f: 392.00, dur: 3.8 }, // G4
      { f: 349.23, dur: 3.0 }, // F4
      { f: 311.13, dur: 4.0 }, // Eb4
      { f: 261.63, dur: 4.5 }, // C4
    ];

    // Pick 2-3 gentle notes to play
    const startNote = Math.floor(Math.random() * 2);
    this.playSoftQuenaNote(notes[startNote].f, notes[startNote].dur, 0);
    this.playSoftQuenaNote(notes[startNote + 1].f, notes[startNote + 1].dur, 2200);
    this.playSoftQuenaNote(notes[startNote + 2].f, notes[startNote + 2].dur, 4400);

    // Schedule next motif in 8 - 14 seconds
    const nextInterval = 8000 + Math.random() * 6000;
    this.fluteTimer = window.setTimeout(() => {
      this.scheduleAndeanMelodies();
    }, nextInterval);
  }

  // Authentic Andean meditative soundscape (Warm Harmonic Drone + Gentle Bamboo Flute)
  toggleAmbient(enable?: boolean): boolean {
    try {
      const ctx = this.getContext();
      if (!ctx) return false;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const target = enable !== undefined ? enable : !this.isAmbientPlaying;
      if (target && !this.isAmbientPlaying) {
        this.isAmbientPlaying = true;

        const master = ctx.createGain();
        master.gain.setValueAtTime(0.001, ctx.currentTime);
        master.gain.linearRampToValueAtTime(0.45, ctx.currentTime + 1.0); // comfortable audible volume
        master.connect(ctx.destination);
        this.masterAmbientGain = master;

        // Warm Andean Charango/Cello harmonic chordal pad (C3, G3, C4, Eb4)
        const chordFrequencies = [130.81, 196.0, 261.63, 311.13];
        this.droneOscs = [];

        chordFrequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          osc.type = 'triangle'; // Warm organic harmonic
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          // Subtle natural detuning for warmth
          const detune = (idx - 1.5) * 5;
          osc.detune.setValueAtTime(detune, ctx.currentTime);

          const lowpass = ctx.createBiquadFilter();
          lowpass.type = 'lowpass';
          lowpass.frequency.setValueAtTime(550 + idx * 80, ctx.currentTime);

          const oscGain = ctx.createGain();
          oscGain.gain.setValueAtTime(0.18 / (idx + 1), ctx.currentTime);

          osc.connect(lowpass);
          lowpass.connect(oscGain);
          oscGain.connect(master);

          osc.start();
          this.droneOscs.push(osc);
        });

        // Immediately play opening flute notes within 200ms
        this.playSoftQuenaNote(311.13, 3.0, 200);
        this.playSoftQuenaNote(392.00, 3.5, 2200);

        // Schedule ongoing melodic flute motifs
        this.fluteTimer = window.setTimeout(() => {
          this.scheduleAndeanMelodies();
        }, 6000);

        return true;
      } else if (!target && this.isAmbientPlaying) {
        this.isAmbientPlaying = false;

        if (this.fluteTimer) {
          clearTimeout(this.fluteTimer);
          this.fluteTimer = null;
        }

        if (this.masterAmbientGain && ctx) {
          this.masterAmbientGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
          setTimeout(() => {
            try {
              this.droneOscs.forEach(o => {
                o.stop();
                o.disconnect();
              });
              this.droneOscs = [];
              this.masterAmbientGain?.disconnect();
              this.masterAmbientGain = null;
            } catch {}
          }, 900);
        }

        return false;
      }

      return this.isAmbientPlaying;
    } catch {
      return false;
    }
  }

  get isPlayingAmbient() {
    return this.isAmbientPlaying;
  }
}

export const soundManager = new SoundService();
