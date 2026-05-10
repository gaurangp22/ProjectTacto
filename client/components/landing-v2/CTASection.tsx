import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { FadeIn } from "./AnimatedPrimitives";

/*
 * CTA section — final push.
 * Copy: recap the value, lower the barrier, strong specific CTA.
 * "Try the Simulator" > "Get Started"
 * "Read the Research" > "Learn More"
 */

export default function CTASection() {
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!glowRef.current) return;
        gsap.to(glowRef.current, {
            scale: 1.2,
            opacity: 0.6,
            duration: 4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });
    }, []);

    return (
        <section className="t-section relative" style={{ padding: "10rem 0" }}>
            {/* Warm glow behind content */}
            <div
                ref={glowRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(ellipse, rgba(212,85,42,0.06) 0%, transparent 70%)",
                    filter: "blur(40px)",
                }}
            />

            <div className="t-container relative z-10 max-w-3xl mx-auto text-center">
                {/* Decorative rule */}
                <FadeIn>
                    <hr className="t-rule-accent mx-auto mb-10" />
                </FadeIn>

                {/* Heading — recap the promise */}
                <FadeIn delay={0.1}>
                    <h2 className="t-h1 mb-6">
                        Every child deserves to
                        <br />
                        <span className="t-serif-italic" style={{ color: "var(--t-coral)" }}>
                            build something
                        </span>
                        .
                    </h2>
                </FadeIn>

                {/* Body — lower the barrier */}
                <FadeIn delay={0.2}>
                    <p className="t-body-lg mx-auto mb-10" style={{ maxWidth: 520 }}>
                        The simulator runs in your browser.
                        No downloads, no accounts.
                        Build your first program in 60 seconds.
                    </p>
                </FadeIn>

                {/* CTAs — specific, action-oriented */}
                <FadeIn delay={0.3}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                        <Link to="/playground" className="t-btn t-btn-coral">
                            Try the Simulator — Free
                            <ArrowRight size={16} />
                        </Link>
                        <Link to="/whitepaper" className="t-btn t-btn-outline">
                            Read the Full Research
                        </Link>
                    </div>
                </FadeIn>

                {/* Credibility footer */}
                <FadeIn delay={0.4}>
                    <div className="flex flex-col items-center gap-4">
                        <hr className="t-rule w-full max-w-xs" />
                        <p className="t-label text-center" style={{ maxWidth: 400 }}>
                            A student-led research initiative · Open source
                            <br />
                            Built at the intersection of HCI, accessibility, and computer science education
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
