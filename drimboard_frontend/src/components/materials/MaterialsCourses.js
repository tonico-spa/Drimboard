"use client";
import Link from "next/link";
import styles from "../../styles/MaterialsCourses.module.css";
import useAppStore from '@/store/useAppStore';
import { capitalizeWords } from "@/utils/utils";
import MaterialsSingleCourse from "./MaterialSingleCourse";



const MaterialsCourses = () => {
    const openMaterialCourse = useAppStore((state) => state.openMaterialCourse);
    const { setOpenMaterialCourse } = useAppStore((state) => state);

    const openCourse = (e) => {
        e.preventDefault()
        setOpenMaterialCourse({"course_name": e.target.id,
            open: true,
            pdf_url: null,
            video_url: null
        })
    }
    return (


        <div className={styles.materialsMainContainer}>
            <div className={styles.materiasMainContentContainer}>
                <div className={styles.materiasMainSectionOne}>
                    <div className={styles.materiasMainSectionOneTitle}>
                        Cursos
                    </div>
                    <div className={styles.materiasMainSectionOneContent}>
                        <div id="colores.pdf" className={styles.materiasMainSectionOneMaterial} onClick={(e) => openCourse(e)}>
                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionOnePdf}
                            />
                            Documento

                        </div>
                        <div className={styles.materiasMainSectionOneMaterial}>
                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionOnePdf}
                            />
                            Documento
                        </div>
                        <div className={styles.materiasMainSectionOneMaterial}>

                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionOnePdf}
                            />
                            Documento
                        </div>
                        <div className={styles.materiasMainSectionOneMaterial}>

                            <img
                                src="/pdf.png"
                                alt="Duolab Logo"
                                className={styles.sectionOnePdf}
                            />
                            Documento
                        </div>
                    </div>

                </div>
            </div>
            <div className={styles.materiasMainContentContainer}>
                <div className={styles.materiasMainSectionTwo}>
                    <div className={styles.materiasMainSectionTwoTitle}>
                        Documentos
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
                        Videos
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

            {openMaterialCourse["open"] && 
            <div className={styles.materialsSingleCourseContainer}>
                <MaterialsSingleCourse />

            </div>
            }

        </div>
    )
}

export default MaterialsCourses