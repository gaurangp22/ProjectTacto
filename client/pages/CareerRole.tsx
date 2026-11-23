import "@/components/landing.css";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Link2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { CONTACT_EMAIL, INTERNSHIP_TERMS, jobBySlug, openJobs, type Job } from "@shared/careers";
import ApplicationForm from "@/components/careers/ApplicationForm";
import { CareerTile, TEAM_STYLE, TeamMark } from "@/components/careers/CareerTile";
import { HEX } from "@/components/kit/SnapReveal";
import NotFound from "./NotFound";

const EASE = [0.22, 1, 0.36, 1] as const;
const display = { fontFamily: "'Cabinet Grotesk', sans-serif" };
const mono = "text-[0.85rem] font-medium";

const GENERAL: Job = {
  slug: "general",
  title: "Open Application",
  team: "Hardware",
  location: "Remote",
  open: true,
  summary: "No listing that fits? Tell us what you'd like to work on.",
  bring: [
    "A reason to care about making coding accessible to every child.",
    "Skills you'd like to put to work, whether that's engineering, design, teaching, research, writing or organising.",
    "The willingness to learn fast and build alongside a small founding team.",
  ],
  perks: [
    { title: "Real ownership", body: "Work directly with the founding team and help shape ideas from the beginning." },
    { title: "Real learning", body: "Pick up new skills on a product that combines hardware, software and education." },
    { title: "Real impact", body: "Build things you can be proud of, for learners who have been left out of computing." },
  ],
  note: "You don't need a perfect CV. You need a reason to care and the willingness to build.",
  showUs: "Your resume or anything you're proud of.",
};

function Block({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-[#e4e2dd] py-10 sm:grid-cols-[10rem_1fr] sm:gap-10">
      <div className="flex items-baseline gap-3 sm:block">
        <span className={`${mono} text-[#a3a39b]`}>{n}</span>
        <h2 className="text-[1.1rem] font-bold tracking-[-0.01em] text-[#1a1a17] sm:mt-1" style={display}>{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it} className="grid grid-cols-[1.25rem_1fr] text-[1.05rem] leading-[1.75] text-[#4a4a44]">
          <span aria-hidden className="text-[#c8c6c0]">–</span>
          {it}
        </li>
      ))}
    </ul>
  );
}

export default function CareerRole() {
  const { slug = "" } = useParams();
  const reduce = useReducedMotion();
  const job = slug === "general" ? GENERAL : jobBySlug(slug);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (job) document.title = `${job.title} | Careers | Project TACTO`;
  }, [job]);

  if (!job) return <NotFound />;
  const isGeneral = job.slug === "general";
  const style = isGeneral ? { color: HEX.functions, shape: "star" as const } : TEAM_STYLE[job.team];
  const others = openJobs().filter((j) => j.slug !== job.slug).slice(0, 4);
  const terms = [INTERNSHIP_TERMS.pay, job.location, INTERNSHIP_TERMS.hours, INTERNSHIP_TERMS.duration];

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  const toForm = () => document.getElementById("apply")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });

  return (
    <div className="landing-root bg-[#fafaf8]">
      {/* ── header ── */}
      <section className="px-6 pb-14 pt-28 sm:pt-36">
        <div className="mx-auto max-w-[1200px]">
          <nav aria-label="Breadcrumb" className={`${mono} flex items-center gap-2 text-[#a3a39b]`}>
            <Link to="/careers" className="inline-flex items-center gap-1.5 text-[#6b6b63] transition hover:text-[#1a1a17]">
              <ArrowLeft size={13} /> Careers
            </Link>
            <span>/</span>
            <span>{isGeneral ? "Open application" : job.team}</span>
          </nav>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
              <h1 className="max-w-[14ch] font-bold leading-[0.98] tracking-[-0.045em] text-[#1a1a17]" style={{ ...display, fontSize: "clamp(2.6rem, 6.4vw, 5.4rem)" }}>
                {job.title}
              </h1>
              <p className="mt-6 max-w-[36rem] text-[1.15rem] leading-[1.7] text-[#6b6b63]">{job.summary}</p>
            </motion.div>
            <motion.div
              className="hidden lg:block"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -50, rotate: -16 }}
              animate={{ opacity: 1, y: 0, rotate: -7 }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.9, delay: 0.15 }}
            >
              <CareerTile label={isGeneral ? "You" : job.team} color={style.color} shape={style.shape} size={170} />
            </motion.div>
          </div>

          <div className="mt-12 flex flex-col gap-6 border-y border-[#1a1a17] py-5 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {terms.map((t, i) => (
                <li key={t} className={`${mono} text-[#1a1a17]`}>
                  {t}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              <button onClick={share} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[#6b6b63] transition hover:bg-[#f2f0ec] hover:text-[#1a1a17]" aria-live="polite">
                {copied ? <><Check size={15} /> Copied</> : <><Link2 size={15} /> Copy link</>}
              </button>
              <button onClick={toForm} className="btn-primary !px-6 !py-2.5">
                Apply <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── description ── */}
      <div className="px-6">
        <article className="mx-auto max-w-[1200px] lg:pr-[22rem]">
          <Block n="01" title="What you'll bring">
            <Bullets items={job.bring} />
          </Block>
          <Block n="02" title="Why you'll love it">
            <ul className="space-y-5">
              {job.perks.map((p) => (
                <li key={p.body} className="grid grid-cols-[1.75rem_1fr] text-[1.05rem] leading-[1.75] text-[#4a4a44]">
                  <span aria-hidden className="mt-[0.3em] grid size-5 place-items-center rounded-full bg-[#2b5e54] text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>
                    {p.title && <span className="font-semibold text-[#1a1a17]">{p.title}. </span>}
                    {p.body}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[40rem] rounded-2xl bg-[#f2f0ec] px-6 py-5 text-[1.02rem] font-medium leading-relaxed text-[#1a1a17]">{job.note}</p>
          </Block>
          <Block n="03" title="The terms">
            <dl className="grid max-w-[40rem] grid-cols-2 gap-x-8 gap-y-5">
              {[
                ["Pay", "Unpaid for now. We plan to introduce paid internships as TACTO grows."],
                ["Hours", `${INTERNSHIP_TERMS.hours}, on your schedule.`],
                ["Length", `${INTERNSHIP_TERMS.duration}.`],
                ["You get", "A mentor, public credit for your work, a reference letter and a certificate."],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className={`${mono} text-[#a3a39b]`}>{k}</dt>
                  <dd className="mt-1.5 leading-relaxed text-[#4a4a44]">{v}</dd>
                </div>
              ))}
            </dl>
          </Block>
        </article>
      </div>

      {/* ── application ── */}
      <section id="apply" className="scroll-mt-16 px-6 pb-24 pt-16 sm:pb-32">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center gap-4 border-t border-[#1a1a17] pt-4">
            <span className={`${mono} text-[#1a1a17]`}>→</span>
            <span className={`${mono} text-[#6b6b63]`}>Apply</span>
          </div>
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="font-bold leading-[1.02] tracking-[-0.04em] text-[#1a1a17]" style={{ ...display, fontSize: "clamp(2rem, 4.4vw, 3.4rem)" }}>
                {isGeneral ? "Send an open application." : "Apply for this internship."}
              </h2>
              <p className="mt-5 max-w-sm leading-relaxed text-[#6b6b63]">
                It takes about five minutes. Only your name, email and a few sentences are required.
              </p>
              <p className="mt-4 max-w-sm leading-relaxed text-[#6b6b63]">
                Prefer email? Send {job.showUs.charAt(0).toLowerCase() + job.showUs.slice(1).replace(/\.$/, "")} to{" "}
                <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Application: ${job.title}`)}`} className="font-semibold text-[#1a1a17] underline decoration-[#c8c6c0] underline-offset-4 hover:decoration-[#1a1a17]">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
              {others.length > 0 && (
                <div className="mt-12 hidden lg:block">
                  <p className={`${mono} text-[#a3a39b]`}>Other internships</p>
                  <ul className="mt-4 border-t border-[#e4e2dd]">
                    {others.map((o) => (
                      <li key={o.slug} className="border-b border-[#e4e2dd]">
                        <Link to={`/careers/${o.slug}`} className="group flex items-center gap-3 py-3.5">
                          <TeamMark team={o.team} size={22} />
                          <span className="flex-1 text-[0.95rem] font-medium text-[#1a1a17]">{o.title}</span>
                          <ArrowUpRight size={15} className="text-[#a3a39b] transition group-hover:rotate-45 group-hover:text-[#1a1a17]" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <ApplicationForm jobSlug={job.slug} jobTitle={isGeneral ? "" : job.title} showUs={job.showUs} />
          </div>
        </div>
      </section>
    </div>
  );
}
