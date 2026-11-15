/**
 * Audio engine: synthesised instruments, drums, spatial earcons and speech.
 * Everything is generated with WebAudio, no sample files to download.
 */
import type { Sfx } from "./runtime";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;

export function audio(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.7;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export const setVolume = (v: number) => {
  audio();
  master!.gain.value = v;
};

const FREQ: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
};

function out(pan = 0): AudioNode {
  const c = audio();
  if (!pan || !c.createStereoPanner) return master!;
  const p = c.createStereoPanner();
  p.pan.value = Math.max(-1, Math.min(1, pan));
  p.connect(master!);
  return p;
}

function env(g: GainNode, t: number, a: number, peak: number, dur: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
}

function tone(freq: number, dur: number, type: OscillatorType, peak = 0.3, attack = 0.005, pan = 0, when = 0) {
  const c = audio();
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  env(g, t, attack, peak, dur);
  o.connect(g).connect(out(pan));
  o.start(t);
  o.stop(t + dur + 0.05);
  return o;
}

export function playNote(note: string, seconds: number, instrument = "marimba") {
  const f = FREQ[note] ?? 261.63;
  const c = audio();
  const d = Math.max(0.15, seconds);
  switch (instrument) {
    case "piano":
      tone(f, d * 1.2, "triangle", 0.32, 0.004);
      tone(f * 2, d * 0.6, "sine", 0.08, 0.004);
      break;
    case "flute": {
      const o = tone(f, d, "sine", 0.28, 0.06);
      const lfo = c.createOscillator();
      const lg = c.createGain();
      lfo.frequency.value = 5.5;
      lg.gain.value = f * 0.008;
      lfo.connect(lg).connect(o.frequency);
      lfo.start();
      lfo.stop(c.currentTime + d + 0.1);
      tone(f * 2, d, "sine", 0.03, 0.08);
      break;
    }
    case "synth": {
      const t = c.currentTime;
      const o = c.createOscillator();
      const fl = c.createBiquadFilter();
      const g = c.createGain();
      o.type = "sawtooth";
      o.frequency.value = f;
      fl.type = "lowpass";
      fl.frequency.setValueAtTime(f * 8, t);
      fl.frequency.exponentialRampToValueAtTime(f * 1.5, t + d);
      env(g, t, 0.01, 0.18, d);
      o.connect(fl).connect(g).connect(master!);
      o.start(t);
      o.stop(t + d + 0.05);
      break;
    }
    default: // marimba
      tone(f, Math.min(d, 0.9), "sine", 0.4, 0.002);
      tone(f * 4, 0.12, "sine", 0.07, 0.001);
  }
}

function noiseHit(dur: number, filter: BiquadFilterType, freq: number, peak: number, pan = 0) {
  const c = audio();
  const t = c.currentTime;
  const s = c.createBufferSource();
  s.buffer = noise;
  const f = c.createBiquadFilter();
  f.type = filter;
  f.frequency.value = freq;
  const g = c.createGain();
  env(g, t, 0.001, peak, dur);
  s.connect(f).connect(g).connect(out(pan));
  s.start(t);
  s.stop(t + dur + 0.02);
}

export function drum(kind: string) {
  const c = audio();
  const t = c.currentTime;
  if (kind === "kick") {
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.25);
    env(g, t, 0.002, 0.9, 0.35);
    o.connect(g).connect(master!);
    o.start(t);
    o.stop(t + 0.4);
  } else if (kind === "snare") {
    noiseHit(0.18, "bandpass", 1800, 0.5);
    tone(190, 0.1, "triangle", 0.25);
  } else if (kind === "hat") {
    noiseHit(0.05, "highpass", 7000, 0.25);
  } else {
    [0, 0.012, 0.024].forEach((w) => setTimeout(() => noiseHit(0.08, "bandpass", 1200, 0.4), w * 1000));
  }
}

/** Earcons. `pan` places the sound left/right so learners can hear where Pip is. */
export function sfx(name: Sfx | "win" | "place" | "remove" | "select", pan = 0) {
  switch (name) {
    case "step": noiseHit(0.05, "lowpass", 900, 0.35, pan); tone(180, 0.06, "sine", 0.15, 0.002, pan); break;
    case "turn": tone(520, 0.05, "triangle", 0.12, 0.002, pan); tone(700, 0.05, "triangle", 0.1, 0.002, pan, 0.05); break;
    case "gem": tone(988, 0.25, "sine", 0.25, 0.002, pan); tone(1319, 0.4, "sine", 0.22, 0.002, pan, 0.08); break;
    case "empty": tone(300, 0.12, "sine", 0.12, 0.01, pan); break;
    case "bump": tone(90, 0.25, "square", 0.25, 0.002, pan); noiseHit(0.12, "lowpass", 400, 0.6, pan); break;
    case "tick": tone(1400, 0.025, "sine", 0.06, 0.001); break;
    case "error": tone(330, 0.18, "triangle", 0.2); tone(247, 0.3, "triangle", 0.2, 0.005, 0, 0.16); break;
    case "win": [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.35, "triangle", 0.2, 0.004, 0, i * 0.09)); break;
    case "place": tone(660, 0.05, "square", 0.06, 0.001); noiseHit(0.03, "highpass", 3000, 0.2); break; // the "click" of a tile seating
    case "remove": tone(440, 0.06, "triangle", 0.1, 0.002); tone(330, 0.06, "triangle", 0.08, 0.002, 0, 0.05); break;
    case "select": tone(880, 0.03, "sine", 0.06, 0.001); break;
  }
}

/* ─────────────── Speech ─────────────── */

let voice: SpeechSynthesisVoice | null = null;
let preferredURI: string | null = (() => {
  try {
    return JSON.parse(localStorage.getItem("tacto.settings.v1") ?? "{}").voiceURI ?? null;
  } catch {
    return null;
  }
})();
let rate = 1;
export const setSpeechRate = (r: number) => (rate = r);
export const speechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;

/**
 * Browsers ship very different voices. Neural "Natural"/"Online" voices (Edge), Google's
 * cloud voices (Chrome) and Apple's Premium/Enhanced voices (Safari) sound far more human
 * than legacy desktop voices like Microsoft David/Zira or eSpeak, so we rank them.
 */
export function scoreVoice(v: SpeechSynthesisVoice): number {
  const n = v.name.toLowerCase();
  let s = 0;
  if (!/^en/i.test(v.lang)) return -1000;
  if (/natural|neural/.test(n)) s += 120;
  if (/online/.test(n)) s += 40;
  if (/premium|enhanced|siri/.test(n)) s += 100;
  if (/google/.test(n)) s += 70;
  if (/(ava|aria|jenny|emma|sonia|libby|natasha|andrew|brian|guy|ryan|samantha|serena|karen|moira|daniel|allison|susan)/.test(n)) s += 25;
  if (/(david|zira|mark|hazel|george)\b/.test(n) && !/natural|online/.test(n)) s -= 60; // legacy SAPI voices
  if (/espeak|robot|compact|novelty|bad news|bells|boing|bubbles|cellos|whisper|zarvox|trinoids|albert|fred|junior|ralph/.test(n)) s -= 200;
  if (/en[-_](us|gb)/i.test(v.lang)) s += 10;
  if (/en[-_](in|au|ie|ca|nz)/i.test(v.lang)) s += 6;
  if (v.default) s += 2;
  return s;
}

export function listVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  return speechSynthesis
    .getVoices()
    .filter((v) => scoreVoice(v) > -500)
    .sort((a, b) => scoreVoice(b) - scoreVoice(a));
}

function pickVoice() {
  const vs = listVoices();
  return (preferredURI && vs.find((v) => v.voiceURI === preferredURI)) || vs[0] || null;
}

export function setPreferredVoice(uri: string | null) {
  preferredURI = uri;
  voice = pickVoice();
}

const voiceSubs = new Set<() => void>();
export const onVoicesChanged = (f: () => void) => (voiceSubs.add(f), () => void voiceSubs.delete(f));
if (speechSupported())
  speechSynthesis.onvoiceschanged = () => {
    voice = pickVoice();
    voiceSubs.forEach((f) => f());
  };

/** Speaks text. Resolves when done (or after a safety timeout). `interrupt` cancels anything queued. */
export function speak(text: string, interrupt = true): Promise<void> {
  if (!speechSupported() || !text) return Promise.resolve();
  if (interrupt) speechSynthesis.cancel();
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    voice ??= pickVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    }
    // neural voices sound best near 1.0; legacy voices are slightly more natural a touch slower
    u.rate = voice && scoreVoice(voice) >= 70 ? rate : rate * 0.92;
    u.pitch = 1;
    const done = () => resolve();
    u.onend = done;
    u.onerror = done;
    setTimeout(done, 600 + text.length * 90);
    speechSynthesis.speak(u);
  });
}
export const stopSpeech = () => speechSupported() && speechSynthesis.cancel();

/** Light haptics for phones/tablets, another channel besides sound. */
export const buzz = (pattern: number | number[]) => {
  try {
    if ((navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive === false) return;
    navigator.vibrate?.(pattern);
  } catch {
    /* unsupported */
  }
};
