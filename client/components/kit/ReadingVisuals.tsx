/**
 * Two purposeful visuals built on the tile render:
 *  • BrailleReading, the tile's label read cell by cell, the way fingers read Braille.
 *  • TwoWaysToRead, one tile, read by eye (print) and by touch (Braille): one version for everyone.
 */
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Eye, Hand } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrailleCell } from "@/components/BrailleName";
import { fromSpecs } from "@/sim/blocks";
import { toBraille } from "@/lib/utils";
import { Tile } from "./SnapReveal";

const display = { fontFamily: "'Cabinet Grotesk', sans-serif" };

export function BrailleReading({ word = "collect" }: { word?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-60px" });
  const reduce = useReducedMotion();
  const letters = [...word];
  const [at, setAt] = useState(reduce ? letters.length : -1);

  useEffect(() => {
    if (!inView || reduce) return;
    let i = -1;
    const t = setInterval(() => {
      i = i >= letters.length + 2 ? -1 : i + 1; // read, pause on the full word, start again
      setAt(i);
    }, 520);
    return () => clearInterval(t);
  }, [inView, reduce, letters.length]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-8">
      <Tile inst={fromSpecs(word)[0] ?? fromSpecs("collect")[0]} size={120} />
      <div className="flex gap-3" aria-label={`The Braille for “${word}”, read one cell at a time`}>
        {letters.map((ch, i) => {
          const bits = toBraille(ch).codePointAt(0)! - 0x2800;
          const reading = i === at;
          const read = i < at || at >= letters.length;
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div
                className="rounded-lg p-1.5"
                animate={{ backgroundColor: reading ? "#f2f0ec" : "rgba(242,240,236,0)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              >
                <BrailleCell bits={bits} size={7} gap={4} />
              </motion.div>
              <motion.span className="font-mono text-xs text-[#1a1a17]" animate={{ opacity: read || reading ? 1 : 0.15 }} transition={{ duration: 0.2 }}>
                {ch}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Callout({ side, icon, title, body }: { side: "left" | "right"; icon: React.ReactNode; title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -12 : 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.3 }}
      className={`max-w-[170px] ${side === "left" ? "text-right" : "text-left"}`}
    >
      <span className={`inline-grid h-9 w-9 place-items-center rounded-full bg-[#f2f0ec] text-[#1a1a17]`}>{icon}</span>
      <p className="mt-3 text-lg font-bold text-[#1a1a17]" style={display}>
        {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[#6b6b63]">{body}</p>
    </motion.div>
  );
}

export function TwoWaysToRead() {
  const tile = fromSpecs("repeat:3")[0];
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8" aria-label="One tile, read two ways: by eye from the printed label, and by touch from the Braille">
      <Callout side="left" icon={<Eye size={16} />} title="Read with eyes" body="A bold, high-contrast printed label." />
      <div className="relative">
        {/* leader lines to the label and the Braille */}
        <svg aria-hidden className="pointer-events-none absolute -left-10 top-0 h-full w-10 overflow-visible sm:-left-16 sm:w-16" viewBox="0 0 64 200" preserveAspectRatio="none">
          <motion.path d="M0 100 C 30 100, 40 150, 64 152" fill="none" stroke="#c8c6c0" strokeWidth="1.5" strokeDasharray="3 4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }} />
        </svg>
        <svg aria-hidden className="pointer-events-none absolute -right-10 top-0 h-full w-10 overflow-visible sm:-right-16 sm:w-16" viewBox="0 0 64 200" preserveAspectRatio="none">
          <motion.path d="M64 100 C 34 100, 24 168, 0 170" fill="none" stroke="#c8c6c0" strokeWidth="1.5" strokeDasharray="3 4" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.5 }} />
        </svg>
        <Tile inst={tile} size={170} />
      </div>
      <Callout side="right" icon={<Hand size={16} />} title="Read with fingers" body="Grade-1 Braille, raised on the same tile." />
    </div>
  );
}
