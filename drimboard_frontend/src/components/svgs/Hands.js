"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


const Hands = ({ styles, hoverTargetRef }) => {
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
                .to('.flower_1', { y: 5, x: 5, duration: 0.3, ease: 'power2.out' } )
                .to('.flower_3', { y: 5, x: -5,duration: 0.3, ease: 'power2.out'}, "-=0.3")
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
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 117.49 95.98">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g>
                    <path className="wrist" d="M7.02,54.93H2.58c-1.42,0-2.58,1.16-2.58,2.58v34.59c0,1.42,1.16,2.58,2.58,2.58h4.44c1.42,0,2.58-1.16,2.58-2.58v-34.59c0-1.43-1.16-2.58-2.58-2.58Z" />
                    <path className="hand" d="M116.03,52.11c-2.34-1.24-9.63-.81-32.14,15.77.08.29.15.59.21.91.42,2.16-.04,4.07-1.39,5.65-4.32,5.1-16.62,5.4-26.86,5.1-.75-.03-1.34-.04-1.71-.04h-7.21c-.74,0-1.34-.6-1.34-1.34s.6-1.34,1.34-1.34h7.21c.41,0,1.02.02,1.79.04,5.12.15,20.7.62,24.74-4.15.8-.95,1.07-2.06.8-3.41-.1-.55-.24-1.04-.4-1.45,0,0,0,0,0-.01-1.12-3.02-3.57-2.99-9.47-2.63-5.32.33-12.6.77-21.76-2.05-16.69-5.14-33.46-1.34-37.55-.26v24.28c4.77.63,22.49,3.09,30.35,5.77l.37.13c8.63,2.95,19.37,6.62,35.49-5.78,3.31-2.54,6.9-5.28,10.36-7.92,12.12-9.24,27.16-20.7,28.62-23.02,0-.05,0-.1,0-.15.06-1.61-.06-3.36-1.45-4.1Z" />
                    <path className="flower_1" d="M61.72,52.87c11,1.96,19.33.31,24.78-4.94,9.56-9.19,7.71-26.85,7.15-30.85-2.56-.67-10.92-2.47-18.65,0,.83,2.42,1.37,5.03,1.49,7.78.4,9.66-4.57,19.07-14.77,28.01Z" />
                    <path className="flower_2" d="M58.74,51.89c10.38-8.69,15.46-17.74,15.08-26.91-.53-13.01-11.99-22.63-15.08-24.98-3.08,2.36-14.54,11.98-15.08,24.98-.38,9.17,4.7,18.22,15.08,26.91Z" />
                    <path className="flower_3" d="M30.99,47.93c5.46,5.24,13.78,6.9,24.78,4.93-10.21-8.93-15.18-18.35-14.77-28.01.11-2.76.66-5.36,1.49-7.78-7.73-2.46-16.09-.66-18.64,0-.56,4-2.4,21.67,7.15,30.85Z" />
                </g>
            </svg>
        </div>
    );
}
export default Hands