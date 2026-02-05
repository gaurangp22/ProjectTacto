import { initAudioContext } from './audioEngine';

// TACTO SoundManager - Implements "Earcons" from Whitepaper
// - "Winding Up": Rising pitch for Loops
// - "Questioning": Upward inflection for Conditionals
// - "Thud": Low frequency saw/square for Errors
// - "Snap": High frequency click for connections

class SoundManager {
    private ctx: AudioContext | null = null;
    private isMuted: boolean = false;

    private getContext() {
        if (!this.ctx) {
            this.ctx = initAudioContext();
        }
        return this.ctx;
    }

    // "Winding Up" - Rising pitch sequence for Loop Start
    // Mimics a spring winding up
    playLoopStart() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.3); // Rises quickly

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.1);
        gain.gain.linearRampToValueAtTime(0, t + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.35);
    }

    // "Questioning" - Two-tone rising inflection for Conditionals (If/Else)
    // Like saying "Huh?"
    playConditional() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';

        // First tone (low)
        osc.frequency.setValueAtTime(400, t);
        // Second tone (high) - slide up
        osc.frequency.linearRampToValueAtTime(600, t + 0.15);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.05);
        gain.gain.linearRampToValueAtTime(0, t + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.25);
    }

    // "Thud" - Low discordant sound for Errors
    // Mimics hitting a physical wall or block
    playErrorThud() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        const t = ctx.currentTime;

        // Osc 1: Low Square
        const osc1 = ctx.createOscillator();
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(60, t);
        osc1.frequency.exponentialRampToValueAtTime(30, t + 0.3);

        // Osc 2: Dissonant Saw
        const osc2 = ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(87, t); // Tritone-ish dissonance
        osc2.frequency.exponentialRampToValueAtTime(40, t + 0.3);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(t);
        osc1.stop(t + 0.35);
        osc2.start(t);
        osc2.stop(t + 0.35);
    }

    // "Snap" - Short high-frequency click for UI connections
    playSnap() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.06);
    }

    // "Trash" - Crumpling/Descending sound for deletion
    playTrash() {
        if (this.isMuted) return;
        const ctx = this.getContext();
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.linearRampToValueAtTime(0, t + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.25);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}

export const soundManager = new SoundManager();
