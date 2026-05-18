"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Materiales.module.css";
import useAppStore from "@/store/useAppStore";
import { capitalizeWords, getRelativeTime } from "@/utils/utils";
import VideoEmbed from "../VideoEmbed";
import PdfViewer from "../PdfViewer";
import axios from "axios";
import EmbeddedPage from "../EmbeddedPage";
import { useToast } from "@/context/ToastContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const AVATAR_COLORS = ["avatarPink", "avatarGreen", "avatarYellow", "avatarSky", "avatarInk"];

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

function avatarClass(seed = "") {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[h];
}

const TYPE_LABEL = {
  actividades: "actividad",
  documents: "documento",
  videos: "video",
};

const MaterialsSingleCourse = ({ course }) => {
  const router = useRouter();
  const logged = useAppStore((s) => s.logged);
  const { showToast } = useToast();
  const [view, setView] = useState("editor");
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [messages, setMessages] = useState([]);
  const [savedProjects, setSavedProjects] = useState([]);

  const contentType = course?.contentType;
  const isAct = contentType === "actividades";
  const isVid = contentType === "videos";
  const isDoc = contentType === "documents";

  useEffect(() => {
    if (!course?._id) return;
    fetchCourseMessages(course._id);
    if (isAct && logged?.user_email) fetchSavedProjects();
  }, [course?._id]);

  const fetchCourseMessages = async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/get_course_messages?course_id=${encodeURIComponent(courseId)}`);
      setMessages(response.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const fetchSavedProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/blocks/user/${encodeURIComponent(logged.user_email)}`);
      setSavedProjects(response.data);
    } catch (err) {
      console.error("Error fetching saved projects:", err);
    }
  };

  const commentCourse = async () => {
    if (!comment.trim() || isSubmittingComment) return;
    setIsSubmittingComment(true);
    const payload = {
      course_id: course?._id,
      user_email: logged?.user_email,
      message: comment,
      user_name: logged?.user_name,
    };
    try {
      await axios.post(`${API_URL}/create_course_message`, payload);
      setMessages((prev) => [...prev, { ...payload, created_time: new Date().toISOString() }]);
      setComment("");
      showToast("Comentario enviado", "success");
    } catch {
      showToast("Error al enviar el comentario. Intenta de nuevo.", "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const downloadPdf = () => {
    if (!course?.pdfFile) return;
    const link = document.createElement("a");
    link.href = course.pdfFile;
    link.download = course.title || "document.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const typePillClass = isAct
    ? styles.badgePillPink
    : isDoc
    ? styles.badgePillYellow
    : styles.badgePillGreen;

  return (
    <div className={styles.courseView}>
      <button type="button" className={styles.backBtn} onClick={() => router.push("/materials/cursos")}>
        ← Volver al material
      </button>

      <div className={styles.courseHero}>
        <div>
          <span className={`${styles.badgePill} ${typePillClass}`}>
            {TYPE_LABEL[contentType] || contentType}
          </span>
          <h1>{course?.title}</h1>
          <p>{course?.description}</p>
          <div className={styles.badges}>
            {course?.publishedAt && (
              <span className={styles.badgePill}>
                Publicado{" "}
                {new Date(course.publishedAt).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            {isAct && <span className={styles.badgePill}>Editor de bloques</span>}
            {isDoc && <span className={styles.badgePill}>PDF</span>}
            {isVid && (course?.youtubeUrls?.length || 0) > 0 && (
              <span className={styles.badgePill}>
                {course.youtubeUrls.length} video{course.youtubeUrls.length === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>
        <aside className={styles.courseSide}>
          <h4>Resumen</h4>
          <div className={styles.sideRow}>
            <span className={styles.k}>Tipo</span>
            <span className={styles.v}>{TYPE_LABEL[contentType] || contentType}</span>
          </div>
          <div className={styles.sideRow}>
            <span className={styles.k}>Comentarios</span>
            <span className={styles.v}>{messages.length}</span>
          </div>
          {course?.pdfFile && (
            <div className={styles.sideRow}>
              <span className={styles.k}>Material</span>
              <span className={styles.v}>PDF disponible</span>
            </div>
          )}
          {(course?.youtubeUrls?.length || 0) > 0 && (
            <div className={styles.sideRow}>
              <span className={styles.k}>Videos</span>
              <span className={styles.v}>{course.youtubeUrls.length}</span>
            </div>
          )}
          <div className={styles.sideActions}>
            {isAct && (
              <button type="button" className={`${styles.btnMini} ${styles.btnMiniPrimary}`} onClick={() => setView("editor")}>
                ▶ Abrir editor
              </button>
            )}
            {course?.pdfFile && (
              <button type="button" className={styles.btnMini} onClick={downloadPdf} title="Descargar PDF">
                ↓ PDF
              </button>
            )}
          </div>
        </aside>
      </div>

      {isAct && (
        <div className={styles.subTabs} role="tablist">
          <button
            type="button"
            role="tab"
            className={`${styles.subTab} ${view === "editor" ? styles.subTabActive : ""}`}
            onClick={() => setView("editor")}
          >
            Editor
          </button>
          <button
            type="button"
            role="tab"
            className={`${styles.subTab} ${view === "recursos" ? styles.subTabActive : ""}`}
            onClick={() => setView("recursos")}
          >
            Recursos
          </button>
          <button
            type="button"
            role="tab"
            className={`${styles.subTab} ${view === "comments" ? styles.subTabActive : ""}`}
            onClick={() => setView("comments")}
          >
            Comentarios <span style={{ opacity: 0.6 }}>· {messages.length}</span>
          </button>
        </div>
      )}

      {isAct && view === "editor" && (
        <div className={styles.editorFrame}>
          <div className={styles.editorToolbar}>
            <div className={styles.lights}>
              <span /> <span /> <span />
            </div>
            <span className={styles.editorTitle}>· {course?.title}</span>
          </div>
          <div className={styles.editorBody}>
            <EmbeddedPage
              url="https://blockly-web.dplpleoajxzor.amplifyapp.com/"
              allowedOrigins={["https://blockly-web.dplpleoajxzor.amplifyapp.com"]}
              savedProjects={savedProjects}
              onProjectsChange={fetchSavedProjects}
            />
          </div>
        </div>
      )}

      {isAct && view === "recursos" && (
        <div className={styles.resList}>
          {course?.pdfFile ? (
            <>
              <div className={styles.resRow}>
                <div className={styles.resIcon}>▤</div>
                <div>
                  <div className={styles.resTtl}>{course.title} · guía</div>
                  <div className={styles.resMeta}>PDF</div>
                </div>
                <button type="button" className={styles.resDl} onClick={downloadPdf}>Descargar</button>
              </div>
              <PdfViewer pdfUrl={course.pdfFile} />
            </>
          ) : (
            <div className={styles.empty}>
              <h4>Sin recursos adicionales</h4>
              <p>Esta actividad no tiene PDF complementario.</p>
            </div>
          )}
          {(course?.youtubeUrls || []).map((item, i) => (
            <div key={item?._key || i}>
              <VideoEmbed styles={styles} videoUrl={item?.url || item} />
            </div>
          ))}
        </div>
      )}

      {/* Document type: PDF viewer */}
      {isDoc && (
        <div className={styles.resList}>
          {course?.pdfFile && (
            <>
              <div className={styles.resRow}>
                <div className={styles.resIcon}>▤</div>
                <div>
                  <div className={styles.resTtl}>{course.title}</div>
                  <div className={styles.resMeta}>PDF</div>
                </div>
                <button type="button" className={styles.resDl} onClick={downloadPdf}>Descargar</button>
              </div>
              <PdfViewer pdfUrl={course.pdfFile} />
            </>
          )}
        </div>
      )}

      {/* Video type */}
      {isVid && (course?.youtubeUrls || []).map((item, i) => (
        <div key={item?._key || i} style={{ marginBottom: 16 }}>
          <VideoEmbed styles={styles} videoUrl={item?.url || item} />
        </div>
      ))}

      {(!isAct || view === "comments") && (
        <div className={styles.comments}>
          <h3>
            Comentarios <span className={styles.commentsN}>{messages.length}</span>
          </h3>
          <div className={styles.commentInput}>
            <div className={`${styles.avatar} ${styles[avatarClass(logged?.user_email || "you")]}`}>
              {initials(logged?.user_name || "Tú")}
            </div>
            <div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntale al grupo cómo te fue, o pedí ayuda…"
              />
              <div className={styles.ciFoot}>
                <span />
                <button
                  type="button"
                  className={styles.ciSend}
                  onClick={commentCourse}
                  disabled={isSubmittingComment || !comment.trim()}
                >
                  {isSubmittingComment ? "Enviando…" : "Enviar"}
                </button>
              </div>
            </div>
          </div>

          {messages.map((m, i) => (
            <div key={m._id || i} className={styles.comment}>
              <div className={`${styles.avatar} ${styles[avatarClass(m.user_email || m.user_name)]}`}>
                {initials(m.user_name)}
              </div>
              <div>
                <span className={styles.name}>{capitalizeWords(m.user_name)}</span>
                <span className={styles.when}>· {getRelativeTime(m.created_time)}</span>
                <p>{m.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialsSingleCourse;
