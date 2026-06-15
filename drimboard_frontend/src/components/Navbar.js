"use client";
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from "../styles/Navbar.module.css";
import useAppStore from '@/store/useAppStore';
import NavLogo from './svgs/NavLogo';

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();

    const { setOpenLoginForm } = useAppStore((state) => state);
    const logged = useAppStore((state) => state.logged);
    const [openUser, setOpenUser] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false);
    const { setLogged } = useAppStore((state) => state);


    const navLogoStyles = `
    .cls-8 {
        fill: #1f150b;
      }`;

    const openLoginForm = (e) => {
        e.preventDefault()
        setOpenLoginForm(true)
        setMenuOpen(false)
    }

    const logout = (e) => {
        e.preventDefault()
        setLogged({ user_email: null, kit_code: null, user_name: null })
        setOpenUser(false)
        setMenuOpen(false)
    }

    const closeNavOverlays = () => {
        setOpenUser(false)
        setMenuOpen(false)
    }

    const scrollToSection = (sectionId) => {
        setMenuOpen(false)
        if (pathname !== '/') {
            router.push(`/#${sectionId}`)
            return
        }
        const element = document.getElementById(sectionId);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - (window.innerHeight * 0.2);
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    }


    return (

        <nav className={styles.navContainer}>
            <div className={styles.navbarContainer}>
                <div className={styles.logoContainer}>
                    <Link href="/" onClick={closeNavOverlays} className={styles.navbarLink}>
                        <NavLogo styles={navLogoStyles} />
                    </Link>
                </div>

                <button
                    type="button"
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                >
                    <span className={menuOpen ? styles.barTop : ''}></span>
                    <span className={menuOpen ? styles.barMid : ''}></span>
                    <span className={menuOpen ? styles.barBot : ''}></span>
                </button>

                <div className={`${styles.linksContainer} ${menuOpen ? styles.menuOpen : ''}`}>
                    <button type="button" onClick={() => scrollToSection('sectionTwoContainer')} className={styles.navbarLink}>
                        Por que drim
                    </button>

                    <button type="button" onClick={() => scrollToSection('sectionSixContainer')} className={styles.navbarLink}>
                        Quiero mi taller
                    </button>
                    <button type="button" onClick={() => scrollToSection('sectionActividades')} className={styles.navbarLink}>
                        Nuestras Actividades
                    </button>
                    <Link
                        href="/playground"
                        onClick={() => setMenuOpen(false)}
                        className={styles.navbarLink}
                    >
                        Prueba tu drim
                    </Link>



                    {
                        logged["user_email"] &&
                        <div className={styles.userMenuContainer}>
                            <img
                                src="/user.png"
                                alt="User"
                                className={styles.logoUser}
                                onClick={() => setOpenUser(!openUser)}
                            />
                            {openUser &&
                                <div className={styles.navbarOpenUser}>
                                    <Link
                                        href="/materials/inicio"
                                        onClick={closeNavOverlays}
                                        className={styles.openUserLink}
                                    >
                                        Ver material
                                    </Link>
                                    <button type="button" onClick={(e) => logout(e)} className={styles.openUserLink}>
                                        Logout
                                    </button>
                                </div>
                            }
                        </div>
                    }

                    {
                        !logged["user_email"] &&
                        <button className={styles.navbarLoginLink} onClick={(e) => openLoginForm(e)}>
                            Login
                        </button>
                    }

                </div>
            </div>

        </nav>
    )
}

export default Navbar