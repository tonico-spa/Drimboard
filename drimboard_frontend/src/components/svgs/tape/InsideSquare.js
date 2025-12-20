"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

const styles = `
    .insideSquare {
      fill: #ded900;
    }`;

const InsideSquare = () => {
    return (
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.27 48.27">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g id="suenos">
                    <path className="insideSquare" d="M23.81.05C10.32-.81-.81,10.32.05,23.81c.7,11.13,9.73,20.16,20.86,20.86,13.5.85,24.62-10.27,23.77-23.77C43.97,9.78,34.94.75,23.81.05ZM19.87,32.3l-7.45-7.45c-1.38-1.38-1.38-3.61,0-4.98l7.45-7.45c1.38-1.38,3.61-1.38,4.98,0l7.45,7.45c1.38,1.38,1.38,3.61,0,4.98l-7.45,7.45c-1.38,1.38-3.61,1.38-4.98,0Z" />
                </g>
            </svg>
    );
}
export default InsideSquare