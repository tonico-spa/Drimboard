"use client";

import { useEffect, useRef } from 'react';

import styles from "../styles/SectionFive.module.css";

import { gsap } from 'gsap';

import { ScrollTrigger } from "gsap/ScrollTrigger";



gsap.registerPlugin(ScrollTrigger);



const SectionFive = () => {




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
                    </div>
                    <div className={styles.sectionFiveRightSideBlock}>
                        <div className={styles.sectionFiveRightSideSmallTitle}>
                            Paso 1
                        </div>
                    </div>
                    <div className={styles.sectionFiveRightSideBlock}>
                        <div className={styles.sectionFiveRightSideSmallTitle}>
                            Paso 1
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );

};



export default SectionFive;