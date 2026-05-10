import { motion } from "framer-motion";
import { FadeIn, CountUp, Marquee } from "./AnimatedPrimitives";

/*
 * Impact section — stats + a full-width marquee.
 * Copy rule: specific numbers beat superlatives.
 * "32 structured lessons" beats "comprehensive curriculum."
 */

const stats = [
    { value: 285, suffix: "M", label: "Visually impaired people who can't use Scratch, Python IDEs, or block-based coding tools" },
    { value: 32, suffix: "", label: "Structured lessons from sequencing basics to nested functions with parameters" },
    { value: 0, suffix: "", display: "Zero", label: "Screen dependency. No monitor, no visual interface, no color coding required" },
    { value: 10, suffix: "×", label: "Faster error identification with spatial audio vs. linear screen reader output" },
];

const marqueeItems = [
    "Loops", "Conditionals", "Variables", "Functions",
    "Sequences", "Parameters", "Nested Logic", "Debugging",
    "Abstraction", "Pattern Recognition",
];

export default function ImpactSection() {
    return (
        <section id="impact" className="t-section">
            <div className="t-container">
                {/* Header */}
                <div className="mb-16 max-w-2xl">
                    <FadeIn>
                        <div className="flex items-center gap-4 mb-6">
                            <hr className="t-rule-accent" />
                            <span className="t-label">By the numbers</span>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h2 className="t-h1 mb-4">
                            Built for real classrooms.
                            <br />
                            <span className="t-serif-italic" style={{ color: "var(--t-warm-gray)" }}>
                                Not just pitch decks.
                            </span>
                        </h2>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <p className="t-body-lg">
                            Every number here comes from the research, the prototype, and the curriculum
                            design — not a marketing team.
                        </p>
                    </FadeIn>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            className="t-card group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="relative z-10">
                                <div className="t-stat-value mb-4" style={{ color: "var(--t-charcoal)" }}>
                                    {stat.display ? (
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.7 }}
                                        >
                                            {stat.display}
                                        </motion.span>
                                    ) : (
                                        <CountUp value={stat.value} suffix={stat.suffix} duration={2.5} />
                                    )}
                                </div>
                                <p className="t-body" style={{ maxWidth: 320 }}>{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Big statement — the "aha" moment */}
                <FadeIn className="text-center mb-6">
                    <h3 className="t-h2 mx-auto" style={{ maxWidth: 700 }}>
                        Coding is not memorizing syntax.
                        <br />
                        <span style={{ color: "var(--t-warm-gray)" }}>It's understanding how </span>
                        <span className="t-serif-italic" style={{ color: "var(--t-coral)" }}>ideas connect</span>
                        <span style={{ color: "var(--t-warm-gray)" }}>.</span>
                    </h3>
                </FadeIn>
            </div>

            {/* Full-width scrolling marquee — concepts taught */}
            <div className="mt-12 py-6" style={{ borderTop: "1px solid var(--t-border)", borderBottom: "1px solid var(--t-border)" }}>
                <Marquee speed={40}>
                    {marqueeItems.map((item, i) => (
                        <span key={i} className="flex items-center gap-6 whitespace-nowrap">
                            <span
                                className="text-2xl md:text-3xl font-bold"
                                style={{
                                    fontFamily: "var(--t-font-display)",
                                    color: "var(--t-sand)",
                                }}
                            >
                                {item}
                            </span>
                            <span style={{ color: "var(--t-sand)", fontSize: "0.5rem" }}>●</span>
                        </span>
                    ))}
                </Marquee>
            </div>
        </section>
    );
}
