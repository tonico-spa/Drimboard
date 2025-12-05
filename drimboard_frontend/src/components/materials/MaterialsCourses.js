"use client";
import Link from "next/link";
import styles from "../../styles/MaterialsCourses.module.css";
import useAppStore from '@/store/useAppStore';
import { capitalizeWords } from "@/utils/utils";
import MaterialsSingleCourse from "./MaterialSingleCourse";



const MaterialsCourses = () => {
    const openMaterialCourse = useAppStore((state) => state.openMaterialCourse);
    const actividades = useAppStore((state) => state.actividades);
    const videos = useAppStore((state) => state.videos);
    const documents = useAppStore((state) => state.documents);
    const { setOpenMaterialCourse } = useAppStore((state) => state);

    const openCourse = (e, element, contentType) => {
        e.preventDefault()
        setOpenMaterialCourse({ ...element, "open": true, "contentType": contentType })
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

                                {actividades.length > 0 && actividades.map((element) => (
                                    <div
                                        key={element._id}
                                        className={styles.materiasMainSectionOneMaterial}
                                        onClick={(e) => openCourse(e, element, 'actividades')}
                                        style={{
                                            backgroundImage: `url(${element.coverImage || '/pdf.png'})`
                                        }}
                                    >
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
                                {documents.length > 0 && documents.map((element) => (
                                    <div
                                        key={element._id}
                                        className={styles.materiasMainSectionTwoMaterial}
                                        onClick={(e) => openCourse(e, element, 'documents')}
                                        style={{
                                            backgroundImage: `url(${element.coverImage || '/pdf.png'})`
                                        }}
                                    >
                                        {element.title}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                    <div className={styles.materiasMainContentContainer}>
                        <div className={styles.materiasMainSectionThree}>
                            <div className={styles.materiasMainSectionThreeTitle}>
                                Videos
                            </div>
                            <div className={styles.materiasMainSectionThreeContent}>
                                {videos.length > 0 && videos.map((element) => (
                                    <div
                                        key={element._id}
                                        className={styles.materiasMainSectionThreeMaterial}
                                        onClick={(e) => openCourse(e, element, 'videos')}
                                        style={{
                                            backgroundImage: `url(${element.coverImage || '/pdf.png'})`
                                        }}
                                    >
                                        {element.title}
                                    </div>
                                ))}
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