"use client";
import styles from "../styles/Footer.module.css";
import MainLogo from './svgs/MainLogo';
const Footer = () => {



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

    return (

        <div className={styles.footerContainer}>
            <div className={styles.footerLogin}>
                <div className={styles.coverLogo}>
            <MainLogo styles={mainLogoStyles} />
          </div>
            </div>
            <div className={styles.footerContent}>
                <div className={styles.footerTitle}>
                    Contacto
                </div>
                <div className={styles.footerContactInfo}>
                    <img
                        src="/email.png"
                        alt="Duolab Logo"
                        className={styles.footerEmailLogo}
                    />
                    <div className={styles.footerEmail}>
                        hola@duolab.com
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer