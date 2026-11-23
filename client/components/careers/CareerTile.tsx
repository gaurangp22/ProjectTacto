/**
 * A TACTO tile with a free-form label, drawn exactly like the physical kit tiles
 * (raised body, recessed glyph well, Braille strip). Used for teams and the hiring steps.
 */
import type { Shape } from "@/sim/blocks";
import { ShapeGlyph } from "@/sim/ui/Tile";
import { BrailleDots, HEX } from "@/components/kit/SnapReveal";
import type { Team } from "@shared/careers";

const display = { fontFamily: "'Cabinet Grotesk', sans-serif" };

export const TEAM_STYLE: Record<Team, { color: string; shape: Shape }> = {
  Hardware: { color: HEX.motion, shape: "arrow" },
  Research: { color: HEX.logic, shape: "notch" },
  Partnerships: { color: HEX.voice, shape: "bubble" },
  Curriculum: { color: HEX.control, shape: "ring" },
  Marketing: { color: HEX.sound, shape: "wave" },
};

export function CareerTile({ label, color, shape, size, lit }: { label: string; color: string; shape: Shape; size: number; lit?: boolean }) {
  const depth = Math.max(3, Math.round(size * 0.07));
  return (
    <div className="relative select-none" style={{ width: size, height: size * 1.12 }} aria-hidden>
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
          filter: lit ? "brightness(1.15)" : "none",
        }}
      >
        <div className="absolute -left-1/4 -top-1/2 h-full w-[150%] rotate-[-18deg] bg-gradient-to-b from-white/20 to-transparent" />
        <div
          className="absolute left-1/2 top-[15%] grid -translate-x-1/2 place-items-center rounded-[20%]"
          style={{ width: size * 0.44, height: size * 0.44, background: `color-mix(in srgb, ${color} 88%, black)`, boxShadow: "inset 0 3px 6px rgba(0,0,0,.35), inset 0 -1px 0 rgba(255,255,255,.22)" }}
        >
          <span style={{ width: size * 0.26, height: size * 0.26 }} className="block text-white/95">
            <ShapeGlyph shape={shape} className="h-full w-full" />
          </span>
        </div>
        {size >= 56 && (
          <div className="absolute inset-x-0 bottom-[10%] flex flex-col items-center gap-[0.35em] text-white" style={{ fontSize: size * 0.11 }}>
            <span className="font-bold leading-none tracking-tight [text-shadow:0_1px_0_rgba(0,0,0,.25)]" style={display}>
              {label}
            </span>
            <BrailleDots text={label} size={Math.max(2.5, size * 0.03)} />
          </div>
        )}
      </div>
    </div>
  );
}

/** A small flat chip version for dense lists. */
export function TeamMark({ team, size = 28 }: { team: Team; size?: number }) {
  const s = TEAM_STYLE[team];
  return (
    <span
      aria-hidden
      className="relative grid shrink-0 place-items-center rounded-[28%] text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(160deg, color-mix(in srgb, ${s.color} 80%, white), ${s.color} 55%)`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.35), 0 2px 0 color-mix(in srgb, ${s.color} 60%, black)`,
      }}
    >
      <ShapeGlyph shape={s.shape} className="h-[58%] w-[58%]" />
    </span>
  );
}
