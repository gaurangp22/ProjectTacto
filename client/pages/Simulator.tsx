import { DndContext, DragOverlay, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Footprints, Keyboard, ListTree, Map as MapIcon, Play, RotateCcw, Settings2, Square, StepForward, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BLOCKS, fromSpecs, makeInst, type BlockId, type Inst, type ParamValue } from "@/sim/blocks";
import { LESSONS, lessonById, nextLesson, unitOf } from "@/sim/curriculum";
import { evaluate, target } from "@/sim/evaluate";
import { parse } from "@/sim/parser";
import { describeProgram, initState, parseMap, run, type SimState, type Step } from "@/sim/runtime";
import { audio, buzz, drum, playNote, setPreferredVoice, setSpeechRate, setVolume, sfx, speak, stopSpeech } from "@/sim/audio";
import { loadSettings, recordResult, saveSettings, syncFromServer, useProgress, type Settings } from "@/sim/progress";
import { Board, HardwarePreview, Palette } from "@/sim/ui/Board";
import { LessonMap, MissionPanel, ResultDialog, SettingsPanel, SHORTCUTS, Stars } from "@/sim/ui/Panels";
import { GridStage, MusicStage, VoiceStage } from "@/sim/ui/Stages";
import { Tile } from "@/sim/ui/Tile";
import { cn } from "@/lib/utils";

const SECONDS_PER_BEAT = 0.5;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const draftKey = (id: string) => `tacto.draft.${id}`;

function loadDraft(id: string): Inst[] | null {
  try {
    const raw = localStorage.getItem(draftKey(id));
    if (!raw) return null;
    const arr = JSON.parse(raw) as { type: BlockId; params: Record<string, ParamValue> }[];
    return arr.filter((t) => BLOCKS[t.type]).map((t) => makeInst(t.type, t.params));
  } catch {
    return null;
  }
}

type View = "build" | "stage" | "mission";

export default function Simulator() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const lesson = lessonById(lessonId) ?? LESSONS[0];
  const unit = unitOf(lesson.id);
  const progress = useProgress();

  const [settings, setSettingsState] = useState<Settings>(loadSettings);
  const setSettings = (p: Partial<Settings>) =>
    setSettingsState((s) => {
      const n = { ...s, ...p };
      saveSettings(n);
      return n;
    });

  const [tiles, setTiles] = useState<Inst[]>([]);
  const [sel, setSel] = useState(-1);
  const [variant, setVariant] = useState(0);
  const [sim, setSim] = useState<SimState>(() => initState());
  const [, force] = useState(0);
  const [running, setRunning] = useState<false | "run" | "step">(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ tone: "info" | "error" | "ok"; text: string } | null>(null);
  const [narration, setNarration] = useState("");
  const [mood, setMood] = useState<"idle" | "happy" | "bump">("idle");
  const [result, setResult] = useState<{ stars: number; message: string } | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [view, setView] = useState<View>("build");
  const [dragType, setDragType] = useState<BlockId | null>(null);

  const genRef = useRef<Generator<Step, void, void> | null>(null);
  const runId = useRef(0);
  const boardRef = useRef<HTMLUListElement>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const parsed = useMemo(() => parse(tiles), [tiles]);
  const freshState = useCallback(() => initState(lesson.maps ? parseMap(lesson.maps[variant] ?? lesson.maps[0]) : undefined), [lesson, variant]);

  /* settings side-effects */
  useEffect(() => {
    setSpeechRate(settings.speechRate);
  }, [settings.speechRate]);
  useEffect(() => {
    setPreferredVoice(settings.voiceURI);
  }, [settings.voiceURI]);
  useEffect(() => {
    document.documentElement.style.fontSize = settings.bigText ? "18px" : "";
    return () => void (document.documentElement.style.fontSize = "");
  }, [settings.bigText]);
  useEffect(() => void syncFromServer(), []);

  /* load lesson */
  useEffect(() => {
    stop();
    setVariant(0);
    setTiles(loadDraft(lesson.id) ?? (lesson.starter ? fromSpecs(lesson.starter) : []));
    setSel(-1);
    setFeedback(null);
    setResult(null);
    setErrorIndex(null);
    setNarration(`${lesson.title}. ${lesson.brief}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  useEffect(() => {
    if (!running) setSim(freshState());
  }, [freshState, running]);

  /* persist draft */
  useEffect(() => {
    try {
      localStorage.setItem(draftKey(lesson.id), JSON.stringify(tiles.map((t) => ({ type: t.type, params: t.params }))));
    } catch {
      /* ignore */
    }
  }, [tiles, lesson.id]);

  const say = useCallback((text: string, interrupt = true) => {
    setNarration(text);
    if (settingsRef.current.narrate) return speak(text, interrupt);
    return Promise.resolve();
  }, []);

  /* ─────────────── editing ─────────────── */

  const edit = (fn: (t: Inst[]) => Inst[]) => {
    if (running) stop();
    setErrorIndex(null);
    setFeedback(null);
    setTiles(fn);
  };

  const addTile = (type: BlockId, at?: number) => {
    if (!lesson.palette.includes(type)) return;
    audio();
    const inst = makeInst(type);
    const i = at ?? (sel >= 0 ? sel + 1 : tiles.length);
    edit((t) => [...t.slice(0, i), inst, ...t.slice(i)]);
    setSel(i);
    sfx("place");
    buzz(12);
    void say(`Placed ${BLOCKS[type].speak(inst.params)}, tile ${i + 1}`);
  };

  const removeTile = (i: number) => {
    const t = tiles[i];
    if (!t) return;
    edit((ts) => ts.filter((_, k) => k !== i));
    setSel(Math.min(i, tiles.length - 2));
    sfx("remove");
    void say(`Removed ${BLOCKS[t.type].name}`);
  };

  const setParam = (i: number, key: string, v: ParamValue) => {
    edit((ts) => ts.map((t, k) => (k === i ? { ...t, params: { ...t.params, [key]: v } } : t)));
    const t = tiles[i];
    if (t) void say(BLOCKS[t.type].speak({ ...t.params, [key]: v }));
    sfx("select");
  };

  const cycleParam = (i: number, dir: 1 | -1) => {
    const t = tiles[i];
    const pd = t && BLOCKS[t.type].params?.[0];
    if (!pd) return;
    const idx = pd.options.findIndex((o) => o === t.params[pd.key]);
    const next = pd.options[(idx + dir + pd.options.length) % pd.options.length];
    setParam(i, pd.key, next);
  };

  /* ─────────────── running ─────────────── */

  function stop() {
    runId.current++;
    genRef.current = null;
    stopSpeech();
    setRunning(false);
    setActiveIndex(null);
    setMood("idle");
  }

  const reset = () => {
    stop();
    setSim(freshState());
    setFeedback(null);
    setErrorIndex(null);
  };

  const playTarget = async () => {
    audio();
    const t = target(lesson);
    for (const p of t.played) {
      if (p.kind === "note") playNote(p.note, p.beats * SECONDS_PER_BEAT, t.instrument);
      if (p.kind === "drum") drum(p.drum);
      await wait((p.kind === "drum" ? 0.5 : p.beats) * SECONDS_PER_BEAT * 1000);
    }
  };

  const finish = async (state: SimState, error?: string, errIdx?: number) => {
    const v = evaluate(lesson, tiles, state, error, variant);
    setActiveIndex(null);
    if (v.success) {
      setMood("happy");
      sfx("win");
      buzz([30, 60, 30]);
      recordResult(lesson.id, v.stars, tiles.length);
      setFeedback({ tone: "ok", text: v.message });
      void speak(`Solved! ${v.message}`);
      setTimeout(() => setResult({ stars: v.stars, message: v.message }), 650);
    } else {
      setMood(error?.startsWith("Bump") ? "bump" : "idle");
      sfx("error");
      buzz([80, 40, 80]);
      if (errIdx != null) setErrorIndex(errIdx);
      setFeedback({ tone: "error", text: v.message });
      void speak(v.message);
      if (v.failedVariant != null) {
        const fv = v.failedVariant;
        setTimeout(() => {
          setVariant(fv);
          setFeedback({ tone: "info", text: `Here's the layout where it fails (${fv + 1} of ${lesson.maps!.length}). Press Run to watch.` });
        }, 2400);
      }
    }
  };

  /** Executes one step: updates the stage and plays its sound. Returns false when the program is over. */
  const advance = async (state: SimState, id: number): Promise<boolean> => {
    const g = genRef.current;
    if (!g) return false;
    const { value: step, done } = g.next();
    if (id !== runId.current) return false;
    if (done || !step) {
      genRef.current = null;
      setRunning(false);
      await finish(state);
      return false;
    }
    setActiveIndex(step.index);
    setSim({ ...state });
    force((n) => n + 1);
    setNarration(`Tile ${step.index + 1}: ${step.narration}`);

    const s = settingsRef.current;
    const pace = 1 / s.speed;
    const grid = state.grid;
    const pan = grid ? (grid.map.w > 1 ? (grid.x / (grid.map.w - 1)) * 1.6 - 0.8 : 0) : 0;
    if (step.sfx) sfx(step.sfx, pan);
    if (step.sfx === "step") buzz(8);
    if (step.sfx === "gem") buzz([20, 30, 20]);

    let ms = 480 * pace;
    if (step.note) {
      const n = step.note;
      if (n.kind === "note") playNote(n.note, n.beats * SECONDS_PER_BEAT * pace, step.instrument);
      if (n.kind === "drum") drum(n.drum);
      ms = (n.kind === "drum" ? 0.5 : n.beats) * SECONDS_PER_BEAT * 1000 * pace;
    }
    if (step.waitMs) ms = step.waitMs;
    if (step.say) await speak(step.say, false);
    else if (s.narrate && !step.note) await speak(step.narration, true);

    if (step.error) {
      genRef.current = null;
      setRunning(false);
      await finish(state, step.error, step.index);
      return false;
    }
    if (id === runId.current) await wait(ms);
    return id === runId.current;
  };

  const start = (mode: "run" | "step") => {
    audio();
    setVolume(settingsRef.current.volume);
    if (!tiles.length) {
      setFeedback({ tone: "error", text: "The board is empty. Add some tiles first." });
      void speak("The board is empty. Add some tiles first.");
      return null;
    }
    if (parsed.error || !parsed.program) {
      setErrorIndex(parsed.error!.index);
      setFeedback({ tone: "error", text: parsed.error!.message });
      sfx("error");
      void speak(parsed.error!.message);
      return null;
    }
    const state = freshState();
    setSim(state);
    setFeedback(null);
    setErrorIndex(null);
    setMood("idle");
    const id = ++runId.current;
    genRef.current = run(parsed.program, state);
    setRunning(mode);
    return { state, id };
  };

  const stateRef = useRef<{ state: SimState; id: number } | null>(null);

  const onRun = async () => {
    if (running === "run") return stop();
    const ctx = start("run");
    if (!ctx) return;
    stateRef.current = ctx;
    while (await advance(ctx.state, ctx.id));
  };

  const onStep = async () => {
    if (running === "run") return;
    if (!genRef.current || !stateRef.current) {
      const ctx = start("step");
      if (!ctx) return;
      stateRef.current = ctx;
    }
    await advance(stateRef.current!.state, stateRef.current!.id);
  };

  const readProgram = () => {
    if (!tiles.length) return say("The board is empty.");
    const lines = describeProgram(tiles, parsed.depths);
    return say(`${tiles.length} tiles. ${lines.join(". ")}`);
  };

  /* ─────────────── keyboard ─────────────── */

  const onBoardKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const k = e.key;
    const i = sel;
    if (k === "ArrowDown" || k === "ArrowUp") {
      e.preventDefault();
      const d = k === "ArrowDown" ? 1 : -1;
      if (e.altKey && i >= 0) {
        const j = i + d;
        if (j < 0 || j >= tiles.length) return;
        edit((t) => arrayMove(t, i, j));
        setSel(j);
        sfx("place");
        void say(`Moved to tile ${j + 1}`);
        return;
      }
      const j = Math.max(0, Math.min(tiles.length - 1, i + d));
      setSel(j);
      sfx("select");
      if (tiles[j]) void say(`Tile ${j + 1}${parsed.depths[j] ? `, inside` : ""}: ${BLOCKS[tiles[j].type].speak(tiles[j].params)}`);
    } else if (k === "ArrowLeft" || k === "ArrowRight") {
      e.preventDefault();
      if (i >= 0) cycleParam(i, k === "ArrowRight" ? 1 : -1);
    } else if (k === "Delete" || k === "Backspace") {
      e.preventDefault();
      if (i >= 0) removeTile(i);
    } else if (k === "Enter") {
      e.preventDefault();
      void onRun();
    } else if (k === "Escape") {
      stop();
      void say("Stopped");
    } else if (k === " ") {
      e.preventDefault();
      if (tiles[i]) void speak(`Tile ${i + 1}: ${BLOCKS[tiles[i].type].speak(tiles[i].params)}`);
    } else if (k === "?") {
      setHelpOpen((v) => !v);
    } else if (k.toLowerCase() === "a" && !e.ctrlKey && !e.metaKey) {
      void readProgram();
    } else if (k.toLowerCase() === "t" && !e.ctrlKey) {
      void onStep();
    } else if (k === "Home") {
      e.preventDefault();
      setSel(0);
    } else if (k === "End") {
      e.preventDefault();
      setSel(tiles.length - 1);
    } else if (!e.ctrlKey && !e.metaKey && !e.altKey && k.length === 1) {
      const type = lesson.palette.find((t) => BLOCKS[t].key === k.toLowerCase());
      if (type) {
        e.preventDefault();
        addTile(type);
      }
    }
  };

  useEffect(() => {
    if (sel >= 0) document.getElementById(`tile-${tiles[sel]?.uid}`)?.scrollIntoView({ block: "nearest" });
  }, [sel, tiles]);

  /* ─────────────── drag & drop ─────────────── */

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const onDragStart = (e: DragStartEvent) => {
    const id = String(e.active.id);
    setDragType(id.startsWith("pal:") ? (id.slice(4) as BlockId) : tiles.find((t) => t.uid === id)?.type ?? null);
  };
  const onDragEnd = (e: DragEndEvent) => {
    setDragType(null);
    const a = String(e.active.id);
    const o = e.over ? String(e.over.id) : null;
    if (!o) return;
    if (a.startsWith("pal:")) {
      const at = o === "board" ? tiles.length : tiles.findIndex((t) => t.uid === o);
      addTile(a.slice(4) as BlockId, at < 0 ? tiles.length : at);
      return;
    }
    const from = tiles.findIndex((t) => t.uid === a);
    const to = o === "board" ? tiles.length - 1 : tiles.findIndex((t) => t.uid === o);
    if (from >= 0 && to >= 0 && from !== to) {
      edit((t) => arrayMove(t, from, to));
      setSel(to);
      sfx("place");
    }
  };

  /* ─────────────── render ─────────────── */

  const best = progress[lesson.id]?.stars ?? 0;
  const next = nextLesson(lesson.id);
  const idx = LESSONS.findIndex((l) => l.id === lesson.id);
  const tgt = lesson.world !== "grid" && !lesson.sandbox ? target(lesson) : undefined;

  const stage =
    lesson.world === "grid" && sim.grid ? (
      <GridStage g={sim.grid} mood={mood} hidden={settings.eyesFree} />
    ) : lesson.world === "music" ? (
      <MusicStage s={sim} target={tgt?.played} onListen={playTarget} sandbox={lesson.sandbox} />
    ) : (
      <VoiceStage s={sim} expected={tgt?.said} sandbox={lesson.sandbox} />
    );

  return (
    <div className={cn("flex h-[100dvh] flex-col bg-paper text-ink", settings.night && "theme-night")}>
      {/* top bar */}
      <header className="relative z-30 flex h-16 shrink-0 items-center gap-2 border-b border-line bg-paper/90 px-3 backdrop-blur sm:gap-3 sm:px-5">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full hover:bg-paper-2" aria-label="Back to the TACTO website">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <button onClick={() => setMapOpen(true)} className="flex min-w-0 items-center gap-3 rounded-2xl px-2 py-1.5 text-left hover:bg-paper-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl font-display font-bold text-white" style={{ background: `rgb(var(--${unit.color}))` }}>
            {unit.n}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-3">
              {unit.title} · {idx + 1}/{LESSONS.length}
            </span>
            <span className="block truncate font-display text-base font-bold leading-tight sm:text-lg">{lesson.title}</span>
          </span>
          <Stars n={best} className="ml-1 hidden sm:inline-flex" />
        </button>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => setMapOpen(true)} className="btn-ghost hidden !px-4 !py-2.5 text-sm md:inline-flex">
            <MapIcon className="h-4 w-4" /> Lessons
          </button>
          <button onClick={() => setHelpOpen((v) => !v)} className="hidden h-10 w-10 place-items-center rounded-full border border-line hover:bg-paper-2 sm:grid" aria-label="Keyboard shortcuts">
            <Keyboard className="h-4 w-4" />
          </button>
          <div className="relative">
            <button onClick={() => setSettingsOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-line hover:bg-paper-2" aria-label="Settings" aria-expanded={settingsOpen}>
              <Settings2 className="h-4 w-4" />
            </button>
            {settingsOpen && <SettingsPanel s={settings} set={setSettings} onClose={() => setSettingsOpen(false)} />}
          </div>
        </div>
      </header>

      {/* mobile view switcher */}
      <div className="flex shrink-0 gap-1 border-b border-line p-2 lg:hidden" role="tablist">
        {(["mission", "build", "stage"] as View[]).map((v) => (
          <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={cn("flex-1 rounded-xl py-2 text-sm font-semibold capitalize", view === v ? "bg-ink text-paper" : "text-ink-2")}>
            {v === "build" ? "Build" : v === "stage" ? "Stage" : "Mission"}
          </button>
        ))}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setDragType(null)}>
        <div className="grid min-h-0 flex-1 lg:grid-cols-[210px_minmax(340px,1fr)_minmax(340px,0.95fr)] xl:grid-cols-[240px_minmax(400px,1fr)_minmax(400px,1fr)]">
          {/* palette */}
          <aside className={cn("min-h-0 overflow-y-auto border-line p-4 lg:block lg:border-r", view === "build" ? "block max-h-[34vh] border-b lg:max-h-none lg:border-b-0" : "hidden")}>
            <p className="mb-3 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-3">Tile drawer</p>
            <Palette palette={lesson.palette} onAdd={addTile} />
          </aside>

          {/* board */}
          <section aria-label="Program" className={cn("min-h-0 flex-col overflow-y-auto p-4 sm:p-5 lg:flex", view === "build" ? "flex" : "hidden")}>
            <div className="mb-3 flex items-center gap-2">
              <ListTree className="h-4 w-4 text-ink-3" />
              <h2 className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-3">Your program · {tiles.length} tiles</h2>
              <div className="ml-auto flex gap-1">
                <button onClick={() => void readProgram()} className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-paper-2">
                  Read aloud
                </button>
                <button
                  onClick={() => {
                    edit(() => (lesson.starter ? fromSpecs(lesson.starter) : []));
                    setSel(-1);
                    void say(lesson.starter ? "Board reset to the starter program" : "Board cleared");
                  }}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-2 hover:bg-paper-2"
                >
                  <Trash2 className="h-3.5 w-3.5" /> {lesson.starter ? "Reset" : "Clear"}
                </button>
              </div>
            </div>
            <Board
              ref={boardRef}
              tiles={tiles}
              depths={parsed.depths}
              sel={sel}
              activeIndex={activeIndex}
              errorIndex={errorIndex}
              onSelect={(i) => {
                setSel(i);
                boardRef.current?.focus();
              }}
              onRemove={removeTile}
              onParam={setParam}
              onKeyDown={onBoardKey}
            />
            <AnimatePresence>
              {helpOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="card mt-4 p-4">
                  <p className="mb-2 font-display font-bold">Keyboard: focus the board first</p>
                  <dl className="grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-[auto_1fr]">
                    {SHORTCUTS.map(([k, d]) => (
                      <div key={k} className="contents">
                        <dt>
                          <kbd className="rounded-md border border-line bg-paper-2 px-1.5 py-0.5 font-mono text-xs">{k}</kbd>
                        </dt>
                        <dd className="text-ink-2">{d}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="mt-auto shrink-0 pt-6">
              <HardwarePreview tiles={tiles} activeIndex={activeIndex} />
            </div>
          </section>

          {/* stage + mission */}
          <section aria-label="Stage and mission" className={cn("min-h-0 flex-col gap-4 overflow-y-auto border-line p-4 sm:p-5 lg:flex lg:border-l", view === "build" ? "hidden" : "flex")}>
            <div className={cn("flex-col gap-4 lg:flex", view === "stage" || view === "build" ? "flex" : "hidden lg:flex")}>
              <div className="card overflow-hidden">
                <div className="flex min-h-[48px] items-center justify-between gap-3 border-b border-line px-4 py-2">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-ink-3">
                    {lesson.world === "grid" ? "Grid world" : lesson.world === "music" ? "Music studio" : "Speaker"}
                    {sim.grid && sim.grid.map.gems.length > 0 && (
                      <span className="ml-3 normal-case tracking-normal text-ink-2">
                        {sim.grid.collected}/{sim.grid.map.gems.length} gems
                      </span>
                    )}
                  </p>
                {lesson.maps && lesson.maps.length > 1 && (
                  <div className="flex items-center gap-1" role="group" aria-label="Map layouts">
                    <span className="mr-1 text-xs text-ink-3">Layout</span>
                    {lesson.maps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => !running && setVariant(i)}
                        aria-pressed={variant === i}
                        aria-label={`Layout ${i + 1}`}
                        className={cn("h-7 w-7 rounded-full text-xs font-bold", variant === i ? "bg-ink text-paper" : "text-ink-2 hover:bg-paper-2")}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
                </div>
                <div className="relative">
                  <div className="dot-grid absolute inset-0 opacity-60" aria-hidden />
                  <div className="relative h-[clamp(240px,38vh,420px)]">{stage}</div>
                </div>
              </div>

              {/* controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => void onRun()} className={cn("btn flex-1 text-base sm:flex-none sm:px-8", running === "run" ? "bg-coral text-white" : "bg-teal text-white hover:-translate-y-0.5 hover:shadow-lift")}>
                  {running === "run" ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                  {running === "run" ? "Stop" : "Run"}
                </button>
                <button onClick={() => void onStep()} disabled={running === "run"} className="btn-ghost disabled:opacity-40">
                  <StepForward className="h-4 w-4" /> Step
                </button>
                <button onClick={reset} className="btn-ghost" aria-label="Reset the stage">
                  <RotateCcw className="h-4 w-4" />
                </button>
                <label className="ml-auto flex items-center gap-2 text-sm text-ink-3">
                  <Footprints className="h-4 w-4" />
                  <span className="sr-only">Run speed</span>
                  <input type="range" min={0.5} max={3} step={0.25} value={settings.speed} onChange={(e) => setSettings({ speed: Number(e.target.value) })} className="w-24 accent-[rgb(var(--ink))]" />
                </label>
              </div>

              <AnimatePresence mode="popLayout">
                {feedback && (
                  <motion.div
                    key={feedback.text}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="status"
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-sm font-medium",
                      feedback.tone === "error" && "border-coral/40 bg-coral/10 text-ink",
                      feedback.tone === "ok" && "border-teal/40 bg-teal/10 text-ink",
                      feedback.tone === "info" && "border-sky/40 bg-sky/10 text-ink",
                    )}
                  >
                    {feedback.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={cn(view === "mission" ? "block" : "hidden lg:block")}>
              <MissionPanel
                key={lesson.id}
                lesson={lesson}
                unit={unit}
                onSpeak={(t) => void speak(t)}
              />
            </div>
          </section>
        </div>
        {view === "build" && (
          <div className="flex shrink-0 gap-2 border-t border-line bg-paper p-3 lg:hidden">
            <button
              onClick={() => {
                setView("stage");
                void onRun();
              }}
              className="btn flex-1 bg-teal text-white"
            >
              <Play className="h-4 w-4 fill-current" /> Run
            </button>
            <button
              onClick={() => {
                setView("stage");
                void onStep();
              }}
              className="btn-ghost"
            >
              <StepForward className="h-4 w-4" /> Step
            </button>
          </div>
        )}
        <DragOverlay dropAnimation={null}>{dragType && <Tile type={dragType} size="md" className="w-56 rotate-2 shadow-lift" />}</DragOverlay>
      </DndContext>

      {/* live region for screen readers */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {narration}
      </p>

      <LessonMap open={mapOpen} onClose={() => setMapOpen(false)} current={lesson.id} progress={progress} />
      <ResultDialog
        open={!!result}
        stars={result?.stars ?? 0}
        message={result?.message ?? ""}
        hasNext={!!next}
        onAgain={() => setResult(null)}
        onNext={() => {
          setResult(null);
          if (next) navigate(`/simulator/${next.id}`);
        }}
      />
    </div>
  );
}
