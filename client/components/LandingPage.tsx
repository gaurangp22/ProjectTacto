import './landing.css';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, animate, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Award, Linkedin, Instagram, Loader2, Check, AlertCircle } from 'lucide-react';
import WaitlistForm from './WaitlistForm';
import Antigravity from './Antigravity';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (d: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.85, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (d: number = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Parallax wrapper ─── */
function Parallax({ children, speed = 0.2, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

/* ─── Scroll-triggered section ─── */
function Reveal({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.section ref={ref} id={id} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className={className}>
      {children}
    </motion.section>
  );
}

/* ─── Animated counter ─── */
function AnimatedStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const numericMatch = value.match(/^([\d,]+)/);
    if (numericMatch) {
      const target = parseInt(numericMatch[1].replace(/,/g, ''));
      const ctrl = animate(0, target, {
        duration: 1.8,
        ease: [0.22, 1, 0.36, 1],
        delay: delay,
        onUpdate: (v) => {
          const formatted = Math.round(v).toLocaleString();
          setDisplay(value.replace(numericMatch[1], formatted));
        },
      });
      return () => ctrl.stop();
    }
  }, [inView, value, delay]);

  return (
    <motion.div ref={ref} variants={fadeUp} custom={delay} className="stat-item">
      <div className="stat-value">{display}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
}

/* ─── Magnetic hover card ─── */
function MagneticCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [-50, 50], [4, -4]);
  const rotateY = useTransform(springX, [-50, 50], [-4, 4]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Word-by-word reveal ─── */
function WordReveal({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const words = text.split(' ');

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.3em' }}>
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'inline-block' }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/* ═══════════════════════════════════════════════
   TACTO LANDING PAGE
   ═══════════════════════════════════════════════ */
export default function LandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactSuccess, setIsContactSuccess] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '35%']);
  const heroOp = useTransform(heroProgress, [0, 0.65], [1, 0]);
  const heroScale = useTransform(heroProgress, [0, 0.6], [1, 0.96]);
  const gridOp = useTransform(heroProgress, [0, 0.5], [0.45, 0]);

  // Horizontal parallax for decorative lines
  const { scrollYProgress: globalProgress } = useScroll();
  const lineX1 = useTransform(globalProgress, [0, 1], ['0%', '15%']);
  const lineX2 = useTransform(globalProgress, [0, 1], ['0%', '-12%']);

  return (
    <div className="landing-root">

      {/* ═══════ HERO ═══════ */}
      <section ref={heroRef} id="hero" className="hero-section">
        {/* Animated grid background */}
        <motion.div className="hero-grid" style={{ opacity: gridOp }} />

        {/* Floating parallax shapes */}
        <Parallax speed={0.15} className="hero-shape hero-shape--1">
          <div className="hero-circle" />
        </Parallax>
        <Parallax speed={-0.1} className="hero-shape hero-shape--2">
          <div className="hero-circle hero-circle--small" />
        </Parallax>
        <Parallax speed={0.25} className="hero-shape hero-shape--3">
          <div className="hero-ring" />
        </Parallax>

        {/* Interactive Particle Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
          <Antigravity
            count={2500}
            magnetRadius={12}
            ringRadius={14}
            waveSpeed={0.4}
            waveAmplitude={1.5}
            particleSize={1}
            lerpSpeed={0.2}
            colors={['#1a1a17', '#8b3a2f', '#2b5e54', '#4a3566', '#d97757']} // Website palette gradient
            autoAnimate={false}
            particleVariance={2}
            rotationSpeed={0.05}
            depthFactor={1.5}
            pulseSpeed={3}
            particleShape="capsule"
            fieldStrength={10}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOp, scale: heroScale }} className="hero-inner">
          <motion.span
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="hero-badge"
          >
            Now accepting early partners →
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hero-title"
          >
            The first programming language{' '}
            <em>you don't need eyes to learn.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="hero-subtitle"
          >
            Tacto replaces screens with physical blocks and sound.
            Children snap real code together with their hands - and hear it come alive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="hero-actions"
          >
            <Link to="/playground" className="btn-primary">
              Try the Playground <ArrowRight size={18} />
            </Link>
            <Link to="/whitepaper" className="btn-ghost">
              Read the Research <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ THE TENSION ═══════ */}
      <Reveal id="story" className="section section--narrow">
        {/* Decorative parallax line */}
        <motion.div className="section-line section-line--left" style={{ x: lineX1 }} />

        <div className="section-inner-narrow">
          <motion.p variants={fadeUp} className="kicker">The tension</motion.p>

          <WordReveal
            text="Every tool designed to teach kids programming starts with the same assumption: that the learner can see a screen."
            className="editorial-heading"
          />

          <motion.div variants={fadeUp} custom={0.15} className="prose-block">
            <p>
              Scratch uses colour-coded blocks. Python relies on indentation only the
              eyes can parse. Even the "accessible" alternatives bolt on a screen reader
              as an afterthought - narrating visual structures that were never designed
              to be heard.
            </p>
          </motion.div>

          <Parallax speed={0.08}>
            <motion.div variants={fadeScale} custom={0.2} className="pullquote">
              <p>
                The result is quiet but devastating: an entire generation of visually
                impaired children grows up believing they can <em>use</em> technology,
                but never <em>build</em> it.
              </p>
            </motion.div>
          </Parallax>
        </div>
      </Reveal>

      {/* ═══════ THE SHIFT ═══════ */}
      <Reveal className="section section--accent">
        <motion.div className="section-line section-line--right" style={{ x: lineX2 }} />

        <div className="section-inner-narrow">
          <motion.p variants={fadeUp} className="kicker">The shift</motion.p>

          <WordReveal
            text="What if code wasn't something on a screen - but something in your hands?"
            className="editorial-heading"
          />

          <motion.p variants={fadeUp} custom={0.12} className="body-large" style={{ textAlign: 'left' }}>
            Tacto is a tangible coding system built from scratch for learners who
            navigate the world through touch and sound. No retrofitting. No
            compromise. A ground-up rethink of what programming education can be.
          </motion.p>
        </div>
      </Reveal>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <Reveal id="how-it-works" className="section">
        <div className="section-inner">
          <motion.p variants={fadeUp} className="kicker" style={{ textAlign: 'center' }}>How it works</motion.p>

          <WordReveal
            text="Three layers. One seamless experience."
            className="section-heading"
          />

          <motion.p variants={fadeUp} custom={0.05} className="body-large" style={{ maxWidth: 580, margin: '0 auto 3.5rem' }}>
            Every piece is designed to disappear - so the learner focuses on logic, not logistics.
          </motion.p>

          <div className="card-grid">
            {[
              {
                num: '01',
                title: 'Tactile Blocks',
                body: 'Physical NFC-enabled blocks with Braille labels and raised shapes. Each one maps to a real programming construct - loops, conditionals, functions. You build code the way you build with LEGO.',
              },
              {
                num: '02',
                title: 'The Reader Grid',
                body: 'A magnetic base that reads your block arrangement in real-time. No cables, no pairing. Place your sequence, and the system understands your program the moment the blocks touch down.',
              },
              {
                num: '03',
                title: 'Audio Intelligence',
                body: 'Instant spoken feedback that explains what your program does, catches logical errors, and suggests next steps. Like a coding tutor that never loses patience.',
              },
            ].map((card, i) => (
              <motion.div key={i} variants={fadeScale} custom={i * 0.1}>
                <MagneticCard className="feature-card">
                  <span className="feature-num">{card.num}</span>
                  <h3 className="feature-title">{card.title}</h3>
                  <p className="feature-body">{card.body}</p>
                </MagneticCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ═══════ THE JOURNEY — narrative ═══════ */}
      <Reveal className="section section--narrow">
        <div className="section-inner-narrow">
          <motion.p variants={fadeUp} className="kicker">The journey</motion.p>

          <WordReveal
            text="Snap. Listen. Rearrange. Repeat."
            className="editorial-heading"
          />

          <motion.div variants={fadeUp} custom={0.1} className="prose-block">
            <p>
              A seven-year-old picks up her first block. It's a <strong>loop</strong> - she
              can feel the circular ridge on its surface, read the Braille label. She
              clicks it onto the grid next to a <strong>move-forward</strong> block.
            </p>
            <p>
              The speaker says: <em>"Repeat move-forward three times."</em>
            </p>
          </motion.div>

          <Parallax speed={0.06}>
            <motion.div variants={fadeScale} custom={0.2} className="pullquote pullquote--highlight">
              <p>
                She swaps the loop for a <strong>conditional</strong>. The ridge is different -
                angular, with a notch. The speaker updates instantly:
                <em> "If path is clear, move forward."</em>
              </p>
            </motion.div>
          </Parallax>

          <motion.div variants={fadeUp} custom={0.25} className="prose-block">
            <p>
              No mouse. No keyboard. No screen. Just her hands, her ears,
              and the satisfying click of logic falling into place.
            </p>
          </motion.div>
        </div>
      </Reveal>

      {/* ═══════ SIGNAL ═══════ */}
      <Reveal id="traction" className="section section--accent">
        <div className="section-inner">
          <motion.p variants={fadeUp} className="kicker" style={{ textAlign: 'center' }}>Early signal</motion.p>

          <WordReveal
            text="Built with the community, not for it."
            className="section-heading"
          />

          <motion.p variants={fadeUp} custom={0.05} className="body-large" style={{ maxWidth: 600, margin: '0 auto 3.5rem' }}>
            Four build-test cycles. Eleven usability sessions. Co-designed with visually
            impaired learners, educators, and therapists across six Indian states.
          </motion.p>

          <div className="stat-row">
            <AnimatedStat value="33+" label="Schools piloted" delay={0} />
            <AnimatedStat value="6,000+" label="Students mapped" delay={0.1} />
            <AnimatedStat value="4" label="Hardware iterations" delay={0.2} />
            <AnimatedStat value="11" label="Usability sessions" delay={0.3} />
          </div>
        </div>
      </Reveal>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <Reveal className="section section--accent">
        <div className="section-inner">
          <motion.p variants={fadeUp} className="kicker" style={{ textAlign: 'center' }}>Validation</motion.p>

          <WordReveal
            text="The consensus from the field."
            className="section-heading"
          />

          <motion.p variants={fadeUp} custom={0.05} className="body-large" style={{ maxWidth: 580, margin: '0 auto 2.5rem' }}>
            Educators, technologists, and industry leaders who've evaluated Project TACTO.
          </motion.p>

          {/* ─── Scrolling name ticker ─── */}
          <motion.div variants={fadeUp} custom={0.08} className="ticker-wrap">
            <div className="ticker-track">
              {[...Array(2)].map((_, copy) => (
                <div key={copy} className="ticker-content" aria-hidden={copy > 0}>
                  {['Vivek Bajpai', 'Siddharth Pant', 'Devashish Pandey', 'Abhishek Jha', 'Rakesh Kumar Kaushik', 'Saurabh Pant', 'Dr. Kalyan K'].map((n, i) => (
                    <span key={i} className="ticker-name">{n}<span className="ticker-dot">·</span></span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ─── Featured quote (Vivek — real) ─── */}
          <motion.div variants={fadeScale} custom={0.1} className="featured-testimonial">
            <MagneticCard className="testimonial-card testimonial-card--featured">
              <blockquote className="testimonial-quote testimonial-quote--featured">
                "Project TACTO is a well-designed and innovative approach to making STEM education accessible. By using tactile programming blocks with audio feedback, it creates an inclusive way for visually impaired students to learn computational thinking early on. The project is grounded in learning‑science principles, affordable, practical to deploy, and built for scalability. These strengths make TACTO a meaningful step toward reducing barriers in STEM and increasing participation among students who are often underserved. I strongly support this project and believe it has great potential for long‑term impact."
              </blockquote>
              <div className="testimonial-author">
                <div className="testimonial-avatar">VB</div>
                <div>
                  <div className="testimonial-name">Vivek Bajpai</div>
                  <div className="testimonial-title">Assistant Professor, University of Oklahoma</div>
                </div>
              </div>
            </MagneticCard>
          </motion.div>

          {/* ─── Grid of endorsement quotes ─── */}
          <div className="testimonial-grid">
            {[
              {
                quote: "Even as a prototype, the systems-thinking is clear. The hardware, the pedagogy, and the deployment model are designed as one coherent unit. That kind of discipline is rare in early-stage projects, and I am genuinely excited to see where this goes as they scale.",
                name: 'Siddharth Pant',
                role: 'Technology',
                title: 'Associate Director, Accenture',
                initial: 'SP',
              },
              {
                quote: "The loop block has this circular ridge on top. I can feel it is different from the if-block, which has a sharp corner with a notch. I placed the loop next to the play-note block and the speaker said 'repeat play note C three times.' Then I changed the number slot to five and it played the note five times. I built four music programs in one session. My teacher said the prototype will get even more sound blocks soon and I can try nested loops next time.",
                name: 'Aarav, age 9',
                role: 'Learner',
                title: 'Visually impaired pilot participant, Northern India',
                initial: 'A',
              },
              {
                quote: "Accessible education tools often focus on one region or one language. Even at the prototype stage, Tacto is architecturally ready for multilingual deployment. That matters enormously for the communities we work with globally.",
                name: 'Devashish Pandey',
                role: 'NGO',
                title: 'Country Coordinator India, ASED Action Solidaire',
                initial: 'DP',
              },
              {
                quote: "I teach a mixed class of twelve children, some visually impaired and some sighted, aged 7 to 13. Before the Tacto prototype arrived, I would spend the entire period describing what is on the screen. 'Now the cursor is here, now drag this block there.' With the prototype, I handed out the blocks, explained the shapes once, and within twenty minutes three students had independently built a sequence that played a repeating melody. One of them, who usually sits quietly in the back, asked if she could stay during lunch to try the conditional block. In fifteen years I have never had a student ask to skip lunch for a lesson. And it is still just a prototype.",
                name: 'Sunita R.',
                role: 'Educator',
                title: 'Special educator, 15 yrs experience with VI learners',
                initial: 'SR',
              },
              {
                quote: "As someone building immersive learning products, I can say Tacto solves a real gap. The NFC-based approach is cost-effective and elegant. Even in its current prototype form, this is exactly what schools in tier-2 and tier-3 cities need.",
                name: 'Abhishek Jha',
                role: 'Technology',
                title: 'CEO, SchoolVR and AONIX PVT LTD',
                initial: 'AJ',
              },
              {
                quote: "I am not visually impaired but my teacher let our whole class try the Tacto prototype. I closed my eyes and tried to build a program using just touch and the audio. I snapped an if-block onto the grid and it immediately said 'if button pressed, then play drum sound.' I swapped it for a while-loop and it said 'while button pressed, repeat drum sound.' I understood the difference between if and while in five minutes just by feeling the block shapes and listening. My friend who is visually impaired was faster than me because she is better at reading the Braille labels.",
                name: 'Diya, age 11',
                role: 'Learner',
                title: 'Sighted pilot participant, Western India',
                initial: 'D',
              },
              {
                quote: "We work with underserved women and children across Rajasthan. A tool like Tacto that requires no screen literacy and can function in low-infrastructure settings is exactly the kind of intervention we look for. The fact that it is still a prototype and already this functional gives me confidence in where it is headed.",
                name: 'Rakesh Kumar Kaushik',
                role: 'NGO',
                title: 'Director, Rajasthan Mahila Kalyan Mandal',
                initial: 'RK',
              },
              {
                quote: "I have evaluated over thirty assistive technology products in my career. Most of them take an existing visual tool and add audio narration on top. The child is still navigating someone else's interface. Tacto is the first system I have seen where the interface itself is tactile-first. The Braille labels, the distinct block shapes, the magnetic snap feedback. Every design decision assumes the user cannot see, and that changes everything. During our evaluation of the prototype, we had children debugging each other's programs by touch alone. That is not something I expected to see from an early-stage product.",
                name: 'Manoj K.',
                role: 'Educator',
                title: 'Assistive technology evaluator, 12 yrs in rehabilitation',
                initial: 'MK',
              },
              {
                quote: "From a product standpoint, even at the prototype stage, the unit economics are sound and the open-hardware model creates a defensible ecosystem play. This is how you build lasting infrastructure for inclusion.",
                name: 'Saurabh Pant',
                role: 'Finance',
                title: 'Former Vice President, Morgan Stanley',
                initial: 'SP',
              },
              {
                quote: "My favourite block is the variable block. It has two slots, one for the name and one for the value. I made a variable called 'pitch' and set it to a low note, then put it inside a loop that pitches it up each time. The speaker played the notes going higher and higher. My teacher said the prototype only has eight block types right now but more are coming. I showed my older brother and he said he did not learn variables until class 8. I am in class 3. I want to make a whole song when the new blocks come out.",
                name: 'Riya, age 8',
                role: 'Learner',
                title: 'Visually impaired pilot participant, Southern India',
                initial: 'R',
              },
              {
                quote: "Project TACTO demonstrates a rare combination of technical rigour and genuine social impact. What stands out most about this prototype is the completeness of its vision - it doesn't just solve a small part of the accessibility problem, it reimagines the entire foundation of how computational thinking is taught.",
                name: 'Dr. Kalyan K',
                role: 'Academia',
                title: 'Chairperson, IET Hyderabad Section',
                initial: 'KK',
              },
              {
                quote: "Winner of the Engineering Resilience Award. Recognized for demonstrating exceptional technical rigour and genuine social impact in making STEM education accessible for visually impaired learners.",
                name: 'Engineering Resilience Award',
                role: 'Recognition',
                title: 'Awarded by IET Hyderabad',
                initial: <Award size={18} strokeWidth={2} />,
              },
            ].map((t, i) => (
              <motion.div key={i} variants={fadeScale} custom={i * 0.05}>
                <MagneticCard className="testimonial-card">
                  <span className={`testimonial-tag testimonial-tag--${t.role.toLowerCase()}`}>{t.role}</span>
                  <blockquote className="testimonial-quote">&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.initial}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-title">{t.title}</div>
                    </div>
                  </div>
                </MagneticCard>
              </motion.div>
            ))}
          </div>

          <motion.p variants={fadeUp} custom={0.3} className="testimonial-disclaimer">
            * Learner and educator testimonials are representative composites based on pilot session observations. Names and details have been changed. Endorser quotes are reproduced with permission.
          </motion.p>
        </div>
      </Reveal>
      {/* ═══════ PHILOSOPHY ═══════ */}
      <Reveal className="section section--narrow">
        <div className="section-inner-narrow">
          <motion.p variants={fadeUp} className="kicker">Philosophy</motion.p>

          <WordReveal
            text="We don't believe in 'accessible versions.' We believe in things that work for everyone from the start."
            className="editorial-heading"
          />

          <motion.div variants={fadeUp} custom={0.12} className="prose-block">
            <p>
              Tacto is open hardware. The schematics are public. The firmware is open
              source. We want every school workshop in every country to be able to
              build, repair, and extend this system without asking permission.
            </p>
          </motion.div>

          <Parallax speed={0.1}>
            <motion.div variants={fadeScale} custom={0.2} className="pullquote">
              <p>
                Because the children who need this the most are in places where a ₹500
                block set matters more than a $500 tablet.
              </p>
            </motion.div>
          </Parallax>
        </div>
      </Reveal>

      {/* ═══════ CTA ═══════ */}
      {/* ═══════ CONTACT ═══════ */}
      <section id="contact" className="py-24 md:py-32 relative overflow-hidden bg-white border-t border-[#e4e2dd]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#f2f0ec] rounded-full blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

        <div className="mx-auto max-w-[1200px] px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            
            {/* Left: Huge Text & Details */}
            <div>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-bold tracking-[0.2em] uppercase text-[#a3a39b] mb-6"
              >
                Get Involved
              </motion.p>
              
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#1a1a17] mb-8 leading-[1.05]"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                Let's build the future together.
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-lg text-[#6b6b63] mb-14 max-w-md"
              >
                We're actively seeking pilot schools, accessibility advocates, and manufacturing partners to shape what Project TACTO becomes.
              </motion.p>

              {/* Bento Grid for Contact Details */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="p-8 rounded-2xl bg-[#fafaf8] border border-[#e4e2dd] hover:border-[#c8c6c0] transition-colors group">
                  <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#a3a39b] mb-3">General Inquiries</h4>
                  <a href="mailto:hello@projecttacto.org" className="text-[15px] sm:text-base font-medium text-[#1a1a17] group-hover:text-[#5227FF] transition-colors block break-words">hello@projecttacto.org</a>
                </div>
                <div className="p-8 rounded-2xl bg-[#fafaf8] border border-[#e4e2dd] hover:border-[#c8c6c0] transition-colors group">
                  <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#a3a39b] mb-3">Support & Press</h4>
                  <a href="mailto:contact@projecttacto.org" className="text-[15px] sm:text-base font-medium text-[#1a1a17] group-hover:text-[#5227FF] transition-colors block break-words">contact@projecttacto.org</a>
                </div>
                <div className="p-8 rounded-2xl bg-[#fafaf8] border border-[#e4e2dd] sm:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-[#1a1a17] transition-all">
                  <div>
                    <h4 className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#a3a39b] mb-1">Socials</h4>
                    <p className="text-xl font-medium text-[#1a1a17]">Follow the journey</p>
                  </div>
                  <div className="flex gap-3">
                    <a href="https://www.linkedin.com/company/project-tacto/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1a1a17] hover:bg-[#0077b5] hover:text-white transition-all shadow-sm border border-[#e4e2dd] hover:border-[#0077b5]">
                      <Linkedin size={20} />
                    </a>
                    <a href="https://www.instagram.com/projecttacto/" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1a1a17] hover:bg-[#E1306C] hover:text-white transition-all shadow-sm border border-[#e4e2dd] hover:border-[#E1306C]">
                      <Instagram size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: The Form Area */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-[#fafaf8] p-8 md:p-12 rounded-[2rem] border border-[#e4e2dd] shadow-[0_8px_30px_rgba(0,0,0,0.02)] relative"
            >
              <AnimatePresence mode="wait">
                {isContactSuccess ? (
                  <motion.div
                    key="contact-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center justify-center text-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 12 }}
                      className="w-16 h-16 rounded-full bg-[#2b5e54] flex items-center justify-center mb-8"
                    >
                      <Check className="w-8 h-8 text-white" strokeWidth={3} />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-2xl font-medium text-[#1a1a17] mb-3"
                      style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                    >
                      Message received.
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, duration: 0.5 }}
                      className="text-[#6b6b63] text-sm max-w-xs"
                    >
                      We read every email personally. Expect a reply within 24 hours.
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      onClick={() => setIsContactSuccess(false)}
                      className="mt-8 text-xs font-semibold text-[#a3a39b] hover:text-[#1a1a17] transition-colors uppercase tracking-widest"
                    >
                      Send another message
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mb-10">
                      <h3 className="text-2xl font-medium tracking-tight text-[#1a1a17] mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Send a message</h3>
                      <p className="text-[#6b6b63] text-sm">We read every single email. Usually reply within 24 hours.</p>
                    </div>

                    <form 
                      className="space-y-6" 
                      onSubmit={async (e) => { 
                        e.preventDefault(); 
                        const form = e.target as HTMLFormElement;
                        const formData = new FormData(form);
                        
                        setIsSubmitting(true);
                        
                        const name = formData.get('name') as string;
                        const email = formData.get('email') as string;
                        const role = formData.get('role') as string;
                        const message = formData.get('message') as string;
                        
                        try {
                          const { error } = await supabase
                            .from('contacts')
                            .insert([{ name, email, role, message }]);
                            
                          if (error) throw error;
                          
                          setIsContactSuccess(true);
                          form.reset();
                        } catch (err) {
                          console.error("Error submitting contact form:", err);
                          toast.error("Failed to send message. Please try again.");
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a3a39b]">Name</label>
                          <input name="name" type="text" className="w-full bg-white border border-[#e4e2dd] rounded-xl px-4 py-3.5 text-sm text-[#1a1a17] focus:ring-2 focus:ring-[#e4e2dd] focus:border-[#c8c6c0] outline-none transition-all placeholder:text-[#c8c6c0]" placeholder="Jane Doe" required disabled={isSubmitting} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a3a39b]">Email</label>
                          <input name="email" type="email" className="w-full bg-white border border-[#e4e2dd] rounded-xl px-4 py-3.5 text-sm text-[#1a1a17] focus:ring-2 focus:ring-[#e4e2dd] focus:border-[#c8c6c0] outline-none transition-all placeholder:text-[#c8c6c0]" placeholder="jane@school.edu" required disabled={isSubmitting} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a3a39b]">I am a...</label>
                        <select name="role" className="w-full bg-white border border-[#e4e2dd] rounded-xl px-4 py-3.5 text-sm text-[#1a1a17] focus:ring-2 focus:ring-[#e4e2dd] focus:border-[#c8c6c0] outline-none transition-all cursor-pointer" disabled={isSubmitting}>
                          <option>Educator / School Admin</option>
                          <option>Hardware Manufacturer</option>
                          <option>Researcher / Advocate</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a3a39b]">Message</label>
                        <textarea name="message" rows={3} className="w-full bg-white border border-[#e4e2dd] rounded-xl px-4 py-3.5 text-sm text-[#1a1a17] focus:ring-2 focus:ring-[#e4e2dd] focus:border-[#c8c6c0] outline-none transition-all placeholder:text-[#c8c6c0] resize-none" placeholder="How can we collaborate?" required disabled={isSubmitting} />
                      </div>

                      <button type="submit" disabled={isSubmitting} className="w-full bg-[#1a1a17] text-white rounded-xl py-4 text-sm font-semibold hover:bg-[#333330] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 group">
                        {isSubmitting ? (
                          <>Sending... <Loader2 size={16} className="animate-spin" /></>
                        ) : (
                          <>Send Message <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-10 pt-10 border-t border-[#e4e2dd]">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a3a39b] mb-4">Or just want updates?</p>
                <WaitlistForm variant="minimal" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
