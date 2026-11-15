import { useSyncExternalStore } from "react";
import type { ProgressRow } from "@shared/api";

/**
 * Lesson progress: local-first (works offline, no account), synced to Turso through
 * /api/progress under an anonymous random learner id.
 */
const KEY = "tacto.progress.v1";
const ID_KEY = "tacto.learner";
type Store = Record<string, { stars: number; blocks?: number }>;

const read = (): Store => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
};
let store: Store = typeof window === "undefined" ? {} : read();
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

export function learnerId(): string {
  try {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
      localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    return "anonymous-learner-0000";
  }
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* private mode */
  }
  emit();
}

export function recordResult(lessonId: string, stars: number, blocks: number) {
  const prev = store[lessonId];
  if (prev && prev.stars >= stars && (prev.blocks ?? Infinity) <= blocks) return;
  store = { ...store, [lessonId]: { stars: Math.max(prev?.stars ?? 0, stars), blocks: Math.min(prev?.blocks ?? Infinity, blocks) } };
  persist();
  void fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ learnerId: learnerId(), lessonId, stars, blocks }),
    keepalive: true,
  }).catch(() => {});
}

/** Pulls server progress (e.g. after clearing local storage on the same device id). */
export async function syncFromServer() {
  try {
    const r = await fetch(`/api/progress/${learnerId()}`);
    if (!r.ok) return;
    const j = (await r.json()) as { data?: ProgressRow[] };
    let changed = false;
    for (const row of j.data ?? []) {
      const cur = store[row.lessonId];
      if (!cur || cur.stars < row.stars) {
        store = { ...store, [row.lessonId]: { stars: row.stars, blocks: row.bestBlocks ?? undefined } };
        changed = true;
      }
    }
    if (changed) persist();
  } catch {
    /* offline is fine */
  }
}

export function resetProgress() {
  store = {};
  persist();
}

export const useProgress = () =>
  useSyncExternalStore(
    (f) => (subs.add(f), () => subs.delete(f)),
    () => store,
    () => store,
  );

/* Settings (voice, speed, theme…) */
export interface Settings {
  narrate: boolean;
  speechRate: number;
  speed: number; // 0.5 – 3
  night: boolean;
  eyesFree: boolean;
  bigText: boolean;
  volume: number;
  voiceURI: string | null;
}
const SKEY = "tacto.settings.v1";
const DEFAULTS: Settings = { narrate: true, speechRate: 1, speed: 1, night: false, eyesFree: false, bigText: false, volume: 0.7, voiceURI: null };
export function loadSettings(): Settings {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SKEY) ?? "{}") };
  } catch {
    return DEFAULTS;
  }
}
export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(SKEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}
