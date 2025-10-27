"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);


const SquareCircle = ({ styles }) => {
    return (
        <div >
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96.08 96.08">
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