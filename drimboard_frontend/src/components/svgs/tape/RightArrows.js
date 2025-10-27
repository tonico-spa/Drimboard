"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

  const styles = `
    .first_triangle {
      fill: #f397c1;
    }
    .second_triangle {
      fill: #f397c1;
    }`;

const RightArrow = () => {
    return (
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42.13 35.82">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g>
                    <path className="first_triangle" d="M20.02,15.33L6.08,1.07C3.84-1.22,0,.41,0,3.65v28.52c0,3.25,3.84,4.87,6.08,2.58l13.94-14.26c1.39-1.42,1.39-3.73,0-5.16Z" />
                    <path className="second_triangle" d="M41.09,15.33L27.15,1.07c-2.24-2.3-6.08-.67-6.08,2.58v28.52c0,3.25,3.84,4.87,6.08,2.58l13.94-14.26c1.39-1.42,1.39-3.73,0-5.16Z" />
                </g>
            </svg>
    );
}
export default RightArrow