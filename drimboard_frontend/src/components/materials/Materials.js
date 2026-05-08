"use client";
import { useEffect, useRef, useState } from "react";
import useAppStore from '@/store/useAppStore';
import MaterialsMain from "@/components/materials/MaterialsMain";
import MaterialsCourses from "@/components/materials/MaterialsCourses";
import MaterialsSingleCourse from "@/components/materials/MaterialSingleCourse";
import Forum from "./Forum";
import { api } from '@/lib/api';
const groq = String.raw;

import { client } from '../../lib/sanity.js';

const Materials = () => {
    const [tab, setTab] = useState("inicio");
    const openMaterialCourse = useAppStore((state) => state.openMaterialCourse);
    const setMaterialCourseChat = useAppStore((s) => s.setMaterialCourseChat);
    const setActividades = useAppStore((s) => s.setActividades);
    const setVideos = useAppStore((s) => s.setVideos);
    const setDocuments = useAppStore((s) => s.setDocuments);

    const actividades = useAppStore((state) => state.actividades);
    const videos = useAppStore((state) => state.videos);
    const documents = useAppStore((state) => state.documents);

    // Animated tab underline
    const tabsRef = useRef(null);
    const [bar, setBar] = useState({ left: 0, width: 0 });
    useEffect(() => {
        const el = tabsRef.current?.querySelector(`[data-tab="${tab}"]`);
        if (el) setBar({ left: el.offsetLeft, width: el.offsetWidth });
    }, [tab, openMaterialCourse]);

    useEffect(() => {
        const store = useAppStore.getState();

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

        const notDraft = `!(_id in path("drafts.**"))`;

        if (!store.actividades || store.actividades.length === 0) {
            const q = groq`
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
            client.fetch(q).then((data) => setActividades(dedupById(data))).catch((err) => console.error('actividades', err));
        }

        if (!store.videos || store.videos.length === 0) {
            const q = groq`
                *[_type == "videos" && ${notDraft}]{
                    _id,
                    title,
                    youtubeUrls,
                    description,
                    "coverImage": coverImage.asset->url,
                    publishedAt
                } | order(publishedAt desc)
            `;
            client.fetch(q).then((data) => setVideos(dedupById(data))).catch((err) => console.error('videos', err));
        }

        if (!store.documents || store.documents.length === 0) {
            const q = groq`
                *[_type == "pdf_document" && ${notDraft}]{
                    _id,
                    title,
                    "pdfFile": pdfFile.asset->url,
                    description,
                    "coverImage": coverImage.asset->url,
                    publishedAt
                } | order(publishedAt desc)
            `;
            client.fetch(q).then((data) => setDocuments(dedupById(data))).catch((err) => console.error('documents', err));
        }
    }, [setMaterialCourseChat, setActividades, setVideos, setDocuments]);

    const handleTabClick = (tabValue) => {
        const { setOpenMaterialCourse } = useAppStore.getState();
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

    const totalMaterial = actividades.length + documents.length + videos.length;

    return (
        <div className="mat-page">
            <div className="mat-wrap">
                {openMaterialCourse["open"] ? (
                    <MaterialsSingleCourse />
                ) : (
                    <>
                        <div className="mtabs" ref={tabsRef} role="tablist">
                            <button
                                type="button"
                                data-tab="inicio"
                                className={`mtab ${tab === 'inicio' ? 'active' : ''}`}
                                onClick={() => handleTabClick('inicio')}
                            >
                                Inicio
                            </button>
                            <button
                                type="button"
                                data-tab="material"
                                className={`mtab ${tab === 'material' ? 'active' : ''}`}
                                onClick={() => handleTabClick('material')}
                            >
                                Material <span className="count">{totalMaterial}</span>
                            </button>
                            <button
                                type="button"
                                data-tab="foro"
                                className={`mtab ${tab === 'foro' ? 'active' : ''}`}
                                onClick={() => handleTabClick('foro')}
                            >
                                Foro
                            </button>
                            <div className="mtab-bar" style={{ left: bar.left, width: bar.width }} />
                        </div>

                        {tab === "inicio"   && <MaterialsMain />}
                        {tab === "material" && <MaterialsCourses />}
                        {tab === "foro"     && <Forum />}
                    </>
                )}
            </div>
        </div>
    );
};

export default Materials;
