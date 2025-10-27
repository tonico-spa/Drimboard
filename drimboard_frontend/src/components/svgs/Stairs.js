"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


const Stairs = ({ styles, hoverTargetRef }) => {
    const selfContainerRef = useRef(null);
    const timelineRef = useRef(null);

    useEffect(() => {
        const triggerElement = hoverTargetRef?.current || selfContainerRef.current;
        if (!triggerElement) return;
        // Use GSAP Context for safe scoping and easy cleanup.
        // All GSAP animations and selectors created inside will be scoped to containerRef.
        const ctx = gsap.context(() => {
            // The timeline is created the same way as before.
            timelineRef.current = gsap.timeline({ paused: true })
                .to('.arrow', { y: -5, x: 5, duration: 0.3, ease: 'power2.out' })
        }, selfContainerRef); // GSAP context is still scoped to this component's container
        // Get the DOM element from the ref

        const handleMouseEnter = () => timelineRef.current?.play();
        const handleMouseLeave = () => timelineRef.current?.reverse();

        // Attach the listeners to the determined trigger element
        triggerElement.addEventListener('mouseenter', handleMouseEnter);
        triggerElement.addEventListener('mouseleave', handleMouseLeave);

        // --- Cleanup Function ---
        return () => {
            ctx.revert();
            // Important: remove listeners from the same element they were added to
            triggerElement.removeEventListener('mouseenter', handleMouseEnter);
            triggerElement.removeEventListener('mouseleave', handleMouseLeave);
        };
        // Add hoverTargetRef to the dependency array.
        // This ensures the effect re-runs if the target ref changes.
    }, [hoverTargetRef]);
    return (
        <div ref={selfContainerRef}>
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 -10 98.68 107.68">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g>
                    <path className="border" d="M93.61,0h-24.42c-2.24,0-4.07,1.83-4.07,4.07v16.28h-12.21c-2.24,0-4.07,1.83-4.07,4.07v12.21h-12.21c-2.24,0-4.07,1.83-4.07,4.07v12.21h-12.21c-2.24,0-4.07,1.83-4.07,4.07v12.21H4.07c-2.24,0-4.07,1.83-4.07,4.07v20.35c0,2.24,1.83,4.07,4.07,4.07h89.54c2.24,0,4.07-1.83,4.07-4.07V4.07c0-2.24-1.83-4.07-4.07-4.07ZM89.54,89.54H8.14v-12.21h12.21c2.24,0,4.07-1.83,4.07-4.07v-12.21h12.21c2.24,0,4.07-1.83,4.07-4.07v-12.21h12.21c2.24,0,4.07-1.83,4.07-4.07v-12.21h12.21c2.24,0,4.07-1.83,4.07-4.07V8.14h16.28v81.4Z" />
                    <path className="arrow" d="M1.18,31.38c.81.81,1.83,1.18,2.89,1.18s2.08-.41,2.89-1.18L24.42,13.92v10.54c0,2.24,1.83,4.07,4.07,4.07s4.07-1.83,4.07-4.07V4.11c0-.53-.12-1.06-.33-1.55-.41-1.02-1.22-1.79-2.2-2.2-.49-.2-1.02-.33-1.55-.33H8.14C5.9.04,4.07,1.87,4.07,4.11s1.83,4.07,4.07,4.07h10.54L1.22,25.64c-1.59,1.59-1.59,4.15,0,5.74h-.04Z" />
                    <polygon className="stairs" points="4.01 84.28 8.14 73.52 19.82 71.64 19.82 58.18 36.67 56.89 36.67 43.33 50.37 40.04 54.58 27.39 67.23 24.23 69.33 13.7 69.33 6.07 78.82 4.21 89.54 4.21 93.32 4.21 93.32 93.97 5.07 93.77 4.01 84.28" />
                </g>
            </svg>
        </div>
    );
}
export default Stairs