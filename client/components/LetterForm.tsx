/**
 * Contact form written as a letter. Fields sit inline in the sentence, validate
 * inline (not on submit), and the letter folds into an envelope when sent.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { postJSON, toBraille } from "@/lib/utils";

const display = { fontFamily: "'Cabinet Grotesk', sans-serif" };
const ROLES = ["teacher", "school leader", "parent", "researcher", "NGO or funder", "maker or manufacturer"];
const GOALS = ["bring TACTO to my classroom", "run a pilot at my school", "partner with you", "fund or support the work", "learn more first"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Blank({ children, invalid, hint }: { children: ReactNode; invalid?: boolean; hint?: string }) {
  return (
    <span className="relative inline-block align-baseline">
      {children}
      <AnimatePresence>
        {invalid && hint && (
          <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-0 top-full mt-1 whitespace-nowrap text-xs font-medium text-[#b5583a]" role="alert">
            {hint}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

const inputCls = (invalid?: boolean) =>
  `mx-1 border-0 border-b-2 bg-transparent px-1 pb-0.5 text-[#1a1a17] outline-none transition-colors placeholder:text-[#c8c6c0] focus:border-[#1a1a17] ${invalid ? "border-[#d97757]" : "border-[#e4e2dd]"}`;

export default function LetterForm() {
  const reduce = useReducedMotion();
  const [f, setF] = useState({ name: "", role: ROLES[0], organization: "", goal: GOALS[0], email: "", note: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }));
  const touch = (k: string) => () => setTouched((t) => ({ ...t, [k]: true }));
  const nameBad = !f.name.trim();
  const emailBad = !EMAIL.test(f.email.trim());
  const ready = !nameBad && !emailBad;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true });
    if (!ready) return;
    setBusy(true);
    setError(null);
    const r = await postJSON("/api/contact", {
      name: f.name.trim(),
      email: f.email.trim(),
      role: f.role,
      organization: f.organization.trim(),
      topic: /pilot|classroom/.test(f.goal) ? "pilot" : /partner|fund/.test(f.goal) ? "partnership" : "general",
      message: `I'd love to ${f.goal}.${f.note.trim() ? `\n\n${f.note.trim()}` : ""}`,
    });
    setBusy(false);
    if (r.ok) setSent(true);
    else setError(r.error ?? "Something went wrong. Please try again.");
  }

  return (
    <div className="relative [perspective:1400px]">
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.form
            key="letter"
            onSubmit={submit}
            noValidate
            exit={reduce ? { opacity: 0 } : { rotateX: 70, y: 80, scale: 0.7, opacity: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }}
            style={{ transformOrigin: "50% 100%" }}
            className="relative overflow-hidden rounded-[1.75rem] border border-[#e4e2dd] bg-white p-8 shadow-[0_30px_60px_-40px_rgba(26,26,23,.35)] sm:p-11"
          >
            {/* faint writing lines */}
            <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(transparent_47px,#f2f0ec_48px)] [background-size:100%_48px]" />
            <div className="relative">
              <p className="text-[1.7rem] font-bold tracking-[-0.02em] text-[#1a1a17]" style={display}>
                Dear TACTO team,
              </p>
              <div className="mt-7 text-[1.15rem] leading-[2.6] text-[#6b6b63]">
                My name is
                <Blank invalid={touched.name && nameBad} hint="Tell us your name">
                  <input aria-label="Your name" value={f.name} onChange={set("name")} onBlur={touch("name")} placeholder="your name" size={Math.max(9, f.name.length + 1)} className={inputCls(touched.name && nameBad)} autoComplete="name" />
                </Blank>
                , and I'm a
                <select aria-label="Your role" value={f.role} onChange={set("role")} className={`${inputCls()} cursor-pointer appearance-none pr-1`}>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                at
                <input aria-label="School or organisation (optional)" value={f.organization} onChange={set("organization")} placeholder="your school or organisation" size={Math.max(22, f.organization.length + 1)} className={inputCls()} autoComplete="organization" />
                . I'd love to
                <select aria-label="What you'd like to do" value={f.goal} onChange={set("goal")} className={`${inputCls()} cursor-pointer appearance-none pr-1`}>
                  {GOALS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
                . You can reach me at
                <Blank invalid={touched.email && emailBad} hint="That email doesn't look right">
                  <input aria-label="Your email" type="email" value={f.email} onChange={set("email")} onBlur={touch("email")} placeholder="you@school.org" size={Math.max(15, f.email.length + 1)} className={inputCls(touched.email && emailBad)} autoComplete="email" />
                </Blank>
                .
              </div>
              <label className="mt-8 block">
                <span className="text-sm font-medium text-[#a3a39b]">Anything else? (optional)</span>
                <textarea value={f.note} onChange={set("note")} rows={3} maxLength={3500} placeholder="Your learners, your setting, your timeline…" className="mt-2 w-full resize-none border-0 border-b-2 border-[#e4e2dd] bg-transparent pb-2 text-[1.05rem] leading-[1.8] text-[#1a1a17] outline-none transition-colors placeholder:text-[#c8c6c0] focus:border-[#1a1a17]" />
              </label>

              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[#6b6b63]">Warmly,</p>
                  <p className="mt-1 min-h-[2.2rem] text-[1.6rem] font-bold tracking-[-0.02em] text-[#1a1a17]" style={display}>
                    {f.name.trim() || <span className="text-[#e4e2dd]">your name</span>}
                  </p>
                </div>
                <button
                  disabled={busy}
                  aria-disabled={!ready}
                  className={`group inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-semibold transition duration-100 active:scale-[.97] ${ready ? "bg-[#1a1a17] text-white hover:bg-[#333330]" : "bg-[#e4e2dd] text-[#a3a39b]"}`}
                >
                  {busy ? <Loader2 size={18} className="animate-spin" /> : <>Send letter <ArrowRight size={18} className="transition group-hover:translate-x-0.5" /></>}
                </button>
              </div>
              {error && (
                <p role="alert" className="mt-4 text-sm font-medium text-[#b5583a]">
                  {error}
                </p>
              )}
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="sent"
            initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0, duration: 0.6 }}
            className="flex min-h-[460px] flex-col items-center justify-center rounded-[1.75rem] border border-[#e4e2dd] bg-white p-10 text-center"
            role="status"
          >
            <svg viewBox="0 0 120 84" className="w-32" aria-hidden>
              <rect x="2" y="2" width="116" height="80" rx="10" fill="#fafaf8" stroke="#1a1a17" strokeWidth="2.5" />
              <motion.path d="M4 8 L60 48 L116 8" fill="none" stroke="#1a1a17" strokeWidth="2.5" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.2 }} />
              <motion.circle cx="60" cy="62" r="9" fill="#d97757" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0, duration: 0.4, delay: 0.7 }} />
            </svg>
            <p className="mt-8 text-[2rem] font-bold tracking-[-0.02em] text-[#1a1a17]" style={display}>
              Your letter is on its way.
            </p>
            <p className="mt-3 max-w-sm text-[#6b6b63]">Thank you, {f.name.trim().split(" ")[0]}. We read every message and reply within two working days.</p>
            <p aria-hidden className="mt-8 text-2xl tracking-[0.2em] text-[#c8c6c0]">
              {toBraille("thank you")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
