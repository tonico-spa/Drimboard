"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


const Circle = ({ fill }) => {

   
    return (
        <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.27 48.27">
            <defs>
                <style>
                    {`
                        .circle {
                        fill: ${fill}
                        }`}
                </style>
            </defs>
            <g id="suenos">
                <path className="circle" d="M24.13,0C10.8,0,0,10.8,0,24.13s10.8,24.13,24.13,24.13,24.13-10.8,24.13-24.13S37.46,0,24.13,0ZM24.13,38.44c-7.9,0-14.3-6.4-14.3-14.3s6.4-14.3,14.3-14.3,14.3,6.4,14.3,14.3-6.4,14.3-14.3,14.3Z" />
            </g>
        </svg>
    );
}
export default Circle