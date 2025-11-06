"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Footer.module.css";
import { useAuth } from '../context/AuthContext';

const Footer = () => {




    return (

        <div className={styles.footerContainer}>
            <div className={styles.footerLogin}>
                <img
                    src="/cover_logo.png"
                    alt="Duolab Logo"
                    className={styles.footerLogo}
                />
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
                        hola@drim.com
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer