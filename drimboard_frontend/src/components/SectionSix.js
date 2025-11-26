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
                Quiero <br></br> mi taller
            </div>
            <div className={styles.sectionSixContainerInfo}>

                {/* <div className={`${styles.sectionSixContainerInfoCard} ${styles.cardRaised}`} >
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

                </div> */}
                <div className={`${styles.sectionSixContainerInfoCard}`}>
                    <div className={styles.sectionSixTitle}>
                        <div className={styles.sectionSixTitle}>
                            Quieres que vayamos a hacerte un taller? <br />

                            <span className={styles.highlightText}>Contáctanos</span>

                        </div>
                        <form className={styles.form} >
                            <div className={styles.contactFirstWrap}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Nombre</label>
                                    <input  type="text" id="name" name="name" required className={styles.inputStyle}  />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" required className={styles.inputStyle}  />
                                </div>
                            </div>


                            <div className={styles.formGroup}>
                                <label htmlFor="msg">Escribenos un mensaje</label>
                                <textarea id="msg" name="msg" rows="4" required className={styles.inputStyle} ></textarea>
                            </div>
                           

                            <button type="submit" className={styles.submitBtn} >Enviar</button>
                            {/* <button type="submit" className={styles.submitBtn} onClick={(e) => getUsers(e)}>get</button> */}


                        </form>

                    </div>

                </div>
            </div>

        </div>

    );

};



export default SectionSix;