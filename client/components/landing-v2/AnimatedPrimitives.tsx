import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
}

/** Word-by-word reveal on scroll */
export function TextReveal({ children, className = "", delay = 0 }: TextRevealProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });
    const words = children.split(" ");

    return (
        <span ref={ref} className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                    animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                    transition={{
                        duration: 0.45,
                        delay: delay + i * 0.035,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ display: "inline-block", marginRight: "0.28em" }}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}

interface CountUpProps {
    value: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    duration?: number;
}

/** Animated number ticker */
export function CountUp({ value, suffix = "", prefix = "", className = "", duration = 2 }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const countRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!isInView || !countRef.current) return;
        const end = value;
        const startTime = performance.now();
        const durationMs = duration * 1000;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = Math.round(end * eased);
            if (countRef.current) {
                countRef.current.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
            }
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [isInView, value, suffix, prefix, duration]);

    return (
        <span ref={ref} className={className}>
            <motion.span
                ref={countRef}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                {prefix}0{suffix}
            </motion.span>
        </span>
    );
}

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
}

/** Simple scroll-triggered fade */
export function FadeIn({ children, className = "", delay = 0, direction = "up" }: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    const offsets = {
        up: { y: 30, x: 0 },
        down: { y: -30, x: 0 },
        left: { y: 0, x: 30 },
        right: { y: 0, x: -30 },
        none: { y: 0, x: 0 },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, y: offsets[direction].y, x: offsets[direction].x }}
            animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

/** Horizontal infinite marquee */
export function Marquee({
    children,
    speed = 35,
    className = "",
}: {
    children: React.ReactNode;
    speed?: number;
    className?: string;
}) {
    return (
        <div className={`overflow-hidden ${className}`}>
            <div
                className="t-marquee-track"
                style={{ "--t-marquee-speed": `${speed}s` } as React.CSSProperties}
            >
                {children}
                {children}
            </div>
        </div>
    );
}
