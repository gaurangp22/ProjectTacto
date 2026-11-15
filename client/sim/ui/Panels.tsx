import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Lightbulb, Lock, Star, Volume2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { listVoices, onVoicesChanged, scoreVoice, setPreferredVoice, speak } from "../audio";
import { Link } from "react-router-dom";
import { UNITS, type Lesson, type Unit } from "../curriculum";
import { par } from "../evaluate";
import type { Settings } from "../progress";
import { cn } from "@/lib/utils";

export function Stars({ n, size = 16, className }: { n: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-label={`${n} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <Star key={i} width={size} height={size} className={i < n ? "fill-ochre text-ochre" : "text-ink/20"} />
      ))}
    </span>
  );
}

/* ───────────────────────── Mission / Board / Teacher tabs ───────────────────────── */

export function MissionPanel({ lesson, onSpeak }: { lesson: Lesson; unit: Unit; onSpeak: (t: string) => void; onShowSolution?: () => void }) {
  const [hints, setHints] = useState(0);
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <p className="flex-1 text-[0.98rem] leading-relaxed text-ink">{lesson.brief}</p>
        <button onClick={() => onSpeak(lesson.brief)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line hover:bg-paper-2" aria-label="Read the mission aloud">
          <Volume2 className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 rounded-2xl bg-paper-2/70 p-3.5 text-sm">
        <p className="font-semibold">You'll learn</p>
        <p className="text-ink-2">{lesson.concept}</p>
        {!lesson.sandbox && (
          <p className="mt-2 text-ink-3">
            Three stars: solve it in {par(lesson)} tiles or fewer{lesson.maps && lesson.maps.length > 1 ? ` · works on all ${lesson.maps.length} layouts` : ""}.
          </p>
        )}
      </div>
      <div className="mt-4 space-y-2">
        {lesson.hints.slice(0, hints).map((h, i) => (
          <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 rounded-2xl border border-ochre/40 bg-ochre/10 p-3 text-sm">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-ochre" /> {h}
          </motion.p>
        ))}
        {hints < lesson.hints.length && (
          <button
            onClick={() => {
              setHints(hints + 1);
              onSpeak(lesson.hints[hints]);
            }}
            className="text-sm font-semibold text-sky hover:underline"
          >
            {hints === 0 ? "I'd like a hint" : "Another hint"} ({lesson.hints.length - hints} left)
          </button>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Lesson map ───────────────────────── */

export function LessonMap({ open, onClose, current, progress }: { open: boolean; onClose: () => void; current: string; progress: Record<string, { stars: number }> }) {
  const total = UNITS.reduce((n, u) => n + u.lessons.length, 0);
  const done = Object.keys(progress).length;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="All lessons"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="h-full w-full max-w-xl overflow-y-auto bg-paper p-5 shadow-lift sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="kicker">Lessons</p>
                <h2 className="mt-2 font-display text-3xl font-bold">Your learning path</h2>
                <p className="mt-1 text-ink-2">
                  {done} of {total} lessons complete
                </p>
                <div className="mt-3 h-2 w-64 max-w-full overflow-hidden rounded-full bg-line">
                  <div className="h-full rounded-full bg-teal" style={{ width: `${(done / total) * 100}%` }} />
                </div>
              </div>
              <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-line" aria-label="Close" autoFocus>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-6">
              {UNITS.map((u) => (
                <section key={u.id}>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl font-display font-bold text-white" style={{ background: `rgb(var(--${u.color}))` }}>
                      {u.n}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold leading-tight">{u.title}</h3>
                      <p className="text-sm text-ink-3">{u.tagline}</p>
                    </div>
                  </div>
                  <ul className="grid gap-1.5 pl-12">
                    {u.lessons.map((l, i) => {
                      const st = progress[l.id]?.stars ?? 0;
                      return (
                        <li key={l.id}>
                          <Link
                            to={`/simulator/${l.id}`}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 transition hover:border-ink/30 hover:bg-card",
                              l.id === current ? "border-ink bg-card" : "border-transparent",
                            )}
                          >
                            <span className={cn("grid h-6 w-6 place-items-center rounded-full text-[0.7rem] font-bold", st ? "bg-teal text-white" : "bg-line text-ink-2")}>
                              {st ? <Check className="h-3.5 w-3.5" /> : i + 1}
                            </span>
                            <span className="flex-1 font-semibold">{l.title}</span>
                            <span className="text-xs capitalize text-ink-3">{l.sandbox ? "free play" : l.world}</span>
                            <Stars n={st} size={13} />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
            <p className="mt-8 flex items-center gap-2 text-xs text-ink-3">
              <Lock className="h-3.5 w-3.5" /> Nothing is locked: teachers can jump anywhere. Progress is saved on this device.
            </p>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── Result ───────────────────────── */

const CONFETTI = ["--coral", "--teal", "--ochre", "--plum", "--sky", "--rose"];

export function ResultDialog({ open, stars, message, onNext, onAgain, hasNext }: { open: boolean; stars: number; message: string; onNext: () => void; onAgain: () => void; hasNext: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {Array.from({ length: 36 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-2 rounded-sm"
              style={{ background: `rgb(var(${CONFETTI[i % CONFETTI.length]}))` }}
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: (Math.random() - 0.5) * 900, y: (Math.random() - 0.7) * 700, rotate: Math.random() * 720, opacity: 0 }}
              transition={{ duration: 1.6 + Math.random(), ease: [0.2, 0.7, 0.3, 1] }}
            />
          ))}
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="result-title"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="card relative w-full max-w-md p-8 text-center shadow-lift"
          >
            <div className="mb-4 flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.25 + i * 0.18, type: "spring", stiffness: 400, damping: 14 }}>
                  <Star className={cn("h-12 w-12", i < stars ? "fill-ochre text-ochre" : "text-ink/15")} />
                </motion.span>
              ))}
            </div>
            <h2 id="result-title" className="font-display text-3xl font-bold">
              Solved!
            </h2>
            <p className="mt-2 text-ink-2">{message}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button onClick={onAgain} className="btn-ghost flex-1">
                Keep improving
              </button>
              {hasNext && (
                <button onClick={onNext} className="btn-primary flex-1" autoFocus>
                  Next lesson <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────────────────────── Settings ───────────────────────── */

export function SettingsPanel({ s, set, onClose }: { s: Settings; set: (p: Partial<Settings>) => void; onClose: () => void }) {
  const Toggle = ({ k, label, desc }: { k: keyof Settings; label: string; desc: string }) => (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl p-3 hover:bg-paper-2">
      <input type="checkbox" checked={Boolean(s[k])} onChange={(e) => set({ [k]: e.target.checked })} className="mt-1 h-5 w-5 accent-[rgb(var(--teal))]" />
      <span>
        <span className="block font-semibold">{label}</span>
        <span className="block text-sm text-ink-3">{desc}</span>
      </span>
    </label>
  );
  return (
    <div role="dialog" aria-label="Accessibility and sound settings" className="card absolute right-0 top-12 z-40 w-[min(92vw,360px)] p-3 shadow-lift">
      <div className="flex items-center justify-between px-3 pb-1 pt-2">
        <p className="font-display text-lg font-bold">Settings</p>
        <button onClick={onClose} aria-label="Close settings" className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper-2">
          <X className="h-4 w-4" />
        </button>
      </div>
      <Toggle k="narrate" label="Narrate while running" desc="The speaker describes each tile. Turn off if you use a screen reader." />
      <Toggle k="eyesFree" label="Eyes-free mode" desc="Hide the stage and follow Pip by sound only." />
      <Toggle k="night" label="High-contrast night" desc="Bright colours on a dark background." />
      <Toggle k="bigText" label="Large text" desc="Make everything bigger." />
      <VoicePicker value={s.voiceURI} onChange={(uri) => set({ voiceURI: uri })} />
      <div className="space-y-3 p-3">
        {(
          [
            ["speed", "Run speed", 0.5, 3, 0.25],
            ["speechRate", "Voice speed", 0.6, 1.8, 0.1],
            ["volume", "Volume", 0, 1, 0.05],
          ] as const
        ).map(([k, label, min, max, step]) => (
          <label key={k} className="block">
            <span className="flex justify-between text-sm font-semibold">
              {label} <span className="font-mono text-ink-3">{Number(s[k]).toFixed(2)}</span>
            </span>
            <input type="range" min={min} max={max} step={step} value={s[k]} onChange={(e) => set({ [k]: Number(e.target.value) })} className="w-full accent-[rgb(var(--ink))]" />
          </label>
        ))}
      </div>
    </div>
  );
}

export const SHORTCUTS: [string, string][] = [
  ["↑ ↓", "Move between tiles"],
  ["Alt + ↑ ↓", "Move the selected tile"],
  ["← →", "Change the tile's first value"],
  ["Delete", "Remove the selected tile"],
  ["Letter", "Add a tile (F forward, L left, R right, C collect, P repeat, E end, I if, X else…)"],
  ["Space", "Hear the selected tile"],
  ["A", "Hear the whole program"],
  ["Enter", "Run"],
  ["T", "Step one tile"],
  ["Esc", "Stop"],
  ["?", "Show these shortcuts"],
];


const prettyVoice = (v: SpeechSynthesisVoice) =>
  v.name
    .replace(/^(Microsoft|Google) /, "")
    .replace(/ Online \(Natural\)/, " (natural)")
    .replace(/ - English.*/, "");

function VoicePicker({ value, onChange }: { value: string | null; onChange: (uri: string | null) => void }) {
  const [voices, setVoices] = useState(listVoices);
  useEffect(() => onVoicesChanged(() => setVoices(listVoices())), []);
  if (!voices.length) return null;
  const current = value ?? voices[0]?.voiceURI;
  return (
    <div className="p-3">
      <label className="block text-sm font-semibold" htmlFor="voice-pick">
        Voice
      </label>
      <div className="mt-1.5 flex gap-2">
        <select
          id="voice-pick"
          value={current}
          onChange={(e) => {
            onChange(e.target.value);
            setPreferredVoice(e.target.value);
            void speak("Hi! I am the TACTO speaker. Let us build something.");
          }}
          className="field !py-2.5 text-sm"
        >
          {voices.slice(0, 30).map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {prettyVoice(v)}
              {scoreVoice(v) >= 100 ? " ★" : ""}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => void speak("Repeat four times. Move forward. Collect gem.")} className="btn-ghost shrink-0 !px-3 !py-2 text-sm">
          Test
        </button>
      </div>
      <p className="mt-1.5 text-xs text-ink-3">★ = natural-sounding. The best voices come with Microsoft Edge, Chrome and Safari.</p>
    </div>
  );
}
