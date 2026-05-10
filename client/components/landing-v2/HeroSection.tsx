import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* Rotating words — each one lands a different angle of the value prop */
const WORDS = ["Touch", "Sound", "Feel", "Play"];
const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroSection() {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const [wordIdx, setWordIdx] = useState(0);

    /* GSAP: staggered character entrance on the main heading */
    useEffect(() => {
        if (!headingRef.current) return;
        const chars = headingRef.current.querySelectorAll(".h-char");
        gsap.fromTo(
            chars,
            { opacity: 0, y: 60, rotateX: -60 },
            {
                opacity: 1, y: 0, rotateX: 0,
                duration: 0.9,
                stagger: 0.025,
                ease: "expo.out",
                delay: 0.2,
            }
        );
    }, []);

    /* Rotate the accent word every 2.8s */
    useEffect(() => {
        const t = setInterval(() => setWordIdx((p) => (p + 1) % WORDS.length), 2800);
        return () => clearInterval(t);
    }, []);

    const splitChars = (text: string) =>
        text.split("").map((c, i) => (
            <span key={i} className="h-char inline-block" style={{ perspective: "500px" }}>
                {c === " " ? "\u00A0" : c}
            </span>
        ));

    return (
        <section className="t-section relative min-h-screen flex items-center" style={{ paddingTop: "8rem", paddingBottom: "4rem" }}>
            {/* Organic blobs */}
            <div className="t-blob t-blob-coral" style={{ width: 500, height: 500, top: "-5%", right: "5%" }} />
            <div className="t-blob t-blob-teal" style={{ width: 400, height: 400, bottom: "10%", left: "0%" }} />
            <div className="t-blob t-blob-ochre" style={{ width: 300, height: 300, top: "50%", left: "40%" }} />

            <div className="t-container relative z-10">
                {/* Chip */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
                >
                    <span className="t-chip mb-8 inline-flex">
                        <span className="t-chip-dot" />
                        For 285 million visually impaired learners
                    </span>
                </motion.div>

                {/* Main headline */}
                <h1 ref={headingRef} className="t-display mb-8 max-w-5xl" style={{ perspective: "800px" }}>
                    <span className="block">{splitChars("Code through")}</span>
                    <span className="block mt-1">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={wordIdx}
                                initial={{ opacity: 0, y: 24, rotateX: -30 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                exit={{ opacity: 0, y: -24, rotateX: 30 }}
                                transition={{ duration: 0.45, ease: EASE }}
                                className="inline-block"
                                style={{ color: "var(--t-coral)" }}
                            >
                                {WORDS[wordIdx]}
                            </motion.span>
                        </AnimatePresence>
                        <span style={{ color: "var(--t-sand)", margin: "0 0.3em" }}>—</span>
                        <span className="t-serif-italic" style={{ color: "var(--t-warm-gray)" }}>
                            not sight.
                        </span>
                    </span>
                </h1>

                {/* Subheadline — specific, benefit-driven, no fluff */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="t-body-lg max-w-xl mb-10"
                    style={{ fontSize: "1.3rem" }}
                >
                    Physical blocks that snap together to build real programs.
                    An audio engine that reads, explains, and debugs every line.
                    Screen readers can't describe a for-loop — but your hands can build one.
                </motion.p>

                {/* CTAs — action-oriented, specific about what they get */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
                    className="flex flex-wrap gap-4 mb-12"
                >
                    <Link to="/playground" className="t-btn t-btn-dark">
                        Try the Simulator
                        <ArrowRight size={16} />
                    </Link>
                    <Link to="/whitepaper" className="t-btn t-btn-outline">
                        Read the Research
                    </Link>
                </motion.div>

                {/* Social proof — specific, not vague */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 2 }}
                    className="flex items-center gap-6"
                >
                    <hr className="t-rule-accent" />
                    <p className="t-label">
                        32 structured lessons · Loops, conditionals, functions · Zero screen dependency
                    </p>
                </motion.div>
            </div>

            {/* Scroll cue */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="t-label" style={{ fontSize: "0.6rem" }}>Scroll</span>
                <motion.div
                    className="w-[1px] h-8"
                    style={{ background: "var(--t-coral)" }}
                    animate={{ scaleY: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </section>
    );
}
