"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


const SquareCircle = ({ styles }) => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            const topCircle = svgRef.current.querySelector('.top_circle');
            const topSquare = svgRef.current.querySelector('.top_square');
            const bottomCircle = svgRef.current.querySelector('.bottom_circle');
            const bottomSquare = svgRef.current.querySelector('.bottom_square');

            // Create rotation animations for each element
            const createRotationAnimation = (element, delay = 0) => {
                gsap.timeline({ repeat: -1, repeatDelay: 5, delay: delay })
                    .to(element, {
                        rotation: 360,
                        duration: 1,
                        ease: "power2.inOut",
                        transformOrigin: "center center"
                    });
            };

            // Stagger the rotation animations
            createRotationAnimation(topCircle, 0);
            createRotationAnimation(topSquare, 0.3);
            createRotationAnimation(bottomCircle, 0.6);
            createRotationAnimation(bottomSquare, 0.9);
        }
    }, []);

    return (
        <div >
            <svg ref={svgRef} id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="-10 -10 116 116">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g id="Capa_1-2" data-name="Capa_1">
                    <circle className="top_circle" cx="24.02" cy="24.02" r="24.02" />
                    <rect className="top_square" x="48.04" width="48.04" height="48.04" rx="7.58" ry="7.58" />
                    <circle className="bottom_circle" cx="72.06" cy="72.06" r="24.02" />
                    <rect className="bottom_square" y="48.04" width="48.04" height="48.04" rx="7.58" ry="7.58" /></g>
            </svg>
        </div>
    );
}
export default SquareCircle