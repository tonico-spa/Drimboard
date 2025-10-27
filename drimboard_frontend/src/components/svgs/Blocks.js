"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


const Blocks = ({ styles, hoverTargetRef }) => {
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
                .to('.block_1', { x: -5, y: -5, duration: 0.3, ease: 'power2.out' })
                .to('.block_2', { x: 5, duration: 0.3, ease: 'power2.out' }, '<')
                .to('.block_3', { x: -5, y: 5, duration: 0.3, ease: 'power2.out' }, '<');
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
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 106.09 106.09">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g id="Capa_1-2" data-name="Capa_1">
                    <path className="block_1" d="M58.64,0H2.21C.99,0,0,.99,0,2.21v62.92C0,66.35.99,67.34,2.21,67.34h18.45c1.22,0,2.21-.99,2.21-2.21v-26.62c0-1.22.99-2.21,2.21-2.21h33.55c1.22,0,2.21-.99,2.21-2.21V2.21c0-1.22-.99-2.21-2.21-2.21Z" />
                    <rect className="block_2" x="70.21" width="35.88" height="106.09" rx="2.37" ry="2.37" />
                    <path className="block_3" d="M60.85,104.13v-56.51c0-1.09-.88-1.97-1.97-1.97h-24.68c-1.09,0-1.97.88-1.97,1.97v27.12c0,1.09-.88,1.97-1.97,1.97H1.97c-1.09,0-1.97.88-1.97,1.97v25.46c0,1.09.88,1.97,1.97,1.97h56.92c1.09,0,1.97-.88,1.97-1.97Z" />
                </g>
            </svg>
        </div>
    );
}
export default Blocks