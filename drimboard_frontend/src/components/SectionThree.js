"use client";

import { useEffect, useRef } from 'react';

import styles from "../styles/SectionThree.module.css";

import { gsap } from 'gsap';

import { ScrollTrigger } from "gsap/ScrollTrigger";



gsap.registerPlugin(ScrollTrigger);



const SectionThree = ({ triggerRef }) => {

    // Ref for the content that will be moved/animated
    const scrollContentRef = useRef(null);

    // Ref for the container that acts as a "viewport" for the content
    const scrollContainerRef = useRef(null);



    useEffect(() => {

        // Ensure all necessary refs are mounted in the DOM
        if (triggerRef.current && scrollContentRef.current && scrollContainerRef.current) {



            // Use GSAP Context for proper cleanup in React
            let ctx = gsap.context(() => {

                const scrollContent = scrollContentRef.current;
                const scrollContainer = scrollContainerRef.current;

                // THE KEY CHANGE:
                // Calculate how much the content overflows its *specific container*.
                // This is the precise distance the animation needs to travel.

                const margin = -200
                const scrollDistance = scrollContainer.clientHeight*2;

                // Only create the animation if there is content to scroll
                if (scrollDistance > 0) {
                    gsap.to(scrollContent, {
                        // Animate the 'y' property to move the content up by the exact overflow amount
                        y: -scrollDistance,
                        ease: "none", // Linear movement for a natural scroll feel
                        scrollTrigger: {
                            trigger: triggerRef.current, // The outer element that triggers the whole effect
                            start: "top 20%", // When the top of the trigger hits the top of the viewport

                            // The pinning and scrubbing will last for a scroll duration
                            // equal to the calculated overflow distance.
                            end: `+=${scrollDistance}`,
                            markers: true,
                            scrub: 1,  // Smoothly link animation progress to the scrollbar (1 second catch-up)
                            pin: true, // Pins the trigger element while the animation is active

                            // Recalculates all values if the browser window is resized
                            invalidateOnRefresh: true,

                            // Uncomment for visual debugging of start/end points
                            // markers: true,

                        }
                    });
                }

            }, triggerRef); // Scope the context to the main container


            // Cleanup function to revert all GSAP animations and triggers on component unmount
            return () => ctx.revert();

        }

    }, [triggerRef]);



    return (

        <div className={styles.splitScrollContainer}>
            <div ref={scrollContainerRef} className={styles.scrollContainer}>
                <div ref={scrollContentRef} className={styles.scrollContent}>
                    <div className={styles.scrollSection}>
                        <div className={styles.scrollSectionTextContainer}>
                            <div>
                                <div className={styles.scrollSectionTitle}>
                                    Crea tu <br /> primer robot <br /> sin saber <br />programas
                                </div>
                                <div className={styles.scrollSectionText}>
                                    drim elimina la barrera inicial de la programacion tradicional.
                                    Mientras que en otros microcontroladores se necesita descargar
                                    softwares y aprender sintaxis de programacion, drim ofrece una
                                    interfaz visual e intuitiva sin necesidad de saber escribir codigo.
                                </div>
                            </div>
                        </div>

                        <div className={styles.scrollSectionTextContainer}>
                            <div>
                                <div className={styles.scrollSectionTitle}>
                                    Tu imaginacion <br /> es el limite, <br /> no los cables
                                </div>
                                <div className={styles.scrollSectionText}>
                                    Otros microcontroladores exponen al usuario a todos los
                                    componentes físicos desde el principio: la placa, los cables,
                                    la protoboard y los pines específicos. Al ocultar la placa y
                                    centralizar todo en una pantalla, drim reduce la complejidad y
                                    evita distracciones.
                                </div>
                            </div>
                        </div>
                        <div className={styles.scrollSectionTextContainer}>
                            <div>
                                <div className={styles.scrollSectionTitle}>
                                    De los <br /> bloques al <br /> codigo real
                                </div>

                                <div className={styles.scrollSectionText}>
                                    El sistema de programacion basado en bloques de drim es
                                    el puente perfecto hacia la programacion real.
                                    Al permitir ver el codigo creado con bloques se crea una
                                    ruta de aprendizaje natural: un niño primero domina la lógica
                                    con los bloques y, cuando siente curiosidad, puede espiar el
                                    código subyacente, entendiendo cómo una estructura visual se
                                    traduce en una sintaxis textual.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            {/* The right column that stays fixed */}

            <div className={styles.videoContainer}>
                <div className={styles.videoPlaceholder}>VIDEO</div>
            </div>

        </div>

    );

};



export default SectionThree;