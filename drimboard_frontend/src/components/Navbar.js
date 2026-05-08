"use client";
import { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import useAppStore from '@/store/useAppStore';
import NavLogo from './svgs/NavLogo';

const Navbar = () => {

    const { setOpenLoginForm } = useAppStore((state) => state);
    const logged = useAppStore((state) => state.logged);
    const [openUser, setOpenUser] = useState(false)
    const { setLogged } = useAppStore((state) => state);
    const { setOpenMaterialsPage } = useAppStore((state) => state);


    const navLogoStyles = `
    .cls-8 {
        fill: #1f150b;
      }`;

    const openLoginForm = (e) => {
        e.preventDefault()
        setOpenLoginForm(true)
    }

    const logout = (e) => {
        e.preventDefault()
        setLogged({ user_email: null, kit_code: null, user_name: null })
        setOpenMaterialsPage(false)
        setOpenUser(false)
    }

    const openMaterials = (e) => {
        e.preventDefault()
        setOpenMaterialsPage(true)
        setOpenUser(false)
    }

    const closeMaterials = (e) => {
        e.preventDefault()
        setOpenMaterialsPage(false)
        setOpenUser(false)
    }

    const scrollToSection = (sectionId) => {
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

        <nav className={styles.navContainer}>
            <div className={styles.navbarContainer}>
                <div className={styles.logoContainer}>
                    <div href="/" onClick={(e) => closeMaterials(e)} className={styles.navbarLink}>
                        <NavLogo styles={navLogoStyles} />
                    </div>
                </div>
                <div className={styles.linksContainer}>
                    <div onClick={() => scrollToSection('sectionTwoContainer')} className={styles.navbarLink}>
                        Por que drim
                    </div>
                    <div onClick={() => scrollToSection('sectionFourContainer')} className={styles.navbarLink}>
                        Testimonios
                    </div>
                    <div onClick={() => scrollToSection('sectionFiveContainer')} className={styles.navbarLink}>
                        Usa tu drim
                    </div>
                    <div onClick={() => scrollToSection('sectionSixContainer')} className={styles.navbarLink}>
                        Quiero mi taller
                    </div>
                    <div onClick={() => scrollToSection('sectionActividades')} className={styles.navbarLink}>
                        Nuestras Actividades
                    </div>



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
                                    <div onClick={(e) => openMaterials(e)} className={styles.openUserLink}>
                                        Ver material
                                    </div>
                                    <div onClick={(e) => logout(e)} className={styles.openUserLink}>
                                        Logout
                                    </div>
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