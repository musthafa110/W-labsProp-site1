// A custom Web Audio API synthesizer for elegant, soft romantic ambient music.
// This allows the app to have high-fidelity romantic background music without any external dependencies.

class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private nextNoteTime: number = 0;
  private timerId: number | null = null;
  private nodes: {
    delay: DelayNode;
    feedback: GainNode;
    filter: BiquadFilterNode;
    masterGain: GainNode;
  } | null = null;

  // Chord progression: Dbmaj7 - Gbmaj7 - Bbm7 - Absus4 (in Db major, very romantic and soft)
  private chords = [
    [53, 56, 60, 61, 65, 68], // Db, Ab, C, Db, F, Ab (Dbmaj7)
    [54, 58, 61, 65, 68, 70], // Gb, Bb, Db, F, Ab, Bb (Gbmaj7)
    [58, 61, 65, 68, 70, 72], // Bb, Db, F, Ab, Bb, C (Bbm9)
    [56, 60, 63, 65, 68, 72]  // Ab, C, Eb, F, Ab, C (Ab6/add9)
  ];
  private chordIndex = 0;
  private notePatternIndex = 0;

  constructor() {}

  public init() {
    if (this.ctx) return;
    
    // Create AudioContext with fallback
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Create delay and master effects chain
    const masterGain = this.ctx.createGain();
    masterGain.gain.value = 0.25; // Quiet background level

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800; // Soft warm tone

    const delay = this.ctx.createDelay(2.0);
    delay.delayTime.value = 0.6; // Gentle echo

    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.4; // Soft decaying echoes

    // Connect delay loop
    delay.connect(feedback);
    feedback.connect(delay);

    // Connect main chain
    // Oscillator -> Filter -> MasterGain -> Destination
    //                   |
    //                   -> Delay -> MasterGain
    filter.connect(masterGain);
    filter.connect(delay);
    delay.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    this.nodes = { delay, feedback, filter, masterGain };
  }

  public toggle() {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx?.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }

  public start() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx?.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    if (this.isPlaying || !this.ctx) return;
    this.isPlaying = true;
    this.nextNoteTime = this.ctx.currentTime;
    this.chordIndex = 0;
    this.notePatternIndex = 0;
    this.scheduler();
  }

  public stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  private midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Plays a beautiful soft sine bell-like tone
  private playBell(midiNote: number, time: number, velocity = 0.5) {
    if (!this.ctx || !this.nodes) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    // Soft warm waveform
    osc.type = "sine";
    osc.frequency.value = this.midiToFreq(midiNote);

    // Dynamic filtering for extra sparkle on strike, then warm decay
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1500, time);
    filter.frequency.exponentialRampToValueAtTime(400, time + 1.2);

    // Expressive romantic envelope (slow attack, long decay)
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(velocity * 0.15, time + 0.1); // soft attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 2.5); // long gentle release

    // Connect
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.nodes.filter);

    osc.start(time);
    osc.stop(time + 2.6);
  }

  // Play a soft synth pad chord note (sustained, warm)
  private playPadNote(midiNote: number, time: number, duration: number, velocity = 0.3) {
    if (!this.ctx || !this.nodes) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "triangle"; // Soft and full
    osc.frequency.value = this.midiToFreq(midiNote - 12); // octave lower for warm floor

    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(velocity * 0.08, time + 0.8); // very slow fade in
    gainNode.gain.setValueAtTime(velocity * 0.08, time + duration - 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration); // smooth release

    osc.connect(gainNode);
    gainNode.connect(this.nodes.filter);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Triggered on key typing for a soft, realistic, minimal laptop keystroke click sound
  public playTypeClick() {
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }

      const time = this.ctx.currentTime;

      // 1. Organic filtered noise impulse (tactile key tap)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.012); // ~12ms length
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      // Subtle randomized pitch variation (1800Hz - 2400Hz) for natural variation
      bandpass.frequency.setValueAtTime(1800 + (Math.random() - 0.5) * 600, time);
      bandpass.Q.setValueAtTime(2.0, time);

      const noiseGain = this.ctx.createGain();
      const volume = 0.012 + (Math.random() - 0.5) * 0.003; // Ultra-soft gain
      noiseGain.gain.setValueAtTime(volume, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.011);

      noiseNode.connect(bandpass);
      bandpass.connect(noiseGain);

      // 2. Subtle low body tick (bottoming out feel)
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyOsc.type = "sine";
      bodyOsc.frequency.setValueAtTime(600 + (Math.random() - 0.5) * 180, time);

      bodyGain.gain.setValueAtTime(0.006, time);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.009);

      bodyOsc.connect(bodyGain);

      const output = this.nodes ? this.nodes.masterGain : this.ctx.destination;
      noiseGain.connect(output);
      bodyGain.connect(output);

      noiseNode.start(time);
      bodyOsc.start(time);
      bodyOsc.stop(time + 0.012);
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  // Triggered on star hover or button hover for dynamic romantic feedback
  public playSparkleTone() {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    
    const time = this.ctx.currentTime;
    // Beautiful pentatonic sparkle arpeggio
    const notes = [72, 75, 77, 80, 84]; // Db major pentatonic high notes
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(this.midiToFreq(randomNote), time);
    
    // Quick delay effect just for this note
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.08, time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 1.0);
    
    osc.connect(gainNode);
    // Connect directly to output or master so it echoes beautifully
    if (this.nodes) {
      gainNode.connect(this.nodes.masterGain);
    } else {
      gainNode.connect(this.ctx.destination);
    }
    
    osc.start(time);
    osc.stop(time + 1.1);
  }

  // Play a magical golden chime sweep (for yes response!)
  public playYesChime() {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const time = this.ctx.currentTime;
    const majorArpeggio = [61, 65, 68, 72, 77, 80, 84]; // Dbmaj9 arpeggio going high
    
    majorArpeggio.forEach((note, i) => {
      const noteTime = time + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(this.midiToFreq(note), noteTime);
      
      gainNode.gain.setValueAtTime(0, noteTime);
      gainNode.gain.linearRampToValueAtTime(0.06, noteTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.5);
      
      osc.connect(gainNode);
      if (this.nodes) {
        gainNode.connect(this.nodes.masterGain);
      } else {
        gainNode.connect(this.ctx.destination);
      }
      
      osc.start(noteTime);
      osc.stop(noteTime + 1.6);
    });
  }

  private scheduler() {
    if (!this.isPlaying || !this.ctx) return;

    while (this.nextNoteTime < this.ctx.currentTime + 0.2) {
      this.scheduleNextNote(this.nextNoteTime);
    }

    // Call scheduler recursively
    this.timerId = window.setTimeout(() => this.scheduler(), 50);
  }

  private scheduleNextNote(time: number) {
    const chord = this.chords[this.chordIndex];
    
    // Play a pad base note every chord change (every 8 beats)
    if (this.notePatternIndex === 0) {
      // Play low chord tonic
      this.playPadNote(chord[0], time, 3.2, 0.4);
      // Play mid fifth/third
      this.playPadNote(chord[1], time, 3.2, 0.3);
    }

    // Ambient arpeggio pattern
    const pattern = [0, 2, 4, 3, 5, 2, 4, 1]; // indexes into the chord
    const chordNoteIndex = pattern[this.notePatternIndex];
    const midiNote = chord[chordNoteIndex];

    // Slightly randomize velocity for natural gentle expression
    const vel = 0.35 + Math.random() * 0.25;
    this.playBell(midiNote, time, vel);

    // Advanced clock logic
    // 0.4s per step (subtle gentle tempo)
    const stepDuration = 0.45;
    this.nextNoteTime += stepDuration;

    // Increment pattern
    this.notePatternIndex = (this.notePatternIndex + 1) % 8;
    if (this.notePatternIndex === 0) {
      // Move to next chord
      this.chordIndex = (this.chordIndex + 1) % this.chords.length;
    }
  }
}

export const ambientSynth = new AmbientSynthesizer();
