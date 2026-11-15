/**
 * The TACTO block catalogue.
 *
 * Every block mirrors a physical tile: a colour (for low-vision learners), a raised
 * shape (for touch), a Braille label, and a spoken name. Programs are a single linear
 * sequence on the reader board, nesting is expressed with physical bracket tiles
 * (Repeat … End, If … Else … End), exactly like the hardware.
 */

export type Category = "motion" | "control" | "logic" | "sound" | "voice" | "data" | "functions";
export type Shape = "arrow" | "ring" | "notch" | "wave" | "bubble" | "square" | "star" | "bar";
export type Structure = "cmd" | "open" | "mid" | "close";

export type ParamValue = number | string;
export interface ParamDef {
  key: string;
  label: string;
  options: ParamValue[];
  default: ParamValue;
  /** How the value is spoken / printed. */
  format?: (v: ParamValue) => string;
}

export type BlockId =
  | "forward" | "turn_left" | "turn_right" | "collect"
  | "repeat" | "repeat_until" | "while" | "end" | "wait"
  | "if" | "else" | "if_compare" | "if_divisible"
  | "play_note" | "rest" | "drum" | "instrument"
  | "say" | "say_var"
  | "set_var" | "change_var"
  | "define" | "call";

export interface BlockDef {
  id: BlockId;
  name: string; // short label printed on the tile
  category: Category;
  structure: Structure;
  params?: ParamDef[];
  /** Spoken description, e.g. "Repeat 4 times". */
  speak: (p: Record<string, ParamValue>) => string;
  /** Keyboard shortcut in the simulator palette. */
  key?: string;
  /** Short tactile description for the help panel. */
  feel: string;
}

export const CATEGORIES: Record<Category, { label: string; color: string; shape: Shape; blurb: string }> = {
  motion: { label: "Motion", color: "rgb(var(--teal))", shape: "arrow", blurb: "Move Pip around the grid." },
  control: { label: "Loops", color: "rgb(var(--ochre))", shape: "ring", blurb: "Repeat things without repeating yourself." },
  logic: { label: "Decisions", color: "rgb(var(--plum))", shape: "notch", blurb: "Ask a question, choose a path." },
  sound: { label: "Music", color: "rgb(var(--coral))", shape: "wave", blurb: "Notes, rests, drums and instruments." },
  voice: { label: "Voice", color: "rgb(var(--sky))", shape: "bubble", blurb: "Make the speaker talk." },
  data: { label: "Variables", color: "rgb(var(--leaf))", shape: "square", blurb: "Boxes that remember numbers." },
  functions: { label: "Functions", color: "rgb(var(--rose))", shape: "star", blurb: "Name a routine, reuse it anywhere." },
};

export const CONDITIONS = ["path_ahead", "path_left", "path_right", "wall_ahead", "on_gem", "at_goal"] as const;
export type Condition = (typeof CONDITIONS)[number];
const COND_TEXT: Record<Condition, string> = {
  path_ahead: "path ahead",
  path_left: "path to the left",
  path_right: "path to the right",
  wall_ahead: "wall ahead",
  on_gem: "on a gem",
  at_goal: "at the goal",
};
export const condText = (c: ParamValue) => COND_TEXT[c as Condition] ?? String(c);

export const NOTES = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5"] as const;
export const NOTE_NAMES: Record<string, string> = {
  C4: "Do (C)", D4: "Re (D)", E4: "Mi (E)", F4: "Fa (F)", G4: "Sol (G)", A4: "La (A)", B4: "Ti (B)", C5: "High Do (C)", D5: "High Re (D)", E5: "High Mi (E)",
};
const beatsText = (b: ParamValue) => (b === 0.5 ? "half beat" : b === 1 ? "1 beat" : `${b} beats`);

export const PHRASES = ["Hello!", "Blast off!", "Fizz", "Buzz", "FizzBuzz", "Small", "Big", "Done!", "Beep", "Goal!", "Yes", "No"] as const;
export const VARS = ["A", "B"] as const;
export const FUNCS = ["Dance", "Climb", "Chorus", "Spin"] as const;

const nums = (a: number, b: number, step = 1) => {
  const out: number[] = [];
  for (let i = a; i <= b; i += step) out.push(i);
  return out;
};

export const BLOCKS: Record<BlockId, BlockDef> = {
  forward: { id: "forward", name: "Forward", category: "motion", structure: "cmd", key: "f", feel: "Arrow ridge pointing away from you.", speak: () => "Move forward" },
  turn_left: { id: "turn_left", name: "Turn left", category: "motion", structure: "cmd", key: "l", feel: "Arrow ridge curling left.", speak: () => "Turn left" },
  turn_right: { id: "turn_right", name: "Turn right", category: "motion", structure: "cmd", key: "r", feel: "Arrow ridge curling right.", speak: () => "Turn right" },
  collect: { id: "collect", name: "Collect", category: "motion", structure: "cmd", key: "c", feel: "Small raised diamond.", speak: () => "Collect gem" },

  repeat: {
    id: "repeat", name: "Repeat", category: "control", structure: "open", key: "p", feel: "Circular ridge with a number dial.",
    params: [{ key: "n", label: "times", options: nums(2, 12), default: 3 }],
    speak: (p) => `Repeat ${p.n} times`,
  },
  repeat_until: {
    id: "repeat_until", name: "Repeat until", category: "control", structure: "open", key: "u", feel: "Circular ridge with a notch.",
    params: [{ key: "cond", label: "until", options: [...CONDITIONS], default: "at_goal", format: condText }],
    speak: (p) => `Repeat until ${condText(p.cond)}`,
  },
  while: {
    id: "while", name: "While", category: "control", structure: "open", key: "w", feel: "Circular ridge with two notches.",
    params: [{ key: "cond", label: "while", options: [...CONDITIONS], default: "path_ahead", format: condText }],
    speak: (p) => `While ${condText(p.cond)}`,
  },
  wait: {
    id: "wait", name: "Wait", category: "control", structure: "cmd", feel: "Smooth hourglass dimple.",
    params: [{ key: "s", label: "seconds", options: [0.5, 1, 2], default: 1 }],
    speak: (p) => `Wait ${p.s} ${p.s === 1 ? "second" : "seconds"}`,
  },
  end: { id: "end", name: "End", category: "control", structure: "close", key: "e", feel: "Flat bar that closes a bracket.", speak: () => "End" },

  if: {
    id: "if", name: "If", category: "logic", structure: "open", key: "i", feel: "Angular notch on the left edge.",
    params: [{ key: "cond", label: "if", options: [...CONDITIONS], default: "path_ahead", format: condText }],
    speak: (p) => `If ${condText(p.cond)}`,
  },
  if_compare: {
    id: "if_compare", name: "If", category: "logic", structure: "open", feel: "Angular notch with a square hole.",
    params: [
      { key: "v", label: "box", options: [...VARS], default: "A" },
      { key: "op", label: "is", options: [">", "<", "="], default: ">", format: (o) => (o === ">" ? "greater than" : o === "<" ? "less than" : "equal to") },
      { key: "n", label: "number", options: nums(0, 20), default: 3 },
    ],
    speak: (p) => `If ${p.v} is ${p.op === ">" ? "greater than" : p.op === "<" ? "less than" : "equal to"} ${p.n}`,
  },
  if_divisible: {
    id: "if_divisible", name: "If divisible", category: "logic", structure: "open", feel: "Angular notch with a slash.",
    params: [
      { key: "v", label: "box", options: [...VARS], default: "A" },
      { key: "n", label: "by", options: nums(2, 15), default: 3 },
    ],
    speak: (p) => `If ${p.v} divides evenly by ${p.n}`,
  },
  else: { id: "else", name: "Else", category: "logic", structure: "mid", key: "x", feel: "Notch on both edges.", speak: () => "Else" },

  play_note: {
    id: "play_note", name: "Play", category: "sound", structure: "cmd", key: "n", feel: "Wave ridge with a pitch slider.",
    params: [
      { key: "note", label: "note", options: [...NOTES], default: "C4", format: (n) => NOTE_NAMES[n as string] ?? String(n) },
      { key: "beats", label: "for", options: [0.5, 1, 2], default: 1, format: beatsText },
    ],
    speak: (p) => `Play ${NOTE_NAMES[p.note as string] ?? p.note} for ${beatsText(p.beats)}`,
  },
  rest: {
    id: "rest", name: "Rest", category: "sound", structure: "cmd", feel: "Flat wave, no ridge.",
    params: [{ key: "beats", label: "for", options: [0.5, 1, 2], default: 1, format: beatsText }],
    speak: (p) => `Rest for ${beatsText(p.beats)}`,
  },
  drum: {
    id: "drum", name: "Drum", category: "sound", structure: "cmd", key: "d", feel: "Round drum-skin dimple.",
    params: [{ key: "kind", label: "sound", options: ["kick", "snare", "hat", "clap"], default: "kick" }],
    speak: (p) => `Drum ${p.kind}`,
  },
  instrument: {
    id: "instrument", name: "Instrument", category: "sound", structure: "cmd", feel: "Wave ridge with a turning key.",
    params: [{ key: "inst", label: "", options: ["piano", "marimba", "flute", "synth"], default: "marimba" }],
    speak: (p) => `Use the ${p.inst}`,
  },

  say: {
    id: "say", name: "Say", category: "voice", structure: "cmd", key: "s", feel: "Speech-bubble bump.",
    params: [{ key: "text", label: "", options: [...PHRASES], default: "Hello!" }],
    speak: (p) => `Say ${p.text}`,
  },
  say_var: {
    id: "say_var", name: "Say box", category: "voice", structure: "cmd", feel: "Speech bubble with a square hole.",
    params: [{ key: "v", label: "", options: [...VARS], default: "A" }],
    speak: (p) => `Say the number in box ${p.v}`,
  },

  set_var: {
    id: "set_var", name: "Set", category: "data", structure: "cmd", feel: "Square hole, smooth rim.",
    params: [
      { key: "v", label: "box", options: [...VARS], default: "A" },
      { key: "n", label: "to", options: nums(0, 20), default: 0 },
    ],
    speak: (p) => `Set box ${p.v} to ${p.n}`,
  },
  change_var: {
    id: "change_var", name: "Change", category: "data", structure: "cmd", feel: "Square hole with a plus-minus groove.",
    params: [
      { key: "v", label: "box", options: [...VARS], default: "A" },
      { key: "n", label: "by", options: [-5, -3, -2, -1, 1, 2, 3, 5, 10], default: 1, format: (n) => (Number(n) > 0 ? `+${n}` : String(n)) },
    ],
    speak: (p) => `Change box ${p.v} by ${p.n}`,
  },

  define: {
    id: "define", name: "Define", category: "functions", structure: "open", feel: "Star with a raised border.",
    params: [{ key: "name", label: "", options: [...FUNCS], default: "Dance" }],
    speak: (p) => `Define ${p.name}`,
  },
  call: {
    id: "call", name: "Do", category: "functions", structure: "cmd", feel: "Flat star.",
    params: [{ key: "name", label: "", options: [...FUNCS], default: "Dance" }],
    speak: (p) => `Do ${p.name}`,
  },
};

export interface Inst {
  uid: string;
  type: BlockId;
  params: Record<string, ParamValue>;
  locked?: boolean;
}

let seq = 0;
export const uid = () => `b${Date.now().toString(36)}${(seq++).toString(36)}`;

export function makeInst(type: BlockId, params: Record<string, ParamValue> = {}): Inst {
  const def = BLOCKS[type];
  const p: Record<string, ParamValue> = {};
  for (const pd of def.params ?? []) p[pd.key] = params[pd.key] ?? pd.default;
  return { uid: uid(), type, params: p };
}

/** Compact authoring syntax used by the curriculum: "repeat:4", "play_note:E4:2", "if:on_gem". */
export function fromSpec(spec: string): Inst {
  const [type, ...vals] = spec.split(":") as [BlockId, ...string[]];
  const def = BLOCKS[type];
  if (!def) throw new Error(`Unknown block "${type}"`);
  const params: Record<string, ParamValue> = {};
  (def.params ?? []).forEach((pd, i) => {
    if (vals[i] === undefined) return;
    params[pd.key] = typeof pd.default === "number" ? Number(vals[i]) : pd.options.includes(vals[i]) ? vals[i] : vals[i].replace(/_/g, " ");
  });
  return makeInst(type, params);
}

export const fromSpecs = (s: string) => s.trim().split(/\s+/).filter(Boolean).map(fromSpec);

export function paramText(def: BlockDef, key: string, v: ParamValue) {
  const pd = def.params?.find((p) => p.key === key);
  return pd?.format ? pd.format(v) : String(v);
}

/** The short label printed on a tile, e.g. "Repeat 4", "If on a gem". */
export function tileLabel(inst: Inst): string {
  const def = BLOCKS[inst.type];
  const p = inst.params;
  switch (inst.type) {
    case "repeat": return `Repeat ${p.n}`;
    case "repeat_until": return `Until ${condText(p.cond)}`;
    case "while": return `While ${condText(p.cond)}`;
    case "if": return `If ${condText(p.cond)}`;
    case "if_compare": return `If ${p.v} ${p.op} ${p.n}`;
    case "if_divisible": return `If ${p.v} ÷ ${p.n}`;
    case "play_note": return `${String(p.note).replace(/\d/, "")} · ${p.beats === 0.5 ? "½" : p.beats}`;
    case "rest": return `Rest ${p.beats === 0.5 ? "½" : p.beats}`;
    case "drum": return `Drum ${p.kind}`;
    case "instrument": return String(p.inst);
    case "say": return `Say “${p.text}”`;
    case "say_var": return `Say ${p.v}`;
    case "set_var": return `${p.v} = ${p.n}`;
    case "change_var": return `${p.v} ${Number(p.n) >= 0 ? "+" : "−"} ${Math.abs(Number(p.n))}`;
    case "define": return `Define ${p.name}`;
    case "call": return `Do ${p.name}`;
    case "wait": return `Wait ${p.s}s`;
    default: return def.name;
  }
}
