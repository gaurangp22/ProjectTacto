/**
 * "Write your name in Braille", type, and each character rises as a Braille cell.
 * Uses Grade-1 (uncontracted) Braille, including the number sign for digits.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { toBraille } from "@/lib/utils";

type Cell = { ch: string; bits: number };

function toCells(text: string): Cell[] {
  const out: Cell[] = [];
  let inNumber = false;
  for (const ch of text.slice(0, 18)) {
    const isDigit = ch >= "0" && ch <= "9";
    if (isDigit && !inNumber) out.push({ ch: "#", bits: 0b111100 });
    inNumber = isDigit;
    const b = toBraille(ch).replace("⠼", "");
    if (!b) continue;
    out.push({ ch, bits: b.codePointAt(0)! - 0x2800 });
  }
  return out;
}

export function BrailleCell({ bits, size = 12, gap = 6 }: { bits: number; size?: number; gap?: number }) {
  return (
    <span className="grid grid-flow-col grid-rows-3" style={{ gap }} aria-hidden>
      {[0, 1, 2, 3, 4, 5].map((b) => {
        const on = !!(bits & (1 << b));
        return (
          <motion.span
            key={b}
            className="rounded-full"
            style={{ width: size, height: size }}
            initial={false}
            animate={{
              backgroundColor: on ? "#1a1a17" : "#e4e2dd",
              scale: on ? 1 : 0.62,
              boxShadow: on ? "0 3px 6px rgba(26,26,23,.28), inset 0 1px 0 rgba(255,255,255,.25)" : "0 0 0 rgba(0,0,0,0)",
            }}
            transition={{ type: "spring", bounce: 0, duration: 0.4, delay: b * 0.02 }}
          />
        );
      })}
    </span>
  );
}

export default function BrailleName() {
  const [name, setName] = useState("");
  const reduce = useReducedMotion();
  const cells = useMemo(() => toCells(name || "Your name"), [name]);
  const placeholder = !name;

  return (
    <div className="rounded-[1.75rem] border border-[#e4e2dd] bg-white p-7 sm:p-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#a3a39b]">Try it</p>
          <h3 className="mt-3 text-[1.9rem] font-bold leading-tight tracking-[-0.02em] text-[#1a1a17]" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            Write your name in Braille.
          </h3>
        </div>
        <label className="block w-full md:max-w-xs">
          <span className="sr-only">Your name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={18}
            placeholder="Type your name"
            className="w-full rounded-full border border-[#e4e2dd] bg-[#fafaf8] px-5 py-3.5 text-[#1a1a17] outline-none transition placeholder:text-[#a3a39b] focus:border-[#1a1a17] focus:bg-white"
          />
        </label>
      </div>

      <div className="mt-10 flex min-h-[96px] flex-wrap items-end gap-x-5 gap-y-6" aria-live="polite" aria-label={name ? `${name} in Braille: ${toBraille(name)}` : undefined}>
        <AnimatePresence initial={false}>
          {cells.map((c, i) => (
            <motion.div
              key={`${i}-${c.ch}`}
              layout={!reduce}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: placeholder ? 0.35 : 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              {c.ch === " " ? <span className="w-4" /> : <BrailleCell bits={c.bits} />}
              <span className="font-mono text-xs uppercase text-[#a3a39b]">{c.ch === " " ? "" : c.ch === "#" ? "num" : c.ch}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
