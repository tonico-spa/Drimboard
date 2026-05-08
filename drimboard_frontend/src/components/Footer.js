"use client";
import Link from 'next/link';
import MainLogo from './svgs/MainLogo';

const Footer = () => {
  const footerLogoStyles = `
    .cls-1 { fill: #000000; }
    .cls-2 { fill: none; }
    .cls-3 { fill: #ded900; }
    .cls-4 { fill: #000000; }
    .cls-5 { fill: #000000; }
  `;

  const year = new Date().getFullYear();

  return (
    <footer className="dfoot">
      <div className="dfoot-grid">
        <div>
          <div style={{ width: 'min(360px, 90%)' }}>
            <MainLogo styles={footerLogoStyles} />
          </div>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#ffffff', maxWidth: '36ch', marginTop: 12, lineHeight: 1.5 }}>
            Crea sin límites. Tu mundo, tus reglas. Hecho con cariño en Chile por Duolab.
          </p>
        </div>
        <div className="dfoot-col">
          <h5>Producto</h5>
          <a href="#sectionTwoContainer">Por qué drim</a>
          <a href="#sectionFiveContainer">Usa tu drim</a>
          <Link href="/programacion">Probar drim</Link>
          <Link href="/materiales">Materiales</Link>
        </div>
        <div className="dfoot-col">
          <h5>Contacto</h5>
          <a href="mailto:hola@duolab.com">hola@duolab.com</a>
          <a href="#sectionSixContainer">Quiero mi taller</a>
        </div>
      </div>
      <div className="dfoot-bottom">
        <span>© {year} Duolab · drim™</span>
        <span>Santiago · Chile</span>
      </div>
    </footer>
  );
};

export default Footer;
