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
import { Suspense } from 'react';
import useAppStore from '@/store/useAppStore';
import LoginForm from './LoginForm';
import StepViewer from './SetpViewer';
import VideoEmbed from "./VideoEmbed";
import Materials from './materials/Materials';
import MainLogo from './svgs/MainLogo';
import ActivitiesCarousel from './ActivitiesCarousel';


gsap.registerPlugin(ScrollTrigger);


const Main = () => {
  const mainContainerRef = useRef(null);
  const sectionThreeTriggerRef = useRef(null);
  const scrollContentRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const mainScrollContainerRef = useRef(null);
  const sectionTwoTitleRef = useRef(null);
  const sectionFiveBackgroundRef = useRef(null);
  const sectionFiveContainerRef = useRef(null);
  const sectionSixContainerRef = useRef(null);
  const containerRef = useRef(null);
  const activitiesTitleRef = useRef(null);


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
  const [userDict, setUserDict] = useState({ "name": "", "email": "", "message": "" })



  useEffect(() => {
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

  const mainLogoStyles = `
      .cls-1 {
          fill: #1f150b;
        }

      .cls-2 {
        fill: none;
      }

      .cls-3 {
        fill: #ded900;
      }

      .cls-4 {
        fill: #1f150b;
      }

      .cls-5 {
        fill: #1f150b;
      }
    `
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

  // Effect for Section Four Video Container (Scale animation)
  useEffect(() => {
    if (openMaterials === true) return;

    const ctx = gsap.context(() => {
      const background = document.querySelector(`.${styles.sectionFourBackground}`);
      const container = document.querySelector(`.${styles.sectionFourVideoContainer}`);

      if (background && container) {
        gsap.set(background, {
          scale: 0.93,
        });

        gsap.to(background, {
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        });
      }
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


  const squareSixCircleStyles = `
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


  const sendForm = async (e) => {
    e.preventDefault()
    const response = await axios.post(`${API_URL}/send_form`, userDict)
    if (response.status === 200) {
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

  // Effect for Section Six Info Background (Scale animation)
  useEffect(() => {
    if (openMaterials === true) return;

    const ctx = gsap.context(() => {
      const background = document.querySelector(`.${styles.sectionSixBackground}`);
      const container = document.querySelector(`.${styles.sectionSixContainer}`);

      if (background && container) {
        gsap.set(background, {
          scale: 0.95,
        });

        gsap.to(background, {
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        });
      }
    }, mainContainerRef);

    return () => ctx.revert();
  }, [openMaterials]);


  return (
    !openMaterials ? (
      <div className={styles.mainContainer} ref={mainContainerRef}>

        <div id="coverContainer" className={styles.coverContainer}>
          <img
            src="/auto.png"
            alt="cover image"
            className={styles.coverImg}
          />

          <div className={styles.coverLogo}>
            <MainLogo styles={mainLogoStyles} />
          </div>

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
        <div id="sectionTwoContainer" className={styles.sectionTwoContainer}>

          <div ref={sectionTwoTitleRef} className={styles.sectionTwoTitleContainer}>
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
            <SectionTwoCards triggerRef={sectionTwoTitleRef} />
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
                <StepViewer fileUrl="/models/kit_sim_trans.glb" initialAngle={-Math.PI / 2} />
              </Suspense>

            </div>

          </div>

        </div>
        <div className={styles.separator}></div>

        <div className={styles.separator}></div>
        {/* --- UPDATED JSX FOR SECTION FOUR --- */}
        <Tape />

        <div id="sectionFourContainer" className={styles.sectionFourContainer}>
          <div className={styles.sectionFourVideoContainer}>
            <div className={styles.sectionFourBackground}></div>
            <div className={styles.sectionFourTextContainer}>
              <div className={styles.sectionFourVideo}>
                <VideoEmbed styles={styles} videoUrl={"https://youtu.be/DkfgSmyWFec?si=f0SsxZZgYLswl6SO"} />
              </div>
              <div className={styles.sectionFourTitle}>
                Sofía
              </div>
              <div className={styles.sectionFourSubTitle}>
                9 años - Futura Botánica
              </div>

              <div className={styles.sectionFourText}>
                Siempre me encantaron las plantas, pero se me olvidaba regarlas.
                Con el kit armé un sistema que riega mis plantas solo cuando la tierra está seca.
                ¡No tuve que programar nada complicado! Solo seguí los pasos y conecté el sensor de
                humedad. Ahora mis plantas están más verdes que nunca.
              </div>

            </div>
            <div className={styles.sectionFourTextContainer}>
              <div className={styles.sectionFourVideo}>
                <VideoEmbed styles={styles} videoUrl={"https://youtu.be/DkfgSmyWFec?si=f0SsxZZgYLswl6SO"} />
              </div>
              <div className={styles.sectionFourTitle}>
                Mateo
              </div>
              <div className={styles.sectionFourSubTitle}>
                10 años - Futuro Músico
              </div>

              <div className={styles.sectionFourText}>
                Quiero ser músico como mi papá, pero nunca imaginé que podría crear mis propios instrumentos.
                Con el kit construí una guitarra que hace sonidos cuando tocas los botones.
                Lo mejor es que el kit ya trae todo listo para empezar, no necesitas saber programar.

              </div>

            </div>
            <div className={styles.sectionFourTextContainer}>
              <div className={styles.sectionFourVideo}>
                <VideoEmbed styles={styles} videoUrl={"https://youtu.be/DkfgSmyWFec?si=f0SsxZZgYLswl6SO"} />
              </div>
              <div className={styles.sectionFourTitle}>
                Valentina
              </div>
              <div className={styles.sectionFourSubTitle}>
                11 años - Futura Geóloga
              </div>

              <div className={styles.sectionFourText}>
                Los terremotos siempre me dieron curiosidad. ¿Cómo los detectan?
                Con el kit pude construir mi propio detector de movimientos sísmicos para mi proyecto de ciencias.
                Pensé que sería súper difícil, pero las instrucciones son tan claras que lo armé en una
                tarde.
              </div>
            </div>
          </div>
        </div>
        <Tape />

        

       
        <div className={styles.separator}></div>
        <div id="sectionFiveContainer" className={styles.sectionFiveContainer} ref={sectionFiveContainerRef}>
          <SectionFive triggerRef={sectionFiveContainerRef} />
        </div>
        <div className={styles.sectionBigSixContainer}>
          <div id="sectionSixContainer" className={styles.sectionSixContainer} >
            <div className={styles.sectionSixContainerTitle}>
              <div className={styles.sectionTwoTitleLogo}>
                <SquareCircle styles={squareSixCircleStyles} />
              </div>
              Quiero <br></br> mi taller
            </div>
            <div className={styles.sectionSixContainerInfo}>
              <div className={styles.sectionSixInfoBackground}></div>
              <div className={`${styles.sectionSixContainerInfoCard}`}>
                <div className={styles.sectionSixBackground}></div>
                <div className={styles.sectionSixTitle}>
                  Quieres que vayamos a hacerte un taller? <br />

                  <span className={styles.highlightText}>Contáctanos</span>

                </div>
                <form className={styles.form} >
                  <div className={styles.contactFirstWrap}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Nombre</label>
                      <input value={userDict.name} onChange={(e) => handleChange(e)} type="text" id="name" name="name" required className={styles.inputStyle} />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>
                      <input value={userDict.email} onChange={(e) => handleChange(e)} type="email" id="email" name="email" required className={styles.inputStyle} />
                    </div>
                  </div>


                  <div className={styles.formGroup}>
                    <label htmlFor="message">Escribenos un mensaje</label>
                    <textarea value={userDict.message} onChange={(e) => handleChange(e)} id="message" name="message" rows="4" required className={styles.inputStyle} ></textarea>
                  </div>


                  <button type="submit" className={styles.submitBtn} onClick={(e) => sendForm(e)}>Enviar</button>


                </form>


              </div>
            </div>

          </div>
        </div>
        <div className={styles.sectionActivities} id="sectionActividades">
          <div className={styles.activitiesHeader}>
            <div ref={activitiesTitleRef} className={styles.sectionTwoTitleContainer}>
              <div className={styles.sectionTwoTitleLogo}>
                <SquareCircle styles={squareCircleStyles} />
              </div>
              <div className={styles.sectionTwoTitleText}>
                Nuestras
                <br />
                Actividades
              </div>

            </div>
            <div className={styles.activitiesSubtitle}>
              Desde capacitación docente y talleres para estudiantes hasta competencias interactivas,
              hemos llevado a cabo diversas actividades diseñadas para despertar la curiosidad y fomentar
              la creatividad. Únete a nosotros en la exploración de robótica, programación y mucho más
              a través de nuestros programas inmersivos.
            </div>
          </div>
          <ActivitiesCarousel />
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