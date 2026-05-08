"use client";
import { useEffect, useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import styles from "../styles/Navbar.module.css";
import useAppStore from '@/store/useAppStore';
import NavLogo from './svgs/NavLogo';

const Navbar = () => {

    const setOpenLoginForm = useAppStore((s) => s.setOpenLoginForm);
    const logged = useAppStore((s) => s.logged);
    const setLogged = useAppStore((s) => s.setLogged);
    const [openUser, setOpenUser] = useState(false)
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);


    const navLogoStyles = `
    .cls-8 {
        fill: #1f150b;
      }`;

    const openLoginForm = (e) => {
        e.preventDefault()
        setOpenLoginForm(true)
    }

    const logout = () => {
        setLogged({ user_email: null, kit_code: null, user_name: null })
        setOpenUser(false)
        if (pathname !== '/') router.push('/')
    }

    // Section anchors only exist on `/`. From any other route, navigate home with the hash
    // and let the browser scroll. From `/`, do a smooth scroll with a top offset.
    const goToSection = (sectionId) => {
        if (pathname !== '/') {
            router.push(`/#${sectionId}`)
            return
        }
        const element = document.getElementById(sectionId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - (window.innerHeight * 0.2);

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }


    return (

        <nav className={`${styles.navContainer} ${scrolled ? styles.scrolled : ''}`} aria-label="Principal">
            <div className={styles.navbarContainer}>
                <div className={styles.logoContainer}>
                    <Link href="/" onClick={() => setOpenUser(false)} className={styles.navbarLogoLink} aria-label="Inicio">
                        <NavLogo styles={navLogoStyles} />
                    </Link>
                </div>
                <div className={styles.linksContainer}>
                    <button type="button" onClick={() => goToSection('sectionTwoContainer')} className={styles.navbarLink}>
                        Por que drim
                    </button>
                    <button type="button" onClick={() => goToSection('sectionFiveContainer')} className={styles.navbarLink}>
                        Usa tu drim
                    </button>
                    <button type="button" onClick={() => goToSection('sectionSixContainer')} className={styles.navbarLink}>
                        Quiero mi taller
                    </button>
                    <button type="button" onClick={() => goToSection('sectionActividades')} className={styles.navbarLink}>
                        Nuestras Actividades
                    </button>
                    <Link href="/programacion" className={`${styles.navbarLink} ${styles.keepMobile}`}>
                        Prueba tu drim
                    </Link>



                    {
                        logged["user_email"] &&
                        <div className={styles.userMenuContainer}>
                            <button
                                type="button"
                                className={styles.logoUserButton}
                                onClick={() => setOpenUser(!openUser)}
                                aria-haspopup="menu"
                                aria-expanded={openUser}
                                aria-label="Menú de usuario"
                            >
                                <img
                                    src="/user.png"
                                    alt=""
                                    className={styles.logoUser}
                                />
                            </button>
                            {openUser &&
                                <div className={styles.navbarOpenUser} role="menu">
                                    <Link href="/materiales" onClick={() => setOpenUser(false)} className={styles.openUserLink} role="menuitem">
                                        Ver material
                                    </Link>
                                    <button type="button" onClick={logout} className={styles.openUserLink} role="menuitem">
                                        Logout
                                    </button>
                                </div>
                            }
                        </div>
                    }

                    {
                        !logged["user_email"] &&
                        <button className={styles.navbarLoginLink} onClick={openLoginForm}>
                            Login
                        </button>
                    }

                </div>
            </div>

        </nav>
    )
}

export default Navbar