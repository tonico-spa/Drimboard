
"use client";
import Link from "next/link";
import { useMemo } from "react";
import styles from "../../styles/MaterialsMain.module.css";
import useAppStore from '@/store/useAppStore';
import { capitalizeWords } from "@/utils/utils";

const MaterialsMain = () => {
    const logged = useAppStore((state) => state.logged);
    const actividades = useAppStore((state) => state.actividades);
    const videos = useAppStore((state) => state.videos);
    const documents = useAppStore((state) => state.documents);
    const { setOpenMaterialCourse } = useAppStore((state) => state);

    // Get the latest 3 posts from all categories combined
    const recentMaterials = useMemo(() => {
        const allMaterials = [
            ...actividades.map(item => ({ ...item, contentType: 'actividades', color: '#F397C1' })),
            ...videos.map(item => ({ ...item, contentType: 'videos', color: '#53C68E' })),
            ...documents.map(item => ({ ...item, contentType: 'documents', color: '#FFB71A' }))
        ];

        // Sort by publishedAt date (newest first) and take the first 3
        return allMaterials
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 3);
    }, [actividades, videos, documents]);

    // Get the latest 5 actividades
    const recentActividades = useMemo(() => {
        return actividades
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 5);
    }, [actividades]);

    const openCourse = (e, element, contentType) => {
        e.preventDefault();
        setOpenMaterialCourse({ ...element, "open": true, "contentType": contentType });
    }

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
                        {recentMaterials.length > 0 ? (
                            recentMaterials.map((element) => (
                                <div
                                    key={element._id}
                                    className={styles.materiasMainSectionOneMaterial}
                                    onClick={(e) => openCourse(e, element, element.contentType)}
                                    style={{
                                        backgroundImage: `url(${element.coverImage || '/pdf.png'})`,
                                        border: `3px solid ${element.color}`
                                    }}
                                >
                                    <div className={styles.materiasMainSectionOneMaterialTitle}>
                                        {element.title}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>

                </div>
            </div>
            <div className={styles.materiasMainContentContainer}>
                <div className={styles.materiasMainSectionTwo}>
                    <div className={styles.materiasMainSectionTwoTitle}>
                        Cursos recientes
                    </div>
                    <div className={styles.materiasMainSectionTwoContent}>
                        {recentActividades.length > 0 ? (
                            recentActividades.map((element) => (
                                <div
                                    key={element._id}
                                    className={styles.materiasMainSectionTwoMaterial}
                                    onClick={(e) => openCourse(e, element, 'actividades')}
                                    style={{
                                        backgroundImage: `url(${element.coverImage || '/pdf.png'})`,
                                        border: "3px solid #F397C1"
                                    }}
                                >
                                    <div className={styles.materiasMainSectionTwoMaterialTitle}>
                                        {element.title}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                               
                            </>
                        )}
                    </div>

                </div>
            </div>
             

        </div>
    )
}

export default MaterialsMain