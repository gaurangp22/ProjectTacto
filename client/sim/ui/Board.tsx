import { useDraggable, useDroppable } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { forwardRef, type KeyboardEvent } from "react";
import { BLOCKS, CATEGORIES, paramText, tileLabel, type BlockId, type Category, type Inst, type ParamValue } from "../blocks";
import { colorOf, ShapeGlyph, Tile } from "./Tile";
import { cn } from "@/lib/utils";

/* ───────────────────────── Palette ───────────────────────── */

function PaletteItem({ type, onAdd }: { type: BlockId; onAdd: (t: BlockId) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `pal:${type}`, data: { type } });
  const def = BLOCKS[type];
  return (
    <Tile
      ref={setNodeRef}
      type={type}
      size="sm"
      role="button"
      tabIndex={0}
      aria-label={`Add ${def.speak(Object.fromEntries((def.params ?? []).map((p) => [p.key, p.default])))}${def.key ? `. Shortcut ${def.key.toUpperCase()}` : ""}`}
      onClick={() => onAdd(type)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onAdd(type))}
      className={cn("cursor-grab touch-none hover:-translate-y-0.5 active:cursor-grabbing", isDragging && "opacity-40")}
      {...listeners}
      {...attributes}
    >
      {def.key && <kbd className="rounded-md bg-black/20 px-1.5 py-0.5 font-mono text-[0.65rem] uppercase">{def.key}</kbd>}
    </Tile>
  );
}

export function Palette({ palette, onAdd }: { palette: BlockId[]; onAdd: (t: BlockId) => void }) {
  const groups = new Map<Category, BlockId[]>();
  for (const t of palette) {
    const c = BLOCKS[t].category;
    groups.set(c, [...(groups.get(c) ?? []), t]);
  }
  return (
    <nav aria-label="Tile drawer" className="space-y-5">
      {[...groups].map(([cat, types]) => (
        <section key={cat}>
          <h3 className="mb-2 flex items-center gap-2 font-sans text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORIES[cat].color }} />
            {CATEGORIES[cat].label}
          </h3>
          <div className="space-y-2.5">
            {types.map((t) => (
              <PaletteItem key={t} type={t} onAdd={onAdd} />
            ))}
          </div>
        </section>
      ))}
    </nav>
  );
}

/* ───────────────────────── Board ───────────────────────── */

interface RowProps {
  inst: Inst;
  index: number;
  depth: number;
  selected: boolean;
  active: boolean;
  error: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onParam: (key: string, v: ParamValue) => void;
}

function Row({ inst, index, depth, selected, active, error, onSelect, onRemove, onParam }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: inst.uid });
  const def = BLOCKS[inst.type];
  return (
    <li
      ref={setNodeRef}
      id={`tile-${inst.uid}`}
      role="option"
      aria-selected={selected}
      aria-label={`Tile ${index + 1}${depth ? `, inside ${depth}` : ""}: ${def.speak(inst.params)}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("flex items-center gap-2", isDragging && "z-10 opacity-60")}
    >
      <span className="w-6 shrink-0 text-right font-mono text-[0.7rem] text-ink-3">{index + 1}</span>
      <div className="flex min-w-0 flex-1 items-center" style={{ paddingLeft: depth * 22 }}>
        {depth > 0 && <span aria-hidden className="mr-2 h-9 w-[3px] shrink-0 rounded-full" style={{ background: "rgb(var(--ochre) / .45)" }} />}
        <Tile
          inst={inst}
          active={active}
          selected={selected}
          error={error}
          nameOnly
          onClick={onSelect}
          className="min-w-0 flex-1 cursor-grab touch-none active:cursor-grabbing"
          {...listeners}
          {...attributes}
          tabIndex={-1}
          role={undefined}
        >
          {def.params && (
          <span className="flex flex-wrap items-center gap-1">
          {def.params.map((pd) => (
            <label key={pd.key} className="relative shrink-0" onPointerDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
              <span className="sr-only">{pd.label || def.name}</span>
              <select
                value={String(inst.params[pd.key])}
                onChange={(e) => {
                  const raw = e.target.value;
                  onParam(pd.key, typeof pd.default === "number" ? Number(raw) : raw);
                }}
                className="max-w-[9.5rem] cursor-pointer appearance-none rounded-lg bg-black/20 py-1 pl-2 pr-5 text-[0.78rem] font-semibold text-white outline-none hover:bg-black/30 focus-visible:ring-2 focus-visible:ring-white"
              >
                {pd.options.map((o) => (
                  <option key={String(o)} value={String(o)} className="text-ink">
                    {paramText(def, pd.key, o)}
                  </option>
                ))}
              </select>
              <span aria-hidden className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-[0.6rem]">▾</span>
            </label>
          ))}
          </span>
          )}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => (e.stopPropagation(), onRemove())}
            aria-label={`Remove tile ${index + 1}`}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-black/10 opacity-60 transition hover:bg-black/25 hover:opacity-100"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </Tile>
      </div>
    </li>
  );
}

interface BoardProps {
  tiles: Inst[];
  depths: number[];
  sel: number;
  activeIndex: number | null;
  errorIndex: number | null;
  onSelect: (i: number) => void;
  onRemove: (i: number) => void;
  onParam: (i: number, key: string, v: ParamValue) => void;
  onKeyDown: (e: KeyboardEvent<HTMLUListElement>) => void;
}

export const Board = forwardRef<HTMLUListElement, BoardProps>(function Board(
  { tiles, depths, sel, activeIndex, errorIndex, onSelect, onRemove, onParam, onKeyDown },
  ref,
) {
  const { setNodeRef, isOver } = useDroppable({ id: "board" });
  return (
    <div ref={setNodeRef} className={cn("min-h-[220px] shrink-0 rounded-4xl border-2 border-dashed p-3 transition sm:p-4", isOver ? "border-sky bg-sky/5" : "border-line")}>
      <SortableContext items={tiles.map((t) => t.uid)} strategy={verticalListSortingStrategy}>
        <ul
          ref={ref}
          role="listbox"
          tabIndex={0}
          aria-label="Reader board. Arrow keys to move between tiles, letters to add tiles, Enter to run, question mark for all shortcuts."
          aria-activedescendant={tiles[sel] ? `tile-${tiles[sel].uid}` : undefined}
          onKeyDown={onKeyDown}
          className="space-y-2.5 rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-sky/30"
        >
          {tiles.map((t, i) => (
            <Row
              key={t.uid}
              inst={t}
              index={i}
              depth={Math.max(0, depths[i] ?? 0)}
              selected={i === sel}
              active={i === activeIndex}
              error={i === errorIndex}
              onSelect={() => onSelect(i)}
              onRemove={() => onRemove(i)}
              onParam={(k, v) => onParam(i, k, v)}
            />
          ))}
          {tiles.length === 0 && (
            <li className="grid place-items-center px-6 py-14 text-center text-ink-3">
              <p className="font-display text-lg font-bold text-ink-2">The board is empty</p>
              <p className="mt-1 max-w-xs text-sm">Drag a tile here, click one in the drawer, or focus the board and press its letter key.</p>
            </li>
          )}
        </ul>
      </SortableContext>
    </div>
  );
});

/* ───────────────────────── Physical board preview ───────────────────────── */

/** How the current program sits on a real 3×8 TACTO reader board. */
export function HardwarePreview({ tiles, activeIndex }: { tiles: Inst[]; activeIndex: number | null }) {
  const SLOTS = 24;
  const boards = Math.max(1, Math.ceil(tiles.length / SLOTS));
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-3">On your TACTO board</p>
        <p className="text-xs text-ink-3">
          {tiles.length}/{SLOTS * boards} slots{boards > 1 ? ` · ${boards} boards linked` : ""}
        </p>
      </div>
      <div className="rounded-3xl bg-ink p-2.5 shadow-lift" aria-hidden>
        <div className="grid grid-cols-8 gap-1.5">
          {Array.from({ length: SLOTS * boards }).map((_, i) => {
            const t = tiles[i];
            return (
              <div
                key={i}
                className={cn(
                  "relative grid aspect-square place-items-center rounded-lg transition",
                  t ? "text-white shadow-tile" : "bg-white/[.06] shadow-[inset_0_2px_4px_rgba(0,0,0,.5)]",
                  i === activeIndex && "ring-2 ring-ochre",
                )}
                style={t ? { background: colorOf(t.type) } : undefined}
                title={t ? tileLabel(t) : `Slot ${i + 1}`}
              >
                {t ? (
                  <ShapeGlyph shape={t.type === "end" ? "bar" : CATEGORIES[BLOCKS[t.type].category].shape} block={t.type} className="h-[55%] w-[55%]" />
                ) : (
                  i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
