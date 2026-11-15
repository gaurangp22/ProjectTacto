import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export async function postJSON<T = unknown>(url: string, body: unknown): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({ ok: false, error: "Unexpected response" }));
    return r.ok ? j : { ok: false, error: j.error ?? `Request failed (${r.status})` };
  } catch {
    return { ok: false, error: "You seem to be offline. Please try again." };
  }
}

/** Grade-1 (uncontracted) Braille, enough for labels like "Repeat 4" or "Turn left". */
const BRAILLE: Record<string, string> = {
  a: "⠁", b: "⠃", c: "⠉", d: "⠙", e: "⠑", f: "⠋", g: "⠛", h: "⠓", i: "⠊", j: "⠚",
  k: "⠅", l: "⠇", m: "⠍", n: "⠝", o: "⠕", p: "⠏", q: "⠟", r: "⠗", s: "⠎", t: "⠞",
  u: "⠥", v: "⠧", w: "⠺", x: "⠭", y: "⠽", z: "⠵", " ": "⠀", ".": "⠲", ",": "⠂", "!": "⠖",
  "?": "⠦", "-": "⠤", "'": "⠄", ">": "⠕⠕", "<": "⠪⠪", "=": "⠶",
};
const DIGIT = "⠚⠁⠃⠉⠙⠑⠋⠛⠓⠊"; // 0-9 share a–j cells after the number sign

export function toBraille(text: string): string {
  let out = "";
  let inNumber = false;
  for (const ch of text.toLowerCase()) {
    if (ch >= "0" && ch <= "9") {
      if (!inNumber) out += "⠼";
      out += DIGIT[+ch];
      inNumber = true;
      continue;
    }
    inNumber = false;
    out += BRAILLE[ch] ?? "";
  }
  return out;
}
