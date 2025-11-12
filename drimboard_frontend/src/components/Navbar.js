"use client";
import Link from "next/link";
import styles from "../styles/Navbar.module.css";
import useAppStore from '@/store/useAppStore';

const Navbar = () => {

    const { setOpenLoginForm } = useAppStore((state) => state);
    const logged = useAppStore((state) => state.logged);




    const openLoginForm = (e) => {
        e.preventDefault()
        setOpenLoginForm(true)
    }



    return (

        <nav className={styles.navContainer}>
            <div className={styles.navbarContainer}>
                <div className={styles.logoContainer}>
                    <Link href="/" className={styles.navbarLink}>
                        <img
                            src="/black_logo.png"
                            alt="Duolab Logo"
                            className={styles.logoImg}
                        />
                    </Link>
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
                        <Link href="/materials" className={styles.navbarLink}>
                            Ver material
                        </Link>
                    }
                    <button className={styles.navbarLoginLink} onClick={(e) => openLoginForm(e)}>
                        Login
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar