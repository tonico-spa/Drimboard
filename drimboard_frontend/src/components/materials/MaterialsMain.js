"use client";
import Link from "next/link";
import styles from "../../styles/MaterialsMain.module.css";
import useAppStore from '@/store/useAppStore';
import { capitalizeWords } from "@/utils/utils";

const MaterialsMain = () => {
    const logged = useAppStore((state) => state.logged);



    return (

        <div className={styles.materialsMainContainer}>
            <div className={styles.materiasMainTitleContainer}>
                <div className={styles.materiasMainTitle}>
                    Bienvenid@ {capitalizeWords(logged["user_name"])}

                </div>
                <div className={styles.materiasMainSubtitle}>
                    Encuentra todo el material que necesitas para empezar a usar tu drim
                </div>

            </div>

            <div className={styles.materiasMainContentContainer}>
                <div className={styles.materiasMainSectionOne}>
                    <div className={styles.materiasMainSectionOneTitle}>
                        Material reciente
                    </div>
                    <div className={styles.materiasMainSectionOneContent}>
                        <div className={styles.materiasMainSectionOneMaterial}>
                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.coverLogo}
                            />
                            Documento

                        </div>
                        <div className={styles.materiasMainSectionOneMaterial}>
                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.coverLogo}
                            />
                            Documento
                        </div>
                        <div className={styles.materiasMainSectionOneMaterial}>

                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.coverLogo}
                            />
                            Documento
                        </div>
                    </div>

                </div>
            </div>
            <div className={styles.materiasMainContentContainer}>
                <div className={styles.materiasMainSectionTwo}>
                    <div className={styles.materiasMainSectionTwoTitle}>
                        Cursos recientes
                    </div>
                    <div className={styles.materiasMainSectionTwoContent}>
                        <div className={styles.materiasMainSectionTwoMaterial}>
                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionTwoPdf}
                            />
                            Documento

                        </div>
                        <div className={styles.materiasMainSectionTwoMaterial}>
                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionTwoPdf}
                            />
                            Documento
                        </div>
                        <div className={styles.materiasMainSectionTwoMaterial}>

                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionTwoPdf}
                            />
                            Documento
                        </div>
                        <div className={styles.materiasMainSectionTwoMaterial}>

                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionTwoPdf}
                            />
                            Documento
                        </div>
                    </div>

                </div>
            </div>
             <div className={styles.materiasMainContentContainer}>
                <div className={styles.materiasMainSectionThree}>
                    <div className={styles.materiasMainSectionThreeTitle}>
                        Tus proyectos
                    </div>
                    <div className={styles.materiasMainSectionThreeContent}>
                        <div className={styles.materiasMainSectionThreeMaterial}>
                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionThreePdf}
                            />
                            Documento

                        </div>
                        <div className={styles.materiasMainSectionThreeMaterial}>
                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionThreePdf}
                            />
                            Documento
                        </div>
                        <div className={styles.materiasMainSectionThreeMaterial}>

                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionThreePdf}
                            />
                            Documento
                        </div>
                        <div className={styles.materiasMainSectionThreeMaterial}>

                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionThreePdf}
                            />
                            Documento
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default MaterialsMain