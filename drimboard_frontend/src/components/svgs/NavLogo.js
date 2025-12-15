"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


const NavLogo = ({ styles }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            const circles = svgRef.current.querySelectorAll('circle');

            // Create independent blinking animation for each eye
            circles.forEach((element, index) => {
                const createBlinkTimeline = () => {
                    const timeline = gsap.timeline({ 
                        repeat: -1, 
                        repeatDelay: gsap.utils.random(2, 4) 
                    });
                    
                    // Random initial delay
                    timeline.to({}, { duration: gsap.utils.random(0, 2) })
                    // Quick blink
                    .to(element, {
                        scaleY: 0.1,
                        duration: 0.1,
                        ease: "power2.in",
                        transformOrigin: "center center"
                    })
                    .to(element, {
                        scaleY: 1,
                        duration: 0.1,
                        ease: "power2.out"
                    })
                    // Sometimes double blink
                    .to({}, { 
                        duration: Math.random() > 0.7 ? 0.2 : 0,
                        onComplete: () => {
                            if (Math.random() > 0.7) {
                                gsap.to(element, {
                                    scaleY: 0.1,
                                    duration: 0.1,
                                    ease: "power2.in",
                                    transformOrigin: "center center",
                                    onComplete: () => {
                                        gsap.to(element, {
                                            scaleY: 1,
                                            duration: 0.1,
                                            ease: "power2.out"
                                        });
                                    }
                                });
                            }
                        }
                    });
                    
                    return timeline;
                };
                
                createBlinkTimeline();
            });
        }
    }, []);

    return (
        <div style={{ width: '20%', height: '50%' }}>
            <svg ref={svgRef} id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69.59 46.1" style={{ width: '100%', height: '100%' }}>
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g id="portada">
                    <g>
                        <path className="cls-8" d="M67.22,14.36c-.03-2.22-1.12-4.3-2.95-5.58l-5.77-4.04c-1.16-.82-2.55-1.25-3.97-1.25h-3.73c-.28-1.95-1.94-3.46-3.97-3.46h-3.52c-2.03,0-3.69,1.51-3.97,3.46h-14.5c-.27-1.97-1.93-3.49-3.97-3.49h-3.52c-2.04,0-3.71,1.52-3.97,3.49h-2.99c-3.82,0-6.92,3.1-6.92,6.93v3.63c-1.95.28-3.46,1.94-3.46,3.97v3.52c0,2.03,1.51,3.69,3.46,3.97v9.63c0,2.26,1.1,4.38,2.95,5.67l5.77,4.04c1.16.82,2.55,1.25,3.97,1.25h40.17c6.02,0,10.9-4.88,10.9-10.9v-10c1.39-.63,2.36-2.03,2.36-3.66v-3.52c0-1.63-.97-3.03-2.37-3.66ZM54.66,32.62c0,2.01-1.63,3.64-3.64,3.64H12.26c-2.01,0-3.64-1.63-3.64-3.64V11.49c0-2.01,1.63-3.64,3.64-3.64h38.76c2.01,0,3.64,1.63,3.64,3.64v21.12Z" />
                        <g>
                            <circle className="cls-8" cx="23.03" cy="22.05" r="5.79" />
                            <circle className="cls-8" cx="40.24" cy="22.05" r="5.79" />
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
}
export default NavLogo