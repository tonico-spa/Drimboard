"use client";
import Link from "next/link";
import styles from "../../styles/MaterialsSingleCourse.module.css";
import useAppStore from '@/store/useAppStore';
import { useEffect, useRef, useState } from "react";
import { capitalizeWords, PDFViewer } from "@/utils/utils";
import VideoEmbed from "../VideoEmbed";
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
import { getUrl } from "@/utils/utils";


const MaterialsSingleCourse = () => {
    const logged = useAppStore((state) => state.logged);
    const openMaterialCourse = useAppStore((state) => state.openMaterialCourse);
    const [error, setError] = useState(null);
    const { setOpenMaterialCourse } = useAppStore((state) => state);
    const [pdfUrl, setPdfUrl] = useState(null)
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

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
                console.log(response.data["url"]);
                setPdfUrl(response.data["url"])
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
        setOpenMaterialCourse({
            "course_name": null,
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

            <div className={styles.materialCourse}>
                <div className={styles.materialCoursePdf}>
                    {pdfUrl &&
                        <iframe
                            src={pdfUrl}
                            className={styles.pdfContainer}
                            title="PDF Viewer"
                        />}
                </div>
                <div className={styles.materialCourseVideo}>
                    <VideoEmbed  styles={styles} videoUrl="https://youtu.be/LeGcbc87JxU?si=s30UAE7KfEwX4BOe" />
                </div>
            </div>



        </div>
    )
}

export default MaterialsSingleCourse