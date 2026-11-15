import { BLOCKS, fromSpecs, type Inst } from "./blocks";
import type { Lesson } from "./curriculum";
import { parse } from "./parser";
import { initState, parseMap, runHeadless, type Played, type SimState } from "./runtime";

export interface Verdict {
  success: boolean;
  stars: 0 | 1 | 2 | 3;
  message: string;
  /** For grid lessons: the map variant that failed, so the UI can switch to it. */
  failedVariant?: number;
}

const trimRests = (p: Played[]) => {
  const out = p.slice();
  while (out.length && out[out.length - 1].kind === "rest") out.pop();
  return out;
};
const sameMusic = (a: Played[], b: Played[]) => JSON.stringify(trimRests(a)) === JSON.stringify(trimRests(b));

const targetCache = new Map<string, SimState>();
/** Runs the reference solution to produce the target melody / speech. */
export function target(lesson: Lesson): SimState {
  if (!targetCache.has(lesson.id)) {
    const parsed = parse(fromSpecs(lesson.solution));
    if (!parsed.program) throw new Error(`Solution for ${lesson.id} does not parse: ${parsed.error?.message}`);
    const s = initState();
    runHeadless(parsed.program, s);
    targetCache.set(lesson.id, s);
  }
  return targetCache.get(lesson.id)!;
}

export const par = (l: Lesson) => l.par ?? fromSpecs(l.solution).length;

function starsFor(l: Lesson, tiles: Inst[]): 1 | 2 | 3 {
  if (l.sandbox) return 3;
  const n = tiles.length;
  const p = par(l);
  return n <= p ? 3 : n <= p + 2 ? 2 : 1;
}

/** Runs a program on one grid variant and returns a reason string if it failed. */
export function checkGrid(rows: string[], tiles: Inst[]): string | null {
  const parsed = parse(tiles);
  if (!parsed.program) return parsed.error!.message;
  const map = parseMap(rows);
  const s = initState(map);
  const r = runHeadless(parsed.program, s);
  if (r.error) return r.error;
  const g = s.grid!;
  if (g.gems.size) return `Pip left ${g.gems.size === 1 ? "a gem" : `${g.gems.size} gems`} behind.`;
  if (map.goal && (g.x !== map.goal.x || g.y !== map.goal.y)) return "Pip stopped before reaching the flag.";
  return null;
}

export function evaluate(lesson: Lesson, tiles: Inst[], state: SimState, runtimeError?: string, shownVariant = 0): Verdict {
  if (runtimeError) return { success: false, stars: 0, message: runtimeError };
  if (!tiles.length) return { success: false, stars: 0, message: "The board is empty. Add some tiles first." };

  if (lesson.sandbox) return { success: true, stars: 3, message: "Nice! Your project ran without a single error." };

  if (lesson.world === "grid") {
    const maps = lesson.maps!;
    // check the visible variant first (its state is already computed), then the hidden ones
    const g = state.grid!;
    const shown = maps[shownVariant];
    const m = parseMap(shown);
    if (g.gems.size) return { success: false, stars: 0, message: `So close! Pip left ${g.gems.size === 1 ? "a gem" : `${g.gems.size} gems`} behind.` };
    if (m.goal && (g.x !== m.goal.x || g.y !== m.goal.y)) return { success: false, stars: 0, message: "Pip stopped before reaching the flag. Keep going!" };
    for (let i = 0; i < maps.length; i++) {
      if (i === shownVariant) continue;
      const why = checkGrid(maps[i], tiles);
      if (why)
        return {
          success: false,
          stars: 0,
          failedVariant: i,
          message: `That worked here, but the path changes! On another layout: ${why} Try making your program check its surroundings.`,
        };
    }
  } else if (lesson.world === "music") {
    if (!sameMusic(state.played, target(lesson).played))
      return { success: false, stars: 0, message: "Not quite the tune. Press Listen to hear the target again, then compare it with yours." };
  } else {
    const want = target(lesson).said;
    const got = state.said;
    if (JSON.stringify(want) !== JSON.stringify(got)) {
      const i = want.findIndex((w, k) => got[k] !== w);
      const at = i === -1 ? got.length : i;
      return {
        success: false,
        stars: 0,
        message:
          at < want.length
            ? `Line ${at + 1} should be “${want[at]}” but the speaker said ${got[at] ? `“${got[at]}”` : "nothing"}.`
            : `The speaker said too much: “${got[at]}” wasn't expected.`,
      };
    }
  }

  const missing = (lesson.require ?? []).filter((b) => !tiles.some((t) => t.type === b));
  if (missing.length)
    return { success: false, stars: 0, message: `It works! Now try it using a ${BLOCKS[missing[0]].name} tile. That's the skill this lesson is about.` };

  const stars = starsFor(lesson, tiles);
  const p = par(lesson);
  return {
    success: true,
    stars,
    message: stars === 3 ? "Perfect! Three stars." : `Solved! Can you do it in ${p} tiles for three stars?`,
  };
}
