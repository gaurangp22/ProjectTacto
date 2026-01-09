import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface BallpitProps {
    className?: string;
    count?: number;
    gravity?: number;
    friction?: number;
    wallBounce?: number;
    followCursor?: boolean;
    colors?: string[];
}

const Ballpit = ({
    className = '',
    count = 50,
    gravity = 0.5,
    friction = 0.9975,
    wallBounce = 0.95,
    followCursor = true,
    colors = ["#5227FF", "#7cff67", "#ff6b6b"]
}: BallpitProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Composite } = Matter;

        const containerRect = containerRef.current.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;

        const engine = Engine.create();
        engine.world.gravity.y = gravity;

        const render = Render.create({
            element: containerRef.current,
            canvas: canvasRef.current,
            engine: engine,
            options: {
                width,
                height,
                background: 'transparent',
                wireframes: false,
                pixelRatio: window.devicePixelRatio
            }
        });

        // Boundaries
        const wallOptions = {
            isStatic: true,
            render: { visible: false },
            restitution: wallBounce
        };

        const walls = [
            Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions), // Floor
            Bodies.rectangle(-50, height / 2, 100, height * 4, wallOptions),   // Left
            Bodies.rectangle(width + 50, height / 2, 100, height * 4, wallOptions),  // Right
            // No ceiling so balls can fall in if we want, or add one if needed. 
            // Let's add a high ceiling just in case they bounce too high
            Bodies.rectangle(width / 2, -1000, width, 100, wallOptions)
        ];

        World.add(engine.world, walls);

        // Create Balls
        const balls: Matter.Body[] = [];

        for (let i = 0; i < count; i++) {
            const radius = 10 + Math.random() * 20; // Random size
            const x = Math.random() * width;
            const y = -Math.random() * 500 - 50; // Start above viewport

            const ball = Bodies.circle(x, y, radius, {
                restitution: 0.9,
                friction: 0.005,
                frictionAir: (1 - friction) * 0.1, // Approximate friction mapping
                render: {
                    fillStyle: colors[Math.floor(Math.random() * colors.length)]
                }
            });
            balls.push(ball);
        }

        World.add(engine.world, balls);

        // Mouse Interaction
        const mouse = Mouse.create(render.canvas);

        // Fix scroll issue - remove default listeners
        mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
        mouse.element.removeEventListener("wheel", (mouse as any).mousewheel);

        if (followCursor) {
            const mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });
            World.add(engine.world, mouseConstraint);
        }

        render.mouse = mouse;

        const runner = Runner.create();
        // Runner.run(runner, engine); // Handled by observer
        // Render.run(render); // Handled by observer

        // Resize Handler
        const handleResize = () => {
            if (!containerRef.current || !canvasRef.current) return;
            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;

            render.canvas.width = newWidth;
            render.canvas.height = newHeight;

            // Reposition walls
            Matter.Body.setPosition(walls[0], { x: newWidth / 2, y: newHeight + 50 }); // Floor
            Matter.Body.setPosition(walls[1], { x: -50, y: newHeight / 2 }); // Left
            Matter.Body.setPosition(walls[2], { x: newWidth + 50, y: newHeight / 2 }); // Right
            Matter.Body.setPosition(walls[3], { x: newWidth / 2, y: -1000 }); // Ceiling
        };

        window.addEventListener('resize', handleResize);

        // Intersection Observer to start/stop the engine
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Runner.run(runner, engine);
                    Render.run(render);
                } else {
                    Runner.stop(runner);
                    Render.stop(render);
                }
            });
        }, { threshold: 0.1 });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
            Render.stop(render);
            Runner.stop(runner);
            if (render.canvas) {
                render.canvas.remove();
            }
            World.clear(engine.world, false);
            Engine.clear(engine);
        };
    }, [count, gravity, friction, wallBounce, followCursor, colors]);

    return (
        <div ref={containerRef} className={`w-full h-full absolute inset-0 pointer-events-auto touch-pan-y ${className}`}>
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

export default Ballpit;
