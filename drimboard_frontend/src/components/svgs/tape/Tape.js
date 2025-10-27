"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "../../../styles/Tape.module.css";

// SVGs
import Circle from "./Circle";
import CircleSquare from "./CircleSquare";
import InsideSquare from "./InsideSquare";
import Line from "./Lines";
import RightArrow from "./RightArrows";
import Square from "./Square";
import UpArrows from "./UpArrows";
import SideSquare from "./SideSquare";

const Tape = ({ direction = "left" }) => { // Accept a direction prop, defaulting to "left"
  const laneARef = useRef(null);
  const laneBRef = useRef(null);
  const speedRef = useRef(80); // px/sec
  const xARef = useRef(0);
  const xBRef = useRef(0);
  const laneWidthRef = useRef(0);

  const items = [
    <Square key="sq" />,
    <CircleSquare key="cs" fill={"#53C68E"} />,
    <InsideSquare key="isq" />,
    <UpArrows key="ua2" fill={"#f397c1"} />,
    <SideSquare key="ss" />,
    <Circle key="c" fill={"#53C68E"} />,
    <InsideSquare key="isq2" />,
    <RightArrow key="ra" />,
    <CircleSquare key="cs2" />,
    <Line key="ln" />,
    <UpArrows key="ua1" fill={"#FFB71A"} />,
        <Square key="sq" />,
    <CircleSquare key="cs" fill={"#53C68E"} />,
    <InsideSquare key="isq" />,
    <UpArrows key="ua2" fill={"#f397c1"} />,
    <SideSquare key="ss" />,
    <Circle key="c" fill={"#53C68E"} />,
    <InsideSquare key="isq2" />,
    <RightArrow key="ra" />,
    <CircleSquare key="cs2" />,
    <Line key="ln" />,
    <UpArrows key="ua1" fill={"#FFB71A"} />,
  ];

  useLayoutEffect(() => {
    const laneA = laneARef.current;
    const laneB = laneBRef.current;
    if (!laneA || !laneB) return;

    let animationFrameId = null;
    let lastTime = performance.now();

    const measure = () => {
      laneWidthRef.current = laneA.offsetWidth;
    };

    const init = () => {
      measure();
      if (direction === "left") {
        // Start lane A at 0 and lane B immediately after
        xARef.current = 0;
        xBRef.current = laneWidthRef.current;
      } else {
        // Start lane A at 0 and lane B immediately before
        xARef.current = 0;
        xBRef.current = -laneWidthRef.current;
      }
      gsap.set(laneA, { x: xARef.current });
      gsap.set(laneB, { x: xBRef.current });
    };

    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 2000; // Convert to seconds
      lastTime = currentTime;

      const distance = speedRef.current * deltaTime;
      const laneWidth = laneWidthRef.current;

      if (direction === "left") {
        // Move both lanes to the left
        xARef.current -= distance;
        xBRef.current -= distance;

        // Wrap lanes around for leftward movement
        if (xARef.current + laneWidth <= 1) {
          xARef.current = xBRef.current + laneWidth;
        }
        if (xBRef.current + laneWidth <= 1) {
          xBRef.current = xARef.current + laneWidth;
        }
      } else { // direction is "right"
        // Move both lanes to the right
        xARef.current += distance;
        xBRef.current += distance;

        // Wrap lanes around for rightward movement
        if (xARef.current >= 1) {
          xARef.current = xBRef.current - laneWidth;
        }
        if (xBRef.current >= 1) {
          xBRef.current = xARef.current - laneWidth;
        }
      }

      // Apply positions
      gsap.set(laneA, { x: xARef.current });
      gsap.set(laneB, { x: xBRef.current });

      animationFrameId = requestAnimationFrame(animate);
    };

    const start = () => {
      init();
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(animate);
    };

    requestAnimationFrame(start);

    const ro = new ResizeObserver(() => {
      measure();
      const ratio = xARef.current / (laneWidthRef.current || 1);
      init();
      xARef.current = ratio * laneWidthRef.current;
      if (direction === "left") {
        xBRef.current = xARef.current + laneWidthRef.current;
      } else {
        xBRef.current = xARef.current - laneWidthRef.current;
      }
    });
    ro.observe(laneA);

    return () => {
      ro.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [direction]); // Re-run the effect if the direction changes

  return (
    <div className={styles.marquee}>
      <div className={styles.wrapper}>
        <div ref={laneARef} className={styles.lane}>
          {items.map((item, i) => (
            <div className={styles.tapeItem} key={`a-${i}`}>
              {item}
            </div>
          ))}
        </div>
        <div ref={laneBRef} className={styles.lane} aria-hidden="true">
          {items.map((item, i) => (
            <div className={styles.tapeItem} key={`b-${i}`}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tape;