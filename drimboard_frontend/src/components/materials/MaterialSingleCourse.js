"use client";
import { useEffect, useState } from "react";
import useAppStore from '@/store/useAppStore';
import { capitalizeWords, getRelativeTime } from "@/utils/utils";
import VideoEmbed from "../VideoEmbed";
import EmbeddedPage from "../EmbeddedPage";
import { api } from '@/lib/api';

const TYPE_TO_DISPLAY = { actividades: 'actividad', documents: 'documento', videos: 'video' };
const TYPE_TO_TONE = { actividades: 'pink', documents: 'yellow', videos: 'green' };

const AVATAR_TONES = ['', 'green', 'yellow', 'sky', 'ink'];

function avatarInitials(name) {
    if (!name) return '·';
    return name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase();
}
function avatarTone(seed) {
    const s = (seed || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return AVATAR_TONES[s % AVATAR_TONES.length];
}

const MaterialsSingleCourse = () => {
    const openMaterialCourse = useAppStore((state) => state.openMaterialCourse);
    const logged = useAppStore((state) => state.logged);
    const materialCourseChat = useAppStore((state) => state.materialCourseChat);
    const setOpenMaterialCourse = useAppStore((s) => s.setOpenMaterialCourse);
    const setMaterialCourseChat = useAppStore((s) => s.setMaterialCourseChat);

    const [pdfUrl, setPdfUrl] = useState(null);
    const [videoUrls, setVideoUrls] = useState([]);
    const [description, setDescription] = useState('');
    const [comment, setComment] = useState('');
    const [messages, setMessages] = useState([]);
    const [contentType, setContentType] = useState(null);
    const [view, setView] = useState('editor');

    useEffect(() => {
        setVideoUrls(openMaterialCourse["youtubeUrls"] || []);
        setPdfUrl(openMaterialCourse["pdfFile"]);
        setDescription(openMaterialCourse["description"] || '');
        setContentType(openMaterialCourse["contentType"]);
        setMessages(materialCourseChat.filter((ele) => ele.course_id === openMaterialCourse["_id"]));

        // Default sub-tab depends on type
        const t = openMaterialCourse["contentType"];
        if (t === 'documents') setView('recursos');
        else if (t === 'videos') setView('recursos');
        else setView('editor');
    }, []);

    useEffect(() => {
        setMessages(materialCourseChat.filter((ele) => ele.course_id === openMaterialCourse["_id"]));
    }, [materialCourseChat]);

    const back = () => {
        setOpenMaterialCourse({ course_name: null, open: false, pdf_url: null, video_url: null });
    };

    const submitComment = async () => {
        if (!comment.trim()) return;
        const send = {
            course_id: openMaterialCourse["_id"],
            user_email: logged?.user_email,
            message: comment,
            user_name: logged?.user_name,
        };
        try {
            const response = await api.post('/create_course_message', send);
            setMaterialCourseChat([...materialCourseChat, response.data]);
            setComment('');
        } catch (err) {
            console.error("Error posting comment", err);
        }
    };

    const downloadDocument = () => {
        if (!pdfUrl) return;
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = openMaterialCourse.title || 'document.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const tone = TYPE_TO_TONE[contentType] || '';
    const display = TYPE_TO_DISPLAY[contentType] || contentType;
    const isAct = contentType === 'actividades';
    const isDoc = contentType === 'documents';
    const isVid = contentType === 'videos';

    return (
        <div className="course-view">
            <button type="button" className="back-btn" onClick={back}>← Volver al material</button>

            <div className="course-hero">
                <div>
                    {display && <span className={`badge-pill ${tone}`}>{display}</span>}
                    <h1>{openMaterialCourse.title}</h1>
                    {description && <p>{description}</p>}
                    <div className="badges">
                        {isDoc && <span className="badge-pill">PDF</span>}
                        {isVid && videoUrls.length > 0 && <span className="badge-pill">Video</span>}
                        {isAct && <span className="badge-pill">Editor de bloques</span>}
                    </div>
                </div>
                <aside className="course-side">
                    <h4>Detalles</h4>
                    <div className="row"><span className="k">Tipo</span><span className="v">{display}</span></div>
                    <div className="row"><span className="k">Comentarios</span><span className="v">{messages.length}</span></div>
                    {openMaterialCourse.publishedAt && (
                        <div className="row"><span className="k">Publicado</span><span className="v">{getRelativeTime(openMaterialCourse.publishedAt)}</span></div>
                    )}
                </aside>
            </div>

            {isAct && (
                <div className="sub-tabs" role="tablist">
                    <button type="button" className={`sub-tab ${view === 'editor' ? 'active' : ''}`} onClick={() => setView('editor')}>Editor</button>
                    {(pdfUrl || videoUrls.length > 0) && (
                        <button type="button" className={`sub-tab ${view === 'recursos' ? 'active' : ''}`} onClick={() => setView('recursos')}>Recursos</button>
                    )}
                    <button type="button" className={`sub-tab ${view === 'comments' ? 'active' : ''}`} onClick={() => setView('comments')}>
                        Comentarios <span style={{ opacity: .6 }}>· {messages.length}</span>
                    </button>
                </div>
            )}

            {/* Activity → Blockly editor */}
            {isAct && view === 'editor' && (
                <div style={{ height: '70vh', minHeight: 480, borderRadius: 15, border: '1.5px solid #000', overflow: 'hidden', boxShadow: '0 6px 0 #000', marginBottom: 28 }}>
                    <EmbeddedPage
                        url="https://blockly-web.dplpleoajxzor.amplifyapp.com/"
                        allowedOrigins={['https://blockly-web.dplpleoajxzor.amplifyapp.com']}
                    />
                </div>
            )}

            {/* Resources panel — PDF + videos */}
            {((isAct && view === 'recursos') || isDoc || isVid) && (
                <div style={{ marginBottom: 28 }}>
                    {pdfUrl && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
                                <button type="button" className="dbtn" onClick={downloadDocument}>
                                    Descargar PDF <span className="arr">↓</span>
                                </button>
                            </div>
                            <div style={{ width: '100%', height: '80vh', borderRadius: 15, border: '1.5px solid #000', overflow: 'hidden', boxShadow: '0 4px 0 #000', marginBottom: 16 }}>
                                <iframe src={`${pdfUrl}#toolbar=0`} width="100%" height="100%" style={{ border: 'none' }} title={openMaterialCourse.title} />
                            </div>
                        </>
                    )}
                    {videoUrls && videoUrls.length > 0 && videoUrls.map((url, i) => (
                        <div key={i} style={{ width: '100%', aspectRatio: '16 / 9', borderRadius: 15, border: '1.5px solid #000', overflow: 'hidden', boxShadow: '0 4px 0 #000', marginBottom: 16 }}>
                            <VideoEmbed
                                styles={{ container: 'vembed-container', iframe: 'vembed-iframe' }}
                                videoUrl={typeof url === 'string' ? url : url.url}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Comments — always visible (single tab for non-act, or "Comentarios" sub-tab for act) */}
            {(view === 'comments' || !isAct) && (
                <div className="comments">
                    <h3>Comentarios <span className="n">{messages.length}</span></h3>
                    <div className="comment-input">
                        <div className="avatar">{avatarInitials(logged?.user_name) || 'YO'}</div>
                        <div>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Cuéntale al grupo cómo te fue, o pide ayuda…"
                            />
                            <div className="ci-foot">
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--t3)' }}>
                                    Sé respetuoso con la comunidad
                                </span>
                                <button type="button" className="send" onClick={submitComment}>Enviar</button>
                            </div>
                        </div>
                    </div>
                    {messages.length === 0 && (
                        <div className="empty">
                            <h4>Sin comentarios todavía</h4>
                            <p>Sé el primero en compartir cómo te fue.</p>
                        </div>
                    )}
                    {messages.map((cm) => (
                        <div className="comment" key={cm.id ?? cm.created_time}>
                            <div className={`avatar ${avatarTone(cm.user_email)}`}>{avatarInitials(cm.user_name)}</div>
                            <div>
                                <span className="name">{capitalizeWords(cm.user_name)}</span>
                                <span className="when">· {getRelativeTime(cm.created_time)}</span>
                                <p>{cm.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MaterialsSingleCourse;
