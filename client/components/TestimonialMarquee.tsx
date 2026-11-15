/**
 * Testimonial marquee, two rows of cards drifting in opposite directions.
 * Hovering pauses a row; clicking a card opens the full quote. Reduced-motion users get
 * a plain horizontally scrollable row instead.
 */
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Award, X } from "lucide-react";
import { useEffect, useState } from "react";
import { TESTIMONIALS, type Testimonial } from "@/data/testimonials";

const ACCENT: Record<string, string> = {
  Academia: "#4a3566",
  Technology: "#2b5e54",
  Learner: "#d97757",
  NGO: "#2b5e54",
  Educator: "#8b3a2f",
  Finance: "#6b6b63",
  Recognition: "#c9973a",
};

/** First sentence(s) up to ~200 characters, cut on a sentence boundary. */
function excerpt(q: string, max = 200) {
  if (q.length <= max) return q;
  const sentences = q.match(/[^.!?]+[.!?]+/g) ?? [q];
  let out = "";
  for (const s of sentences) {
    if ((out + s).length > max && out) break;
    out += s;
  }
  return out.trim();
}

function Card({ t, onOpen, clone }: { t: Testimonial; onOpen: (t: Testimonial) => void; clone?: boolean }) {
  const award = t.role === "Recognition";
  const short = award ? t.name : excerpt(t.quote);
  const cut = !award && short.length < t.quote.length;
  return (
    <button
      onClick={() => onOpen(t)}
      tabIndex={clone ? -1 : 0}
      className="group/card flex h-full w-[340px] shrink-0 flex-col rounded-[1.5rem] border border-[#e4e2dd] bg-white p-7 text-left transition duration-500 hover:-translate-y-1 hover:border-[#c8c6c0] hover:shadow-[0_24px_48px_-28px_rgba(26,26,23,.28)] sm:w-[400px]"
      aria-label={`Read the full quote from ${award ? "IET Hyderabad" : t.name}`}
    >
      <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em]" style={{ color: ACCENT[t.role] }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACCENT[t.role] }} />
        {t.role}
      </span>
      <p className="mt-5 flex-1 text-[1.02rem] leading-[1.65] text-[#1a1a17]" style={award ? { fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 700, fontSize: "1.3rem" } : undefined}>
        {award ? short : <>&ldquo;{short}&rdquo;</>}
      </p>
      {cut && <span className="mt-4 text-sm font-medium text-[#6b6b63] transition group-hover/card:text-[#1a1a17]">Read full quote →</span>}
      <span className="mt-7 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white" style={{ background: ACCENT[t.role], fontFamily: "'Cabinet Grotesk', sans-serif" }}>
          {award ? <Award size={16} /> : t.initial}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-[#1a1a17]">{award ? "IET Hyderabad" : t.name}</span>
          <span className="block truncate text-xs text-[#6b6b63]">{award ? "Engineering Resilience Award" : t.title}</span>
        </span>
      </span>
    </button>
  );
}

function Row({ items, reverse, duration, onOpen, still }: { items: Testimonial[]; reverse?: boolean; duration: number; onOpen: (t: Testimonial) => void; still: boolean }) {
  if (still)
    return (
      <div className="flex gap-4 overflow-x-auto px-6 pb-2">
        {items.map((t) => (
          <Card key={t.name} t={t} onOpen={onOpen} />
        ))}
      </div>
    );
  return (
    <div className="group/row flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        className="flex w-max gap-4 py-3 pr-4 group-hover/row:[animation-play-state:paused] group-focus-within/row:[animation-play-state:paused]"
        style={{ animation: `tacto-marquee ${duration}s linear infinite`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {[...items, ...items].map((t, i) => (
          <div key={i} aria-hidden={i >= items.length} className="flex">
            <Card t={t} onOpen={onOpen} clone={i >= items.length} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TestimonialMarquee() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<Testimonial | null>(null);
  const half = Math.ceil(TESTIMONIALS.length / 2);
  const rowA = TESTIMONIALS.slice(0, half);
  const rowB = TESTIMONIALS.slice(half);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <div className="mt-20 space-y-4">
      <style>{`@keyframes tacto-marquee { to { transform: translateX(-50%); } }`}</style>
      <Row items={rowA} duration={70} onOpen={setOpen} still={!!reduce} />
      <Row items={rowB} duration={80} reverse onOpen={setOpen} still={!!reduce} />

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-[#1a1a17]/40 p-5 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.figure
              role="dialog"
              aria-modal="true"
              aria-label={`Quote from ${open.name}`}
              initial={{ y: 24, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-[640px] overflow-y-auto rounded-[1.75rem] bg-white p-8 sm:p-12"
            >
              <button onClick={() => setOpen(null)} aria-label="Close" autoFocus className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-[#e4e2dd] text-[#1a1a17] hover:border-[#1a1a17]">
                <X size={16} />
              </button>
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]" style={{ color: ACCENT[open.role] }}>
                {open.role}
              </span>
              <blockquote className="mt-6 text-[1.15rem] leading-[1.75] text-[#1a1a17]">&ldquo;{open.quote}&rdquo;</blockquote>
              <figcaption className="mt-8 border-t border-[#f2f0ec] pt-6">
                <span className="block font-semibold text-[#1a1a17]">{open.role === "Recognition" ? "IET Hyderabad" : open.name}</span>
                <span className="block text-sm text-[#6b6b63]">{open.title}</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
