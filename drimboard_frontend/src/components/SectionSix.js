"use client";

import { useEffect, useRef } from 'react';

import styles from "../styles/SectionSix.module.css";

import { gsap } from 'gsap';

import { ScrollTrigger } from "gsap/ScrollTrigger";
import SquareCircle from './svgs/SquareCircle';


gsap.registerPlugin(ScrollTrigger);



const SectionSix = () => {

    const squareCircleStyles = `
    .top_circle {
      fill: #F397C1;
    }
    .bottom_circle {
      fill: #F397C1;
    }
    .top_square {
      fill: #F397C1;
    }
    .bottom_square {
      fill: #F397C1;
    }`;



    return (

        <div className={styles.sectionSixContainer}>
            <div className={styles.sectionSixContainerTitle}>
                <div className={styles.sectionTwoTitleLogo}>
                    <SquareCircle styles={squareCircleStyles} />
                </div>
                Quiero <br></br> mi drim
            </div>
            <div className={styles.sectionSixContainerInfo}>
                <div className={`${styles.sectionSixContainerInfoCard} ${styles.cardRaised}`} >
                   <div className={styles.sectionSixTitle}>
                        <div className={styles.sectionSixTitle}>
                            Soy <br />
                            <span className={styles.highlightText}>Profesor</span>
                            <br />
                            y quiero mi drim
                        </div>
                    </div>
                    <div className={styles.sectionSixButton}>
                            consiguela
                    </div>

                </div>
                <div className={`${styles.sectionSixContainerInfoCard}`}>
                    <div className={styles.sectionSixTitle}>
                        <div className={styles.sectionSixTitle}>
                            Soy <br />
                            <span className={styles.highlightText}>Estudiante</span>
                            <br />
                            y quiero mi drim
                        </div>
                    </div>
                    <div className={styles.sectionSixButton}>
                            consiguela
                    </div>
                </div>
            </div>

        </div>

    );

};



export default SectionSix;