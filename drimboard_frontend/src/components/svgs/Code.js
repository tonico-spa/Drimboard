"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


const Code = ({ styles, hoverTargetRef }) => {
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
                .to('.stroke_2', { x: -5, duration: 0.3, ease: 'power2.out' })
                .to('.stroke_3', { x: 5, duration: 0.3, ease: 'power2.out' }, '<')
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
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 129.98 92.25">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g>
                    <rect className="box" width="129.98" height="92.25" rx="7.78" ry="7.78" />
                    <g>
                        <path className="stroke_1" d="M70.31,23.74c-1.62.04-3.02,1.13-3.46,2.69l-11.09,36.96c-.59,1.96.53,4.02,2.49,4.61,1.96.59,4.02-.53,4.61-2.49,0,0,0,0,0-.02l11.09-36.96c.61-1.95-.48-4.02-2.43-4.63-.39-.12-.8-.18-1.21-.17h0Z" />
                        <path className="stroke_2" d="M48.02,24.21c-1.09.07-2.12.56-2.85,1.38l-16.77,17.82c-1.51,1.61-1.51,4.12,0,5.73l16.77,17.82c1.46,1.79,4.11,2.06,5.9.6,1.79-1.46,2.06-4.11.6-5.9-.13-.15-.26-.3-.41-.43l-14.09-14.94,14.09-14.97c1.61-1.66,1.57-4.32-.09-5.93-.84-.82-1.99-1.24-3.16-1.18h0Z" />
                        <path className="stroke_3" d="M81.86,24.21c-2.31-.07-4.25,1.74-4.32,4.06-.04,1.13.39,2.23,1.18,3.05l14.09,14.97-14.09,14.94c-1.7,1.57-1.81,4.22-.24,5.93,1.57,1.7,4.22,1.81,5.93.24.15-.13.28-.28.41-.43l16.77-17.82c1.51-1.61,1.51-4.12,0-5.73l-16.77-17.82c-.76-.84-1.82-1.33-2.95-1.38h0Z" />
                    </g>
                </g>
            </svg>
        </div>
    );
}
export default Code