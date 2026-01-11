import { useRef, useState, useEffect } from 'react';
import Matter from 'matter-js';
import './FallingText.css';
import { useIsMobile } from "@/hooks/use-mobile";

interface FallingTextProps {
    className?: string;
    text?: string;
    highlightWords?: string[];
    highlightClass?: string;
    trigger?: 'auto' | 'scroll' | 'click' | 'hover';
    backgroundColor?: string;
    wireframes?: boolean;
    gravity?: number;
    mouseConstraintStiffness?: number;
    fontSize?: string;
}

const FallingText = ({
    className = '',
    text = '',
    highlightWords = [],
    highlightClass = 'falling-text-highlighted',
    trigger = 'auto',
    backgroundColor = 'transparent',
    wireframes = false,
    gravity = 1,
    mouseConstraintStiffness = 0.2,
    fontSize = '1rem'
}: FallingTextProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    const [effectStarted, setEffectStarted] = useState(false);

    useEffect(() => {
        if (!textRef.current) return;
        const words = text.split(' ');
        const newHTML = words
            .map(word => {
                const isHighlighted = highlightWords.some(hw => word.includes(hw));
                return `<span class="word ${isHighlighted ? highlightClass : ''}">${word}</span>`;
            })
            .join(' ');
        textRef.current.innerHTML = newHTML;
    }, [text, highlightWords, highlightClass]);

    useEffect(() => {
        if (trigger === 'auto') {
            setEffectStarted(true);
            return;
        }
        if (trigger === 'scroll' && containerRef.current) {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setEffectStarted(true);
                        observer.disconnect();
                    }
                },
                { threshold: 0.2, rootMargin: '0px' }
            );
            observer.observe(containerRef.current);
            return () => observer.disconnect();
        }
    }, [trigger]);

    useEffect(() => {
        if (!effectStarted) return;

        const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

        if (!containerRef.current || !canvasContainerRef.current || !textRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;

        if (width <= 0 || height <= 0) {
            return;
        }

        const engine = Engine.create();
        engine.world.gravity.y = gravity;

        const render = Render.create({
            element: canvasContainerRef.current,
            engine,
            options: {
                width,
                height,
                background: backgroundColor,
                wireframes,
                pixelRatio: window.devicePixelRatio
            }
        });

        const boundaryOptions = {
            isStatic: true,
            render: { fillStyle: 'transparent' }
        };

        // Create boundaries
        const floor = Bodies.rectangle(width / 2, height + 25, width, 50, boundaryOptions);
        const leftWall = Bodies.rectangle(-25, height / 2, 50, height * 2, boundaryOptions); // made taller
        const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height * 2, boundaryOptions); // made taller
        const ceiling = Bodies.rectangle(width / 2, -25, width, 50, boundaryOptions);

        const wordSpans = textRef.current.querySelectorAll('.word');
        const wordBodies = Array.from(wordSpans).map((elem) => {
            const rect = (elem as HTMLElement).getBoundingClientRect();

            // Calculate relative position based on valid rects
            const x = rect.left - containerRect.left + rect.width / 2;
            const y = rect.top - containerRect.top + rect.height / 2;

            const body = Bodies.rectangle(x, y, rect.width, rect.height, {
                render: { fillStyle: 'transparent' },
                restitution: 0.6, // Bounciness
                frictionAir: 0.01,
                friction: 0.2
            });

            // Add random initial velocity and rotation
            Matter.Body.setVelocity(body, {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            });
            Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1);

            return { elem: elem as HTMLElement, body };
        });

        // Initial positioning
        wordBodies.forEach(({ elem, body }) => {
            elem.style.position = 'absolute';
            // Center the element on the body
            elem.style.left = '0';
            elem.style.top = '0';
            elem.style.transform = `translate(${body.position.x - elem.offsetWidth / 2}px, ${body.position.y - elem.offsetHeight / 2}px) rotate(${body.angle}rad)`;
        });

        const mouse = Mouse.create(containerRef.current);

        // Robust fix for scrolling: Remove all wheel listeners that Matter.js adds
        // This allows the user to scroll the page naturally even when cursor is over the canvas
        const preventScroll = (mouse as any).mousewheel;
        if (preventScroll) {
            mouse.element.removeEventListener("mousewheel", preventScroll);
            mouse.element.removeEventListener("DOMMouseScroll", preventScroll);
            mouse.element.removeEventListener("wheel", preventScroll);
        }

        if (!isMobile) {
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse,
                constraint: {
                    stiffness: mouseConstraintStiffness,
                    render: { visible: false }
                }
            });
            World.add(engine.world, mouseConstraint);
        }

        render.mouse = mouse;

        World.add(engine.world, [floor, leftWall, rightWall, ceiling, ...wordBodies.map(wb => wb.body)]);

        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        const updateLoop = () => {
            wordBodies.forEach(({ body, elem }) => {
                const { x, y } = body.position;
                const angle = body.angle;

                // Update DOM element position to match physics body
                elem.style.transform = `translate(${x - elem.offsetWidth / 2}px, ${y - elem.offsetHeight / 2}px) rotate(${angle}rad)`;
            });

            requestAnimationFrame(updateLoop);
        };

        const animationId = requestAnimationFrame(updateLoop);

        const handleResize = () => {
            setEffectStarted(false);
            setTimeout(() => setEffectStarted(true), 100);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
            Render.stop(render);
            Runner.stop(runner);
            if (render.canvas && canvasContainerRef.current) {
                if (canvasContainerRef.current.contains(render.canvas)) {
                    canvasContainerRef.current.removeChild(render.canvas);
                }
            }
            World.clear(engine.world, false);
            Engine.clear(engine);
        };
    }, [effectStarted, gravity, wireframes, backgroundColor, mouseConstraintStiffness, isMobile]);

    const handleTrigger = () => {
        if (!effectStarted && (trigger === 'click' || trigger === 'hover')) {
            setEffectStarted(true);
        }
    };

    return (
        <div
            ref={containerRef}
            className={`falling-text-container ${className}`}
            onClick={trigger === 'click' ? handleTrigger : undefined}
            onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
            style={{ overflow: 'hidden', touchAction: 'pan-y', pointerEvents: isMobile ? 'none' : 'auto' }} // pan-y allows vertical scroll
        >
            <div
                ref={textRef}
                className="falling-text-target"
                style={{
                    fontSize: fontSize,
                    lineHeight: 1.6,
                    opacity: 1 // Keep visible always
                }}
            />
            <div ref={canvasContainerRef} className="falling-text-canvas" />
        </div>
    );
};

export default FallingText;
