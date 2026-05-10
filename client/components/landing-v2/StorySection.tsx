import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FadeIn } from "./AnimatedPrimitives";

gsap.registerPlugin(ScrollTrigger);

/*
 * Story section — scroll-driven narrative.
 * Copy approach: Problem-agitation-solution.
 * Lead with empathy, get specific about the pain, then reveal the shift.
 */

const lines = [
    { text: "Every coding tool on the market starts with a screen.", size: "t-h2" },
    { text: "Scratch uses drag-and-drop blocks. Python uses syntax highlighting. Even \"unplugged\" activities end up on a projector.", size: "t-body-lg", muted: true },
    { text: "285 million people can't use any of them.", size: "t-h1", accent: true },
    { text: "Screen readers weren't built for spatial logic. They read left-to-right. Code doesn't work left-to-right — it nests, branches, loops. Try describing a nested if-else to someone who can't see the indentation.", size: "t-body-lg", muted: true },
    { text: "This isn't a gap in accessibility.", size: "t-h2" },
    { text: "It's a locked door.", size: "t-h1", accent: true },
];

export default function StorySection() {
    const sectionRef = useRef<HTMLElement>(null);
    const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            lineRefs.current.forEach((el) => {
                if (!el) return;
                gsap.fromTo(el,
                    { opacity: 0, y: 50, filter: "blur(8px)" },
                    {
                        opacity: 1, y: 0, filter: "blur(0px)",
                        duration: 1,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 82%",
                            end: "top 35%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} id="mission" className="t-section" style={{ padding: "10rem 0 12rem" }}>
            <div className="t-container">
                {/* Section label */}
                <FadeIn className="mb-20">
                    <div className="flex items-center gap-4">
                        <hr className="t-rule-accent" />
                        <span className="t-label">The problem nobody solved</span>
                    </div>
                </FadeIn>

                {/* Staggered story lines */}
                <div className="max-w-3xl flex flex-col gap-10">
                    {lines.map((line, i) => (
                        <div
                            key={i}
                            ref={(el) => { lineRefs.current[i] = el; }}
                            className={`${line.size} ${line.muted ? "" : ""}`}
                            style={{
                                color: line.accent
                                    ? "var(--t-coral)"
                                    : line.muted
                                        ? "var(--t-warm-gray)"
                                        : "var(--t-charcoal)",
                                maxWidth: line.muted ? "600px" : undefined,
                            }}
                        >
                            {line.text}
                        </div>
                    ))}
                </div>

                {/* Transition quote — the pivot to solution */}
                <FadeIn delay={0.1} className="mt-32">
                    <div className="t-grid-editorial">
                        <div>
                            <hr className="t-rule mb-8" />
                            <blockquote className="t-h2" style={{ maxWidth: 480 }}>
                                What if code wasn't something you{" "}
                                <span className="t-serif-italic" style={{ color: "var(--t-coral)" }}>looked at</span>
                                — but something you could hold?
                            </blockquote>
                        </div>
                        <div className="flex justify-end">
                            <div
                                className="rounded-2xl p-10 flex items-center justify-center"
                                style={{
                                    background: "var(--t-charcoal)",
                                    width: "100%",
                                    maxWidth: 400,
                                    aspectRatio: "4/3",
                                }}
                            >
                                <p
                                    className="text-center"
                                    style={{
                                        fontFamily: "var(--t-font-display)",
                                        fontSize: "clamp(2.5rem, 5vw, 4rem)",
                                        color: "var(--t-cream)",
                                        lineHeight: 1.1,
                                    }}
                                >
                                    Meet <span style={{ color: "var(--t-coral)" }}>Tacto</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
