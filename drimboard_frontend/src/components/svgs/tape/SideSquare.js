"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

const styles = `
    .square {
      fill: #ded900;
    }
    }`;

const SideSquare = () => {
    return (
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52.54 51.77">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g>
                    <path className="cls-1" d="M26.27,47.61c0,2.59,2.36,4.57,4.91,4.09,12.16-2.3,21.37-12.98,21.37-25.81,0-12.83-9.2-23.52-21.37-25.81-2.55-.48-4.91,1.5-4.91,4.09v43.45Z" />
                    <path className="cls-1" d="M0,47.61c0,2.59,2.36,4.57,4.91,4.09,12.16-2.3,21.37-12.98,21.37-25.81,0-12.83-9.2-23.52-21.37-25.81C2.36-.41,0,1.57,0,4.16v43.45Z" />
                </g>
            </svg>
    );
}
export default SideSquare