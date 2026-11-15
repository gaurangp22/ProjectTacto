import { BLOCKS, condText, type Condition, type Inst, type ParamValue } from "./blocks";
import type { Node, Program } from "./parser";

/* ─────────────────────────── World model ─────────────────────────── */

export type Dir = 0 | 1 | 2 | 3; // N E S W
export const DIRS: [number, number][] = [[0, -1], [1, 0], [0, 1], [-1, 0]];
export const DIR_NAMES = ["north", "east", "south", "west"];

export interface GridMap {
  w: number;
  h: number;
  walls: boolean[][]; // [y][x]
  start: { x: number; y: number; dir: Dir };
  goal: { x: number; y: number } | null;
  gems: [number, number][];
}

/**
 * Map authoring format (one string per row):
 *   #  wall / void      .  floor      G  goal      *  gem
 *   ^ > v <  Pip's start + facing      @  start that is also the goal (faces north)
 */
export function parseMap(rows: string[]): GridMap {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const walls: boolean[][] = [];
  let start = { x: 0, y: 0, dir: 1 as Dir };
  let goal: GridMap["goal"] = null;
  const gems: [number, number][] = [];
  const dirOf: Record<string, Dir> = { "^": 0, ">": 1, v: 2, "<": 3, "@": 0 };
  for (let y = 0; y < h; y++) {
    walls.push([]);
    for (let x = 0; x < w; x++) {
      const c = rows[y][x] ?? "#";
      walls[y][x] = c === "#";
      if (c in dirOf) start = { x, y, dir: dirOf[c] };
      if (c === "G" || c === "@") goal = { x, y };
      if (c === "*") gems.push([x, y]);
    }
  }
  return { w, h, walls, start, goal, gems };
}

export type Played = { kind: "note"; note: string; beats: number } | { kind: "rest"; beats: number } | { kind: "drum"; drum: string };

export interface GridState {
  map: GridMap;
  x: number;
  y: number;
  dir: Dir;
  gems: Set<string>; // remaining
  collected: number;
  trail: [number, number][];
}

export interface SimState {
  grid?: GridState;
  played: Played[];
  said: string[];
  vars: Record<string, number>;
  instrument: string;
  steps: number;
}

export function initState(map?: GridMap): SimState {
  return {
    grid: map
      ? {
          map,
          x: map.start.x,
          y: map.start.y,
          dir: map.start.dir,
          gems: new Set(map.gems.map(([x, y]) => `${x},${y}`)),
          collected: 0,
          trail: [[map.start.x, map.start.y]],
        }
      : undefined,
    played: [],
    said: [],
    vars: { A: 0, B: 0 },
    instrument: "marimba",
    steps: 0,
  };
}

const open = (g: GridState, x: number, y: number) => x >= 0 && y >= 0 && x < g.map.w && y < g.map.h && !g.map.walls[y][x];

function look(g: GridState, turn: 0 | -1 | 1) {
  const d = (((g.dir + turn) % 4) + 4) % 4;
  const [dx, dy] = DIRS[d];
  return open(g, g.x + dx, g.y + dy);
}

export function checkCondition(s: SimState, c: Condition): boolean {
  const g = s.grid;
  if (!g) return false;
  switch (c) {
    case "path_ahead": return look(g, 0);
    case "wall_ahead": return !look(g, 0);
    case "path_left": return look(g, -1);
    case "path_right": return look(g, 1);
    case "on_gem": return g.gems.has(`${g.x},${g.y}`);
    case "at_goal": return !!g.map.goal && g.x === g.map.goal.x && g.y === g.map.goal.y;
  }
}

/* ─────────────────────────── Execution ─────────────────────────── */

export type Sfx = "step" | "turn" | "gem" | "empty" | "bump" | "tick" | "error";

export interface Step {
  index: number; // board tile being executed
  /** Short narration, e.g. "Repeat, round 2 of 4". */
  narration: string;
  sfx?: Sfx;
  note?: Played;
  instrument?: string;
  say?: string;
  waitMs?: number;
  error?: string;
}

export const STEP_LIMIT = 1500;
const MAX_DEPTH = 40;

class Halt extends Error {}

/**
 * Executes a parsed program as a generator so the UI can animate one tile at a time,
 * while tests can drain it instantly. State is mutated in place.
 */
export function* run(program: Program, s: SimState): Generator<Step, void, void> {
  let depth = 0;

  function* tick(step: Step): Generator<Step, void, void> {
    s.steps++;
    if (s.steps > STEP_LIMIT) {
      yield { index: step.index, narration: "Stopped", sfx: "error", error: "Pip got dizzy: this program seems to loop forever. Check your Repeat-until or While condition." };
      throw new Halt();
    }
    yield step;
    if (step.error) throw new Halt();
  }

  function* list(nodes: Node[]): Generator<Step, void, void> {
    for (const n of nodes) yield* node(n);
  }

  function* node(n: Node): Generator<Step, void, void> {
    const { inst, index } = n;
    const p = inst.params;
    const def = BLOCKS[inst.type];
    const g = s.grid;

    switch (inst.type) {
      case "forward": {
        if (!g) return yield* tick({ index, narration: "There is no grid here", sfx: "empty" });
        const [dx, dy] = DIRS[g.dir];
        if (!open(g, g.x + dx, g.y + dy))
          return yield* tick({ index, narration: "Bump!", sfx: "bump", error: `Bump! Tile ${index + 1}: there is a wall in front of Pip.` });
        g.x += dx;
        g.y += dy;
        g.trail.push([g.x, g.y]);
        return yield* tick({ index, narration: "Forward", sfx: "step" });
      }
      case "turn_left":
      case "turn_right": {
        if (g) g.dir = (((g.dir + (inst.type === "turn_left" ? 3 : 1)) % 4) as Dir);
        return yield* tick({ index, narration: `${def.name}, now facing ${g ? DIR_NAMES[g.dir] : ""}`, sfx: "turn" });
      }
      case "collect": {
        const k = g ? `${g.x},${g.y}` : "";
        if (g && g.gems.has(k)) {
          g.gems.delete(k);
          g.collected++;
          return yield* tick({ index, narration: "Got a gem!", sfx: "gem" });
        }
        return yield* tick({ index, narration: "Nothing to collect here", sfx: "empty" });
      }
      case "repeat": {
        const times = Number(p.n);
        for (let i = 1; i <= times; i++) {
          yield* tick({ index, narration: `Repeat, round ${i} of ${times}`, sfx: "tick" });
          yield* list(n.body!);
        }
        return;
      }
      case "repeat_until":
      case "while": {
        const until = inst.type === "repeat_until";
        let round = 0;
        for (;;) {
          const c = checkCondition(s, p.cond as Condition);
          const go = until ? !c : c;
          round++;
          yield* tick({ index, narration: `${until ? "Until" : "While"} ${condText(p.cond)}? ${c ? "yes" : "no"}${go ? `, round ${round}` : ", done"}`, sfx: "tick" });
          if (!go) return;
          yield* list(n.body!);
        }
      }
      case "if":
      case "if_compare":
      case "if_divisible": {
        let c: boolean;
        if (inst.type === "if") c = checkCondition(s, p.cond as Condition);
        else if (inst.type === "if_divisible") c = s.vars[String(p.v)] % Number(p.n) === 0;
        else {
          const a = s.vars[String(p.v)];
          const b = Number(p.n);
          c = p.op === ">" ? a > b : p.op === "<" ? a < b : a === b;
        }
        yield* tick({ index, narration: `${def.speak(p)}? ${c ? "Yes" : "No"}`, sfx: "tick" });
        if (c) yield* list(n.body!);
        else if (n.elseBody) yield* list(n.elseBody);
        return;
      }
      case "wait":
        return yield* tick({ index, narration: def.speak(p), waitMs: Number(p.s) * 1000 });
      case "play_note": {
        const note: Played = { kind: "note", note: String(p.note), beats: Number(p.beats) };
        s.played.push(note);
        return yield* tick({ index, narration: def.speak(p), note, instrument: s.instrument });
      }
      case "rest": {
        const note: Played = { kind: "rest", beats: Number(p.beats) };
        s.played.push(note);
        return yield* tick({ index, narration: def.speak(p), note });
      }
      case "drum": {
        const note: Played = { kind: "drum", drum: String(p.kind) };
        s.played.push(note);
        return yield* tick({ index, narration: def.speak(p), note });
      }
      case "instrument":
        s.instrument = String(p.inst);
        return yield* tick({ index, narration: def.speak(p), sfx: "tick" });
      case "say":
        s.said.push(String(p.text));
        return yield* tick({ index, narration: `Says “${p.text}”`, say: String(p.text) });
      case "say_var": {
        const v = String(s.vars[String(p.v)]);
        s.said.push(v);
        return yield* tick({ index, narration: `Box ${p.v} is ${v}`, say: v });
      }
      case "set_var":
        s.vars[String(p.v)] = Number(p.n);
        return yield* tick({ index, narration: `${p.v} is now ${p.n}`, sfx: "tick" });
      case "change_var":
        s.vars[String(p.v)] += Number(p.n);
        return yield* tick({ index, narration: `${p.v} is now ${s.vars[String(p.v)]}`, sfx: "tick" });
      case "call": {
        const body = program.funcs[String(p.name)];
        if (++depth > MAX_DEPTH)
          return yield* tick({ index, narration: "Too deep", sfx: "error", error: `Tile ${index + 1}: ${p.name} keeps calling itself. Functions can't call themselves forever.` });
        yield* tick({ index, narration: `Doing ${p.name}`, sfx: "tick" });
        yield* list(body);
        depth--;
        return;
      }
      default:
        return;
    }
  }

  try {
    yield* list(program.main);
  } catch (e) {
    if (!(e instanceof Halt)) throw e;
  }
}

/** Runs to completion without animation, used for hidden map variants, solution checks and tests. */
export function runHeadless(program: Program, s: SimState): { error?: string } {
  for (const step of run(program, s)) if (step.error) return { error: step.error };
  return {};
}

export const describeProgram = (tiles: Inst[], depths: number[]) =>
  tiles.map((t, i) => `${i + 1}. ${"inside, ".repeat(Math.max(0, depths[i] ?? 0))}${BLOCKS[t.type].speak(t.params as Record<string, ParamValue>)}`);
