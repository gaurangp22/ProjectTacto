import { forwardRef, type HTMLAttributes } from "react";
import { BLOCKS, CATEGORIES, tileLabel, type BlockId, type Inst, type Shape } from "../blocks";
import { cn, toBraille } from "@/lib/utils";

/** The raised tactile marking on each physical tile, drawn as an embossed glyph. */
export function ShapeGlyph({ shape, className, block }: { shape: Shape; className?: string; block?: BlockId }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  let g: JSX.Element;
  if (block === "turn_left") g = <path {...common} d="M17 18V12a4 4 0 0 0-4-4H7m3-3L7 8l3 3" />;
  else if (block === "turn_right") g = <path {...common} d="M7 18V12a4 4 0 0 1 4-4h6m-3-3 3 3-3 3" />;
  else if (block === "collect") g = <path {...common} d="M12 4l6 7-6 9-6-9z M6 11h12" />;
  else if (block === "end") g = <path {...common} d="M5 12h14" strokeWidth={3.4} />;
  else if (block === "else") g = <path {...common} d="M4 7l4 5-4 5M20 7l-4 5 4 5" />;
  else if (block === "drum") g = <g {...common}><ellipse cx="12" cy="9" rx="7" ry="3" /><path d="M5 9v6c0 1.7 3.1 3 7 3s7-1.3 7-3V9" /></g>;
  else if (block === "rest") g = <path {...common} d="M4 12h16" strokeDasharray="2 4" />;
  else if (block === "wait") g = <path {...common} d="M7 4h10M7 20h10M8 4c0 5 8 5 8 8s-8 3-8 8M16 4c0 5-8 5-8 8" />;
  else
    switch (shape) {
      case "arrow": g = <path {...common} d="M12 19V5m-6 6 6-6 6 6" />; break;
      case "ring": g = <g {...common}><circle cx="12" cy="12" r="7" /><path d="M12 5l2.5-2M12 5l2.5 2" /></g>; break;
      case "notch": g = <path {...common} d="M4 6h9l-4 6 4 6H4M15 6h5M15 18h5" />; break;
      case "wave": g = <path {...common} d="M3 12c2-5 4-5 6 0s4 5 6 0 4-5 6 0" />; break;
      case "bubble": g = <path {...common} d="M5 6h14v9H10l-4 3v-3H5z" />; break;
      case "square": g = <rect {...common} x="6" y="6" width="12" height="12" rx="2" />; break;
      case "star": g = <path {...common} d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z" />; break;
      default: g = <path {...common} d="M5 12h14" />;
    }
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("drop-shadow-[0_1px_0_rgba(255,255,255,.35)]", className)}>
      {g}
    </svg>
  );
}

export const colorOf = (type: BlockId) => (type === "end" ? "rgb(var(--ink-2))" : CATEGORIES[BLOCKS[type].category].color);

interface TileProps extends HTMLAttributes<HTMLDivElement> {
  inst?: Inst;
  type?: BlockId;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  selected?: boolean;
  error?: boolean;
  showBraille?: boolean;
  /** Print only the block name (values are shown by controls passed as children). */
  nameOnly?: boolean;
}

/** A TACTO tile, colour, embossed glyph, printed label and Braille strip. */
export const Tile = forwardRef<HTMLDivElement, TileProps>(function Tile(
  { inst, type, size = "md", active, selected, error, showBraille = true, nameOnly, className, style, children, ...rest },
  ref,
) {
  const t = inst?.type ?? type!;
  const def = BLOCKS[t];
  const full = inst ? tileLabel(inst) : def.name;
  const label = nameOnly ? def.name : full;
  const shape = t === "end" ? "bar" : CATEGORIES[def.category].shape;
  return (
    <div
      ref={ref}
      className={cn(
        "tile flex flex-wrap items-center gap-x-2.5 gap-y-1.5 transition-[transform,box-shadow,outline] duration-200",
        size === "sm" && "px-3 py-2 text-[0.82rem]",
        size === "md" && "px-3.5 py-2.5 text-[0.92rem]",
        size === "lg" && "px-4 py-3.5 text-base",
        active && "scale-[1.03] ring-4 ring-ochre/70 ring-offset-2 ring-offset-paper",
        selected && !active && "ring-[3px] ring-sky ring-offset-2 ring-offset-paper",
        error && "ring-4 ring-coral ring-offset-2 ring-offset-paper animate-[pulse_1s_ease-in-out_2]",
        className,
      )}
      style={{ background: colorOf(t), ...style }}
      {...rest}
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-black/15 shadow-[inset_0_2px_3px_rgba(0,0,0,.25)]">
        <ShapeGlyph shape={shape} block={t} className="h-5 w-5" />
      </span>
      <span className="min-w-[4.5rem] flex-1">
        <span className="block truncate font-semibold leading-tight">{label}</span>
        {showBraille && (
          <span aria-hidden className="block truncate text-[0.8em] leading-tight tracking-[0.06em] opacity-75">
            {toBraille(full.replace(/[“”÷·½]/g, ""))}
          </span>
        )}
      </span>
      {children}
    </div>
  );
});
