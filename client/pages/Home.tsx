import "@/components/landing.css";
import { animate, AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { Component, lazy, Suspense, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import WaitlistForm from "@/components/WaitlistForm";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import LetterForm from "@/components/LetterForm";
import SnapReveal, { Board, SlotTile, Tile } from "@/components/kit/SnapReveal";
import { fromSpecs } from "@/sim/blocks";
import { BrailleReading, TwoWaysToRead } from "@/components/kit/ReadingVisuals";
import { DISCLAIMER } from "@/data/testimonials";
import { postJSON, toBraille } from "@/lib/utils";

const Antigravity = lazy(() => import("@/components/Antigravity"));
const EASE = [0.22, 1, 0.36, 1] as const;
const display = { fontFamily: "'Cabinet Grotesk', sans-serif" };

/* ───────────────────────── primitives ───────────────────────── */

function Rise({ children, delay = 0, className, y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 1, delay, ease: EASE }}>
      {children}
    </motion.div>
  );
}

function Kicker({ children, center }: { children: ReactNode; center?: boolean }) {
  return <p className={`text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#a3a39b] ${center ? "text-center" : ""}`}>{children}</p>;
}

function Heading({ children, className = "", as: H = "h2" }: { children: ReactNode; className?: string; as?: "h1" | "h2" }) {
  return (
    <H className={`font-bold leading-[1.08] tracking-[-0.035em] text-[#1a1a17] text-balance ${className}`} style={{ ...display, fontSize: "clamp(2.1rem, 4.6vw, 3.8rem)" }}>
      {children}
    </H>
  );
}

/* ═════════════════════════ 1 · HERO ═════════════════════════ */

const BRAILLE_LINE = toBraille("code you can feel");

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "32%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.96]);

  return (
    <section ref={ref} id="hero" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pb-20 pt-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,#e4e2dd_1px,transparent_1px),linear-gradient(to_bottom,#e4e2dd_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,#000_30%,transparent_100%)]"
      />
      <div className="absolute inset-0 z-[1]" aria-hidden>
        <Suspense fallback={null}>
          <Antigravity
            count={2500}
            magnetRadius={12}
            ringRadius={14}
            waveSpeed={0.4}
            waveAmplitude={1.5}
            particleSize={1}
            lerpSpeed={0.2}
            colors={["#1a1a17", "#8b3a2f", "#2b5e54", "#4a3566", "#d97757"]}
            autoAnimate={false}
            particleVariance={2}
            rotationSpeed={0.05}
            depthFactor={1.5}
            pulseSpeed={3}
            particleShape="capsule"
            fieldStrength={10}
          />
        </Suspense>
      </div>

      <motion.div style={{ y, opacity, scale }} className="pointer-events-none relative z-[2] mx-auto flex max-w-[860px] flex-col items-center text-center [&_a]:pointer-events-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <a href="#contact" className="mb-10 inline-block rounded-full border border-[#e4e2dd] bg-[#f2f0ec]/90 px-5 py-2 text-[0.8125rem] font-semibold tracking-[0.02em] text-[#6b6b63] backdrop-blur transition hover:text-[#1a1a17]">
            Now accepting early partners →
          </a>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="font-extrabold leading-[1.08] tracking-[-0.035em] text-[#1a1a17] text-balance"
          style={{ ...display, fontSize: "clamp(2.6rem, 6.6vw, 4.75rem)" }}
        >
          The first programming language <span className="text-[#a3a39b]">you don't need eyes to learn.</span>
        </motion.h1>

        {/* the tagline, written in Braille, dot by dot */}
        <p aria-hidden className="mt-6 text-[1.35rem] tracking-[0.18em] text-[#c8c6c0]">
          {[...BRAILLE_LINE].map((c, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.05 }}>
              {c}
            </motion.span>
          ))}
        </p>

        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-6 max-w-[580px] text-[clamp(1.06rem,2vw,1.25rem)] leading-[1.7] text-[#6b6b63]">
          TACTO turns code into objects. Children snap tactile blocks onto a reader board, press play, and hear their program come alive. Loops, logic and all.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/simulator" className="btn-primary">
            Try the simulator <ArrowRight size={18} />
          </Link>
          <a href="#how-it-works" className="btn-ghost">
            See how it works <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="scroll-indicator" aria-hidden>
        <motion.span className="scroll-dot" animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      </motion.div>
    </section>
  );
}

/* ═════════════════════════ 2 · MANIFESTO (scroll-lit words) ═════════════════════════ */

const MANIFESTO =
  "Every tool built to teach children programming starts from the same assumption: that the learner can see a screen. Screen readers narrate interfaces that were never designed to be heard. So we started from the opposite end: code you hold, hear, and feel.";

function Word({ w, i, n, progress }: { w: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = i / n;
  const opacity = useTransform(progress, [start, start + 1.5 / n], [0.14, 1]);
  const accent = /hold,|hear,|feel\./.test(w);
  return (
    <motion.span style={{ opacity }} className={accent ? "text-[#d97757]" : undefined}>
      {w}{" "}
    </motion.span>
  );
}

function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 45%"] });
  const words = MANIFESTO.split(" ");
  return (
    <section id="story" className="mx-auto max-w-[1100px] scroll-mt-24 px-6 py-36 sm:py-48">
      <Kicker>Why TACTO exists</Kicker>
      <div ref={ref}>
        <p className="mt-8 font-bold leading-[1.22] tracking-[-0.025em] text-[#1a1a17]" style={{ ...display, fontSize: "clamp(1.8rem, 3.8vw, 3.1rem)" }}>
          {words.map((w, i) => (
            <Word key={i} w={w} i={i} n={words.length} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  );
}

/* ═════════════════════════ 3 · MEET THE KIT ═════════════════════════ */

/* ═════════════════════════ 4 · BENTO ═════════════════════════ */

function Card({ className = "", dark, children, delay = 0 }: { className?: string; dark?: boolean; children: ReactNode; delay?: number }) {
  return (
    <Rise delay={delay} y={20} className={`overflow-hidden rounded-[1.75rem] border p-8 sm:p-10 ${dark ? "border-[#2a2a26] bg-[#1a1a17] text-[#fafaf8]" : "border-[#e4e2dd] bg-white"} ${className}`}>
      {children}
    </Rise>
  );
}

function CardTitle({ n, title, body, dark }: { n?: string; title: string; body: string; dark?: boolean }) {
  return (
    <>
      {n && <p className={`font-mono text-sm ${dark ? "text-[#6b6b63]" : "text-[#a3a39b]"}`}>{n}</p>}
      <h3 className="mt-2 text-[1.75rem] font-bold leading-[1.12] tracking-[-0.02em]" style={display}>
        {title}
      </h3>
      <p className={`mt-3 max-w-[440px] leading-[1.7] ${dark ? "text-[#a3a39b]" : "text-[#6b6b63]"}`}>{body}</p>
    </>
  );
}

function Waveform() {
  return (
    <div className="flex h-20 items-center gap-[5px]" aria-hidden>
      {Array.from({ length: 34 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[4px] rounded-full bg-[#d97757]"
          animate={{ height: [6, 10 + Math.abs(Math.sin(i * 0.7)) * 56, 8, 22 + Math.abs(Math.cos(i * 0.4)) * 30, 6] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.045, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

const FAMILY_TILES = fromSpecs("forward repeat:3 if:on_gem play_note:C4:1");
const MINI_PROGRAM = fromSpecs("repeat:3 play_note:C4:1 end");

function Bento() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-[#f2f0ec] py-36 sm:py-44">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-16 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <Kicker>How it works</Kicker>
            <Rise>
              <Heading className="mt-5">Three layers. One seamless experience.</Heading>
            </Rise>
          </div>
          <Rise delay={0.1}>
            <p className="max-w-[440px] text-lg leading-[1.75] text-[#6b6b63] lg:ml-auto">Every piece is designed to disappear, so the learner focuses on logic, not logistics.</p>
          </Rise>
        </div>

        <div className="grid gap-4 md:grid-cols-6">
          <Card className="md:col-span-4">
            <CardTitle n="01" title="Tactile tiles" body="A raised shape for every concept, Braille and large print on every tile, and dials you can count by feel." />
            <div className="mt-10 flex items-end justify-center gap-4 sm:gap-6">
              {FAMILY_TILES.map((t, i) => (
                <motion.div key={t.uid} initial={{ y: 40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, duration: 1, ease: EASE }} whileHover={{ y: -10 }}>
                  <Tile inst={t} size={i === 1 ? 124 : 100} />
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="flex flex-col md:col-span-2" delay={0.06}>
            <h3 className="text-[1.5rem] font-bold leading-tight" style={display}>
              Braille on every tile.
            </h3>
            <p className="mt-2 text-[#6b6b63]">Grade-1 Braille under every label, read one cell at a time, just like a page.</p>
            <div className="mt-auto flex justify-center pt-10">
              <BrailleReading word="collect" />
            </div>
          </Card>

          <Card className="md:col-span-3">
            <CardTitle n="02" title="The reader board" body="Read left to right, like Braille. It senses each tile the moment it seats. No cables, no pairing." />
            <div className="mt-10 [perspective:1200px]">
              <div className="[transform:rotateX(26deg)]">
                <Board running={false} slots={4}>
                  {(i) => (i < 3 ? <SlotTile inst={MINI_PROGRAM[i]} index={i} seated lit={false} /> : null)}
                </Board>
              </div>
            </div>
          </Card>

          <Card dark className="flex flex-col md:col-span-3" delay={0.06}>
            <CardTitle n="03" dark title="Audio intelligence" body="It reads every step aloud, explains what went wrong in words a seven-year-old understands, and never loses patience." />
            <div className="mt-auto pt-10">
              <Waveform />
              <p className="mt-6 border-l-2 border-[#d97757] pl-4 text-[1.05rem] leading-relaxed text-[#e4e2dd]">“Tile four: this Repeat has no End. Add an End after the tiles it should repeat.”</p>
            </div>
          </Card>

          <Card dark className="md:col-span-2">
            <h3 className="text-[1.5rem] font-bold" style={display}>
              Spatial sound.
            </h3>
            <p className="mt-2 text-[#a3a39b]">Sounds move left and right, so learners hear where things are.</p>
            <div className="relative mt-10 h-14" aria-hidden>
              <div className="absolute inset-x-6 top-1/2 h-px bg-[#3a3a35]" />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6b6b63]">L</span>
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#6b6b63]">R</span>
              <motion.span className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-[#d97757] shadow-[0_0_20px_rgba(217,119,87,.7)]" animate={{ left: ["10%", "86%", "10%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
            </div>
          </Card>
          <Card className="md:col-span-2" delay={0.05}>
            <p className="font-bold leading-none tracking-[-0.04em] text-[#1a1a17]" style={{ ...display, fontSize: "clamp(3rem,6vw,4.5rem)" }}>
              0
            </p>
            <h3 className="mt-3 text-[1.5rem] font-bold" style={display}>
              Screens required.
            </h3>
            <p className="mt-2 text-[#6b6b63]">The board has its own speaker and battery. It works offline, anywhere.</p>
          </Card>
          <Card className="md:col-span-2" delay={0.1}>
            <p className="font-bold leading-none tracking-[-0.04em] text-[#1a1a17]" style={{ ...display, fontSize: "clamp(3rem,6vw,4.5rem)" }}>
              40
            </p>
            <h3 className="mt-3 text-[1.5rem] font-bold" style={display}>
              Lessons to play.
            </h3>
            <p className="mt-2 text-[#6b6b63]">From a first step to FizzBuzz: loops, decisions, variables and functions.</p>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ═════════════════════════ 7 · VOICES ═════════════════════════ */

function Voices() {
  return (
    <section id="voices" className="scroll-mt-20 bg-[#f2f0ec] py-36 sm:py-44">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-[900px] text-center">
          <Kicker center>Voices from the field</Kicker>
          <Rise>
            <blockquote className="mt-10 font-bold leading-[1.3] tracking-[-0.02em] text-[#1a1a17] text-balance" style={{ ...display, fontSize: "clamp(1.5rem, 3vw, 2.35rem)" }}>
              “A well-designed and innovative approach to making STEM education accessible… a meaningful step toward reducing barriers for students who are often underserved.”
            </blockquote>
          </Rise>
          <Rise delay={0.1} className="mt-8 flex items-center justify-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#1a1a17] text-sm font-bold text-white" style={display}>
              VB
            </span>
            <span className="text-left">
              <span className="block font-semibold text-[#1a1a17]">Vivek Bajpai</span>
              <span className="block text-sm text-[#6b6b63]">Assistant Professor, University of Oklahoma</span>
            </span>
          </Rise>
        </div>


      </div>
      <TestimonialMarquee />
      <p className="mx-auto mt-14 max-w-3xl px-6 text-center text-xs italic leading-relaxed text-[#a3a39b]">{DISCLAIMER}</p>
    </section>
  );
}

/* ═════════════════════════ 8 · SIMULATOR ═════════════════════════ */

function Simulator() {
  return (
    <section className="mx-auto max-w-[1200px] px-6 py-36 sm:py-44">
      <Rise className="grid items-center gap-14 overflow-hidden rounded-[2rem] border border-[#e4e2dd] bg-white p-8 sm:p-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <Kicker>The simulator</Kicker>
          <Heading className="mt-5">No kit yet? Start in your browser.</Heading>
          <p className="mt-6 max-w-[460px] text-lg leading-[1.75] text-[#6b6b63]">
            Every lesson runs online with the same blocks, sounds and spoken feedback as the board, so learners can practise at home, and teachers can plan before a kit arrives.
          </p>
          <ul className="mt-8 space-y-3 text-[#1a1a17]">
            {["Eyes-free mode: follow Pip by sound alone", "Spatial audio, spoken errors, natural voices", "Progress saved, no account needed"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#f2f0ec]">
                  <Check size={14} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <Link to="/simulator" className="btn-primary mt-10">
            Open the simulator <ArrowRight size={18} />
          </Link>
        </div>
        <div className="rounded-[1.5rem] bg-[#fafaf8] p-4 sm:p-8">
          <div className="[perspective:1200px]">
            <div className="[transform:rotateX(22deg)]">
              <Board running slots={4}>
                {(i) => <SlotTile inst={MINI_PROGRAM[i] ?? fromSpecs("say:Hello!")[0]} index={i} seated lit={i === 1} />}
              </Board>
            </div>
          </div>
        </div>
      </Rise>
    </section>
  );
}

/* ═════════════════════════ 9 · PHILOSOPHY ═════════════════════════ */

function Philosophy() {
  return (
    <section className="border-t border-[#e4e2dd] bg-white py-36 sm:py-44">
      <div className="mx-auto grid max-w-[1200px] items-center gap-16 px-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <Kicker>Philosophy</Kicker>
          <Rise>
            <Heading className="mt-5">
              We don't build accessible versions. <span className="text-[#a3a39b]">We build one version, for everyone.</span>
            </Heading>
          </Rise>
          <Rise delay={0.1}>
            <p className="mt-8 max-w-[520px] text-lg leading-[1.75] text-[#6b6b63]">
              When a design works for a blind child first, it works beautifully for everyone else. In a TACTO classroom, a visually impaired student and her sighted classmates build side by side, on the same board, with the same blocks.
            </p>
          </Rise>
        </div>
        <Rise delay={0.1}>
          <TwoWaysToRead />
        </Rise>
      </div>
    </section>
  );
}

/* ═════════════════════════ 10 · CONTACT ═════════════════════════ */

function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-[#e4e2dd] bg-[#f2f0ec] py-36 sm:py-44">
      <div className="mx-auto grid max-w-[1200px] gap-16 px-6 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <Kicker>Get involved</Kicker>
          <Rise>
            <Heading className="mt-5">Let's bring TACTO to your classroom.</Heading>
          </Rise>
          <Rise delay={0.1}>
            <p className="mt-6 max-w-[440px] text-lg leading-[1.75] text-[#6b6b63]">
              We're partnering with schools, educators and organisations who want every child to have the chance to build. Join the waitlist, or write to us directly.
            </p>
          </Rise>
          <Rise delay={0.15} className="mt-10">
            <WaitlistForm />
          </Rise>
          <Rise delay={0.2} className="mt-12 grid gap-6 sm:grid-cols-2">
            {[
              ["General", "hello@projecttacto.org"],
              ["Partnerships", "contact@projecttacto.org"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[#a3a39b]">{k}</p>
                <a href={`mailto:${v}`} className="mt-2 block font-medium text-[#1a1a17] transition hover:text-[#d97757]">
                  {v}
                </a>
              </div>
            ))}
          </Rise>
        </div>
        <Rise delay={0.1}>
          <LetterForm />
        </Rise>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="landing-root">
      <Hero />
      <Manifesto />
      <SnapReveal id="kit" />
      <Bento />
      <Voices />
      <Simulator />
      <Philosophy />
      <Contact />
    </div>
  );
}
