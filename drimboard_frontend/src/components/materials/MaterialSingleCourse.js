"use client";
import Link from "next/link";
import styles from "../../styles/MaterialsSingleCourse.module.css";
import useAppStore from '@/store/useAppStore';
import { useEffect, useRef, useState } from "react";
import { capitalizeWords, getRelativeTime } from "@/utils/utils";
import VideoEmbed from "../VideoEmbed";
import axios from 'axios';
import EmbeddedPage from "../EmbeddedPage";
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
import { getUrl } from "@/utils/utils";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const projectToken = process.env.NEXT_PUBLIC_SANITY_PROJECT_TOKEN;
const dataset = process.env.NEXT_PUBLIC_SANITY_PROJECT_DATASET;

const MaterialsSingleCourse = () => {
    const openMaterialCourse = useAppStore((state) => state.openMaterialCourse);
    const logged = useAppStore((state) => state.logged);
    const materialCourseChat = useAppStore((state) => state.materialCourseChat);
    const [error, setError] = useState(null);
    const { setOpenMaterialCourse } = useAppStore((state) => state);
    const { setMaterialCourseChat } = useAppStore((state) => state);
    const [pdfUrl, setPdfUrl] = useState(null)
    const [videoUrl, setVideoUrl] = useState(null)
    const [numPages, setNumPages] = useState(null);
    const [courseContent, setCourseContent] = useState(false);
    const [comment, setComment] = useState('');
    const [description, setDescription] = useState(1);
    const [messages, setMessages] = useState([]);
    const [contentType, setContentType] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    useEffect(() => {

        setVideoUrl(openMaterialCourse["youtubeUrl"])
        setPdfUrl(openMaterialCourse["pdfFile"])
        setDescription(openMaterialCourse["description"])
        setContentType(openMaterialCourse["contentType"])
        setMessages(materialCourseChat.filter(ele => ele.course_id === openMaterialCourse["_id"]))

    }, []);

    useEffect(() => {

        setMessages(materialCourseChat.filter(ele => ele.course_id === openMaterialCourse["_id"]))

    }, [materialCourseChat]);

    const openCourse = (e) => {
        e.preventDefault()
        setOpenMaterialCourse({
            "course_name": null,
            open: false,
            pdf_url: null,
            video_url: null
        })
    }

    const commentCourse = async () => {

        const send_dd = {
            "course_id": openMaterialCourse["_id"],
            "user_email": logged["user_email"],
            "message": comment,
            "user_name": logged["user_name"]
        }
        const response = await axios.post(`${API_URL}/create_course_message`, send_dd)
        setMaterialCourseChat([...materialCourseChat, send_dd])
        setComment("")

    }
    const openCourseContent = () => {
        setCourseContent(!courseContent)
    }
    const downloadDocument = () => {
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = openMaterialCourse.title || 'document.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }


    return (

        <div className={styles.materialsSingleCourseContainer}>
            <div className={styles.closeButton} onClick={(e) => openCourse(e)}>

                Volver
            </div>

            {/* Show embedded page only for Actividades */}
            {contentType === 'actividades' && (
                <>
                    <div className={styles.materialsSingleCourseBlocks}>
                        <EmbeddedPage
                            url="https://blockly-web.dplpleoajxzor.amplifyapp.com/"
                            allowedOrigins={['https://blockly-web.dplpleoajxzor.amplifyapp.com']}
                        />
                    </div>
                    <div className={styles.materialCourseDescription}>
                        <div className={styles.materialCourseDescriptionTitle}>
                            Descripción del curso
                        </div>
                        {description}
                    </div>
                    <div className={styles.materialCourseOpenCourse} onClick={openCourseContent}>
                        Contenido del curso
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                                transform: courseContent ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease'
                            }}
                        >
                            <polyline points="18 15 12 9 6 15"></polyline>
                        </svg>
                    </div>

                    <div className={`${styles.contentWrapper} ${courseContent ? styles.contentOpen : styles.contentClosed}`}>
                        {courseContent &&
                            <>
                                <div className={styles.materialCourse}>
                                    <div className={styles.materialCoursePdf}>
                                        {pdfUrl && (
                                            <div className={styles.pdfViewer}>
                                                <iframe
                                                    src={`${pdfUrl}#toolbar=0`}
                                                    width="100%"
                                                    height="100%"
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.materialCourseVideo}>
                                        {videoUrl &&
                                            <VideoEmbed styles={styles} videoUrl={videoUrl} />
                                        }
                                    </div>
                                </div>

                            </>
                        }
                    </div>
                </>
            )}

            {/* Show only PDF for Documents */}
            {contentType === 'documents' && (
                <>
                    <>
                        <div className={styles.downloadButtonContainer}>
                            <button className={styles.downloadButton} onClick={downloadDocument}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Descargar documento
                            </button>
                        </div>
                        {pdfUrl && (
                            <div className={styles.materialsSingleCourseBlocks}>
                                <iframe
                                    src={`${pdfUrl}#toolbar=0`}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none' }}
                                />
                            </div>
                        )}
                        {description && (
                            <div className={styles.materialCourseDescription}>
                                <div className={styles.materialCourseDescriptionTitle}>
                                    Descripción del documento
                                </div>
                                {description}
                            </div>
                        )}
                    </>
                </>
            )}

            {/* Show only Video for Videos */}
            {contentType === 'videos' && (
                <>
                    {videoUrl && (
                        <div className={styles.materialsSingleCourseBlocks}>
                            <VideoEmbed styles={styles} videoUrl={videoUrl} />
                        </div>
                    )}
                    {description && (
                        <div className={styles.materialCourseDescription}>
                            <div className={styles.materialCourseDescriptionTitle}>
                                Descripción del video
                            </div>
                            {description}
                        </div>
                    )}
                </>
            )}


            <div className={styles.materialCourseChat}>
                <div className={styles.materialCourseChatTitle}>
                    {messages.length} comentarios
                </div>
                <div className={styles.inputGroup}>
                    <textarea
                        id="comment"
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Escribe un comentario"
                        required
                        className={styles.input}
                    />
                    {comment.length > 0 &&
                        <div className={styles.inputGroupButton} onClick={commentCourse}>
                            Enviar

                        </div>
                    }
                </div>
                {messages.length > 0 && messages.map((element) => (
                    <div className={styles.materialCourseMessage} key={element["_id"]}>
                        <div  className={styles.materialCourseTitleContainer}>
                            <div className={styles.materialCourseMessageTitle}>
                                {capitalizeWords(element["user_name"])}

                            </div>
                            <div className={styles.materialCourseMessageTime}>
                                {getRelativeTime(element["created_time"])}
                            </div>
                        </div>

                        <div className={styles.materialCourseMessageText}>
                            {element["message"]}

                        </div>

                    </div>
                ))}

            </div>



        </div>
    )
}

export default MaterialsSingleCourse