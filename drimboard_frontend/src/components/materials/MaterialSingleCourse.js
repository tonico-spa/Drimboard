"use client";
import Link from "next/link";
import styles from "../../styles/MaterialsSingleCourse.module.css";
import useAppStore from '@/store/useAppStore';
import { useEffect, useRef, useState } from "react";
import { capitalizeWords } from "@/utils/utils";
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
import { getUrl } from "@/utils/utils";


const MaterialsSingleCourse = () => {
    const logged = useAppStore((state) => state.logged);
    const openMaterialCourse = useAppStore((state) => state.openMaterialCourse);
    const [error, setError] = useState(null);
     const { setOpenMaterialCourse } = useAppStore((state) => state);
useEffect(() => {
    const abortController = new AbortController();
    
    const fetchData = async () => {
        try {
            console.log(openMaterialCourse);
            const response = await axios.post(
                `${API_URL}/get_single_pdf`, 
                openMaterialCourse,
                { signal: abortController.signal } // Add abort signal
            );
            console.log(response);
        } catch (err) {
            if (err.name !== 'CanceledError') {
                setError(err);
            }
        }
    };

    fetchData();

    return () => abortController.abort(); // Cleanup
}, [openMaterialCourse]);

        const openCourse = (e) => {
        e.preventDefault()
        setOpenMaterialCourse({"course_name": null,
            open: false,
            pdf_url: null,
            video_url: null
        })
    }



    return (

        <div className={styles.materialsSingleCourseContainer}>
            <div className={styles.closeButton} onClick={(e) => openCourse(e)}>
                x
            </div>



        </div>
    )
}

export default MaterialsSingleCourse