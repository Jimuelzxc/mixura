
"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            if (e.target instanceof Element) {
                const target = e.target as Element;
                if (
                    target.tagName === 'A' ||
                    target.tagName === 'BUTTON' ||
                    target.closest('[role="button"]') ||
                    target.closest('[tabindex="0"]') ||
                    window.getComputedStyle(target).cursor === 'pointer'
                ) {
                    setIsHovering(true);
                }
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            if (e.target instanceof Element) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <div
            className={cn("custom-cursor", { hovered: isHovering })}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
        />
    );
}
