import { useRef, useEffect } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

interface DotGridProps {
    dotSize?: number;
    gap?: number;
    baseColor?: string;
    activeColor?: string;
    proximity?: number;
    speedTrigger?: number; // Speed threshold to trigger a "shock"
    shockRadius?: number;
    shockStrength?: number;
    maxSpeed?: number;
    resistance?: number; // Higher resistance = faster stop
    returnDuration?: number; // Seconds to return to origin
}

const DotGrid = ({
    dotSize = 16,
    gap = 32,
    baseColor = "#5227FF",
    activeColor = "#5227FF",
    proximity = 150,
    speedTrigger = 100,
    shockRadius = 250,
    shockStrength = 5,
    maxSpeed = 5000, // Unused in this simple version but kept for prop compatibility
    resistance = 750, // Unused
    returnDuration = 1.5
}: DotGridProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const isMobile = useIsMobile();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        let dots: { x: number, y: number, originX: number, originY: number, vx: number, vy: number }[] = [];

        // Mouse state
        let mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000, lastTime: 0 };

        const initDots = () => {
            dots = [];
            const cols = Math.ceil(width / gap);
            const rows = Math.ceil(height / gap);

            const startX = (width - (cols - 1) * gap) / 2;
            const startY = (height - (rows - 1) * gap) / 2;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = startX + i * gap;
                    const y = startY + j * gap;
                    dots.push({
                        x, y,
                        originX: x, originY: y,
                        vx: 0, vy: 0
                    });
                }
            }
        };

        initDots();

        const handleResize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            initDots();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const now = performance.now();
            const dt = now - mouse.lastTime;

            if (dt > 0) {
                mouse.vx = (x - mouse.lastX) / dt * 1000; // px per second
                mouse.vy = (y - mouse.lastY) / dt * 1000;
            }

            mouse.x = x;
            mouse.y = y;
            mouse.lastX = x;
            mouse.lastY = y;
            mouse.lastTime = now;
        };

        // Keep tracking mouse even if it leaves, but reset interactions
        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('resize', handleResize);
        if (!isMobile) {
            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mouseleave', handleMouseLeave);
        }

        let animationId: number;
        let lastTime = performance.now();

        const animate = (time: number) => {
            const dt = (time - lastTime) / 1000;
            lastTime = time;

            ctx.clearRect(0, 0, width, height);

            // Mouse speed magnitude
            const mouseSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
            const isShock = mouseSpeed > speedTrigger;

            dots.forEach(dot => {
                // Distance to mouse
                const dx = mouse.x - dot.x;
                const dy = mouse.y - dot.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Interaction Logic
                // 1. Proximity push
                if (dist < proximity) {
                    const angle = Math.atan2(dy, dx);
                    const force = (proximity - dist) / proximity;
                    // Push away
                    dot.vx -= Math.cos(angle) * force * 10;
                    dot.vy -= Math.sin(angle) * force * 10;
                }

                // 2. Shockwave logic
                if (isShock && dist < shockRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (shockRadius - dist) / shockRadius;
                    // Strong push based on shock strength
                    dot.vx -= Math.cos(angle) * force * shockStrength * 5;
                    dot.vy -= Math.sin(angle) * force * shockStrength * 5;
                }

                // Return to origin (Spring)
                const springK = 3;  // Stiffness
                const damping = 0.8; // Friction

                const odx = dot.originX - dot.x;
                const ody = dot.originY - dot.y;

                dot.vx += odx * springK;
                dot.vy += ody * springK;

                dot.vx *= damping;
                dot.vy *= damping;

                // Apply Velocity
                dot.x += dot.vx * dt;
                dot.y += dot.vy * dt;

                // Draw
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dotSize / 4, 0, Math.PI * 2); // Increased size slightly
                ctx.fillStyle = dist < proximity ? activeColor : baseColor;
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationId);
        };
    }, [dotSize, gap, baseColor, activeColor, proximity, speedTrigger, shockRadius, shockStrength, returnDuration, isMobile]);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block', pointerEvents: isMobile ? 'none' : 'auto' }}
        />
    );
};

export default DotGrid;
