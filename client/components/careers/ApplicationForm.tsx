/**
 * Internship application as a one-question-at-a-time flow (Typeform style):
 * big type, Enter to continue, a progress bar, and a review screen before submitting.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, ChevronUp, CornerDownLeft, FileText, Loader2, Pencil, UploadCloud, X } from "lucide-react";
import { useEffect, useId, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { CV_TYPES, MAX_CV_BYTES } from "@shared/careers";
import { postJSON } from "@/lib/utils";

const display = { fontFamily: "'Cabinet Grotesk', sans-serif" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_LETTER = 20;
const MAX_LETTER = 6000;

const withScheme = (s: string) => (s.trim() && !/^https?:\/\//i.test(s.trim()) ? `https://${s.trim()}` : s.trim());
const isUrl = (s: string) => {
  if (!s.trim()) return true;
  try {
    const u = new URL(withScheme(s));
    return /^https?:$/.test(u.protocol) && u.hostname.includes(".");
  } catch {
    return false;
  }
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

type StepId = "name" | "email" | "location" | "why" | "work" | "review";
const STEPS: StepId[] = ["name", "email", "location", "why", "work", "review"];

const bigInput =
  "w-full border-0 border-b-2 border-[#e4e2dd] bg-transparent pb-3 text-[clamp(1.35rem,3vw,1.9rem)] font-medium text-[#1a1a17] outline-none transition-colors placeholder:font-normal placeholder:text-[#cfcdc7] focus:border-[#1a1a17]";

export default function ApplicationForm({ jobSlug, jobTitle, showUs }: { jobSlug: string; jobTitle: string; showUs?: string }) {
  const reduce = useReducedMotion();
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const fileInput = useRef<HTMLInputElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  const [f, setF] = useState({ name: "", email: "", location: "", coverLetter: "", linkedin: "", portfolio: "", website: "" });
  const [cv, setCv] = useState<File | null>(null);
  const [cvError, setCvError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [consent, setConsent] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => {
    setF((s) => ({ ...s, [k]: e.target.value }));
    setStepError(null);
  };
  const first = f.name.trim().split(" ")[0];
  const current = STEPS[step];

  // Move focus to the new question's main field as soon as it mounts (not on first page load).
  const moved = useRef(false);
  useEffect(() => {
    if (!moved.current) return;
    stage.current?.querySelector<HTMLElement>(`[data-step="${STEPS[step]}"] [data-autofocus]`)?.focus({ preventScroll: true });
  }, [step]);

  function validate(s: StepId): string | null {
    if (s === "name" && !f.name.trim()) return "Please tell us your name.";
    if (s === "email" && !EMAIL.test(f.email.trim())) return "That email doesn't look quite right.";
    if (s === "why" && f.coverLetter.trim().length < MIN_LETTER) return "Just a couple of sentences, please.";
    if (s === "work") {
      if (cvError) return cvError;
      if (!isUrl(f.linkedin)) return "Your LinkedIn link doesn't look right.";
      if (!isUrl(f.portfolio)) return "Your portfolio link doesn't look right.";
    }
    return null;
  }

  function go(to: number) {
    if (to < 0 || to >= STEPS.length) return;
    if (to > step) {
      for (let i = step; i < to; i++) {
        const err = validate(STEPS[i]);
        if (err) {
          moved.current = true;
          setStep(i);
          setStepError(err);
          return;
        }
      }
    }
    setStepError(null);
    setDir(to > step ? 1 : -1);
    moved.current = true;
    setStep(to);
  }
  const next = () => go(step + 1);
  const back = () => go(step - 1);

  const onEnter = (e: KeyboardEvent, multiline = false) => {
    if (e.key !== "Enter") return;
    if (multiline && !(e.metaKey || e.ctrlKey)) return; // Enter = new line in the long answer
    e.preventDefault();
    next();
  };

  function pickFile(file: File | undefined) {
    if (!file) return;
    if (!(CV_TYPES as readonly string[]).includes(file.type)) return void setCvError("Please upload a PDF or Word document.");
    if (file.size > MAX_CV_BYTES) return void setCvError("That file is over 2 MB. Try exporting a smaller PDF.");
    setCvError(null);
    setStepError(null);
    setCv(file);
  }
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };
  const clearCv = () => {
    setCv(null);
    setCvError(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  async function submit() {
    for (const s of STEPS) {
      const err = validate(s);
      if (err) {
        setDir(-1);
        moved.current = true;
        setStep(STEPS.indexOf(s));
        setStepError(err);
        return;
      }
    }
    if (!consent) return void setStepError("Please tick the box to confirm.");
    setBusy(true);
    setError(null);
    let cvPayload: { name: string; type: string; data: string } | undefined;
    if (cv) {
      try {
        cvPayload = { name: cv.name, type: cv.type, data: await fileToBase64(cv) };
      } catch {
        setBusy(false);
        return void setError("We couldn't read your CV. Please go back and upload it again.");
      }
    }
    const r = await postJSON("/api/careers/apply", {
      jobSlug,
      name: f.name.trim(),
      email: f.email.trim(),
      location: f.location.trim(),
      linkedin: withScheme(f.linkedin),
      portfolio: withScheme(f.portfolio),
      coverLetter: f.coverLetter.trim(),
      cv: cvPayload,
      consent: true,
      website: f.website,
    });
    setBusy(false);
    if (r.ok) setSent(true);
    else setError(r.error ?? "Something went wrong. Please try again.");
  }

  /* ───────── question screens ───────── */

  const Q = ({ n, children, sub, htmlFor }: { n: number; children: ReactNode; sub?: ReactNode; htmlFor?: string }) => (
    <div className="mb-8">
      <div className="flex items-start gap-3">
        <span className="mt-[0.55em] flex shrink-0 items-center gap-1 text-sm font-semibold text-[#8b3a2f]">
          {n} <ArrowRight size={13} strokeWidth={2.5} />
        </span>
        <label htmlFor={htmlFor} className="block text-[clamp(1.5rem,3.2vw,2.15rem)] font-bold leading-[1.2] tracking-[-0.025em] text-[#1a1a17]" style={display}>
          {children}
        </label>
      </div>
      {sub && <p className="mt-3 pl-8 text-[1.02rem] leading-relaxed text-[#6b6b63]">{sub}</p>}
    </div>
  );

  const screens: Record<StepId, ReactNode> = {
    name: (
      <>
        <Q n={1} htmlFor={id("name")} sub={jobTitle ? `You're applying for ${jobTitle}.` : "Thanks for reaching out."}>
          First things first, what's your name?
        </Q>
        <div className="pl-8">
          <input id={id("name")} data-autofocus value={f.name} onChange={set("name")} onKeyDown={onEnter} autoComplete="name" placeholder="Type your full name" className={bigInput} />
        </div>
      </>
    ),
    email: (
      <>
        <Q n={2} htmlFor={id("email")} sub="This is where we'll reply.">
          Nice to meet you{first ? `, ${first}` : ""}. What's your email?
        </Q>
        <div className="pl-8">
          <input id={id("email")} data-autofocus type="email" value={f.email} onChange={set("email")} onKeyDown={onEnter} autoComplete="email" placeholder="name@example.com" className={bigInput} />
        </div>
      </>
    ),
    location: (
      <>
        <Q n={3} htmlFor={id("location")} sub="City and country is perfect. Everything is remote, so this just helps with time zones.">
          Where are you based?
        </Q>
        <div className="pl-8">
          <input id={id("location")} data-autofocus value={f.location} onChange={set("location")} onKeyDown={onEnter} autoComplete="address-level2" placeholder="e.g. Pune, India" className={bigInput} />
        </div>
      </>
    ),
    why: (
      <>
        <Q n={4} htmlFor={id("why")} sub="What draws you to this, and something you've made or learned that you're proud of. A few honest sentences are plenty.">
          {jobTitle ? "Why do you want this internship?" : "What would you like to work on with us?"}
        </Q>
        <div className="pl-8">
          <textarea
            id={id("why")}
            data-autofocus
            value={f.coverLetter}
            onChange={set("coverLetter")}
            onKeyDown={(e) => onEnter(e, true)}
            rows={4}
            maxLength={MAX_LETTER}
            placeholder="Type your answer here…"
            className={`${bigInput} resize-none !text-[clamp(1.1rem,2.2vw,1.35rem)] leading-relaxed`}
          />
          <p className="mt-2 text-xs text-[#a3a39b]">
            Press <kbd className="font-semibold text-[#6b6b63]">Ctrl</kbd> + <kbd className="font-semibold text-[#6b6b63]">Enter</kbd> to continue
          </p>
        </div>
      </>
    ),
    work: (
      <>
        <Q n={5} sub={showUs ? `${showUs} You can skip this if you'd rather not.` : "Add a CV and any links that show your work. You can skip this if you'd rather not."}>
          Anything you'd like to show us?
        </Q>
        <div className="space-y-6 pl-8">
          {cv ? (
            <div className="flex items-center gap-4 rounded-2xl border border-[#e4e2dd] bg-[#fafaf8] px-4 py-3.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#1a1a17] shadow-[0_1px_2px_rgba(0,0,0,.08)]">
                <FileText size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#1a1a17]">{cv.name}</p>
                <p className="text-xs text-[#a3a39b]">{Math.max(1, Math.round(cv.size / 1024))} KB</p>
              </div>
              <button type="button" onClick={clearCv} className="rounded-full p-2 text-[#6b6b63] transition hover:bg-white hover:text-[#1a1a17]" aria-label="Remove CV">
                <X size={16} />
              </button>
            </div>
          ) : (
            <label
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed px-5 py-5 transition focus-within:border-[#1a1a17] ${
                dragging ? "border-[#1a1a17] bg-[#f2f0ec]" : cvError ? "border-[#d97757]" : "border-[#dedcd6] hover:border-[#1a1a17]"
              }`}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#f2f0ec] text-[#1a1a17]">
                <UploadCloud size={20} />
              </span>
              <span>
                <span className="block font-semibold text-[#1a1a17]">Upload your CV</span>
                <span className="block text-sm text-[#6b6b63]">PDF or Word, up to 2 MB. Or drag it here.</span>
              </span>
              <input
                ref={fileInput}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="sr-only"
                onChange={(e) => pickFile(e.target.files?.[0])}
                aria-label="Upload your CV"
              />
            </label>
          )}
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-[#1a1a17]">LinkedIn</span>
              <input data-autofocus value={f.linkedin} onChange={set("linkedin")} onKeyDown={onEnter} inputMode="url" placeholder="linkedin.com/in/…" className={`${bigInput} mt-1 !text-[1.15rem]`} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-[#1a1a17]">Portfolio, GitHub or website</span>
              <input value={f.portfolio} onChange={set("portfolio")} onKeyDown={onEnter} inputMode="url" placeholder="github.com/…" className={`${bigInput} mt-1 !text-[1.15rem]`} />
            </label>
          </div>
        </div>
      </>
    ),
    review: (
      <>
        <Q n={6}>All set{first ? `, ${first}` : ""}. Take a quick look.</Q>
        <div className="pl-8">
          <dl className="divide-y divide-[#efede8] rounded-2xl border border-[#e4e2dd]">
            {(
              [
                ["Name", f.name.trim(), 0],
                ["Email", f.email.trim(), 1],
                ["Based in", f.location.trim(), 2],
                ["Why", f.coverLetter.trim(), 3],
                ["Work", [cv?.name, f.linkedin.trim(), f.portfolio.trim()].filter(Boolean).join(" · "), 4],
              ] as [string, string, number][]
            ).map(([k, v, s]) => (
              <div key={k} className="flex items-start gap-4 px-5 py-3.5">
                <dt className="w-20 shrink-0 pt-0.5 text-sm text-[#a3a39b]">{k}</dt>
                <dd className={`min-w-0 flex-1 text-[0.95rem] ${v ? "text-[#1a1a17]" : "text-[#c8c6c0]"} ${k === "Why" ? "line-clamp-2" : "truncate"}`}>{v || "Skipped"}</dd>
                <button type="button" onClick={() => go(s)} className="shrink-0 rounded-full p-1.5 text-[#a3a39b] transition hover:bg-[#f2f0ec] hover:text-[#1a1a17]" aria-label={`Edit ${k}`}>
                  <Pencil size={14} />
                </button>
              </div>
            ))}
          </dl>
          <label className="mt-6 flex cursor-pointer items-start gap-3 text-[0.95rem] leading-relaxed text-[#6b6b63]">
            <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
              <input
                data-autofocus
                type="checkbox"
                checked={consent}
                onChange={(e) => { setConsent(e.target.checked); setStepError(null); }}
                className="peer size-5 cursor-pointer appearance-none rounded-[6px] border-2 border-[#c8c6c0] transition checked:border-[#1a1a17] checked:bg-[#1a1a17]"
              />
              <Check size={13} strokeWidth={3} className="pointer-events-none absolute text-white opacity-0 peer-checked:opacity-100" />
            </span>
            <span>
              I understand this internship is currently unpaid, and I agree to TACTO keeping my application for up to 12 months, as described in the{" "}
              <Link to="/privacy" className="font-medium text-[#1a1a17] underline decoration-[#c8c6c0] underline-offset-4 hover:decoration-[#1a1a17]">privacy policy</Link>.
            </span>
          </label>
        </div>
      </>
    ),
  };

  const value: Record<StepId, string> = { name: f.name, email: f.email, location: f.location, why: f.coverLetter, work: cv?.name || f.linkedin || f.portfolio, review: "" };
  const optional = current === "location" || current === "work";
  const okLabel = optional && !value[current].trim() ? "Skip" : "OK";
  const progress = sent ? 1 : step / (STEPS.length - 1);

  if (sent) {
    return (
      <motion.div
        ref={(el) => el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })}
        initial={reduce ? { opacity: 0 } : { y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0, duration: 0.6 }}
        className="flex min-h-[460px] flex-col items-center justify-center rounded-[1.75rem] border border-[#e4e2dd] bg-white p-10 text-center"
        role="status"
      >
        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.3, duration: 0.5, delay: 0.1 }} className="grid size-14 place-items-center rounded-full bg-[#2b5e54] text-white">
          <Check size={26} strokeWidth={2.5} />
        </motion.span>
        <p className="mt-7 text-[2rem] font-bold tracking-[-0.02em] text-[#1a1a17]" style={display}>Thanks, {first}. We've got it.</p>
        <p className="mt-3 max-w-md leading-relaxed text-[#6b6b63]">
          Your application{jobTitle ? ` for the ${jobTitle} role` : ""} is with the team. We'll reply to {f.email.trim()} within a week or so.
        </p>
        <Link to="/careers#roles" className="mt-8 text-sm font-semibold text-[#1a1a17] underline decoration-[#c8c6c0] underline-offset-4 hover:decoration-[#1a1a17]">
          Back to all internships
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-[#e4e2dd] bg-white shadow-[0_40px_80px_-55px_rgba(26,26,23,.45)]">
      {/* progress */}
      <div className="h-1 bg-[#f2f0ec]" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Application progress">
        <motion.div className="h-full bg-[#1a1a17]" initial={false} animate={{ width: `${Math.max(progress, 0.04) * 100}%` }} transition={{ type: "spring", bounce: 0, duration: 0.5 }} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); current === "review" ? submit() : next(); }} noValidate aria-label={jobTitle ? `Application for ${jobTitle}` : "Open application"}>
        {/* honeypot */}
        <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden name="website" />

        <div ref={stage} className="relative flex min-h-[440px] flex-col justify-center px-6 py-12 sm:min-h-[480px] sm:px-14">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.div
              key={current}
              data-step={current}
              custom={dir}
              variants={{
                enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, y: d * 40 }),
                center: { opacity: 1, y: 0 },
                exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, y: d * -40 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {screens[current]}

              <div className="mt-8 flex flex-wrap items-center gap-4 pl-8">
                {current === "review" ? (
                  <button type="submit" disabled={busy} className="group inline-flex items-center gap-2 rounded-full bg-[#1a1a17] px-7 py-3.5 text-[1.02rem] font-semibold text-white transition hover:bg-[#333330] active:scale-[.97] disabled:opacity-70">
                    {busy ? <><Loader2 size={18} className="animate-spin" /> Submitting</> : <>Submit application <ArrowRight size={18} className="transition group-hover:translate-x-0.5" /></>}
                  </button>
                ) : (
                  <>
                    <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#1a1a17] px-6 py-3 text-[1.02rem] font-semibold text-white transition hover:bg-[#333330] active:scale-[.97]">
                      {okLabel} {okLabel === "OK" && <Check size={17} strokeWidth={2.5} />}
                    </button>
                    {current !== "why" && (
                      <span className="hidden items-center gap-1.5 text-sm text-[#a3a39b] sm:inline-flex">
                        or press <span className="inline-flex items-center gap-1 font-semibold text-[#6b6b63]">Enter <CornerDownLeft size={13} /></span>
                      </span>
                    )}
                  </>
                )}
              </div>

              <AnimatePresence>
                {(stepError || error) && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="ml-8 mt-5 inline-flex items-center gap-2 rounded-lg bg-[#d97757]/10 px-3.5 py-2 text-sm font-medium text-[#b5583a]">
                    {stepError ?? error}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </form>

      {/* footer nav */}
      <div className="flex items-center justify-between border-t border-[#f2f0ec] px-6 py-3.5 sm:px-14">
        <p className="text-sm text-[#a3a39b]" aria-live="polite">
          Question {step + 1} of {STEPS.length}
        </p>
        <div className="flex overflow-hidden rounded-lg border border-[#e4e2dd]">
          <button type="button" onClick={back} disabled={step === 0} aria-label="Previous question" className="grid size-9 place-items-center text-[#1a1a17] transition hover:bg-[#f2f0ec] disabled:text-[#d8d6d0] disabled:hover:bg-transparent">
            <ChevronUp size={18} />
          </button>
          <button type="button" onClick={next} disabled={step === STEPS.length - 1} aria-label="Next question" className="grid size-9 place-items-center border-l border-[#e4e2dd] text-[#1a1a17] transition hover:bg-[#f2f0ec] disabled:text-[#d8d6d0] disabled:hover:bg-transparent">
            <ChevronDown size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
