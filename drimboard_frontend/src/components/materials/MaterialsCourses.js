"use client";
import Link from "next/link";
import { useState } from "react";
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

    const [modalOpen, setModalOpen] = useState(false);
    const [modalSection, setModalSection] = useState({ type: '', data: [], title: '', color: '' });

    const openCourse = (e, element, contentType) => {
        e.preventDefault()
        setOpenMaterialCourse({ ...element, "open": true, "contentType": contentType })
    }

    const openModal = (type, data, title, color) => {
        setModalSection({ type, data, title, color });
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
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

                                {actividades.length > 0 && actividades.slice(0, 5).map((element) => (
                                    <div
                                        key={element._id}
                                        className={styles.materiasMainSectionOneMaterial}
                                        onClick={(e) => openCourse(e, element, 'actividades')}
                                        style={{
                                            backgroundImage: `url(${element.coverImage || '/pdf.png'})`,
                                            border: "3px solid #F397C1"
                                        }}
                                    >
                                        <div className={styles.materiasMainSectionOneMaterialTitle}>{element.title}</div>

                                    </div>
                                ))}

                            </div>
                            {actividades.length > 5 && (
                                <button 
                                    className={styles.verMasButton}
                                    onClick={() => openModal('actividades', actividades, 'Actividades', '#F397C1')}
                                >
                                    Ver más
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.materiasMainContentContainer}>
                        <div className={styles.materiasMainSectionTwo}>
                            <div className={styles.materiasMainSectionTwoTitle}>
                                Documentos
                            </div>
                            <div className={styles.materiasMainSectionTwoContent}>
                                {documents.length > 0 && documents.slice(0, 5).map((element) => (
                                    <div
                                        key={element._id}
                                        className={styles.materiasMainSectionOneMaterial}
                                        onClick={(e) => openCourse(e, element, 'documents')}
                                        style={{
                                            backgroundImage: `url(${element.coverImage || '/pdf.png'})`,
                                            border: "3px solid #FFB71A"
                                        }}
                                    >
                                        <div className={styles.materiasMainSectionOneMaterialTitle}>{element.title}</div>
                                    </div>
                                ))}
                            </div>
                            {documents.length > 5 && (
                                <button 
                                    className={styles.verMasButton}
                                    onClick={() => openModal('documents', documents, 'Documentos', '#FFB71A')}
                                >
                                    Ver más
                                </button>
                            )}
                        </div>
                    </div>
                    <div className={styles.materiasMainContentContainer}>
                        <div className={styles.materiasMainSectionThree}>
                            <div className={styles.materiasMainSectionThreeTitle}>
                                Videos
                            </div>
                            <div className={styles.materiasMainSectionThreeContent}>
                                {videos.length > 0 && videos.slice(0, 5).map((element) => (
                                    <div
                                        key={element._id}
                                        className={styles.materiasMainSectionOneMaterial}
                                        onClick={(e) => openCourse(e, element, 'videos')}
                                        style={{
                                            backgroundImage: `url(${element.coverImage || '/pdf.png'})`
                                        }}
                                    >
                                        <div className={styles.materiasMainSectionOneMaterialTitle}>{element.title}</div>
                                    </div>
                                ))}
                            </div>
                            {videos.length > 5 && (
                                <button 
                                    className={styles.verMasButton}
                                    onClick={() => openModal('videos', videos, 'Videos', '#53C68E')}
                                >
                                    Ver más
                                </button>
                            )}
                        </div>
                    </div>
                </>
            }


            {openMaterialCourse["open"] &&
                <div >
                    <MaterialsSingleCourse />

                </div>
            }

            {modalOpen && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>{modalSection.title}</h2>
                            <button className={styles.closeButton} onClick={closeModal}>×</button>
                        </div>
                        <div className={styles.modalGrid}>
                            {modalSection.data.map((element) => (
                                <div
                                    key={element._id}
                                    className={styles.modalCard}
                                    onClick={(e) => {
                                        closeModal();
                                        openCourse(e, element, modalSection.type);
                                    }}
                                    style={{
                                        backgroundImage: `url(${element.coverImage || '/pdf.png'})`,
                                        border: `3px solid ${modalSection.color}`
                                    }}
                                >
                                    <div className={styles.modalCardTitle}>{element.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default MaterialsCourses