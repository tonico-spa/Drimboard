"use client";

import { useEffect, useState } from 'react';

import styles from "../styles/SectionSix.module.css";
import axios from 'axios';
import { gsap } from 'gsap';

import { ScrollTrigger } from "gsap/ScrollTrigger";
import SquareCircle from './svgs/SquareCircle';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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

    const [userDict, setUserDict] = useState({ "name": "", "email": "", "message": "" })

    const  sendForm = async (e) => {
        e.preventDefault()
        console.log(userDict)
        const response = await axios.post(`${API_URL}/send_form`, userDict)
     console.log(response)
        if(response.status === 200){
            console.log(response)
            setUserDict({ "name": "", "email": "", "message": "" })
            window.alert("Mensaje enviado! Nos contactaremos contigo")
        }


    }

    const handleChange = (e) => {
        setUserDict({
            ...userDict,
            [e.target.name]: e.target.value
        });
    };


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
                                    <input value={userDict.name} onChange={(e)=>handleChange(e)} type="text" id="name" name="name" required className={styles.inputStyle} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input value={userDict.email} onChange={(e)=>handleChange(e)} type="email" id="email" name="email" required className={styles.inputStyle} />
                                </div>
                            </div>


                            <div className={styles.formGroup}>
                                <label htmlFor="message">Escribenos un mensaje</label>
                                <textarea value={userDict.message} onChange={(e)=>handleChange(e)} id="message" name="message" rows="4" required className={styles.inputStyle} ></textarea>
                            </div>


                            <button type="submit" className={styles.submitBtn} onClick={(e) => sendForm(e)}>Enviar</button>
                            {/* <button type="submit" className={styles.submitBtn} onClick={(e) => getUsers(e)}>get</button> */}


                        </form>

                    </div>

                </div>
            </div>

        </div>

    );

};



export default SectionSix;