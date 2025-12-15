"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


const RightArrow = ({ styles }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            const firstTriangle = svgRef.current.querySelector('.first_triangle');
            const secondTriangle = svgRef.current.querySelector('.second_triangle');

            // Set initial state - hidden and positioned to the left
            gsap.set([firstTriangle, secondTriangle], {
                x: -50,
                opacity: 0
            });

            // Animate arrows appearing one by one from the left with bounce
            gsap.to(firstTriangle, {
                x: 0,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.7)",
                delay: 0
            });

            gsap.to(secondTriangle, {
                x: 0,
                opacity: 1,
                duration: 0.6,
                ease: "back.out(1.7)",
                delay: 0.2
            });
        }
    }, []);

    return (
        <div>
            <svg ref={svgRef} id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55.22 40.46">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g id="Capa_1-2" data-name="Capa_1">
                    <path className="first_triangle" d="M22.25,16.65L6.76,1.17C4.26-1.33,0,.44,0,3.97v30.97c0,3.53,4.26,5.29,6.76,2.8l15.5-15.49c1.55-1.55,1.55-4.05,0-5.6Z" />
                    <path className="second_triangle" d="M45.67,16.65L30.17,1.17c-2.49-2.49-6.76-.73-6.76,2.8v30.97c0,3.53,4.26,5.29,6.76,2.8l15.5-15.49c1.55-1.55,1.55-4.05,0-5.6Z" />        </g>
            </svg>
        </div>
    );
}
export default RightArrow