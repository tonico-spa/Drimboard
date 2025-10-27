"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register the ScrollTrigger plugin with GSAP
gsap.registerPlugin(ScrollTrigger);

const styles = `
    .circle {
      fill: #53C68E;
    }`;

const CircleSquare = ({ fill }) => {
    return (
        <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.3 47.3">
            <defs>
                <style>
                    {`
    .circleSquare {
      fill: ${fill};
    }`}
                </style>
            </defs>
            <g>
                <circle className="circleSquare" cx="7.88" cy="7.88" r="7.88" />
                <circle className="circleSquare" cx="23.65" cy="7.88" r="7.88" />
                <circle className="circleSquare" cx="39.41" cy="7.88" r="7.88" />
                <circle className="circleSquare" cx="7.88" cy="23.65" r="7.88" />
                <circle className="circleSquare" cx="23.65" cy="23.65" r="7.88" />
                <circle className="circleSquare" cx="39.41" cy="23.65" r="7.88" />
                <circle className="circleSquare" cx="7.88" cy="39.41" r="7.88" />
                <circle className="circleSquare" cx="23.65" cy="39.41" r="7.88" />
                <circle className="circleSquare" cx="39.41" cy="39.41" r="7.88" />
            </g>
        </svg>
    );
}
export default CircleSquare