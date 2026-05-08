"use client";
import { Suspense, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from '../styles/Main.module.css';
import RightArrow from './svgs/RightArrows';
import useAppStore from '@/store/useAppStore';
import LoginForm from './LoginForm';
import MainLogo from './svgs/MainLogo';
import Tape from './svgs/tape/Tape';
import { api } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger);

// Three.js + GLTF loader is heavy; lazy-load on the client when this section mounts.
const StepViewer = dynamic(() => import('./SetpViewer'), {
  ssr: false,
  loading: () => <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#000' }}>Cargando modelo 3D…</div>,
});

// Reveal-on-scroll: adds .in to .reveal/.s4-panel elements when they enter viewport.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-up, .s4-panel');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const FEATURES = [
  { color: 'pink',   tag: 'Bloques',  title: 'Código con bloques',     sub: '¡Arrastra, suelta y crea! Programa tu robot sin escribir una sola línea.', icon: 'blocks' },
  { color: 'green',  tag: 'Código',   title: 'Código en texto',        sub: 'El siguiente paso para futuros innovadores. Del bloque a Python real.',     icon: 'code' },
  { color: 'yellow', tag: 'Escalera', title: 'Aprendizaje escalonado', sub: 'Una aventura a tu propio ritmo. Cada actividad sube un peldaño más.',       icon: 'stairs' },
  { color: 'sky',    tag: 'Manos',    title: 'Interviene tu entorno',  sub: 'La magia de lo físico y lo digital, juntas en un solo dispositivo.',         icon: 'hands' },
];

function FeatIcon({ kind }) {
  if (kind === 'blocks') return (
    <div className="ico ico-blocks"><div className="b b1" /><div className="b b2" /><div className="b b3" /><div className="b b4" /></div>
  );
  if (kind === 'code') return (
    <div className="ico ico-code"><div className="line l1" /><div className="line l2" /><div className="line l3" /><div className="line l4" /><div className="caret" /></div>
  );
  if (kind === 'stairs') return (
    <div className="ico ico-stairs"><div className="step" /><div className="step" /><div className="step" /><div className="step" /><div className="ball" /></div>
  );
  if (kind === 'hands') return (
    <div className="ico ico-hands"><div className="pad"><span /><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="finger" /></div>
  );
  return null;
}

const POINTS = [
  { n: '01', t: 'Crea tu primer robot sin saber programar.', d: 'drim elimina la barrera inicial de la programacion tradicional. Mientras que en otros microcontroladores se necesita descargar softwares y aprender sintaxis de programacion, drim ofrece una interfaz visual e intuitiva sin necesidad de saber escribir codigo.' },
  { n: '02', t: 'Tu imaginación es el límite, no los cables.', d: 'Otros microcontroladores exponen al usuario a todos los componentes físicos desde el principio: la placa, los cables, la protoboard y los pines específicos. Al ocultar la placa y centralizar todo en una pantalla, drim reduce la complejidad y evita distracciones.' },
  { n: '03', t: 'De los bloques al código real.', d: '   El sistema de programacion basado en bloques de drim es  el puente perfecto hacia la programacion real. Al permitir ver el codigo creado con bloques se crea una ruta de aprendizaje natural: un niño primero domina la lógica con los bloques y, cuando siente curiosidad, puede espiar el código subyacente, entendiendo cómo una estructura visual se traduce en una sintaxis textual.' },
];

const TESTIS = [
  { name: 'Sofía',    meta: '9 años · Futura botánica',   q: 'Hice un sensor que avisa cuando mis plantas tienen sed. Mi mamá no lo podía creer.', videoUrl: 'https://youtu.be/DkfgSmyWFec' },
  { name: 'Mateo',    meta: '10 años · Futuro músico',    q: 'Construí una guitarra que hace sonidos cuando tocas los botones. No tuve que programar casi nada.', videoUrl: 'https://youtu.be/DkfgSmyWFec' },
  { name: 'Valentina',meta: '11 años · Futura geóloga',   q: 'Pude armar mi propio detector de movimientos sísmicos para mi proyecto de ciencias.', videoUrl: 'https://youtu.be/DkfgSmyWFec' },
];

const STEPS = [
  { t: 'Paso 1',    d: 'Solo la drim es lo que necesitas para empezar. Conectala a tu computador y comienza a programar.', img: '/paso1.png' },
  { t: 'Paso 2',  d: 'Conecta actuadores y sensores externos y ve como tu drim cobra vida con nuevas funcionalidades.',          img: '/paso2.png' },
  { t: 'Paso 3',       d: 'Abre tu drim y trabaja directamente con el microcontroladorpara proyectos mas audaces..', img: '/paso3.png' },
];

const CAROUSEL_IMAGES = [
  '/activities/IMG_0122.jpg',
  '/activities/IMG_1445.jpg',
  '/activities/IMG_3032.jpg',
  '/activities/IMG_3072.jpg',
  '/activities/IMG_3339.jpg',
  '/activities/IMG_3345.jpg',
  '/activities/IMG_3608.jpg',
  '/activities/IMG_4173.jpg',
  '/activities/IMG_4178.jpg',
  '/activities/IMG_4179.jpg',
  '/activities/IMG_4180.jpg',
  '/activities/IMG_4181.jpg',
  '/activities/IMG_4388.jpg',
];

function youtubeId(url) {
  const m = (url || '').match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return (m && m[2].length === 11) ? m[2] : null;
}

const Main = () => {
  const openLoginForm = useAppStore((state) => state.openLoginForm);
  const carouselRef = useRef(null);
  const s3Ref = useRef(null);
  const pointsViewportRef = useRef(null);
  const pointsContentRef = useRef(null);

  const [userDict, setUserDict] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ kind: 'idle', message: '' });

  useReveal();

  // Section 3: pin the section while the left points column scrolls through
  // its content. The model on the right stays in place; window.scrollY keeps
  // advancing during the pin so the model's scroll-rotation still works.
  useEffect(() => {
    const section = s3Ref.current;
    const viewport = pointsViewportRef.current;
    const content = pointsContentRef.current;
    if (!section || !viewport || !content) return;

    const compute = () => Math.max(0, content.scrollHeight - viewport.clientHeight);

    const ctx = gsap.context(() => {
      gsap.to(content, {
        y: () => -compute(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${compute()}`,
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, s3Ref);

    // Refresh after the browser settles (fonts, images, reveal animations).
    const r1 = setTimeout(() => ScrollTrigger.refresh(), 200);
    const r2 = setTimeout(() => ScrollTrigger.refresh(), 800);
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(viewport);
    ro.observe(content);

    return () => {
      clearTimeout(r1); clearTimeout(r2);
      ro.disconnect();
      ctx.revert();
    };
  }, []);

  // Carousel: auto-scroll with hover-pause + manual scroll buttons
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let paused = false;
    let raf;
    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    const tick = () => {
      if (!paused && el) {
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += 0.3;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const sendForm = async (e) => {
    e.preventDefault();
    setFormStatus({ kind: 'sending', message: 'Enviando...' });
    try {
      await api.post('/send_form', userDict);
      setUserDict({ name: '', email: '', message: '' });
      setFormStatus({ kind: 'success', message: '¡Recibido! Te escribimos en menos de 24h.' });
    } catch (err) {
      setFormStatus({ kind: 'error', message: 'No pudimos enviar el mensaje. Inténtalo más tarde.' });
    }
  };

  const handleChange = (e) => {
    setUserDict({ ...userDict, [e.target.name]: e.target.value });
  };

  const arrowStyles = `
    .first_triangle { fill: #f397c1; }
    .second_triangle { fill: #f397c1; }
  `;

  const mainLogoStyles = `
    .cls-1 { fill: #000000; }
    .cls-2 { fill: none; }
    .cls-3 { fill: #ded900; }
    .cls-4 { fill: #000000; }
    .cls-5 { fill: #000000; }
  `;

  return (
    <div className={styles.mainContainer}>

      {/* ===== Cover (unchanged) ===== */}
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
            Prepárate para el futuro
          </div>
        </div>
      </div>
     {/* ===== Tape divider ===== */}
      <Tape />
      {/* ===== Section 2 — Por qué drim ===== */}
      <section className="dsec s2" id="sectionTwoContainer">
        <div className="reveal">
          <div className="dsec-eyebrow">
            <span className="glyph">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <rect x="1" y="1" width="7" height="7" rx="1.5" fill="#53C68E" />
                <circle cx="13.5" cy="13.5" r="3.5" fill="#F397C1" />
              </svg>
            </span>
            Tu mundo, tus reglas
          </div>
          <h2 className="dsec-title">Crea sin <em>límites.</em></h2>
          <p className="dsec-sub">Cuatro maneras de jugar con drim. Desde arrastrar bloques hasta intervenir el mundo real.</p>
        </div>
        <div className="s2-grid">
          {FEATURES.map((f, i) => (
            <article key={f.tag} className="feat reveal" data-color={f.color} style={{ transitionDelay: `${i * 90}ms` }}>
              <span className="feat-tag">{f.tag}</span>
              <div className="feat-icon"><FeatIcon kind={f.icon} /></div>
              <h3>{f.title}</h3>
              <p>{f.sub}</p>
            </article>
          ))}
        </div>
      </section>
           {/* ===== Tape divider ===== */}
      <Tape />

      {/* ===== Section 3 — Comparison ===== */}
      <section className="dsec s3" ref={s3Ref}>
        <div className="reveal">
          <div className="dsec-eyebrow">
            <span className="glyph">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <circle cx="6" cy="9" r="4" fill="#F397C1" />
                <circle cx="12" cy="9" r="4" fill="#53C68E" opacity=".75" />
              </svg>
            </span>
            drim v/s otros microcontroladores
          </div>
        </div>
        <div className="s3-grid">
          <div className="points-viewport" ref={pointsViewportRef}>
            <div className="points" ref={pointsContentRef}>
              {POINTS.map((p, i) => (
                <div className="point reveal" key={p.n} style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="num">{p.n} </span>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="kit-stage reveal">
            <Suspense fallback={<div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#000' }}>Cargando modelo 3D…</div>}>
              <StepViewer fileUrl="/models/kit_sim_trans.glb" initialAngle={-Math.PI / 2} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ===== Tape divider ===== */}
      <Tape />

      {/* ===== Section 4 — Testimonios ===== */}
      {/* <section className="dsec s4">
        <div className="s4-panel">
          <div className="s4-head">
            <div className="reveal">
              <div className="dsec-eyebrow">
                <span className="glyph">
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <path d="M2 4h6v6H4l-2 3V4z M10 4h6v6h-4l-2 3V4z" fill="#1f150b" />
                  </svg>
                </span>
                Testimonios
              </div>
              <h2 className="dsec-title">Niños que <em>ya construyen</em> el futuro.</h2>
            </div>
          </div>
          <div className="s4-grid">
            {TESTIS.map((t, i) => {
              const id = youtubeId(t.videoUrl);
              return (
                <article key={t.name} className="testi reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="testi-video">
                    {id ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${id}`}
                        title={`Testimonio de ${t.name}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="play">▶</div>
                    )}
                  </div>
                  <div className="testi-body">
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-meta">{t.meta}</div>
                    <p className="testi-quote">{t.q}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>*/}

 

      {/* ===== Section 5 — Steps ===== */}
      <section className="dsec s5" id="sectionFiveContainer">
        <div className="reveal">
          <div className="dsec-eyebrow">Usa tu drim</div>
          <h3>Lo que puedes soñar, lo puedes crear. Te mostramos cómo darle vida a tu drim en tres simples pasos.</h3>
        </div>
        <div className="s5-grid">
          
          <h3 className="s5-words reveal">
            <span className="word">Juega<span className="dot">.</span></span>
            <span className="word">Aprende<span className="dot">.</span></span>
            <span className="word">Repite<span className="dot">.</span></span>
          </h3>
          <div className="steps">
            {STEPS.map((s, i) => (
              <div className="step-card reveal" key={s.t} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-text"><h4>{s.t}</h4><p>{s.d}</p></div>
                <div className="step-pic" style={{ backgroundImage: `url(${s.img})` }} aria-hidden="true" />
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ===== Section 6 — Form ===== */}
      <section className="dsec s6" id="sectionSixContainer">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="dsec-eyebrow" style={{ justifyContent: 'center' }}>Quiero mi taller</div>
          <h2 className="dsec-title">¿Lo traemos a tu <em>colegio</em> o casa?</h2>
          <p className="dsec-sub" style={{ marginInline: 'auto' }}>
            Talleres presenciales, kits para grupos y planes de implementación escolar.
          </p>
        </div>
        <form className="s6-card reveal" onSubmit={sendForm}>
          <div className="s6-row">
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <input id="name" name="name" type="text" placeholder="Tu nombre" required value={userDict.name} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="hola@ejemplo.com" required value={userDict.email} onChange={handleChange} />
            </div>
          </div>
          <div className="s6-row" style={{ marginTop: 16 }}>
            <div className="field full">
              <label htmlFor="message">Cuéntanos</label>
              <textarea id="message" name="message" placeholder="¿Para qué edad? ¿Cuántos niños? ¿Cuándo lo necesitas?" value={userDict.message} onChange={handleChange} />
            </div>
          </div>
          <div className="s6-foot">
            <span className={`s6-status ${formStatus.kind === 'error' ? 'error' : ''} ${formStatus.kind === 'success' ? 'success' : ''}`} aria-live="polite">
              {formStatus.message}
            </span>
            <button type="submit" className="dbtn" disabled={formStatus.kind === 'sending'}>
              {formStatus.kind === 'sending' ? 'Enviando…' : 'Quiero mi taller'} <span className="arr">→</span>
            </button>
          </div>
        </form>
      </section>

      {/* ===== Section 7 — Activities carousel ===== */}
      <section className="dsec s7" id="sectionActividades">
        <div className="carousel-head">
          <div className="reveal">
            <div className="dsec-eyebrow">Nuestras actividades</div>
            <p className="dsec-sub" >Desde capacitación docente y talleres para estudiantes hasta competencias interactivas,
              hemos llevado a cabo diversas actividades diseñadas para despertar la curiosidad y fomentar
              la creatividad. Únete a nosotros en la exploración de robótica, programación y mucho más
              a través de nuestros programas inmersivos. </p>
          </div>
        </div>
        <div className="carousel" ref={carouselRef}>
          {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((src, i) => (
            <div
              className="carousel-card"
              key={i}
              style={{ backgroundImage: `url(${src})` }}
              role="img"
              aria-label={`Actividad drim ${(i % CAROUSEL_IMAGES.length) + 1}`}
            >
              <div className="label">
                <span>{String((i % CAROUSEL_IMAGES.length) + 1).padStart(2, '0')} · Taller</span>
                <span className="pill">2025</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {openLoginForm &&
        <div className={styles.loginFormContainer}>
          <LoginForm />
        </div>
      }
    </div>
  );
};

export default Main;
