"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import useAppStore from "@/store/useAppStore";
import { useToast } from "@/context/ToastContext";
import styles from "../../styles/Materiales.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

const AVATAR_COLORS = [
  "avatarPink",
  "avatarGreen",
  "avatarYellow",
  "avatarSky",
  "avatarInk",
];

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

function relTime(iso) {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  const d = Math.max(0, Date.now() - t);
  const min = Math.floor(d / 60000);
  if (min < 1) return "hace instantes";
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "ayer";
  if (day < 7) return `hace ${day} días`;
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export default function Forum() {
  const logged = useAppStore((s) => s.logged || {});
  const storeIssues = useAppStore((s) => s.issues);
  const setStoreIssues = useAppStore((s) => s.setIssues);
  const { showToast } = useToast();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSubmittingIssue, setIsSubmittingIssue] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [scope, setScope] = useState("todas");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (storeIssues && storeIssues.length > 0) setIssues(storeIssues);
    else fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/issues`);
      setIssues(res.data || []);
      setStoreIssues(res.data || []);
    } catch (err) {
      console.error("Error fetching issues", err);
      showToast("Error cargando discusiones", "error");
    } finally {
      setLoading(false);
    }
  };

  const submitIssue = async () => {
    if (!title.trim() || isSubmittingIssue) return;
    setIsSubmittingIssue(true);
    try {
      const tagsArray = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = {
        title: title.trim(),
        description,
        tags: tagsArray,
        author_name: logged.user_name || "Anon",
        author_email: logged.user_email || "anon@example.com",
      };
      const res = await axios.post(`${API_URL}/issues`, payload);
      const created = res.data;
      const newList = [created, ...(storeIssues || [])];
      setStoreIssues(newList);
      setIssues(newList);
      setShowCreate(false);
      setTitle("");
      setDescription("");
      setTagsInput("");
      setSelectedIssue(created);
      fetchIssueDetail(created.id);
    } catch (err) {
      console.error("Error creating issue", err);
      showToast("Error al crear la discusión. Intenta de nuevo.", "error");
    } finally {
      setIsSubmittingIssue(false);
    }
  };

  const fetchIssueDetail = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/issues/${id}`);
      setSelectedIssue(res.data.issue);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Error fetching issue detail", err);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !selectedIssue || isSubmittingComment) return;
    setIsSubmittingComment(true);
    try {
      const payload = {
        user_name: logged.user_name || "Anon",
        user_email: logged.user_email || "anon@example.com",
        comment: newComment.trim(),
      };
      const res = await axios.post(`${API_URL}/issues/${selectedIssue.id}/comments`, payload);
      setComments([...comments, res.data]);
      setNewComment("");
      showToast("Comentario publicado", "success");
    } catch (err) {
      console.error("Error posting comment", err);
      showToast("Error al publicar el comentario. Intenta de nuevo.", "error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const filtered = useMemo(() => {
    let list = issues;
    if (scope === "mias" && logged.user_email) {
      list = list.filter((it) => it.author_email === logged.user_email);
    }
    if (query.trim()) {
      const term = query.toLowerCase();
      list = list.filter(
        (it) =>
          it.title?.toLowerCase().includes(term) ||
          (it.tags || []).some((t) => t?.toLowerCase().includes(term)) ||
          it.author_name?.toLowerCase().includes(term)
      );
    }
    return list;
  }, [issues, scope, query, logged.user_email]);

  if (selectedIssue) {
    return (
      <>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => {
            setSelectedIssue(null);
            setComments([]);
          }}
        >
          ← Volver al foro
        </button>
        <div className={styles.courseHero} style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <span className={`${styles.badgePill} ${styles.badgePillPink}`}>Discusión</span>
            <h1>{selectedIssue.title}</h1>
            <p>{selectedIssue.description}</p>
            <div className={styles.badges}>
              {(selectedIssue.tags || []).map((t, i) => (
                <span key={i} className={styles.badgePill}>{t}</span>
              ))}
              <span className={styles.badgePill}>{relTime(selectedIssue.created_time)}</span>
              <span className={styles.badgePill}>Por {selectedIssue.author_name}</span>
            </div>
          </div>
        </div>

        <div className={styles.comments}>
          <h3>
            Comentarios <span className={styles.commentsN}>{comments.length}</span>
          </h3>
          <div className={styles.commentInput}>
            <div className={`${styles.avatar} ${styles[avatarClass(logged.user_email || "you")]}`}>
              {initials(logged.user_name || "Tú")}
            </div>
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Comparte tu respuesta…"
              />
              <div className={styles.ciFoot}>
                <span />
                <button
                  type="button"
                  className={styles.ciSend}
                  onClick={submitComment}
                  disabled={isSubmittingComment}
                >
                  {isSubmittingComment ? "Enviando…" : "Enviar"}
                </button>
              </div>
            </div>
          </div>
          {comments.map((c) => (
            <div key={c.id} className={styles.comment}>
              <div className={`${styles.avatar} ${styles[avatarClass(c.user_email || c.user_name)]}`}>
                {initials(c.user_name)}
              </div>
              <div>
                <span className={styles.name}>{c.user_name}</span>
                <span className={styles.when}>· {relTime(c.created_time)}</span>
                <p>{c.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.foroHead}>
        <div className={styles.foroSearch}>
          <span style={{ color: "#8a7d6e" }}>⌕</span>
          <input
            placeholder="Buscar por tag, autor o palabra…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span className={styles.foroSearchHint}>
            {filtered.length} DISCUSION{filtered.length === 1 ? "" : "ES"}
          </span>
        </div>
        <div className={styles.foroTabs}>
          <button
            type="button"
            className={`${styles.foroPill} ${scope === "todas" ? styles.foroPillActive : ""}`}
            aria-pressed={scope === "todas"}
            onClick={() => setScope("todas")}
          >
            Todas
          </button>
          <button
            type="button"
            className={`${styles.foroPill} ${scope === "mias" ? styles.foroPillActive : ""}`}
            aria-pressed={scope === "mias"}
            onClick={() => setScope("mias")}
          >
            Mías
          </button>
        </div>
        <button
          type="button"
          className={styles.foroNew}
          onClick={() => setShowCreate((v) => !v)}
        >
          <span style={{ fontSize: 16 }}>+</span> Nueva
        </button>
      </div>

      {showCreate && (
        <div className={styles.commentInput} style={{ marginBottom: 24 }}>
          <div className={`${styles.avatar} ${styles.avatarPink}`}>
            {initials(logged.user_name || "Tú")}
          </div>
          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título de tu discusión"
              style={{
                width: "100%",
                border: 0,
                outline: "none",
                font: "inherit",
                fontFamily: '"Geist Mono", monospace',
                fontWeight: 600,
                fontSize: 15,
                background: "transparent",
                padding: 0,
                marginBottom: 8,
                color: "#1f150b",
              }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cuéntanos qué pasa…"
            />
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="tags separados por coma (ej: bloques, sensor)"
              style={{
                width: "100%",
                border: 0,
                outline: "none",
                font: "inherit",
                fontFamily: '"Geist Mono", monospace',
                fontSize: 12,
                background: "transparent",
                padding: 0,
                marginTop: 6,
                color: "#5a4d3e",
              }}
            />
            <div className={styles.ciFoot}>
              <span />
              <button
                type="button"
                className={styles.ciSend}
                onClick={submitIssue}
                disabled={isSubmittingIssue}
              >
                {isSubmittingIssue ? "Creando…" : "Publicar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <div className={styles.empty}>Cargando…</div>}

      {!loading && filtered.length === 0 && (
        <div className={styles.empty}>
          <h4>Sin discusiones</h4>
          <p>Empezá una conversación con el botón &ldquo;+ Nueva&rdquo;.</p>
        </div>
      )}

      <div className={styles.discList}>
        {filtered.map((it) => (
          <button
            type="button"
            key={it.id}
            className={styles.disc}
            onClick={() => fetchIssueDetail(it.id)}
          >
            <div className={`${styles.avatar} ${styles[avatarClass(it.author_email || it.author_name)]}`}>
              {initials(it.author_name)}
            </div>
            <div className={styles.discBody}>
              <h4>{it.title}</h4>
              <div className={styles.discMeta}>
                Por <b>{it.author_name}</b> · {relTime(it.created_time)}
              </div>
              {(it.tags || []).length > 0 && (
                <div className={styles.discTags}>
                  {(it.tags || []).map((t, i) => (
                    <span key={i} className={styles.chip}>{t}</span>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.discSide}>
              <span className={styles.replies}>↳ ver hilo</span>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
