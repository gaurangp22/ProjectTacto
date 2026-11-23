/**
 * The "snap-in" product reveal: a reader board rises out of the page as you scroll,
 * tiles drop into its slots one by one, then the program runs with the speaker
 * narrating each tile. Scroll position drives the story; springs drive the motion
 * (critically damped, so nothing bounces).
 */
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BLOCKS, CATEGORIES, fromSpecs, tileLabel, type BlockId, type Inst } from "@/sim/blocks";
import { ShapeGlyph } from "@/sim/ui/Tile";
import { toBraille } from "@/lib/utils";

const display = { fontFamily: "'Cabinet Grotesk', sans-serif" };
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring" as const, bounce: 0, duration: 0.45 };

/* ───────────── tile + board renders ───────────── */

export const HEX: Record<string, string> = {
  motion: "#2b5e54",
  control: "#c9973a",
  logic: "#4a3566",
  sound: "#d97757",
  voice: "#3f5f8a",
  data: "#4f7a45",
  functions: "#8b3a2f",
  end: "#5c5850",
};
const hexOf = (t: BlockId) => (t === "end" ? HEX.end : HEX[BLOCKS[t].category]);

export function BrailleDots({ text, size }: { text: string; size: number }) {
  const cells = [...toBraille(text)].slice(0, 7);
  return (
    <span className="flex gap-[0.45em]" aria-hidden>
      {cells.map((c, i) => {
        const code = c.codePointAt(0)! - 0x2800;
        return (
          <span key={i} className="grid grid-flow-col grid-rows-3 gap-[2px]">
            {[0, 1, 2, 3, 4, 5].map((b) => (
              <span
                key={b}
                style={{ width: size, height: size }}
                className={
                  code & (1 << b)
                    ? "rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,.95),rgba(255,255,255,.55)_45%,rgba(0,0,0,.25)_100%)] shadow-[0_1px_1px_rgba(0,0,0,.35)]"
                    : "rounded-full"
                }
              />
            ))}
          </span>
        );
      })}
    </span>
  );
}

export function Tile({ inst, size, lit }: { inst: Inst; size: number; lit?: boolean }) {
  const def = BLOCKS[inst.type];
  const color = hexOf(inst.type);
  const label = tileLabel(inst);
  const shape = inst.type === "end" ? "bar" : CATEGORIES[def.category].shape;
  const depth = Math.max(3, Math.round(size * 0.07));
  return (
    <div className="relative select-none" style={{ width: size, height: size * 1.12 }}>
      <div
        className="absolute inset-0 rounded-[14%]"
        style={{
          background: `color-mix(in srgb, ${color} 60%, black)`,
          transform: `translateY(${depth}px)`,
          boxShadow: `0 ${depth * 2}px ${depth * 4}px -${depth}px rgba(26,26,23,.45)`,
        }}
      />
      <div
        className="absolute inset-0 overflow-hidden rounded-[14%] transition-[filter] duration-300"
        style={{
          background: `linear-gradient(160deg, color-mix(in srgb, ${color} 78%, white) 0%, ${color} 45%, color-mix(in srgb, ${color} 85%, black) 100%)`,
          boxShadow: "inset 0 1.5px 0 rgba(255,255,255,.4), inset 0 -2px 0 rgba(0,0,0,.18)",
          filter: lit ? "brightness(1.18)" : "none",
        }}
      >
        <div className="absolute -left-1/4 -top-1/2 h-full w-[150%] rotate-[-18deg] bg-gradient-to-b from-white/20 to-transparent" />
        <div
          className="absolute left-1/2 top-[15%] grid -translate-x-1/2 place-items-center rounded-[20%]"
          style={{ width: size * 0.44, height: size * 0.44, background: `color-mix(in srgb, ${color} 88%, black)`, boxShadow: "inset 0 3px 6px rgba(0,0,0,.35), inset 0 -1px 0 rgba(255,255,255,.22)" }}
        >
          <span style={{ width: size * 0.26, height: size * 0.26 }} className="block text-white/95">
            <ShapeGlyph shape={shape} block={inst.type} className="h-full w-full" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-[10%] flex flex-col items-center gap-[0.35em] text-white" style={{ fontSize: size * 0.105 }}>
          <span className="font-bold leading-none tracking-tight [text-shadow:0_1px_0_rgba(0,0,0,.25)]" style={display}>
            {label}
          </span>
          <BrailleDots text={label} size={Math.max(2.5, size * 0.03)} />
        </div>
        {lit && <div className="pointer-events-none absolute inset-0 rounded-[14%] ring-2 ring-white/70" />}
      </div>
    </div>
  );
}

/** A tile that sizes itself to its slot. */
export function SlotTile({ inst, lit, seated, index }: { inst: Inst; lit: boolean; seated: boolean; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize(Math.min(e.contentRect.width, e.contentRect.height / 1.12)));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="grid h-full w-full place-items-center">
      {size > 0 && (
        <motion.div
          initial={false}
          animate={{ y: seated ? (lit ? -10 : 0) : -220, opacity: seated ? 1 : 0, rotate: seated ? 0 : index % 2 ? 8 : -8 }}
          transition={SPRING}
        >
          <Tile inst={inst} size={size} lit={lit} />
        </motion.div>
      )}
    </div>
  );
}

export function Board({ children, running, slots }: { children: (i: number) => ReactNode; running: boolean; slots: number }) {
  return (
    <div
      className="relative rounded-[2rem] p-[3%]"
      style={{
        background: "linear-gradient(175deg,#3a3833 0%,#23221e 38%,#181713 100%)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.14), inset 0 -2px 0 rgba(0,0,0,.6), 0 2px 0 #0d0c0a, 0 14px 0 -2px #0f0e0c, 0 60px 90px -30px rgba(26,26,23,.55), 0 30px 40px -20px rgba(26,26,23,.35)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-[.07] [background:repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_3px)]" />
      <div className="relative flex items-stretch gap-[2.5%]">
        <div className="grid flex-1 gap-[2.2%]" style={{ gridTemplateColumns: `repeat(${slots}, minmax(0,1fr))` }}>
          {Array.from({ length: slots }).map((_, i) => (
            <div key={i} className="relative aspect-[1/1.12] rounded-[14%]" style={{ background: "linear-gradient(180deg,#0f0e0c,#1c1b18)", boxShadow: "inset 0 4px 10px rgba(0,0,0,.8), inset 0 -1px 0 rgba(255,255,255,.06)" }}>
              {i === 0 && <span className="absolute left-1/2 top-[8%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/30" />}
              <div className="absolute inset-[4%]">{children(i)}</div>
            </div>
          ))}
        </div>
        <div className="flex w-[15%] min-w-[64px] flex-col items-center justify-between rounded-[1.2rem] py-[6%]" style={{ background: "linear-gradient(180deg,#1d1c19,#141310)", boxShadow: "inset 0 2px 6px rgba(0,0,0,.7)" }}>
          <div className="grid grid-cols-5 gap-[5px]">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="h-[5px] w-[5px] rounded-full bg-black shadow-[inset_0_1px_1px_rgba(0,0,0,.9),0_1px_0_rgba(255,255,255,.08)]" />
            ))}
          </div>
          <motion.span
            className="h-1.5 w-6 rounded-full"
            animate={{ backgroundColor: running ? ["#d97757", "#f0a07c", "#d97757"] : "#3a3833" }}
            transition={{ duration: 0.9, repeat: running ? Infinity : 0 }}
          />
          <div className="flex flex-col items-center gap-2.5">
            <span className="h-0 w-0 border-x-[11px] border-b-[18px] border-x-transparent border-b-[#c9483f] drop-shadow-[0_2px_0_#5a1f1a]" />
            <motion.span
              className="h-7 w-7 rounded-full bg-[linear-gradient(160deg,#5fbf7f,#3e8f5a)] shadow-[inset_0_1px_0_rgba(255,255,255,.4),0_3px_0_#1f4a30]"
              animate={{ scale: running ? [1, 0.92, 1] : 1 }}
              transition={{ duration: 0.9, repeat: running ? Infinity : 0 }}
            />
            <span className="h-5 w-5 rounded-[5px] bg-[linear-gradient(160deg,#5b86c8,#3f6fb3)] shadow-[0_3px_0_#22416d]" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── the scroll story ───────────── */

const PROGRAM = fromSpecs("repeat:4 forward collect turn_right end");
const SPOKEN = ["Repeat four times", "Move forward", "Collect gem", "Turn right", "End repeat"];
const CHAPTERS = [
  { at: 0, title: "Pick up a tile.", sub: "Every idea has its own shape: a ring for loops, a notch for decisions, and Braille on top." },
  { at: 0.22, title: "Snap it in.", sub: "The reader board feels each tile land and says its name out loud." },
  { at: 0.64, title: "Press the green circle.", sub: "The speaker walks through your program, step by step." },
  { at: 0.88, title: "That's programming.", sub: "No mouse. No keyboard. No screen." },
];
const DROP_AT = [0.25, 0.33, 0.41, 0.49, 0.57];

export default function SnapReveal({ id }: { id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const rotateX = useTransform(p, [0, 0.22], [50, 14]);
  const y = useTransform(p, [0, 0.22], [160, 0]);
  const scale = useTransform(p, [0, 0.22, 0.95, 1], [0.86, 1, 1, 0.97]);
  const [chapter, setChapter] = useState(0);
  const [seated, setSeated] = useState(0);
  const [active, setActive] = useState(-1);

  useMotionValueEvent(p, "change", (v) => {
    setChapter(CHAPTERS.reduce((c, ch, i) => (v >= ch.at ? i : c), 0));
    setSeated(DROP_AT.filter((a) => v >= a).length);
    setActive(v >= 0.66 && v < 0.88 ? Math.min(4, Math.floor(((v - 0.66) / 0.22) * 5)) : -1);
  });

  const caption = active >= 0 ? SPOKEN[active] : chapter === 1 && seated > 0 ? SPOKEN[seated - 1] : null;

  return (
    <section ref={ref} id={id} aria-label="How a TACTO program comes together" className="relative h-[400vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-6">
        <div className="relative z-10 mb-10 h-[8.5rem] w-full max-w-3xl text-center sm:mb-14">
          {CHAPTERS.map((c, i) => (
            <motion.div
              key={c.title}
              className="absolute inset-0"
              initial={false}
              animate={{ opacity: chapter === i ? 1 : 0, y: chapter === i ? 0 : chapter > i ? -20 : 20, filter: chapter === i ? "blur(0px)" : "blur(6px)" }}
              transition={{ duration: 0.6, ease: EASE }}
              aria-hidden={chapter !== i}
            >
              <h2 className="font-bold leading-[1.05] tracking-[-0.035em] text-[#1a1a17]" style={{ ...display, fontSize: "clamp(2.2rem, 5.4vw, 4.1rem)" }}>
                {c.title}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-[#6b6b63]">{c.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="w-full max-w-[min(900px,118vh)] [perspective:1800px]">
          <motion.div style={{ rotateX, y, scale } as unknown as CSSProperties}>
            <Board running={active >= 0} slots={5}>
              {(i) => <SlotTile inst={PROGRAM[i]} index={i} seated={i < seated} lit={active === i} />}
            </Board>
          </motion.div>
        </div>

        <div className="mt-12 h-12">
          <motion.div
            key={caption ?? "none"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: caption ? 1 : 0, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-3 rounded-full bg-[#1a1a17] px-5 py-3 text-[#fafaf8] shadow-[0_20px_40px_-20px_rgba(26,26,23,.5)]"
            aria-hidden
          >
            <Volume2 className="h-4 w-4 text-[#d97757]" />
            <span className="font-medium">“{caption}”</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
