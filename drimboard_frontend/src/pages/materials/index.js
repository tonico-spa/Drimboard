"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/Materials.module.css";
import { useAuth } from '../../context/AuthContext';
import useAppStore from '@/store/useAppStore';
import MaterialsMain from "@/components/materials/MaterialsMain";
import MaterialsCourses from "@/components/materials/MaterialsCourses";



const Materials = () => {
    const [tab, setTab] = useState("inicio");

    // Function to handle tab clicks
    const handleTabClick = (tabValue) => {
        setTab(tabValue);
    };
    return (

        <div className={styles.materialsContainer}>
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



                        <button className={styles.navbarLink}>
                            <img
                                src="/user.png"
                                alt="Duolab Logo"
                                className={styles.logoUser}
                            />
                        </button>
                    </div>
                </div>
            </nav>
            <div className={styles.materialsContent}>


                <div className={styles.tabsContainer}>
                    <div className={styles.tabList}>
                        <button
                            className={`${styles.tabButton} ${tab === 'inicio' ? styles.active : ''}`}
                            onClick={() => handleTabClick('inicio')}
                        >
                            Inicio
                        </button>
                        <button
                            className={`${styles.tabButton} ${tab === 'material' ? styles.active : ''}`}
                            onClick={() => handleTabClick('material')}
                        >
                            Material
                        </button>
                        <button
                            className={`${styles.tabButton} ${tab === 'foro' ? styles.active : ''}`}
                            onClick={() => handleTabClick('foro')}
                        >
                            Foro
                        </button>
                    </div>
                </div>
            </div>
            {tab === "inicio" &&
                <MaterialsMain />
            }
            {tab === "material" && 
                <MaterialsCourses/>
            }

        </div>
    )
}

export default Materials