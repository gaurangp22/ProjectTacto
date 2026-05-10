import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Nfc, Volume2, Code, BookOpen } from "lucide-react";
import { FadeIn } from "./AnimatedPrimitives";

/*
 * Solution section — features as benefits.
 * Copy rule: "Your student builds their first loop in 5 minutes"
 * beats "NFC-enabled tactile programming blocks."
 */

const features = [
    {
        icon: Nfc,
        title: "Blocks that teach by shape",
        description:
            "Each block has a distinct shape and texture — a loop feels different from a conditional. Students learn to recognize code structures before they write a single line.",
        labelColor: "var(--t-coral)",
        label: "Hardware",
    },
    {
        icon: Volume2,
        title: "An audio tutor, not a screen reader",
        description:
            "Place a block. Hear what it does. Connect two blocks. Hear them interact. The audio engine doesn't just read code — it explains logic, catches errors, and suggests fixes.",
        labelColor: "var(--t-teal)",
        label: "Software",
    },
    {
        icon: Code,
        title: "Real CS, not toy patterns",
        description:
            "Variables, loops, conditionals, functions, nested logic. The same concepts taught in AP Computer Science — delivered through a sense that works for every learner.",
        labelColor: "var(--t-ochre)",
        label: "Curriculum",
    },
    {
        icon: BookOpen,
        title: "32 lessons that build on each other",
        description:
            "From \"place your first block\" to \"build a function with parameters.\" Each lesson introduces one concept, reinforces the last, and prepares for the next.",
        labelColor: "var(--t-plum)",
        label: "Pedagogy",
    },
];

function FeatureCard({ feature, index }: { feature: (typeof features)[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const Icon = feature.icon;

    const handleMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMove}
            className="t-card group cursor-default"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
            {/* Cursor-following warm glow */}
            <div
                className="absolute w-[250px] h-[250px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    left: mouse.x - 125,
                    top: mouse.y - 125,
                    background: `radial-gradient(circle, ${feature.labelColor}12 0%, transparent 70%)`,
                }}
            />

            {/* Step number watermark */}
            <div className="t-step-num">
                {String(index + 1).padStart(2, "0")}
            </div>

            <div className="relative z-10">
                {/* Category label */}
                <span className="t-label block mb-4" style={{ color: feature.labelColor }}>
                    {feature.label}
                </span>

                {/* Icon */}
                <div
                    className="t-icon-box mb-5"
                    style={{ background: `${feature.labelColor}10`, border: `1px solid ${feature.labelColor}20` }}
                >
                    <Icon size={22} style={{ color: feature.labelColor }} />
                </div>

                {/* Title */}
                <h3 className="t-h3 mb-3">{feature.title}</h3>

                {/* Description */}
                <p className="t-body">{feature.description}</p>
            </div>
        </motion.div>
    );
}

export default function SolutionSection() {
    return (
        <section className="t-section" style={{ background: "white" }}>
            <div className="t-container">
                {/* Header — asymmetric editorial layout */}
                <div className="t-grid-editorial mb-16">
                    <div>
                        <FadeIn>
                            <div className="flex items-center gap-4 mb-6">
                                <hr className="t-rule-accent" />
                                <span className="t-label">How Tacto works</span>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <h2 className="t-h1">
                                Not a screen reader.
                                <br />
                                <span className="t-serif-italic" style={{ color: "var(--t-coral)" }}>
                                    A new sense for code.
                                </span>
                            </h2>
                        </FadeIn>
                    </div>
                    <div className="flex items-end">
                        <FadeIn delay={0.2}>
                            <p className="t-body-lg" style={{ maxWidth: 400 }}>
                                Tacto doesn't try to make visual tools accessible. It starts from scratch with a medium that works: physical blocks and spatial audio.
                            </p>
                        </FadeIn>
                    </div>
                </div>

                <hr className="t-rule mb-12" />

                {/* Feature grid */}
                <div className="grid md:grid-cols-2 gap-5">
                    {features.map((f, i) => (
                        <FeatureCard key={i} feature={f} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
