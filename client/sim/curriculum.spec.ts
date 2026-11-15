import { describe, expect, it } from "vitest";
import { BLOCKS, fromSpecs } from "./blocks";
import { LESSONS } from "./curriculum";
import { checkGrid, evaluate, target } from "./evaluate";
import { parse } from "./parser";
import { initState, parseMap, runHeadless } from "./runtime";
import { toBraille } from "@/lib/utils";

describe("curriculum", () => {
  it("has unique ids and at least 40 lessons", () => {
    const ids = LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(40);
  });

  for (const lesson of LESSONS) {
    describe(lesson.id, () => {
      const sol = fromSpecs(lesson.solution);

      it("solution only uses palette blocks", () => {
        for (const t of sol) expect(lesson.palette, `${t.type} not in palette`).toContain(t.type);
      });

      it("solution parses", () => {
        expect(parse(sol).error).toBeUndefined();
      });

      if (lesson.world === "grid" && !lesson.sandbox) {
        lesson.maps!.forEach((rows, i) => {
          it(`solution solves map variant ${i + 1}`, () => {
            expect(checkGrid(rows, sol)).toBeNull();
          });
        });
      } else if (lesson.world !== "grid") {
        it("solution produces output", () => {
          const t = target(lesson);
          expect(t.played.length + t.said.length).toBeGreaterThan(0);
        });
      }

      it("solution earns three stars", () => {
        const parsed = parse(sol);
        const s = initState(lesson.maps ? parseMap(lesson.maps[0]) : undefined);
        const r = runHeadless(parsed.program!, s);
        const v = evaluate(lesson, sol, s, r.error);
        expect(v.message).toBeTruthy();
        expect(v.success).toBe(true);
        expect(v.stars).toBe(3);
      });

      if (lesson.starter) {
        it("starter program is actually buggy", () => {
          const st = fromSpecs(lesson.starter!);
          const parsed = parse(st);
          if (!parsed.program) return; // a syntax bug counts
          const s = initState(lesson.maps ? parseMap(lesson.maps[0]) : undefined);
          const r = runHeadless(parsed.program, s);
          expect(evaluate(lesson, st, s, r.error).success).toBe(false);
        });
      }
    });
  }
});

describe("parser", () => {
  it("reports an unclosed bracket at the opener", () => {
    const r = parse(fromSpecs("forward repeat:3 forward"));
    expect(r.error?.index).toBe(1);
  });
  it("rejects stray End and Else", () => {
    expect(parse(fromSpecs("end")).error).toBeDefined();
    expect(parse(fromSpecs("repeat:2 else end")).error).toBeDefined();
  });
  it("computes nesting depth", () => {
    expect(parse(fromSpecs("repeat:2 if:on_gem collect else forward end end")).depths).toEqual([0, 1, 2, 1, 2, 1, 0]);
  });
  it("needs a definition before Do", () => {
    expect(parse(fromSpecs("call:Dance")).error?.message).toMatch(/Define Dance/);
  });
});

describe("runtime", () => {
  it("stops infinite loops", () => {
    const p = parse(fromSpecs("repeat_until:at_goal turn_left end")).program!;
    const r = runHeadless(p, initState(parseMap([">.G"])));
    expect(r.error).toMatch(/loop forever/);
  });
  it("bumps into walls", () => {
    const p = parse(fromSpecs("forward forward")).program!;
    expect(runHeadless(p, initState(parseMap([">."]))).error).toMatch(/Bump/);
  });
  it("every block can speak", () => {
    for (const b of Object.values(BLOCKS)) expect(b.speak(Object.fromEntries((b.params ?? []).map((p) => [p.key, p.default])))).toBeTruthy();
  });
});

describe("braille", () => {
  it("encodes letters and numbers", () => {
    expect(toBraille("ab 12")).toBe("⠁⠃⠀⠼⠁⠃");
  });
});

import { LESSON_PEDAGOGY, UNIT_PEDAGOGY } from "../../curriculum/pedagogy";
import { UNITS } from "./curriculum";
describe("pedagogy", () => {
  it("covers every unit and lesson", () => {
    for (const u of UNITS) expect(UNIT_PEDAGOGY[u.id], u.id).toBeDefined();
    for (const l of LESSONS) expect(LESSON_PEDAGOGY[l.id], l.id).toBeDefined();
  });
});

describe("evaluate", () => {
  it("catches programs that only solve the visible layout", () => {
    const l = LESSONS.find((x) => x.id === "if-2")!;
    const tiles = fromSpecs("forward forward forward turn_right forward forward");
    const s = initState(parseMap(l.maps![0]));
    const r = runHeadless(parse(tiles).program!, s);
    const v = evaluate(l, tiles, s, r.error, 0);
    expect(v.success).toBe(false);
    expect(v.failedVariant).toBe(1);
  });
  it("asks for the lesson's concept when a workaround is used", () => {
    const l = LESSONS.find((x) => x.id === "if-1")!;
    const tiles = fromSpecs("repeat:7 forward collect end");
    const s = initState(parseMap(l.maps![0]));
    const r = runHeadless(parse(tiles).program!, s);
    expect(evaluate(l, tiles, s, r.error).message).toMatch(/If tile/);
  });
});
