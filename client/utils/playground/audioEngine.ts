// TACTO Audio Engine
// Web Audio API + Web Speech API for accessible audio feedback

let audioContext: AudioContext | null = null;
let currentTempo = 120; // BPM
let currentPitchShift = 0; // semitones

// Initialize audio context (must be called after user interaction)
export const initAudioContext = (): AudioContext => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContext;
};

// Get note duration based on tempo
export const getNoteDuration = (): number => {
    return 60 / currentTempo; // seconds per beat
};

// Set tempo
export const setTempo = (bpm: number): void => {
    currentTempo = Math.max(40, Math.min(200, bpm));
    console.log(`[Audio] Tempo set to ${currentTempo} BPM`);
};

export const getTempo = (): number => currentTempo;

// Set pitch shift
export const setPitchShift = (semitones: number): void => {
    currentPitchShift = semitones;
    console.log(`[Audio] Pitch shift set to ${currentPitchShift} semitones`);
};

// Calculate frequency with pitch shift
const getShiftedFrequency = (baseFreq: number): number => {
    return baseFreq * Math.pow(2, currentPitchShift / 12);
};

// Play a musical note
export const playNote = (frequency: number, duration?: number): Promise<void> => {
    return new Promise((resolve) => {
        const ctx = initAudioContext();
        const actualDuration = duration ?? getNoteDuration();
        const shiftedFreq = getShiftedFrequency(frequency);

        // Create oscillator for the note
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(shiftedFreq, ctx.currentTime);

        // ADSR envelope for natural sound
        const attackTime = 0.05;
        const decayTime = 0.1;
        const sustainLevel = 0.7;
        const releaseTime = 0.15;

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + attackTime);
        gainNode.gain.linearRampToValueAtTime(sustainLevel * 0.8, ctx.currentTime + attackTime + decayTime);
        gainNode.gain.setValueAtTime(sustainLevel * 0.8, ctx.currentTime + actualDuration - releaseTime);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + actualDuration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + actualDuration);

        setTimeout(() => resolve(), actualDuration * 1000);
    });
};

// Play a drum hit
export const playDrum = (): Promise<void> => {
    return new Promise((resolve) => {
        const ctx = initAudioContext();
        const duration = 0.15;

        // Create noise for drum
        const bufferSize = ctx.sampleRate * duration;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        // Low-pass filter for kick drum sound
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + duration);

        // Also add a sine wave for the "thump"
        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + duration);

        const gainNoise = ctx.createGain();
        gainNoise.gain.setValueAtTime(0.5, ctx.currentTime);
        gainNoise.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        const gainOsc = ctx.createGain();
        gainOsc.gain.setValueAtTime(0.8, ctx.currentTime);
        gainOsc.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(ctx.destination);

        oscillator.connect(gainOsc);
        gainOsc.connect(ctx.destination);

        noise.start(ctx.currentTime);
        noise.stop(ctx.currentTime + duration);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);

        setTimeout(() => resolve(), duration * 1000 + 50);
    });
};

// Play rest (silence)
export const playRest = (): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), getNoteDuration() * 1000);
    });
};

// Play error sound (low thud)
export const playError = (): Promise<void> => {
    return new Promise((resolve) => {
        const ctx = initAudioContext();
        const duration = 0.3;

        const oscillator = ctx.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(80, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + duration);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.6, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);

        setTimeout(() => resolve(), duration * 1000);
    });
};

// Play success sound (ascending chime)
export const playSuccess = (): Promise<void> => {
    return new Promise((resolve) => {
        const ctx = initAudioContext();
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        let time = ctx.currentTime;

        notes.forEach((freq, i) => {
            const oscillator = ctx.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, time);

            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0, time);
            gainNode.gain.linearRampToValueAtTime(0.4, time + 0.02);
            gainNode.gain.linearRampToValueAtTime(0, time + 0.2);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(time);
            oscillator.stop(time + 0.2);

            time += 0.1;
        });

        setTimeout(() => resolve(), 400);
    });
};

// Play "block placed" feedback sound
export const playBlockPlaced = (): Promise<void> => {
    return new Promise((resolve) => {
        const ctx = initAudioContext();

        const oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);

        setTimeout(() => resolve(), 100);
    });
};

// Play "loop start" winding up sound
export const playLoopStart = (): Promise<void> => {
    return new Promise((resolve) => {
        const ctx = initAudioContext();

        const oscillator = ctx.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);

        setTimeout(() => resolve(), 200);
    });
};

// ============ SPEECH SYNTHESIS ============

export const speak = (text: string, priority: boolean = false): Promise<void> => {
    return new Promise((resolve) => {
        if (priority) {
            window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();

        window.speechSynthesis.speak(utterance);
    });
};

export const cancelSpeech = (): void => {
    window.speechSynthesis.cancel();
};

// ============ COMBINED FEEDBACK ============

export const announceBlock = (blockName: string, slotNumber?: number): void => {
    const slotInfo = slotNumber !== undefined ? ` in slot ${slotNumber}` : '';
    speak(`${blockName} block${slotInfo}`, false);
};

export const announceError = async (message: string): Promise<void> => {
    await playError();
    await speak(message, true);
};

export const announceStart = async (): Promise<void> => {
    await speak('Running program', true);
};

export const announceFinish = async (): Promise<void> => {
    await playSuccess();
    await speak('Program finished', false);
};
