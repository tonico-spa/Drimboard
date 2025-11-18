"use client";
import { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import useAppStore from '@/store/useAppStore';

const Navbar = () => {

    const { setOpenLoginForm } = useAppStore((state) => state);
    const logged = useAppStore((state) => state.logged);
    const [openUser, setOpenUser] = useState(false)
    const { setLogged } = useAppStore((state) => state);
    const { setOpenMaterialsPage } = useAppStore((state) => state);



    const openLoginForm = (e) => {
        e.preventDefault()
        setOpenLoginForm(true)
    }

    const logout = () => {
        setLogged({ user_email: null, kit_code: null, user_name: null })
        setOpenMaterialsPage(false)
        setOpenUser(false)
    }

    const openMaterials = () => {
        setOpenMaterialsPage(true)
        setOpenUser(false)
    }

    const closeMaterials = () => {
        setOpenMaterialsPage(false)
        setOpenUser(false)
    }


    return (

        <nav className={styles.navContainer}>
            <div className={styles.navbarContainer}>
                <div className={styles.logoContainer}>
                    <div href="/" onClick={closeMaterials} className={styles.navbarLink}>
                        <img
                            src="/black_logo.png"
                            alt="Duolab Logo"
                            className={styles.logoImg}
                        />
                    </div>
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
                                    <div onClick={openMaterials} className={styles.openUserLink}>
                                        Ver material
                                    </div>
                                    <div onClick={logout} className={styles.openUserLink}>
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