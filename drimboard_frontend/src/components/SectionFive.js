"use client";

import { useEffect, useRef } from 'react';

import styles from "../styles/SectionFive.module.css";

import { gsap } from 'gsap';

import { ScrollTrigger } from "gsap/ScrollTrigger";



gsap.registerPlugin(ScrollTrigger);



const SectionFive = ({ triggerRef }) => {

    useEffect(() => {
        const blocks = gsap.utils.toArray(`.${styles.sectionFiveRightSideBlock}`);
        const leftTitle = document.querySelector(`.${styles.sectionFiveLeftSideTitle}`);
        const leftSmallTitle = document.querySelector(`.${styles.sectionFiveLeftSideSmallTitle}`);
        const leftContent = document.querySelector(`.${styles.sectionFiveLeftSideContent}`);

        if (!triggerRef?.current) return;

        // Create a timeline that triggers when container comes into view
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: triggerRef.current,
                start: 'bottom 70%',
                end: 'bottom 30%',
                toggleActions: 'play none none none',
            }
        });

        // Animate left side
        if (leftSmallTitle) {
            gsap.set(leftSmallTitle, {
                opacity: 0,
                y: 30
            });

            tl.to(leftSmallTitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
            }, 0);
        }

        if (leftTitle) {
            const titleLines = Array.from(leftTitle.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '');
            
            // Animate the title container itself
            gsap.set(leftTitle, {
                opacity: 0,
                y: 50
            });

            tl.to(leftTitle, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
            }, 0.1);
        }

        if (leftContent) {
            gsap.set(leftContent, {
                opacity: 0,
                y: 50
            });

            tl.to(leftContent, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
            }, 0.3);
        }

        // Animate right side blocks
        blocks.forEach((block, index) => {
            const textContainer = block.querySelector(`.${styles.sectionFiveRightTextContainer}`);
            const smallTitle = block.querySelector(`.${styles.sectionFiveRightSideSmallTitle}`);

            if (smallTitle) {
                gsap.set(smallTitle, {
                    opacity: 0,
                    y: 30
                });

                tl.to(smallTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                }, index * 0.2);
            }

            if (textContainer) {
                gsap.set(textContainer, {
                    opacity: 0,
                    y: 50
                });

                tl.to(textContainer, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                }, index * 0.2 + 0.1);
            }
        });
    }, [triggerRef]);


    return (

        <div className={styles.sectionFiveContainer}>
            <div className={styles.sectionFiveContentContainer}>
                <div className={styles.sectionFiveLeftSide}>

                    <div className={styles.sectionFiveLeftSideTitle}>
                        <div className={styles.sectionFiveLeftSideSmallTitle}>
                            Usa tu drim
                        </div>
                        Juega <br></br>
                        Aprende <br></br>
                        Repite <br></br>
                        <div className={styles.sectionFiveLeftSideContent}>
                            Lo que puedes soñar, lo puedes crear. Te mostramos cómo darle vida a tu drim en tres simples pasos.
                        </div>
                    </div>

                </div>
                <div className={styles.sectionFiveRightSide}>
                    <div className={styles.sectionFiveRightSideBlock}>
                        <div className={styles.sectionFiveRightSideSmallTitle}>
                            Paso 1
                        </div>
                        <div className={styles.sectionFiveRightTextContainer}>

                            <div className={styles.sectionFiveRightText}>
                                Solo la drim es lo que necesitas para empezar. Conectala a tu 
                                computador y comienza a programar.
                            </div>
                            <div className={styles.sectionFiveRightImg}>
                                <img
                                    src="/1_solo_caja.png"
                                    alt="Duolab Logo"
                                    className={styles.coverLogo}
                                />
                            </div>
                        </div>

                    </div>
                    <div className={styles.sectionFiveRightSideBlock}>
                        <div className={styles.sectionFiveRightSideSmallTitle}>
                            Paso 2
                        </div>
                        <div className={styles.sectionFiveRightSideBlock}>

                            <div className={styles.sectionFiveRightTextContainer}>

                                <div className={styles.sectionFiveRightText}>
                                    Conecta actuadores y sensores externos y ve como tu drim cobra 
                                    vida con nuevas funcionalidades.
                                </div>
                                <div className={styles.sectionFiveRightImg}>
                                    <img
                                        src="/2_caja_y_externos.png"
                                        alt="Duolab Logo"
                                        className={styles.coverLogo}
                                    />

                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={styles.sectionFiveRightSideBlock}>
                        <div className={styles.sectionFiveRightSideSmallTitle}>
                            Paso 3
                        </div>
                        <div className={styles.sectionFiveRightSideBlock}>

                            <div className={styles.sectionFiveRightTextContainer}>

                                <div className={styles.sectionFiveRightText}>
                                    Abre tu drim y trabaja directamente con el microcontrolador
                                     para proyectos mas audaces.
                                </div>
                                <div className={styles.sectionFiveRightImg}>
                                    <img
                                        src="/3_mas_complejos.png"
                                        alt="Duolab Logo"
                                        className={styles.coverLogo}
                                    />

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>

    );

};



export default SectionFive;