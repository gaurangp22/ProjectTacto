import { motion } from "framer-motion";
import { FadeIn } from "./AnimatedPrimitives";

/*
 * How It Works — 4-step pipeline.
 * Copy: each step title is an action verb. Descriptions are specific, not vague.
 * Layout: dark section break for visual rhythm.
 */

const steps = [
    {
        num: "01",
        title: "Snap blocks together",
        description:
            "Each block has a unique shape — loops have ridges, conditionals have notches. Students identify code structures by touch and connect them on the reader grid.",
    },
    {
        num: "02",
        title: "Plug in via USB",
        description:
            "The Tacto base connects to any laptop, tablet, or Chromebook. One cable. No drivers. No Bluetooth pairing headaches.",
    },
    {
        num: "03",
        title: "Hear your logic explained",
        description:
            "\"You placed a loop that repeats three times. Inside it, there's a print statement.\" The audio engine narrates structure, not just labels.",
    },
    {
        num: "04",
        title: "Run, debug, iterate",
        description:
            "Execute the program. If something breaks, the engine explains what went wrong and where. Rearrange the blocks. Try again. The feedback loop is instant.",
    },
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="t-section t-section-dark" style={{ padding: "8rem 0" }}>
            <div className="t-container">
                {/* Header */}
                <div className="mb-16">
                    <FadeIn>
                        <div className="flex items-center gap-4 mb-6">
                            <hr className="t-rule-accent" />
                            <span className="t-label" style={{ color: "rgba(245,240,234,0.3)" }}>
                                Four steps
                            </span>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h2 className="t-h1" style={{ color: "var(--t-cream)", maxWidth: 600 }}>
                            From unboxing to running your first program
                            <span className="t-serif-italic" style={{ color: "var(--t-coral)" }}>
                                {" "}in one sitting.
                            </span>
                        </h2>
                    </FadeIn>
                </div>

                {/* Steps list — editorial vertical layout */}
                <div className="grid md:grid-cols-2 gap-x-16 gap-y-0">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            className="relative py-10 group"
                            style={{
                                borderTop: "1px solid rgba(255,255,255,0.06)",
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {/* Step number */}
                            <span
                                className="t-label block mb-4 transition-colors duration-400"
                                style={{ color: "rgba(245,240,234,0.15)" }}
                            >
                                Step {step.num}
                            </span>

                            {/* Large watermark number */}
                            <span
                                className="absolute top-6 right-0 pointer-events-none transition-colors duration-500"
                                style={{
                                    fontFamily: "var(--t-font-display)",
                                    fontSize: "5rem",
                                    lineHeight: 1,
                                    color: "rgba(255,255,255,0.02)",
                                }}
                            >
                                {step.num}
                            </span>

                            {/* Title */}
                            <h3
                                className="t-h3 mb-3 transition-colors duration-400 group-hover:text-white"
                                style={{ color: "var(--t-cream)" }}
                            >
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className="t-body" style={{ color: "rgba(245,240,234,0.4)", maxWidth: 380 }}>
                                {step.description}
                            </p>

                            {/* Hover accent bar */}
                            <div
                                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-16 transition-all duration-500"
                                style={{ background: "var(--t-coral)" }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
