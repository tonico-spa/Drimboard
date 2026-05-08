"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/Materials.module.css";
import useAppStore from '@/store/useAppStore';
import MaterialsMain from "@/components/materials/MaterialsMain";
import MaterialsCourses from "@/components/materials/MaterialsCourses";
import MaterialsSingleCourse from "@/components/materials/MaterialSingleCourse";
import Forum from "./Forum";
import { api } from '@/lib/api';
const groq = String.raw;

import { client } from '../../lib/sanity.js'; // Your Sanity client

const Materials = () => {
    const [tab, setTab] = useState("inicio");
    const openMaterialCourse = useAppStore((state) => state.openMaterialCourse);
    const setMaterialCourseChat = useAppStore((s) => s.setMaterialCourseChat);
    const setActividades = useAppStore((s) => s.setActividades);
    const setVideos = useAppStore((s) => s.setVideos);
    const setDocuments = useAppStore((s) => s.setDocuments);

    useEffect(() => {
        // Read latest store snapshot — selectors above don't reflect updates from this same effect.
        const store = useAppStore.getState();

        // Defensive: dedupe by _id in case Sanity returns the same doc twice (drafts, etc.)
        const dedupById = (items) => {
            const seen = new Set();
            return (items || []).filter((it) => {
                if (!it?._id || seen.has(it._id)) return false;
                seen.add(it._id);
                return true;
            });
        };

        if (!store.materialCourseChat || store.materialCourseChat.length === 0) {
            api.get('/get_course_messages')
                .then((res) => setMaterialCourseChat(res.data))
                .catch((err) => console.error('Error fetching messages', err));
        }

        // Token-authed Sanity reads include drafts; filter them out at the GROQ level.
        const notDraft = `!(_id in path("drafts.**"))`;

        if (!store.actividades || store.actividades.length === 0) {
            const actividadesQuery = groq`
                *[_type == "actividades" && ${notDraft}]{
                    _id,
                    title,
                    "pdfFile": pdfFile.asset->url,
                    youtubeUrls,
                    description,
                    "coverImage": coverImage.asset->url,
                    publishedAt
                } | order(publishedAt desc)
            `;
            client.fetch(actividadesQuery)
                .then((data) => {
                    console.log('[sanity] actividades raw:', data);
                    setActividades(dedupById(data));
                })
                .catch((err) => console.error('Error fetching actividades', err));
        }

        if (!store.videos || store.videos.length === 0) {
            const videosQuery = groq`
                *[_type == "videos" && ${notDraft}]{
                    _id,
                    title,
                    youtubeUrls,
                    description,
                    "coverImage": coverImage.asset->url,
                    publishedAt
                } | order(publishedAt desc)
            `;
            client.fetch(videosQuery)
                .then((data) => {
                    console.log('[sanity] videos raw:', data);
                    setVideos(dedupById(data));
                })
                .catch((err) => console.error('Error fetching videos', err));
        }

        if (!store.documents || store.documents.length === 0) {
            const documentsQuery = groq`
                *[_type == "pdf_document" && ${notDraft}]{
                    _id,
                    title,
                    "pdfFile": pdfFile.asset->url,
                    description,
                    "coverImage": coverImage.asset->url,
                    publishedAt
                } | order(publishedAt desc)
            `;
            client.fetch(documentsQuery)
                .then((data) => {
                    console.log('[sanity] documents raw:', data);
                    setDocuments(dedupById(data));
                })
                .catch((err) => console.error('Error fetching documents', err));
        }
    }, [setMaterialCourseChat, setActividades, setVideos, setDocuments])




    // Function to handle tab clicks
    const handleTabClick = (tabValue) => {
        // if a material single course is open, close it when switching tabs
        const { setOpenMaterialCourse } = useAppStore.getState ? useAppStore.getState() : {};
        if (setOpenMaterialCourse) {
            setOpenMaterialCourse({
                course_name: null,
                open: false,
                pdf_url: null,
                youtubeUrls: null,
                _id: null
            });
        }
        setTab(tabValue);
    };
    return (

        <div className={styles.materialsContainer}>
          
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
            {openMaterialCourse["open"] ? (
                <MaterialsSingleCourse />
            ) : (
                <>
                    {tab === "inicio" &&
                        <MaterialsMain />
                    }
                    {tab === "material" &&
                        <MaterialsCourses />
                    }
                    {tab === "foro" &&
                        <Forum />
                    }
                </>
            )}

        </div>
    )
}

export default Materials