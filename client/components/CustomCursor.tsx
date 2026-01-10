import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [isText, setIsText] = useState(false);

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
            // Use requestAnimationFrame for smoother performance if needed, 
            // but for simple cursor React state is often acceptable. 
            // For closer to metal, direct DOM manipulation via ref is better.
            setPosition({ x: e.clientX, y: e.clientY });

            const target = e.target as HTMLElement;

            // Link/Button Detection
            const isLink = target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') !== null ||
                target.closest('button') !== null ||
                target.classList.contains('cursor-pointer');

            // Text Input Detection
            const isTextInput = target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            setLinkHovered(!!isLink);
            setIsText(!!isTextInput);
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

    // If hovering over text input, we might want to hide our custom cursor 
    // and show standard system text cursor, OR change our cursor to a bar.
    // Figma usually keeps the arrow but maybe hides name tag? 
    // Let's hide the custom cursor for text inputs to let native behavior take over for precision.
    if (isText) return null;

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
                "relative -top-[3px] -left-[3px] transition-transform duration-100 ease-out will-change-transform flex items-start",
                clicked ? "scale-90" : "scale-100"
            )}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-md relative z-20"
                >
                    <path
                        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                        fill={linkHovered ? "var(--primary)" : "black"}
                        className="transition-colors duration-200"
                        stroke="white"
                        strokeWidth="1"
                    />
                </svg>

                {/* Name Tag */}
                <div
                    className={cn(
                        "px-2 py-1 text-[10px] font-bold rounded-lg rounded-tl-none whitespace-nowrap shadow-sm text-white transition-colors duration-200 -ml-1 mt-3",
                        linkHovered ? "bg-primary" : "bg-black"
                    )}
                >
                    You
                </div>
            </div>
        </div>
    );
}
