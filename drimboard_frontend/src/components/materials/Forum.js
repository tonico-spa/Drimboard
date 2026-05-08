"use client";
import { useEffect, useMemo, useState } from "react";
import useAppStore from '@/store/useAppStore';
import { api } from '@/lib/api';

const AVATAR_TONES = ['', 'green', 'yellow', 'sky', 'ink'];
const TAG_TONES = ['', 'green', 'yellow', 'sky'];

function avatarInitials(name) {
    if (!name) return '·';
    return name.trim().split(/\s+/).slice(0, 2).map((s) => s[0]).join('').toUpperCase();
}

function avatarTone(seed) {
    const s = (seed || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return AVATAR_TONES[s % AVATAR_TONES.length];
}

function tagTone(idx) {
    return TAG_TONES[idx % TAG_TONES.length];
}

function formatRelative(iso) {
    if (!iso) return '';
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return '';
    const diff = Date.now() - t;
    const m = Math.floor(diff / 60000);
    if (m < 60) return m <= 1 ? 'hace un momento' : `hace ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return h === 1 ? 'hace 1 hora' : `hace ${h} horas`;
    const d = Math.floor(h / 24);
    if (d === 1) return 'ayer';
    if (d < 7) return `hace ${d} días`;
    const w = Math.floor(d / 7);
    if (w < 5) return w === 1 ? 'hace 1 semana' : `hace ${w} semanas`;
    return new Date(iso).toLocaleDateString('es-CL');
}

export default function Forum() {
    const logged = useAppStore((s) => s.logged || {});
    const storeIssues = useAppStore((s) => s.issues);
    const setStoreIssues = useAppStore((s) => s.setIssues);

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tagsInput, setTagsInput] = useState("");
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [search, setSearch] = useState("");
    const [scope, setScope] = useState("todas");

    useEffect(() => {
        if (storeIssues && storeIssues.length > 0) {
            setIssues(storeIssues);
        } else {
            fetchIssues();
        }
    }, []);

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const res = await api.get('/issues');
            setIssues(res.data || []);
            setStoreIssues(res.data || []);
        } catch (err) {
            console.error("Error fetching issues", err);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setTitle("");
        setDescription("");
        setTagsInput("");
        setShowCreate(true);
    };

    const submitIssue = async () => {
        if (!title) return;
        try {
            const payload = {
                title,
                description,
                tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
                author_name: logged.user_name || 'Anon',
                author_email: logged.user_email || 'anon@example.com',
            };
            const res = await api.post('/issues', payload);
            setShowCreate(false);
            const newList = [res.data, ...(storeIssues || [])];
            setStoreIssues(newList);
            setIssues(newList);
            setSelectedIssue(res.data);
            fetchIssueDetail(res.data.id);
        } catch (err) {
            console.error("Error creating issue", err);
        }
    };

    const fetchIssueDetail = async (id) => {
        try {
            const res = await api.get(`/issues/${id}`);
            setSelectedIssue(res.data.issue);
            setComments(res.data.comments || []);
        } catch (err) {
            console.error("Error fetching issue detail", err);
        }
    };

    const submitComment = async () => {
        if (!newComment || !selectedIssue) return;
        try {
            const payload = {
                user_name: logged.user_name || 'Anon',
                user_email: logged.user_email || 'anon@example.com',
                comment: newComment,
            };
            const res = await api.post(`/issues/${selectedIssue.id}/comments`, payload);
            setComments([...comments, res.data]);
            setNewComment("");
        } catch (err) {
            console.error("Error posting comment", err);
        }
    };

    const filteredIssues = useMemo(() => {
        const term = search.trim().toLowerCase();
        return (issues || []).filter((it) => {
            if (scope === 'mias' && it.author_email !== logged.user_email) return false;
            if (!term) return true;
            const hay = `${it.title || ''} ${(it.tags || []).join(' ')} ${it.author_name || ''}`.toLowerCase();
            return hay.includes(term);
        });
    }, [issues, search, scope, logged.user_email]);

    if (selectedIssue) {
        return (
            <div className="course-view">
                <button type="button" className="back-btn" onClick={() => { setSelectedIssue(null); }}>
                    ← Volver al foro
                </button>
                <div className="course-hero">
                    <div>
                        <span className="badge-pill pink">discusión</span>
                        <h1>{selectedIssue.title}</h1>
                        <p>{selectedIssue.description}</p>
                        <div className="badges">
                            {(selectedIssue.tags || []).map((t, i) => (
                                <span key={i} className={`chip ${tagTone(i)}`}>{t}</span>
                            ))}
                        </div>
                    </div>
                    <aside className="course-side">
                        <h4>Discusión</h4>
                        <div className="row"><span className="k">Autor</span><span className="v">{selectedIssue.author_name}</span></div>
                        <div className="row"><span className="k">Creada</span><span className="v">{formatRelative(selectedIssue.created_time)}</span></div>
                        <div className="row"><span className="k">Comentarios</span><span className="v">{comments.length}</span></div>
                    </aside>
                </div>

                <div className="comments">
                    <h3>Comentarios <span className="n">{comments.length}</span></h3>
                    <div className="comment-input">
                        <div className="avatar">{avatarInitials(logged.user_name) || 'YO'}</div>
                        <div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
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
                    {comments.map((cm) => (
                        <div className="comment" key={cm.id}>
                            <div className={`avatar ${avatarTone(cm.user_email)}`}>{avatarInitials(cm.user_name)}</div>
                            <div>
                                <span className="name">{cm.user_name}</span>
                                <span className="when">· {formatRelative(cm.created_time)}</span>
                                <p>{cm.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="foro-head">
                <div className="foro-search">
                    <span style={{ color: 'var(--t3)' }}>⌕</span>
                    <input
                        placeholder="Buscar por palabra, autor o tag…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span style={{ fontSize: 11, color: 'var(--t3)', letterSpacing: '.1em' }}>
                        {filteredIssues.length} DISCUSIONES
                    </span>
                </div>
                <div className="foro-tabs">
                    <button type="button" className="foro-pill" aria-pressed={scope === 'todas'} onClick={() => setScope('todas')}>Todas</button>
                    <button type="button" className="foro-pill" aria-pressed={scope === 'mias'} onClick={() => setScope('mias')}>Mías</button>
                </div>
                <button type="button" className="foro-new" onClick={openCreate}>
                    <span style={{ fontSize: 16 }}>+</span> Nueva
                </button>
            </div>

            {showCreate && (
                <div className="comment-input" style={{ marginBottom: 24 }}>
                    <div className="avatar">{avatarInitials(logged.user_name) || 'YO'}</div>
                    <div>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título de la discusión"
                            style={{ width: '100%', border: 0, outline: 'none', font: 'inherit', fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 600, marginBottom: 8 }}
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe lo que te pasa, o lo que quieres compartir…"
                        />
                        <input
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="Tags separados por coma (ej: Bloques, Sensores)"
                            style={{ width: '100%', border: 0, outline: 'none', font: 'inherit', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--t2)', marginTop: 8 }}
                        />
                        <div className="ci-foot">
                            <button type="button" className="foro-pill" onClick={() => setShowCreate(false)}>Cancelar</button>
                            <button type="button" className="send" onClick={submitIssue}>Crear discusión</button>
                        </div>
                    </div>
                </div>
            )}

            {loading && <div className="empty"><h4>Cargando…</h4></div>}
            {!loading && filteredIssues.length === 0 && (
                <div className="empty">
                    <h4>No hay discusiones aún</h4>
                    <p>Sé el primero en abrir una discusión con el botón “+ Nueva”.</p>
                </div>
            )}

            <div className="disc-list">
                {filteredIssues.map((it) => (
                    <button type="button" key={it.id} className="disc" onClick={() => fetchIssueDetail(it.id)}>
                        <div className={`avatar ${avatarTone(it.author_email)}`}>{avatarInitials(it.author_name)}</div>
                        <div className="disc-body">
                            <h4>{it.title}</h4>
                            <div className="disc-meta">Por <b>{it.author_name}</b> · {formatRelative(it.created_time)}</div>
                            {(it.tags || []).length > 0 && (
                                <div className="disc-tags">
                                    {it.tags.map((t, i) => (
                                        <span key={i} className={`chip ${tagTone(i)}`}>{t}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="disc-side">
                            <span className="replies"><span className="ico">↳</span> Abrir</span>
                        </div>
                    </button>
                ))}
            </div>
        </>
    );
}
