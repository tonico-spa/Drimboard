"use client";
import Link from "next/link";
import styles from "../../styles/MaterialsCourses.module.css";
import useAppStore from '@/store/useAppStore';
import { capitalizeWords } from "@/utils/utils";
import MaterialsSingleCourse from "./MaterialSingleCourse";



const MaterialsCourses = () => {
    const openMaterialCourse = useAppStore((state) => state.openMaterialCourse);
    const courses = useAppStore((state) => state.courses);
    const { setOpenMaterialCourse } = useAppStore((state) => state);
    console.log(courses)

    const openCourse = (e, element) => {
        e.preventDefault()
        setOpenMaterialCourse({ ...element, "open": true })
    }
    return (


        <div className={styles.materialsMainContainer}>
            {!openMaterialCourse["open"] &&
                <>

                    <div className={styles.materiasMainContentContainer}>
                        <div className={styles.materiasMainSectionOne}>
                            <div className={styles.materiasMainSectionOneTitle}>
                                
                                Actividades
                            </div>
                            <div className={styles.materiasMainSectionOneContent}>

                                {courses.length > 0 && courses.map((element) => (
                                    <div
                                        key={element._id} // Use unique ID from Sanity
                                        id="colores.pdf"
                                        className={styles.materiasMainSectionOneMaterial}
                                        onClick={(e) => openCourse(e, element)}
                                    >
                                        <img
                                            src="/pdf.png"
                                            alt="Duolab Logo"
                                            className={styles.sectionOnePdf}
                                        />
                                        {element.title}
                                    </div>
                                ))}

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
                </>
            }


            {openMaterialCourse["open"] &&
                <div >
                    <MaterialsSingleCourse />

                </div>
            }

        </div>
    )
}

export default MaterialsCourses