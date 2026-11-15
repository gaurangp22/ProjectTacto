import { motion, AnimatePresence } from "framer-motion";
import { Volume2 } from "lucide-react";
import { NOTE_NAMES } from "../blocks";
import type { GridState, Played, SimState } from "../runtime";
import { cn } from "@/lib/utils";

/* ───────────────────────── Pip ───────────────────────── */

export function Pip({ size = 64, mood = "idle" }: { size?: number; mood?: "idle" | "happy" | "bump" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <ellipse cx="32" cy="58" rx="18" ry="3.5" fill="rgb(var(--ink) / .14)" />
      <rect x="29" y="4" width="6" height="10" rx="3" fill="rgb(var(--ink))" />
      <circle cx="32" cy="5" r="4" fill="rgb(var(--coral))" />
      <rect x="10" y="12" width="44" height="40" rx="16" fill="rgb(var(--card))" stroke="rgb(var(--ink))" strokeWidth="3" />
      <rect x="16" y="20" width="32" height="20" rx="10" fill="rgb(var(--ink))" />
      {mood === "bump" ? (
        <g stroke="rgb(var(--paper))" strokeWidth="3" strokeLinecap="round">
          <path d="M22 27l5 5m0-5l-5 5M37 27l5 5m0-5l-5 5" />
        </g>
      ) : mood === "happy" ? (
        <g stroke="rgb(var(--ochre))" strokeWidth="3.2" fill="none" strokeLinecap="round">
          <path d="M21 32q3.5-5 7 0M36 32q3.5-5 7 0" />
        </g>
      ) : (
        <g fill="rgb(var(--teal))">
          <circle cx="25" cy="30" r="3.6" />
          <circle cx="39" cy="30" r="3.6" />
        </g>
      )}
      <path d="M26 45q6 4 12 0" stroke="rgb(var(--ink))" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      {/* direction nub, always on the "front" (top) of Pip; the whole sprite rotates */}
      <path d="M27 12 32 7l5 5" fill="rgb(var(--ochre))" />
    </svg>
  );
}

/* ───────────────────────── Grid ───────────────────────── */

export function GridStage({ g, mood, hidden }: { g: GridState; mood: "idle" | "happy" | "bump"; hidden?: boolean }) {
  const { map } = g;
  const C = 56;
  const W = map.w * C;
  const H = map.h * C;
  const collected = new Set(map.gems.map(([x, y]) => `${x},${y}`).filter((k) => !g.gems.has(k)));

  return (
    <div className="relative grid h-full w-full place-items-center p-4">
      <svg
        viewBox={`-8 -8 ${W + 16} ${H + 16}`}
        className={cn("h-full max-h-[440px] w-full transition-[filter,opacity] duration-500", hidden && "opacity-0")}
        role="img"
        aria-label={`Grid ${map.w} by ${map.h}. Pip is at column ${g.x + 1}, row ${g.y + 1}. ${g.gems.size} gems left.`}
      >
        <defs>
          <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgb(var(--ink) / .08)" strokeWidth="3" />
          </pattern>
          <linearGradient id="gem" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#7fe3d0" />
            <stop offset="1" stopColor="rgb(var(--teal))" />
          </linearGradient>
        </defs>
        {map.walls.map((row, y) =>
          row.map((wall, x) =>
            wall ? (
              <rect key={`${x}-${y}`} x={x * C + 2} y={y * C + 2} width={C - 4} height={C - 4} rx={10} fill="url(#hatch)" />
            ) : (
              <g key={`${x}-${y}`}>
                <rect x={x * C + 2} y={y * C + 2} width={C - 4} height={C - 4} rx={12} fill="rgb(var(--card))" stroke="rgb(var(--line))" strokeWidth={1.5} />
                {/* tactile overlay dot, the hardware grid has one raised dot per cell */}
                <circle cx={x * C + C / 2} cy={y * C + C / 2} r={2} fill="rgb(var(--ink) / .12)" />
              </g>
            ),
          ),
        )}
        {g.trail.slice(1).map(([x, y], i) => (
          <circle key={i} cx={x * C + C / 2} cy={y * C + C / 2} r={5} fill="rgb(var(--ochre) / .35)" />
        ))}
        {map.goal && (
          <g transform={`translate(${map.goal.x * C + C / 2 - 12}, ${map.goal.y * C + C / 2 - 16})`}>
            <rect x="2" y="0" width="3" height="32" rx="1.5" fill="rgb(var(--ink))" />
            <path d="M5 2h19l-5 6 5 6H5z" fill="rgb(var(--coral))" />
          </g>
        )}
        {map.gems.map(([x, y]) => {
          const k = `${x},${y}`;
          const got = collected.has(k);
          return (
            <motion.g
              key={k}
              initial={false}
              animate={got ? { opacity: 0, scale: 1.8, y: -18 } : { opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              style={{ transformOrigin: `${x * C + C / 2}px ${y * C + C / 2}px` }}
            >
              <path
                d={`M${x * C + C / 2} ${y * C + 14} l11 11 -11 17 -11 -17z`}
                fill="url(#gem)"
                stroke="rgb(var(--ink) / .5)"
                strokeWidth={1.5}
              />
              <path d={`M${x * C + C / 2 - 11} ${y * C + 25} h22`} stroke="rgb(255 255 255 / .6)" strokeWidth={1.5} />
            </motion.g>
          );
        })}
        <motion.g
          initial={false}
          animate={{ x: g.x * C, y: g.y * C, rotate: g.dir * 90 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <motion.g animate={mood === "bump" ? { x: [0, -4, 4, -3, 0] } : mood === "happy" ? { y: [0, -8, 0] } : {}} transition={{ duration: 0.5 }}>
            <g transform="translate(2 2)">
              <Pip size={C - 4} mood={mood} />
            </g>
          </motion.g>
        </motion.g>
      </svg>
      {hidden && <EyesFreeNote />}
    </div>
  );
}

function EyesFreeNote() {
  return (
    <div className="absolute inset-0 grid place-items-center p-6 text-center">
      <div>
        <Volume2 className="mx-auto mb-3 h-10 w-10 text-ink-3" />
        <p className="font-display text-xl font-bold">Eyes-free mode</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-ink-2">The stage is hidden. Follow Pip by sound alone: footsteps pan left and right, gems chime, walls thud.</p>
      </div>
    </div>
  );
}

/* ───────────────────────── Music ───────────────────────── */

const ROW: Record<string, number> = { C4: 0, D4: 1, E4: 2, F4: 3, G4: 4, A4: 5, B4: 6, C5: 7, D5: 8, E5: 9 };
const DRUM_ROW: Record<string, number> = { kick: 0, snare: 1, hat: 2, clap: 3 };

function Roll({ notes, ghost, label }: { notes: Played[]; ghost?: boolean; label: string }) {
  const hasDrums = notes.some((n) => n.kind === "drum");
  const rows = hasDrums ? 4 : 10;
  let t = 0;
  const items = notes.map((n, i) => {
    const beats = n.kind === "drum" ? 0.5 : n.beats;
    const item = { n, i, t, beats };
    t += beats;
    return item;
  });
  const total = Math.max(t, 8);
  return (
    <div>
      <p className="mb-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-3">{label}</p>
      <div className="relative h-[112px] overflow-hidden rounded-2xl border border-line bg-card" aria-hidden>
        {Array.from({ length: Math.ceil(total) }).map((_, b) => (
          <div key={b} className="absolute top-0 h-full border-l border-line/70" style={{ left: `${(b / total) * 100}%` }} />
        ))}
        {items.map(({ n, i, t, beats }) => {
          if (n.kind === "rest") return null;
          const r = n.kind === "drum" ? DRUM_ROW[n.drum] ?? 0 : ROW[n.note] ?? 0;
          return (
            <motion.div
              key={i}
              initial={ghost ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn("absolute rounded-md", ghost ? "border-2 border-dashed border-coral/60" : n.kind === "drum" ? "bg-ink" : "bg-coral")}
              style={{
                left: `calc(${(t / total) * 100}% + 2px)`,
                width: `calc(${(beats / total) * 100}% - 4px)`,
                bottom: `${(r / rows) * 100 + 4}%`,
                height: `${100 / rows - 2}%`,
                minHeight: 7,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export function MusicStage({ s, target, onListen, sandbox }: { s: SimState; target?: Played[]; onListen: () => void; sandbox?: boolean }) {
  const last = [...s.played].reverse().find((p) => p.kind !== "rest");
  return (
    <div className="flex h-full flex-col justify-center gap-5 p-5">
      <div className="flex flex-wrap items-center gap-4">
        <motion.div
          key={s.played.length}
          initial={{ scale: 0.9 }}
          animate={{ scale: [1.12, 1] }}
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-ink text-paper"
        >
          <Volume2 className="h-8 w-8" />
        </motion.div>
        <div className="min-w-0">
          <p className="text-sm text-ink-3">Now playing · {s.instrument}</p>
          <p className="truncate font-display text-2xl font-bold" aria-live="polite">
            {last ? (last.kind === "drum" ? `Drum: ${last.drum}` : last.kind === "note" ? NOTE_NAMES[last.note] : "") : "Silence"}
          </p>
        </div>
        {!sandbox && (
          <button onClick={onListen} className="btn-ghost shrink-0 !px-4 !py-2.5 text-sm sm:ml-auto">
            <Volume2 className="h-4 w-4" /> Listen to target
          </button>
        )}
      </div>
      {!sandbox && target && <Roll notes={target} ghost label="Target" />}
      <Roll notes={s.played} label="Your music" />
    </div>
  );
}

/* ───────────────────────── Voice ───────────────────────── */

export function VoiceStage({ s, expected, sandbox }: { s: SimState; expected?: string[]; sandbox?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <div className="flex flex-wrap items-center gap-2">
        {["A", "B"].map((v) => (
          <div key={v} className="flex items-center gap-2 rounded-2xl border border-line bg-card px-3 py-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-leaf font-bold text-white">{v}</span>
            <motion.span key={s.vars[v]} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-mono text-lg">
              {s.vars[v]}
            </motion.span>
          </div>
        ))}
        {!sandbox && expected && <span className="ml-auto text-sm text-ink-3">{s.said.length} / {expected.length} lines</span>}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto rounded-3xl border border-line bg-card/60 p-4" aria-live="polite">
        {s.said.length === 0 && <p className="py-10 text-center text-ink-3">The speaker is quiet. Run your program to hear it talk.</p>}
        <AnimatePresence initial={false}>
          {s.said.map((line, i) => {
            const ok = !expected || expected[i] === line;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "w-fit max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 font-semibold",
                  sandbox || ok ? "bg-sky text-white" : "bg-coral text-white",
                )}
              >
                {line}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
