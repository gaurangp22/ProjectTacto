import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const addEventListeners = () => {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseenter', onMouseEnter);
            document.addEventListener('mouseleave', onMouseLeave);
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mouseup', onMouseUp);
        };

        const removeEventListeners = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
        };

        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over a clickable element
            const target = e.target as HTMLElement;
            const isLink = target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') !== null ||
                target.closest('button') !== null ||
                target.classList.contains('cursor-pointer');

            setLinkHovered(!!isLink);
        };

        const onMouseDown = () => {
            setClicked(true);
        };

        const onMouseUp = () => {
            setClicked(false);
        };

        const onMouseLeave = () => {
            setHidden(true);
        };

        const onMouseEnter = () => {
            setHidden(false);
        };

        addEventListeners();
        return () => removeEventListeners();
    }, []);

    // Use a touch device check to disable on mobile if needed, 
    // but CSS media query usually handles cursor:none better.
    // For now, render always but hidden via opacity if needed.

    return (
        <div
            className={cn(
                'fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 ease-out hidden md:block',
                hidden ? 'opacity-0' : 'opacity-100'
            )}
            style={{
                transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
            }}
        >
            {/* Figma-like Arrow Cursor */}
            <div className={cn(
                "relative -top-[3px] -left-[3px] transition-transform duration-100 ease-out will-change-transform",
                clicked ? "scale-90" : "scale-100"
            )}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-md"
                >
                    <path
                        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                        fill="currentColor"
                        className={cn("text-black dark:text-white transition-colors", linkHovered ? "text-primary fill-primary" : "")}
                        stroke="white"
                        strokeWidth="1"
                    />
                </svg>

                {/* Label for "Figma" vibe (optional name tag, skipping for now to keep it clean) */}
                {name && (
                    <div className="absolute left-4 top-4 px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-sm whitespace-nowrap opacity-0 transition-opacity">
                        You
                    </div>
                )}
            </div>
        </div>
    );
}
