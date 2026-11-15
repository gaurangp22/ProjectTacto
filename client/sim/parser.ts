import { BLOCKS, type Inst } from "./blocks";

export interface Node {
  inst: Inst;
  index: number; // position on the board (0-based)
  body?: Node[];
  elseBody?: Node[];
}

export interface ParseError {
  index: number;
  message: string;
}

export interface Program {
  main: Node[];
  funcs: Record<string, Node[]>;
}

/**
 * Turns the flat sequence of tiles into a tree. Errors are phrased for children and
 * point at the exact tile so the audio tutor can say "Tile 4: this Repeat has no End".
 */
export function parse(tiles: Inst[]): { program?: Program; error?: ParseError; depths: number[] } {
  type Frame = { node: Node; inElse: boolean; list: Node[] };
  const main: Node[] = [];
  const funcs: Record<string, Node[]> = {};
  const stack: Frame[] = [];
  const depths: number[] = [];
  let error: ParseError | undefined;

  const current = () => (stack.length ? stack[stack.length - 1].list : main);

  tiles.forEach((inst, index) => {
    const def = BLOCKS[inst.type];
    const node: Node = { inst, index };
    depths[index] = stack.length - (def.structure === "close" || def.structure === "mid" ? 1 : 0);
    if (error) return;

    switch (def.structure) {
      case "cmd":
        current().push(node);
        break;
      case "open": {
        if (inst.type === "define") {
          if (stack.length) {
            error = { index, message: `Tile ${index + 1}: “Define” has to sit on the outer edge of the board, not inside another bracket.` };
            return;
          }
          const name = String(inst.params.name);
          if (funcs[name]) {
            error = { index, message: `Tile ${index + 1}: ${name} is already defined. Each function needs its own name.` };
            return;
          }
        }
        node.body = [];
        if (inst.type !== "define") current().push(node);
        stack.push({ node, inElse: false, list: node.body });
        break;
      }
      case "mid": {
        const top = stack[stack.length - 1];
        const t = top?.node.inst.type;
        if (!top || !(t === "if" || t === "if_compare" || t === "if_divisible")) {
          error = { index, message: `Tile ${index + 1}: “Else” only works inside an If bracket.` };
          return;
        }
        if (top.inElse) {
          error = { index, message: `Tile ${index + 1}: this If already has an Else.` };
          return;
        }
        top.inElse = true;
        top.node.elseBody = [];
        top.list = top.node.elseBody;
        break;
      }
      case "close": {
        const top = stack.pop();
        if (!top) {
          error = { index, message: `Tile ${index + 1}: this End has nothing to close. Remove it, or add a Repeat or If before it.` };
          return;
        }
        if (top.node.inst.type === "define") funcs[String(top.node.inst.params.name)] = top.node.body!;
        break;
      }
    }
  });

  if (!error && stack.length) {
    const open = stack[stack.length - 1].node;
    error = {
      index: open.index,
      message: `Tile ${open.index + 1}: this ${BLOCKS[open.inst.type].name} bracket is never closed. Add an End tile after the blocks it should hold.`,
    };
  }
  if (!error) {
    const check = (nodes: Node[]): ParseError | undefined => {
      for (const n of nodes) {
        if (n.inst.type === "call" && !funcs[String(n.inst.params.name)])
          return { index: n.index, message: `Tile ${n.index + 1}: there is no “Define ${n.inst.params.name}” on the board yet.` };
        const e = (n.body && check(n.body)) || (n.elseBody && check(n.elseBody));
        if (e) return e;
      }
    };
    error = check(main) ?? Object.values(funcs).map(check).find(Boolean);
  }
  return error ? { error, depths } : { program: { main, funcs }, depths };
}

/** Number of tiles, the "cost" used for star ratings. */
export const countBlocks = (tiles: Inst[]) => tiles.length;
