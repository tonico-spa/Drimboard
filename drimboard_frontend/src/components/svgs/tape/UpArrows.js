"use client";

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const UpArrows = ({fill}) => {
    return (
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.98 44.49">
                <defs>
                    <style>
                        {`
    .upArrow {
      fill: ${fill};
    }`}
                    </style>
                </defs>
                <g>
                    <path className="upArrow" d="M15.83,23.35L1.11,38.08c-2.36,2.37-.69,6.41,2.66,6.41h29.45c3.34,0,5.02-4.04,2.66-6.41l-14.73-14.74c-1.47-1.47-3.85-1.47-5.31,0Z" />
                    <path className="upArrow" d="M15.83,1.1L1.11,15.84c-2.36,2.37-.69,6.41,2.66,6.41h29.45c3.34,0,5.02-4.04,2.66-6.41L21.14,1.1c-1.47-1.47-3.85-1.47-5.31,0Z" />
                </g>
            </svg>
    );
}
export default UpArrows