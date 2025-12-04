"use client";
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Main.module.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RightArrow from './svgs/RightArrows';
import SquareCircle from './svgs/SquareCircle';
import SectionTwoCards from './SectionTwoCards';
import Tape from './svgs/tape/Tape';
import Lenis from '@studio-freight/lenis'; // Import Lenis
import SectionFive from './SectionFive';
import SectionSix from './SectionSix';
import { Suspense } from 'react';
import useAppStore from '@/store/useAppStore';
import LoginForm from './LoginForm';
import StepViewer from './SetpViewer';
import VideoEmbed from "./VideoEmbed";
import Materials from './materials/Materials';
gsap.registerPlugin(ScrollTrigger);


const Main = () => {
  const mainContainerRef = useRef(null);
  const sectionThreeTriggerRef = useRef(null);
  const scrollContentRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const mainScrollContainerRef = useRef(null);


  // --- REFS FOR SECTION FOUR CARDS ---
  const cardsContainerRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);
  // ------------------------------------
  const openLoginForm = useAppStore((state) => state.openLoginForm);
  const open_materials = useAppStore((state) => state.openMaterialsPage);


  const [activeCard, setActiveCard] = useState(0);
  const [openMaterials, setOpenMaterials] = useState(false);


  useEffect(() => {
    console.log(open_materials)
    setOpenMaterials(open_materials)
  }, [open_materials])

  const arrowStyles = `
    .first_triangle {
      fill: #f397c1;
    }
    .second_triangle {
      fill: #f397c1;
    }`;

  const squareCircleStyles = `
    .top_circle {
      fill: #53C68E;
    }
    .bottom_circle {
      fill: #53C68E;
    }
    .top_square {
      fill: #53C68E;
    }
    .bottom_square {
      fill: #53C68E;
    }`;

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2, // How fast the smooth scroll is
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
    });

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Function to run on each animation frame
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup function to destroy the Lenis instance when the component unmounts
    return () => {
      lenis.destroy();
    };
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    console.log(openLoginForm)

  }, [openLoginForm])

  // Effect for Section Three (Split Scroll)
  useEffect(() => {
    console.log(openMaterials)

    if (openMaterials === true) return;
    let ctx = gsap.context(() => {
      if (mainScrollContainerRef.current && scrollContentRef.current && scrollContainerRef.current) {
        const scrollContent = scrollContentRef.current;
        const scrollContainer = scrollContainerRef.current;
        const sectionThreeContainer = mainScrollContainerRef.current;

        const scrollDistance = scrollContent.scrollHeight - scrollContainer.clientHeight;

        if (scrollDistance > 0) {
          gsap.to(scrollContent, {
            y: -scrollDistance,
            ease: "none",
            scrollTrigger: {
              trigger: sectionThreeContainer,
              start: "top 5%",
              end: `+=${scrollDistance}`,
              scrub: 1,
              pin: sectionThreeContainer,
              pinSpacing: true,
              invalidateOnRefresh: true,
              enabled: true
            }
          });
        }
      }
    }, mainContainerRef);

    return () => ctx.revert();
  }, [openMaterials]);

  // Effect for Section Two (Title Fade-in)
  useEffect(() => {
    console.log(openMaterials)

    if (openMaterials === true) return; // Skip if materials page is open
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: `.${styles.sectionTwoContainer}`,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });

      tl.from(`.${styles.sectionTwoTitleLogo}`, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out'
      })
        .from(`.${styles.sectionTwoTitleText}`, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out'
        }, '<');

      tl.from(`.${styles.sectionTwoCards}`, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out'
      }, '-=0.5');

    }, mainContainerRef);

    return () => ctx.revert();
  }, [openMaterials]);

  // useEffect(() => {
  //   if (openMaterials === true) return; // Skip if materials page is open
  //   const ctx = gsap.context(() => {


  //     gsap.set([card2Ref.current, card3Ref.current, card4Ref.current], { yPercent: 100, opacity: 0 });

  //     const tl = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: cardsContainerRef.current, // Use the ref for the trigger element
  //         pin: true,
  //         pinSpacing: true,
  //         start: "top 20%",
  //         end: "+=5000", // A larger value gives more scroll room for the animation
  //         scrub: 1,
  //         invalidateOnRefresh: true,
  //         enabled: true
  //         // markers: true, // Uncomment for debugging
  //       }
  //     });

  //     // Animate Card 2 into view
  //     tl.addLabel("card2Enter")
  //       .to(card1Ref.current, { scale: 1, yPercent: -10, opacity: 1 }, "card2Enter")
  //       .to(card2Ref.current, { yPercent: 0, opacity: 1 }, "card2Enter")
  //       .add(() => setActiveCard(tl.scrollTrigger.direction > 0 ? 1 : 0));

  //     // Animate Card 3 into view
  //     tl.addLabel("card3Enter")
  //       .to(card2Ref.current, { scale: 1, yPercent: -8, opacity: 1 }, "card3Enter")
  //       .to(card3Ref.current, { yPercent: 0, opacity: 1 }, "card3Enter")
  //       .add(() => setActiveCard(tl.scrollTrigger.direction > 0 ? 2 : 1));

  //     // Animate Card 4 into view
  //     tl.addLabel("card4Enter")
  //       .to(card3Ref.current, { scale: 1, yPercent: -6, opacity: 1 }, "card4Enter")
  //       .to(card4Ref.current, { yPercent: 0, opacity: 1 }, "card4Enter")
  //       .add(() => setActiveCard(tl.scrollTrigger.direction > 0 ? 3 : 2));

  //   }, mainContainerRef);

  //   return () => ctx.revert();
  // }, [openMaterials]);
  return (
    !openMaterials ? (
      <div className={styles.mainContainer} ref={mainContainerRef}>
   
        <div className={styles.coverContainer}>
        <img
            src="/auto.png"
            alt="cover image"
            className={styles.coverImg}
          />
          <img
            src="/cover_logo.png"
            alt="Duolab Logo"
            className={styles.coverLogo}
          />

          <div className={styles.coverSubtitleContainer}>

            <div className={styles.coverSubtitleLogo}>
              <RightArrow styles={arrowStyles} />
            </div>
            <div className={styles.coverSubtitleText}>
              Preparate para el futuro
            </div>

          </div>
         

        </div>
     <div className={styles.separator}></div>
        <div className={styles.sectionTwoContainer}>

          <div className={styles.sectionTwoTitleContainer}>
            <div className={styles.sectionTwoTitleLogo}>
              <SquareCircle styles={squareCircleStyles} />
            </div>
            <div className={styles.sectionTwoTitleText}>
              Tu Mundo, Tus Reglas
              <br />
              Crea Sin Límites
            </div>
          </div>
          <div className={styles.sectionTwoCards}>
            <SectionTwoCards />
          </div>
        <div className={styles.separator}></div>

        </div>
        <div className={styles.sectionThreeContainer} ref={mainScrollContainerRef}>

          <div className={styles.splitScrollTitle}>
            drim v/s otros microcontroladores
          </div>
          <div className={styles.splitScrollContainer} ref={sectionThreeTriggerRef}>
            <div ref={scrollContainerRef} className={styles.scrollContainer}>
              <div ref={scrollContentRef} className={styles.scrollContent}>
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



            {/* The right column that stays fixed */}

            <div className={styles.videoContainer}>


              <Suspense fallback={<div>Loading 3D model...</div>}>
                <StepViewer fileUrl="/models/kit_sim.glb" initialAngle={-Math.PI / 2} />
              </Suspense>

            </div>

          </div>
          
        </div>
             <div className={styles.separator}></div>

        <div className={styles.separator}></div>
        {/* --- UPDATED JSX FOR SECTION FOUR --- */}
        <Tape />

        <div className={styles.sectionFiveContainer}>
          <div className={styles.sectionFiveVideoContainer}>
            <div className={styles.sectionFiveTextContainer}>
              <div className={styles.sectionFiveVideo}>
                <VideoEmbed styles={styles} videoUrl={"https://youtu.be/DkfgSmyWFec?si=f0SsxZZgYLswl6SO"} />
              </div>
              <div className={styles.sectionFiveTitle}>
                Sofía
              </div>
              <div className={styles.sectionFiveSubTitle}>
                9 años - Futura Botánica
              </div>

              <div className={styles.sectionFiveText}>
                Siempre me encantaron las plantas, pero se me olvidaba regarlas.
                Con el kit armé un sistema que riega mis plantas solo cuando la tierra está seca.
                ¡No tuve que programar nada complicado! Solo seguí los pasos y conecté el sensor de
                humedad. Ahora mis plantas están más verdes que nunca.
              </div>

            </div>
            <div className={styles.sectionFiveTextContainer}>
              <div className={styles.sectionFiveVideo}>
                <VideoEmbed styles={styles} videoUrl={"https://youtu.be/DkfgSmyWFec?si=f0SsxZZgYLswl6SO"} />
              </div>
              <div className={styles.sectionFiveTitle}>
                Mateo
              </div>
              <div className={styles.sectionFiveSubTitle}>
                10 años - Futuro Músico
              </div>

              <div className={styles.sectionFiveText}>
                Quiero ser músico como mi papá, pero nunca imaginé que podría crear mis propios instrumentos.
                Con el kit construí una guitarra que hace sonidos cuando tocas los botones.
                Lo mejor es que el kit ya trae todo listo para empezar, no necesitas saber programar.

              </div>

            </div>
            <div className={styles.sectionFiveTextContainer}>
              <div className={styles.sectionFiveVideo}>
                <VideoEmbed styles={styles} videoUrl={"https://youtu.be/DkfgSmyWFec?si=f0SsxZZgYLswl6SO"} />
              </div>
              <div className={styles.sectionFiveTitle}>
                Valentina
              </div>
              <div className={styles.sectionFiveSubTitle}>
                11 años - Futura Geóloga
              </div>

              <div className={styles.sectionFiveText}>
                Los terremotos siempre me dieron curiosidad. ¿Cómo los detectan?
                Con el kit pude construir mi propio detector de movimientos sísmicos para mi proyecto de ciencias.
                Pensé que sería súper difícil, pero las instrucciones son tan claras que lo armé en una
                tarde.
              </div>
            </div>
          </div>
        </div>
        <Tape />

        {/* <div className={styles.separator}></div> */}
        {/* <div className={styles.sectionFourContainer}>
          <div className={styles.cards} ref={cardsContainerRef}>
            <div ref={card1Ref} className={`${styles.customCard} ${styles.card1}`}>
              <div className={styles.sectionFourTitleContainer}>
                <div className={styles.sectionFourActivityTitle}>
                  Actividades
                </div>
                <div className={styles.sectionFourActivitySubTitle}>
                  Titulo de la actividad
                </div>

              </div>
              <div className={styles.sectionFourActivityInformationContainer}>
                <div className={styles.sectionFourActivityInformation}>
                  Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam,
                  quis nostrud exercitation
                  ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur
                </div>
                <div className={styles.sectionFourActivityButton}>
                  <div>
                    Ver mas
                  </div>
                  <div className={styles.sectionFourActivityArrow}>
                    <RightArrow styles={arrowStyles} />
                  </div>

                </div>
              </div>
              <div className={styles.sectionFourActivityInformationPicture}>
                photo
              </div>
            </div>
            <div ref={card2Ref} className={`${styles.customCard} ${styles.card2}`}>
              <div className={styles.sectionFourTitleContainer}>
                <div className={styles.sectionFourActivityTitle}>
                  Actividades
                </div>
                <div className={styles.sectionFourActivitySubTitle}>
                  Titulo de la actividad
                </div>

              </div>
              <div className={styles.sectionFourActivityInformationContainer}>
                <div className={styles.sectionFourActivityInformation}>
                  Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam,
                  quis nostrud exercitation
                  ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur
                </div>
                <div className={styles.sectionFourActivityButton}>
                  <div>
                    Ver mas
                  </div>
                  <div className={styles.sectionFourActivityArrow}>
                    <RightArrow styles={arrowStyles} />
                  </div>

                </div>
              </div>
              <div className={styles.sectionFourActivityInformationPicture}>
                photo
              </div>
            </div>
            <div ref={card3Ref} className={`${styles.customCard} ${styles.card3}`}>
              <div className={styles.sectionFourTitleContainer}>
                <div className={styles.sectionFourActivityTitle}>
                  Actividades
                </div>
                <div className={styles.sectionFourActivitySubTitle}>
                  Titulo de la actividad
                </div>

              </div>
              <div className={styles.sectionFourActivityInformationContainer}>
                <div className={styles.sectionFourActivityInformation}>
                  Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam,
                  quis nostrud exercitation
                  ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur
                </div>
                <div className={styles.sectionFourActivityButton}>
                  <div>
                    Ver mas
                  </div>
                  <div className={styles.sectionFourActivityArrow}>
                    <RightArrow styles={arrowStyles} />
                  </div>

                </div>
              </div>
              <div className={styles.sectionFourActivityInformationPicture}>
                photo
              </div>
            </div>
            <div ref={card4Ref} className={`${styles.customCard} ${styles.card4}`}>
              <div className={styles.sectionFourTitleContainer}>
                <div className={styles.sectionFourActivityTitle}>
                  Actividades
                </div>
                <div className={styles.sectionFourActivitySubTitle}>
                  Titulo de la actividad
                </div>
              </div>
              <div className={styles.sectionFourActivityInformationContainer}>
                <div className={styles.sectionFourActivityInformation}>
                  Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit,
                  sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam,
                  quis nostrud exercitation
                  ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                  Duis aute irure dolor in reprehenderit in voluptate
                  velit esse cillum dolore eu fugiat nulla pariatur
                </div>
                <div className={styles.sectionFourActivityButton}>
                  <div>
                    Ver mas
                  </div>
                  <div className={styles.sectionFourActivityArrow}>
                    <RightArrow styles={arrowStyles} />
                  </div>

                </div>
              </div>
              <div className={styles.sectionFourActivityInformationPicture}>
                photo
              </div>
            </div>
          </div>
        </div> */}
        <div className={styles.separator}></div>
        <div className={styles.sectionFiveContainer}>
          <SectionFive />
        </div>
        <div className={styles.separator}></div>
        <div className={styles.sectionSixContainer}>
          <SectionSix />
        </div>

        {
          openLoginForm &&
          <div className={styles.loginFormContainer}>
            <LoginForm />
          </div>
        }
      </div >) : (
      <Materials />
    )



  )
}
export default Main;