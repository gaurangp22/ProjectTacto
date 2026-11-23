import "@/components/landing.css";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { INTERNSHIP_TERMS, TEAMS, openJobs, type Job, type Team } from "@shared/careers";
import { Board, HEX } from "@/components/kit/SnapReveal";
import { CareerTile, TEAM_STYLE, TeamMark } from "@/components/careers/CareerTile";
import { toBraille } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const display = { fontFamily: "'Cabinet Grotesk', sans-serif" };
const mono = "text-[0.85rem] font-medium";

const SHORT: Record<Team, string> = {
  Hardware: "Hardware",
  Research: "Research",
  Partnerships: "Partners",
  Curriculum: "Lessons",
  Marketing: "Social",
};

function Fade({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-4 border-t border-[#1a1a17] pt-4">
      <span className={`${mono} text-[#1a1a17]`}>{n}</span>
      <span className={`${mono} text-[#6b6b63]`}>{children}</span>
    </div>
  );
}

/* ───────────── hero: a handful of tiles left on the desk ───────────── */

const SCATTER: { team: Team; x: string; y: string; r: number; z: number }[] = [
  { team: "Hardware", x: "2%", y: "10%", r: -9, z: 2 },
  { team: "Research", x: "37%", y: "0%", r: 6, z: 3 },
  { team: "Partnerships", x: "72%", y: "12%", r: -4, z: 2 },
  { team: "Curriculum", x: "18%", y: "56%", r: 4, z: 4 },
  { team: "Marketing", x: "54%", y: "54%", r: -6, z: 3 },
];

function Hero({ jobs }: { jobs: Job[] }) {
  const reduce = useReducedMotion();
  const desk = useRef<HTMLDivElement>(null);
  const [tile, setTile] = useState(128);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setTile(Math.round(e.contentRect.width * 0.25)));
    ro.observe(desk.current!);
    return () => ro.disconnect();
  }, []);
  return (
    <section className="relative px-6 pb-20 pt-32 sm:pt-40 lg:pb-28">
      <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-center">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className={`${mono} text-[#6b6b63]`}>
            Careers · Internships
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.05, ease: EASE }}
            className="mt-6 max-w-[15ch] font-bold leading-[1] tracking-[-0.045em] text-[#1a1a17]"
            style={{ ...display, fontSize: "clamp(2.5rem, 5.2vw, 4.5rem)" }}
          >
            We're building a computer you read with your fingers.
            <span className="mt-2 block text-[#a3a39b]">Build it with us.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: EASE }} className="mt-8 max-w-[34rem] text-[1.1rem] leading-[1.75] text-[#6b6b63]">
            TACTO makes coding tangible for blind and low-vision children. We're bringing on a small group of interns to ship real hardware, software and research alongside the founding team, with their names on the work.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href="#roles" className="group inline-flex items-center gap-3 font-semibold text-[#1a1a17]">
              <span className="grid size-12 place-items-center rounded-full bg-[#1a1a17] text-white transition group-hover:scale-105">
                <ArrowRight size={18} className="rotate-90" />
              </span>
              {jobs.length} open internships
            </a>
            <a href="#terms" className="text-sm font-medium text-[#6b6b63] underline decoration-[#c8c6c0] underline-offset-[6px] transition hover:text-[#1a1a17] hover:decoration-[#1a1a17]">
              The details
            </a>
          </motion.div>
        </div>

        {/* the tiles */}
        <div ref={desk} className="relative mx-auto aspect-[1.25/1] w-full max-w-[520px]">
          {SCATTER.map((t, i) => {
            const s = TEAM_STYLE[t.team];
            return (
              <motion.div
                key={t.team}
                className="absolute"
                style={{ left: t.x, top: t.y, zIndex: t.z }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -60, rotate: t.r * 2 }}
                animate={{ opacity: 1, y: 0, rotate: t.r }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.9, delay: 0.25 + i * 0.09 }}
                whileHover={reduce ? undefined : { y: -12, rotate: 0, transition: { type: "spring", bounce: 0.3, duration: 0.4 } }}
              >
                <a href="#roles" tabIndex={-1} aria-hidden className="block">
                  <CareerTile label={SHORT[t.team]} color={s.color} shape={s.shape} size={tile} />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────── the terms, said plainly ───────────── */

function Terms() {
  const rows = [
    ["Pay", INTERNSHIP_TERMS.pay],
    ["Commitment", INTERNSHIP_TERMS.commitment],
    ["Hours", INTERNSHIP_TERMS.hours],
    ["Length", INTERNSHIP_TERMS.duration],
    ["Where", INTERNSHIP_TERMS.location],
  ];
  return (
    <section id="terms" className="scroll-mt-24 px-6">
      <div className="mx-auto max-w-[1200px]">
        <Fade className="grid overflow-hidden rounded-[1.25rem] border border-[#e4e2dd] bg-white sm:grid-cols-[1fr_2fr]">
          <div className="border-b border-[#e4e2dd] p-7 sm:border-b-0 sm:border-r">
            <p className="text-lg font-bold tracking-[-0.01em] text-[#1a1a17]" style={display}>The details</p>
            <p className="mt-2 text-sm leading-relaxed text-[#6b6b63]">
              A remote, part-time internship built around your studies. We keep each cohort small, so everyone works directly with the founding team.
            </p>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-5">
            {rows.map(([k, v], i) => (
              <div key={k} className={`p-7 ${i > 0 ? "border-l border-[#e4e2dd]" : ""} ${i === 2 ? "max-sm:border-l-0" : ""} ${i > 1 ? "max-sm:border-t" : ""} border-[#e4e2dd]`}>
                <dt className={`${mono} text-[#a3a39b]`}>{k}</dt>
                <dd className={`mt-2 font-semibold leading-snug text-[#1a1a17]`}>{v}</dd>
              </div>
            ))}
          </dl>
        </Fade>
      </div>
    </section>
  );
}

/* ───────────── the roles ledger ───────────── */

function Row({ job, n }: { job: Job; n: number }) {
  return (
    <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="border-b border-[#e4e2dd]">
      <Link to={`/careers/${job.slug}`} className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 py-7 sm:grid-cols-[3rem_auto_1fr_10rem_auto] sm:gap-x-6">
        <span aria-hidden className="pointer-events-none absolute inset-x-[-1.25rem] inset-y-0 origin-bottom scale-y-0 rounded-xl bg-[#f2f0ec] transition-transform duration-300 ease-out group-hover:scale-y-100" />
        <span className={`${mono} relative hidden text-[#a3a39b] sm:block`}>{String(n).padStart(2, "0")}</span>
        <span className="relative transition-transform duration-300 group-hover:-rotate-6">
          <TeamMark team={job.team} size={34} />
        </span>
        <span className="relative min-w-0">
          <span className="block text-[1.3rem] font-bold leading-tight tracking-[-0.02em] text-[#1a1a17] sm:text-[1.55rem]" style={display}>
            {job.title}
          </span>
          <span className="mt-1 block max-w-[36rem] text-[0.95rem] leading-relaxed text-[#6b6b63]">{job.summary}</span>
        </span>
        <span className={`${mono} relative col-start-2 text-[#6b6b63] sm:col-start-auto`}>{job.team}</span>
        <span className="relative col-start-3 row-start-1 grid size-10 place-items-center rounded-full border border-[#e4e2dd] text-[#1a1a17] transition duration-300 group-hover:border-[#1a1a17] group-hover:bg-[#1a1a17] group-hover:text-white sm:col-start-auto sm:row-start-auto">
          <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:rotate-45" />
        </span>
      </Link>
    </motion.li>
  );
}

function Roles({ jobs }: { jobs: Job[] }) {
  const [team, setTeam] = useState<Team | "All">("All");
  const [q, setQ] = useState("");
  const teams = useMemo(() => TEAMS.filter((t) => jobs.some((j) => j.team === t)), [jobs]);
  const needle = q.trim().toLowerCase();
  const list = jobs.filter((j) => (team === "All" || j.team === team) && (!needle || `${j.title} ${j.team} ${j.summary}`.toLowerCase().includes(needle)));

  return (
    <section id="roles" className="scroll-mt-20 px-6 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1200px]">
        <SectionLabel n="01">Open internships</SectionLabel>
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Fade>
            <h2 className="max-w-[16ch] font-bold leading-[1.02] tracking-[-0.04em] text-[#1a1a17]" style={{ ...display, fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
              Pick a tile.
            </h2>
          </Fade>
          <label className="relative block w-full lg:w-72">
            <span className="sr-only">Search internships</span>
            <Search size={16} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#a3a39b]" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="w-full border-0 border-b border-[#c8c6c0] bg-transparent py-2.5 pl-7 text-[0.95rem] text-[#1a1a17] outline-none transition placeholder:text-[#a3a39b] focus:border-[#1a1a17] [&::-webkit-search-cancel-button]:hidden"
            />
          </label>
        </div>

        <div className="no-scrollbar mt-10 -mx-6 flex gap-1 overflow-x-auto px-6" role="group" aria-label="Filter by team">
          {(["All", ...teams] as const).map((t) => {
            const count = t === "All" ? jobs.length : jobs.filter((j) => j.team === t).length;
            const on = team === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => setTeam(t)}
                className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${on ? "text-white" : "text-[#6b6b63] hover:text-[#1a1a17]"}`}
              >
                {on && <motion.span layoutId="team-pill" className="absolute inset-0 rounded-full bg-[#1a1a17]" transition={{ type: "spring", bounce: 0, duration: 0.4 }} />}
                <span className="relative">
                  {t === "All" ? "Everything" : t} <span className={`${mono} ${on ? "text-white/50" : "text-[#a3a39b]"}`}>{count}</span>
                </span>
              </button>
            );
          })}
        </div>

        <ul className="mt-6 border-t border-[#e4e2dd]">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((j) => (
              <Row key={j.slug} job={j} n={jobs.indexOf(j) + 1} />
            ))}
          </AnimatePresence>
        </ul>
        {list.length === 0 && (
          <p className="py-16 text-center text-[#6b6b63]" aria-live="polite">
            Nothing matches "{q}".{" "}
            <button onClick={() => { setQ(""); setTeam("All"); }} className="font-semibold text-[#1a1a17] underline underline-offset-4">Show everything</button>
          </p>
        )}

        <Link to="/careers/general" className="group mt-8 flex items-center justify-between gap-6 rounded-xl py-4 text-[#6b6b63] transition hover:text-[#1a1a17]">
          <span>
            <span className="font-semibold text-[#1a1a17]">None of these?</span> Tell us what you'd like to work on.
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a1a17]">
            Open application <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ───────────── a note from the team ───────────── */

function Note() {
  return (
    <section className="px-6 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1200px]">
        <SectionLabel n="02">What it's like</SectionLabel>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Fade>
            <h2 className="font-bold leading-[1.02] tracking-[-0.04em] text-[#1a1a17]" style={{ ...display, fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
              A note before you apply.
            </h2>
          </Fade>
          <Fade delay={0.1}>
            <div className="relative overflow-hidden rounded-[1.5rem] border border-[#e4e2dd] bg-white p-8 shadow-[0_30px_60px_-45px_rgba(26,26,23,.35)] sm:p-12">
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(transparent_35px,#f2f0ec_36px)] [background-size:100%_36px]" />
              <div className="relative space-y-6 text-[1.06rem] leading-[1.9] text-[#4a4a44]">
                <p>
                  <span className="font-semibold text-[#1a1a17]">This is real work.</span> You won't be fetching coffee or making slides nobody reads. What you build goes into the kit, the simulator, or the lessons that children use.
                </p>
                <p>
                  <span className="font-semibold text-[#1a1a17]">We test with the people it's for.</span> Blind and low-vision learners and their teachers try everything we make. You'll hear their feedback directly, and it will change your work.
                </p>
                <p>
                  <span className="font-semibold text-[#1a1a17]">It's open, and it's yours.</span> Our hardware, code and research are published openly. Your contributions carry your name, so you can point to them for years.
                </p>
                <p>
                  <span className="font-semibold text-[#1a1a17]">We're small.</span> That means less structure than a big company and more say in what happens. You'll get honest feedback and a weekly check-in, and we expect the same honesty back.
                </p>
              </div>
              <div className="relative mt-10 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[#6b6b63]">From all of us,</p>
                  <p className="mt-1 text-[1.5rem] font-bold tracking-[-0.02em] text-[#1a1a17]" style={display}>The TACTO team</p>
                </div>
                <p aria-hidden className="text-xl tracking-[0.2em] text-[#c8c6c0]">{toBraille("tacto")}</p>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}

/* ───────────── what you get (honest, non-monetary) ───────────── */

const GIVES = [
  ["Mentorship", "A named mentor from the core team and a weekly one-to-one."],
  ["Public credit", "Your work is published openly under your name, ready for your portfolio or CV."],
  ["A reference", "A detailed letter of recommendation and a certificate when you finish."],
  ["Flexible hours", "Work around your classes or job. We agree goals together, not hours at a desk."],
  ["University credit", "We're glad to do the paperwork if your course offers credit for internships."],
  ["A seat at the table", "Join classroom sessions and team calls, and help decide what we build next."],
];

function Gives() {
  return (
    <section className="px-6 pt-28 sm:pt-36">
      <div className="mx-auto max-w-[1200px]">
        <SectionLabel n="03">What you get</SectionLabel>
        <dl className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3">
          {GIVES.map(([k, v], i) => (
            <Fade key={k} delay={(i % 3) * 0.06} className="border-b border-[#e4e2dd] py-8 sm:pr-10">
              <dt className="flex items-baseline gap-3">
                <span className={`${mono} text-[#a3a39b]`}>{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[1.25rem] font-bold tracking-[-0.02em] text-[#1a1a17]" style={display}>{k}</span>
              </dt>
              <dd className="mt-2 pl-8 leading-relaxed text-[#6b6b63]">{v}</dd>
            </Fade>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ───────────── hiring process, as a program on the board ───────────── */

const STEPS = [
  { label: "Apply", color: HEX.motion, shape: "arrow" as const, title: "You apply", body: "A short note and, if you have one, a CV. Five minutes." },
  { label: "Chat", color: HEX.voice, shape: "bubble" as const, title: "We talk", body: "A relaxed 20-minute video call. Camera optional." },
  { label: "Try", color: HEX.control, shape: "ring" as const, title: "A small task", body: "An hour or two, on your schedule. Or walk us through something you've made." },
  { label: "Start", color: HEX.functions, shape: "star" as const, title: "You start", body: "We agree goals and a start date, and you meet your mentor." },
];

function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotion();
  return (
    <section className="mt-28 bg-[#1a1a17] px-6 py-28 text-white sm:mt-36 sm:py-36">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center gap-4 border-t border-white/30 pt-4">
          <span className={`${mono} text-white`}>04</span>
          <span className={`${mono} text-white/50`}>How it works</span>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="font-bold leading-[1.02] tracking-[-0.04em]" style={{ ...display, fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
            Four tiles, start to finish.
          </h2>
          <p className="max-w-md text-white/60 lg:ml-auto">We reply to everyone, usually within a week. Need an adjustment at any step? Just say so.</p>
        </div>

        <div ref={ref} className="mx-auto mt-16 max-w-[880px]">
          <Board running={inView} slots={4}>
            {(i) => (
              <div className="grid h-full w-full place-items-center">
                <motion.div
                  initial={false}
                  animate={inView ? { y: 0, opacity: 1, rotate: 0 } : { y: reduce ? 0 : -160, opacity: 0, rotate: i % 2 ? 8 : -8 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.5, delay: i * 0.18 }}
                  className="w-[92%]"
                >
                  <TileFit {...STEPS[i]} />
                </motion.div>
              </div>
            )}
          </Board>
        </div>

        <ol className="mx-auto mt-14 grid max-w-[880px] gap-8 sm:grid-cols-4 sm:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.label}>
              <span className={`${mono} text-white/40`}>Step {i + 1}</span>
              <p className="mt-2 text-lg font-bold" style={display}>{s.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/60">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Tile that sizes itself to the board slot it sits in. */
function TileFit({ label, color, shape }: { label: string; color: string; shape: (typeof STEPS)[number]["shape"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize(e.contentRect.width));
    ro.observe(ref.current!);
    return () => ro.disconnect();
  }, []);
  return <div ref={ref} className="w-full">{size > 0 && <CareerTile label={label} color={color} shape={shape} size={size} />}</div>;
}

/* ───────────── questions ───────────── */

const FAQ = [
  ["Is the internship paid?", "Not yet. Our current internships are unpaid, and we plan to make them paid as TACTO grows. Until then, we keep the hours light and flexible so they fit around study or other work."],
  ["Who can apply?", "Students, recent graduates, career-changers and self-taught people. Requirements describe the work, not a checklist. If you can do most of it and want to learn the rest, apply."],
  ["How much time does it take?", `${INTERNSHIP_TERMS.hours}, for ${INTERNSHIP_TERMS.duration.toLowerCase()}. You set your schedule; we agree goals together.`],
  ["Can I get university credit?", "Often, yes. Tell us what your course needs and we'll fill in the forms, sign off hours and write the evaluation."],
  ["What adjustments can you make?", "Anything that helps: written instead of live questions, extra time, accessible formats, a screen-reader-friendly task. Mention it in your application."],
  ["What happens after the internship?", "As the team grows, interns who've done great work are the first people we talk to."],
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-[1200px]">
        <SectionLabel n="05">Questions</SectionLabel>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Fade>
            <h2 className="font-bold leading-[1.02] tracking-[-0.04em] text-[#1a1a17]" style={{ ...display, fontSize: "clamp(2.2rem, 5vw, 4rem)" }}>
              Fair questions.
            </h2>
            <p className="mt-6 max-w-xs leading-relaxed text-[#6b6b63]">
              Something else? <a href="/#contact" className="font-medium text-[#1a1a17] underline decoration-[#c8c6c0] underline-offset-4 hover:decoration-[#1a1a17]">Write to us</a>.
            </p>
          </Fade>
          <div className="border-t border-[#e4e2dd]">
            {FAQ.map(([q, a], i) => {
              const on = open === i;
              return (
                <div key={q} className="border-b border-[#e4e2dd]">
                  <h3>
                    <button type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on} aria-controls={`faq-${i}`} className="group flex w-full items-center gap-5 py-6 text-left">
                      <span className={`${mono} text-[#a3a39b]`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex-1 text-[1.1rem] font-semibold text-[#1a1a17]">{q}</span>
                      <Plus size={18} className={`shrink-0 text-[#6b6b63] transition-transform duration-300 group-hover:text-[#1a1a17] ${on ? "rotate-45" : ""}`} />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div id={`faq-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
                        <p className="pb-7 pl-[2.6rem] pr-8 leading-[1.8] text-[#6b6b63]">{a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="px-6 pb-28">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 border-t border-[#1a1a17] pt-12 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-[18ch] font-bold leading-[1.02] tracking-[-0.04em] text-[#1a1a17]" style={{ ...display, fontSize: "clamp(2rem, 4.4vw, 3.4rem)" }}>
          Code you can feel. Help us build it.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#roles" className="btn-primary">See internships <ArrowRight size={18} /></a>
          <Link to="/careers/general" className="btn-ghost">Open application <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </section>
  );
}

export default function Careers() {
  const jobs = openJobs();
  // This page is lazy-loaded, so the app-level hash scroll can fire before the target exists.
  useEffect(() => {
    if (window.location.hash) setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" }), 80);
  }, []);
  return (
    <div className="landing-root bg-[#fafaf8]">
      <Hero jobs={jobs} />
      <Terms />
      <Roles jobs={jobs} />
      <Note />
      <Gives />
      <Process />
      <Faq />
      <Closing />
    </div>
  );
}
