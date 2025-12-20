"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

const styles = `
    .line {
      fill: #DED900;
    }`;

const Line = () => {
    return (
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.27 48.27">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g>
                    <rect className="line" width="12.25" height="48.23" rx="3.81" ry="3.81" />
                    <rect className="line" x="18.18" width="12.25" height="48.23" rx="3.81" ry="3.81" />
                    <rect className="line" x="35.91" width="12.25" height="48.23" rx="3.81" ry="3.81" />
                </g>
            </svg>
    );
}
export default Line