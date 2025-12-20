"use client";
import { useEffect, useRef, useState } from 'react';
import styles from "../styles/SectionTwoCards.module.css"
import Blocks from './svgs/Blocks';
import Code from './svgs/Code';
import Stairs from './svgs/Stairs';
import Hands from './svgs/Hands';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SectionTwoCards = ({ triggerRef }) => {
  const containerRef = useRef(null);
  const blockContainerRef = useRef(null);
  const codeContainerRef = useRef(null);
  const handsContainerRef = useRef(null);
  const stairsContainerRef = useRef(null);


  const squareCircleStyles = `
    .block_1 {
      fill: #53C68E; 
    }
    .block_2 {
      fill: #F397C1; 
    }
    .block_3 {
      fill: #DED900; 
    }
    `;
  const codeStyles = `
    .box {
      fill: #F397C1; 
    }
    .stroke_1 {
      fill: #DED900; 
    }
    .stroke_2 {
      fill: #DED900; 
    }
      .stroke_3 {
      fill: #DED900; 
    }
    `;
  const stairsStyles = `
    .arrow {
      fill: #F397C1; 
    }
    .border {
      fill: #53c68e; 
    }
    .stairs {
      fill: #53c68e; 
    }
    `;
  const handsStyles = `
    .flower_1 {
      fill: #F397C1; 
    }
    .flower_2 {
      fill: #F397C1; 
    }
    .flower_3 {
      fill: #F397C1; 
    }
    .hand {
      fill: #FFB71A; 
    }
    .wrist {
      fill: #53c68e; 
    }
    `;
  useEffect(() => {
    // A robust way to select all card elements
    const cards = gsap.utils.toArray('.singleCardContainer');

    // Set initial state - cards hidden and slightly below
    gsap.set(cards, {
      opacity: 0,
      y: 290
    });

    // Create a timeline for sequential card appearance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef?.current || cards[0],
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    // Animate cards appearing one by one with stagger
    cards.forEach((card, index) => {
      const textContainer = card.querySelector(`.${styles.singleCardText}`);
      
      // Set initial state for this card's text
      gsap.set(textContainer, {
        opacity: 0,
        y: 30
      });
      
      // Animate card
      tl.to(card, {
        opacity: 1,
        y: 0,
        rotation: gsap.utils.random(-15, 15),
        duration: 0.5,
        ease: 'power2.out'
      }, index * 0.15); // Stagger by 0.15 seconds
      
      // Animate text sliding up
      tl.to(textContainer, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, index * 0.15 + 0.2); // Start 0.2s after card animation starts
    });

    // 2. ADD EVENT LISTENERS TO EACH CARD
    cards.forEach(card => {
      // --- MOUSE ENTER ---
      card.addEventListener('mouseenter', () => {
        // Find all other cards by filtering the one we are hovering over
        const otherCards = cards.filter(c => c !== card);

        // Animate the HOVERED card
        gsap.to(card, {
          rotation: 0,      // Make it straight
          scale: 1.1,       // Make it bigger
          y: -20,           // Move it up to separate it
          duration: 0.15,
          ease: 'power2.out',
          overwrite: true // Immediately overwrite any existing animation
        });

        // Animate the OTHER cards to new random angles immediately
        otherCards.forEach(otherCard => {
          gsap.to(otherCard, {
            rotation: gsap.utils.random(-15, 15),
            duration: 0.15,
            ease: 'power2.out',
            overwrite: true
          });
        });
      });

      // --- MOUSE LEAVE ---
      card.addEventListener('mouseleave', () => {
        // Animate all cards simultaneously - no setTimeout delay
        gsap.to(card, {
          scale: 1,
          y: 0,
          rotation: gsap.utils.random(-15, 15),
          duration: 0.2,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        // Give ALL other cards a new random rotation immediately
        const otherCards = cards.filter(c => c !== card);
        otherCards.forEach(otherCard => {
          gsap.to(otherCard, {
            rotation: gsap.utils.random(-15, 15),
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });
      });
    });

    // --- CLEANUP ---
    // Remove event listeners when the component unmounts to prevent memory leaks
    return () => {
      cards.forEach(card => {
        card.removeEventListener('mouseenter', () => { });
        card.removeEventListener('mouseleave', () => { });
      });
    };
  }, []); // Empty dependency array ensures this runs only once on mount
  
  return (
    <div className={styles.cardsContainer} ref={containerRef}>
      <div className={`${styles.singleCardContainer} singleCardContainer`} ref={blockContainerRef}>
        <div className={styles.svgContainer}>
          <Blocks styles={squareCircleStyles} hoverTargetRef={blockContainerRef} />
        </div>
        <div className={styles.singleCardTextContainer}>
          <div className={styles.singleCardTitle}>
            Código con
            Bloques
          </div>
          <div className={styles.singleCardText}>
            ¡Arrastra, Suelta y Crea!
          </div>

        </div>
      </div>
      <div className={`${styles.singleCardContainer} singleCardContainer`} ref={codeContainerRef}>
        <div className={styles.svgContainer}>
          <Code styles={codeStyles} hoverTargetRef={codeContainerRef} />
        </div>
        <div className={styles.singleCardTextContainer}>
          <div className={styles.singleCardTitle}>
            Código en
            Texto
          </div>
          <div className={styles.singleCardText}>
            El siguiente paso para <br /> futuros innovadores
          </div>
        </div>
      </div>
      <div className={`${styles.singleCardContainer} singleCardContainer`}  ref={stairsContainerRef}>
        <div className={styles.svgContainer}>
          <Stairs styles={stairsStyles}  hoverTargetRef={stairsContainerRef}/>
        </div>
        <div className={styles.singleCardTextContainer}>
          <div className={styles.singleCardTitle}>
            Aprendizaje <br /> Escalonado
          </div>
          <div className={styles.singleCardText}>
            Una aventura a <br /> tu propio ritmo
          </div>
        </div>
      </div>
      <div className={`${styles.singleCardContainer} singleCardContainer`} ref={handsContainerRef}>
        <div className={styles.svgContainer}>
          <Hands styles={handsStyles} hoverTargetRef={handsContainerRef} />
        </div>
        <div className={styles.singleCardTextContainer}>
          <div className={styles.singleCardTitle}>
            Interviene <br />
            tu Entorno
          </div>
          <div className={styles.singleCardText}>
            La magia de lo físico <br /> y lo digital
          </div>
        </div>
      </div>


    </div>
  )
}

export default SectionTwoCards