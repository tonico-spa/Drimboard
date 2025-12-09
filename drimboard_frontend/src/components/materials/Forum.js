"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import useAppStore from '@/store/useAppStore';
import styles from "../../styles/Forum.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function Forum() {
    const logged = useAppStore((s) => s.logged || {});
    const storeIssues = useAppStore((s) => s.issues);
    const setStoreIssues = useAppStore((s) => s.setIssues);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [tagFilter, setTagFilter] = useState("");

    useEffect(() => {
        // if we have cached issues in the store, use them to avoid refetching
        if (storeIssues && storeIssues.length > 0) {
            setIssues(storeIssues);
        } else {
            fetchIssues();
        }
    }, []);

    const fetchIssues = async (tag = null) => {
        setLoading(true);
        try {
            const url = tag ? `${API_URL}/issues?tag=${encodeURIComponent(tag)}` : `${API_URL}/issues`;
            const res = await axios.get(url);
            setIssues(res.data || []);
            // cache full list in store when not filtering
            if (!tag) setStoreIssues(res.data || []);
        } catch (err) {
            console.error("Error fetching issues", err);
        } finally {
            setLoading(false);
        }
    }

    const openCreate = () => {
        setTitle("");
        setDescription("");
        setShowCreate(true);
    }

    const submitIssue = async () => {
        if (!title) return;
        try {
            const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
            const payload = {
                title,
                description,
                tags: tagsArray,
                author_name: logged.user_name || 'Anon',
                author_email: logged.user_email || 'anon@example.com'
            };
            const res = await axios.post(`${API_URL}/issues`, payload);
            setShowCreate(false);
            const created = res.data;
            // update store cache by prepending new issue
            const newList = [created, ...(storeIssues || [])];
            setStoreIssues(newList);
            setIssues(newList);
            setSelectedIssue(created);
            fetchIssueDetail(created.id);
        } catch (err) {
            console.error("Error creating issue", err);
        }
    }

    const fetchIssueDetail = async (id) => {
        try {
            const res = await axios.get(`${API_URL}/issues/${id}`);
            setSelectedIssue(res.data.issue);
            setComments(res.data.comments || []);
        } catch (err) {
            console.error("Error fetching issue detail", err);
        }
    }

    const submitComment = async () => {
        if (!newComment || !selectedIssue) return;
        try {
            const payload = {
                user_name: logged.user_name || 'Anon',
                user_email: logged.user_email || 'anon@example.com',
                comment: newComment
            };
            const res = await axios.post(`${API_URL}/issues/${selectedIssue.id}/comments`, payload);
            setComments([...comments, res.data]);
            setNewComment("");
        } catch (err) {
            console.error("Error posting comment", err);
        }
    }

    const applyTagFilter = () => {
        const tag = tagFilter.trim();
        if (!tag) {
            setIssues(storeIssues || []);
            return;
        }
        // try local store first
        const filtered = (storeIssues || []).filter(it => (it.tags || []).map(t => t.toLowerCase()).includes(tag.toLowerCase()));
        if (filtered.length > 0) {
            setIssues(filtered);
            return;
        }
        // fallback to server-side filter
        fetchIssues(tag);
    }

    return (
        <div className={styles.forumContainer}>
            <div className={styles.header}>
                {!selectedIssue && (
                    <div className={styles.controlGroup}>

                        <button className={`${styles.button} ${styles.primary}`} onClick={openCreate}>+</button>
                        <div>
                            <button className={`${styles.button} ${styles.secondary}`} onClick={() => fetchIssues()}>⟲</button>
                            <input placeholder="Filtrar por tag" className={styles.input} value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} style={{ width: 200 }} />
                            <button className={`${styles.button} ${styles.secondary}`} onClick={applyTagFilter}>Buscar</button>
                        </div>
                    </div>
                )}
                {selectedIssue && (
                    <button className={styles.backButton} onClick={() => { setSelectedIssue(null); fetchIssues(); }}>Volver</button>
                )}
            </div>

            {showCreate && !selectedIssue && (
                <div className={styles.createForm}>
                    <button className={`${styles.button} ${styles.close}`} onClick={() => setShowCreate(false)} style={{ marginLeft: 8 }}>x</button>
                    <h3 className={styles.forumTitle}>Nueva discusión</h3>
                    <div>
                        <label className={styles.forumLabel}>Título</label><br />
                        <input className={styles.formInput} value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <label className={styles.forumLabel}>Descripción</label><br />
                        <textarea className={styles.formTextarea} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <label className={styles.forumLabel}>Tags (separados por coma)</label><br />
                        <input className={styles.formInput} value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="ej: bug, pregunta" />
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <button className={`${styles.button} ${styles.secondary}`} onClick={submitIssue}>Crear</button>
                    </div>
                </div>
            )}

            {!selectedIssue && (
                <div className={styles.col}>
                    <h3 className={styles.forumTitle}>Discusiones</h3>
                    {loading && <div className={styles.empty}>Cargando...</div>}
                    {!loading && issues.length === 0 && <div className={styles.empty}>No hay discusiones aún.</div>}
                    <ul className={styles.issuesList}>
                        {issues.map((it) => (
                            <li key={it.id} className={styles.issueCard} onClick={() => fetchIssueDetail(it.id)}>
                                <div>
                                    <div className={styles.issueTitle}>{it.title}</div>
                                    <div style={{ marginTop: 6 }}>
                                        {(it.tags || []).map((t, idx) => (
                                            <span key={idx} className={styles.tagChip}>{t}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.issueMeta}>Por {it.author_name} • {new Date(it.created_time).toLocaleString()}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedIssue && (
                <div className={styles.issueDetail}>
                    <div className={styles.issueHeader}>
                        <h2 >{selectedIssue.title}</h2>
                        <div className={styles.issueMeta}>{selectedIssue.author_name} • {new Date(selectedIssue.created_time).toLocaleString()}</div>
                    </div>

                    <div className={styles.issueDescription} >{selectedIssue.description}</div>
                    <div style={{ marginTop: 6 }}>
                        {(selectedIssue.tags || []).map((t, idx) => (
                            <span key={idx} className={styles.tagChip}>{t}</span>
                        ))}
                    </div>
                    <div className={styles.commentsList}>
                        <h4>Comentarios</h4>
                        <div>
                            {comments.map(c => (
                                <div key={c.id} className={styles.commentCard}>
                                    <div className={styles.commentHeader}>
                                        <div className={styles.commentAuthor}>{c.user_name}</div>
                                        <div className={styles.issueMeta}>{new Date(c.created_time).toLocaleString()}</div>

                                    </div>

                                    <div className={styles.commentText}>{c.comment}</div>
                                </div>
                            ))}
                        </div>


                    </div>
                    <div className={styles.newCommentSection}>
                        <h4 >Nuevo comentario</h4>
                        <textarea className={styles.textarea} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe un comentario" />
                        <div style={{ marginTop: 8 }}>
                            <button className={`${styles.button} ${styles.secondary}`} onClick={submitComment}>Enviar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
