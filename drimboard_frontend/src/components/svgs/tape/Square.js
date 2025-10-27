"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

const styles = `
    .square {
      fill: #53C68E;
    }
    }`;

const Square = () => {
    return (
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.49 40.49">
                <defs>
                    <style>
                        {styles}
                    </style>
                </defs>
                <g id="suenos">
                    <path className="square" d="M0,3.23v34.03c0,1.78,1.45,3.23,3.23,3.23h34.03c1.78,0,3.23-1.45,3.23-3.23V3.23c0-1.78-1.45-3.23-3.23-3.23H3.23C1.45,0,0,1.45,0,3.23ZM28.96,32.19H11.54c-1.78,0-3.23-1.45-3.23-3.23V11.54c0-1.78,1.45-3.23,3.23-3.23h17.42c1.78,0,3.23,1.45,3.23,3.23v17.42c0,1.78-1.45,3.23-3.23,3.23Z" />
                </g>
            </svg>
    );
}
export default Square