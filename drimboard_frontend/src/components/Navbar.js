"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {


    return (

        <nav className={styles.navContainer}>
            <div className={styles.navbarContainer}>
                <div className={styles.logoContainer}>
                    <img
                        src="/black_logo.png"
                        alt="Duolab Logo"
                        className={styles.logoImg}
                    />
                </div>
                <div className={styles.linksContainer}>
                    <Link href="/" className={styles.navbarLink}>
                    Por que drim
                    </Link>
                    <Link href="/" className={styles.navbarLink}>
                    Actividades
                    </Link>
                    <Link href="/" className={styles.navbarLink}>
                    Quiero mi drim
                    </Link>
                    <Link href="/" className={styles.navbarLink}>
                    Login
                    </Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar