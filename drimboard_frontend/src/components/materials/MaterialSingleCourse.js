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

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    useEffect(() => {

        setVideoUrl(openMaterialCourse["youtubeUrl"])
        setPdfUrl(openMaterialCourse["pdfFile"])
        setDescription(openMaterialCourse["description"])
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
            "email": logged["user_email"],
            "message": comment,
            "name": logged["user_name"]
        }
        const response = await axios.post(`${API_URL}/create_course_message`, send_dd)
        setMaterialCourseChat([...materialCourseChat, send_dd])
        setComment("")

    }
    const openCourseContent = () =>{
        setCourseContent(!courseContent)
    }


    return (

        <div className={styles.materialsSingleCourseContainer}>
            <div className={styles.closeButton} onClick={(e) => openCourse(e)}>
                <img
                    src="/left_arrow.png"
                    alt="Duolab Logo"
                    className={styles.coverLogo}
                />
                Volver
            </div>

            <div className={styles.materialsSingleCourseBlocks}>
                <EmbeddedPage
                    url="https://pcb-block-programming.d33nxrkjnqqh49.amplifyapp.com/"
                    allowedOrigins={['https://pcb-block-programming.d33nxrkjnqqh49.amplifyapp.com/']}
                />
            </div>
            <div className={styles.materialCourseOpenCourse} onClick={openCourseContent}>
                Contenido del curso
            </div>

            {courseContent && 
            <>
             <div className={styles.materialCourse}>
                <div className={styles.materialCoursePdf}>

                    {pdfUrl && (
                        <div className={styles.pdfViewer}>
                            <iframe
                                src={`${`https://cdn.sanity.io/files/${projectId}/${dataset}/${pdfUrl.asset._ref.replace('file-', '').replace('-pdf', '.pdf')}`}#toolbar=0`}
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
            <div className={styles.materialCourseDescription}>
                <div className={styles.materialCourseDescriptionTitle}>
                    Descripción del curso
                </div>
                {description}


            </div>
            </>
            }

           
            <div className={styles.materialCourseChat}>
                <div>
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
                        <div className={styles.materialCourseTitleContainer}>
                            <div className={styles.materialCourseMessageTitle}>
                                {capitalizeWords(element["name"])}

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