"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Navbar.module.css";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, loading, login } = useAuth();

        const handleSubmit = async () => {
        const result = await login({ email: "ignaciabaeza.i@gmail.com", kit_code: "p0s31d0n" });

        if (result.success) {
            console.log(user)
        } else {
            setError(result.message);
        }
    };

 useEffect(() => {
    handleSubmit()
 }, [])


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