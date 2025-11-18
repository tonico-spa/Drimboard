"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../../styles/Materials.module.css";
import { useAuth } from '../../context/AuthContext';
import useAppStore from '@/store/useAppStore';
import MaterialsMain from "@/components/materials/MaterialsMain";
import MaterialsCourses from "@/components/materials/MaterialsCourses";
import axios from 'axios';
import { groq } from 'next-sanity';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

import { client } from '../../lib/sanity.js'; // Your Sanity client

const Materials = () => {
    const [tab, setTab] = useState("inicio");
    const { setMaterialCourseChat } = useAppStore((state) => state);
    const { setCourses } = useAppStore((state) => state);

    useEffect(() => {

        const getMessages = async () => {
            console.log("fetching messages")
            const response = await axios.get(`${API_URL}/get_course_messages`);
            console.log("messages fetched", response.data)
            setMaterialCourseChat(response.data)
        }
        const getLatestPosts = async () => {

            const postsQuery = groq`
                            *[_type == "post"]{
                            _id,
                            title,
                            "pdfFile": pdf.asset->url,
                            youtubeUrl,
                            description
                            } | order(_createdAt desc)
                            `;

            const data =  await client.fetch('*[_type == "post"]')
            setCourses(data)

        }

        getMessages()
        getLatestPosts()


    }, [])




    // Function to handle tab clicks
    const handleTabClick = (tabValue) => {
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
            {tab === "inicio" &&
                <MaterialsMain />
            }
            {tab === "material" &&
                <MaterialsCourses />
            }

        </div>
    )
}

export default Materials