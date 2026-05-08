"use client";
import { useMemo, useState } from "react";
import useAppStore from '@/store/useAppStore';

function Glyph({ type }) {
    if (type === 'actividades') {
        return (
            <svg className="g" viewBox="0 0 64 64" fill="none">
                <rect x="6"  y="22" width="22" height="22" rx="4" fill="#fff" stroke="#1f150b" strokeWidth="2.5" />
                <rect x="20" y="8"  width="22" height="22" rx="4" fill="#F397C1" stroke="#1f150b" strokeWidth="2.5" />
                <rect x="34" y="22" width="22" height="22" rx="4" fill="#fff" stroke="#1f150b" strokeWidth="2.5" />
                <rect x="20" y="36" width="22" height="22" rx="4" fill="#fff" stroke="#1f150b" strokeWidth="2.5" />
            </svg>
        );
    }
    if (type === 'documents') {
        return (
            <svg className="g" viewBox="0 0 64 64" fill="none">
                <path d="M14 8 H40 L52 20 V56 H14 Z" fill="#fff" stroke="#1f150b" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M40 8 V20 H52" fill="none" stroke="#1f150b" strokeWidth="2.5" strokeLinejoin="round" />
                <line x1="22" y1="32" x2="44" y2="32" stroke="#1f150b" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="22" y1="40" x2="44" y2="40" stroke="#1f150b" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="22" y1="48" x2="36" y2="48" stroke="#1f150b" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        );
    }
    return (
        <svg className="g" viewBox="0 0 64 64" fill="none">
            <rect x="6" y="10" width="52" height="44" rx="8" fill="#fff" stroke="#1f150b" strokeWidth="2.5" />
            <path d="M26 22 L42 32 L26 42 Z" fill="#1f150b" />
        </svg>
    );
}

const TYPE_TO_DISPLAY = { actividades: 'actividad', documents: 'documento', videos: 'video' };

function CourseCard({ element, contentType, onOpen }) {
    const type = TYPE_TO_DISPLAY[contentType] || contentType;
    const cover = element.coverImage;
    return (
        <button
            type="button"
            className="course"
            data-type={type}
            onClick={() => onOpen(element, contentType)}
        >
            <div
                className={`course-cover ${cover ? 'has-image' : ''}`}
                style={cover ? { backgroundImage: `url(${cover})` } : undefined}
            >
                <span className="course-tag">{type}</span>
                {!cover && (<div className="cover-glyph"><Glyph type={contentType} /></div>)}
            </div>
            <div className="course-body">
                <h4 className="course-title">{element.title}</h4>
                <div className="course-meta"><span>drim</span></div>
            </div>
        </button>
    );
}

const MaterialsCourses = () => {
    const actividades = useAppStore((state) => state.actividades);
    const videos = useAppStore((state) => state.videos);
    const documents = useAppStore((state) => state.documents);
    const setOpenMaterialCourse = useAppStore((s) => s.setOpenMaterialCourse);

    const [filter, setFilter] = useState('todos');
    const [q, setQ] = useState('');

    const open = (element, contentType) => {
        setOpenMaterialCourse({ ...element, open: true, contentType });
    };

    const matchQuery = (item) => !q.trim() || (item.title || '').toLowerCase().includes(q.toLowerCase());

    const filteredActividades = useMemo(() => actividades.filter(matchQuery), [actividades, q]);
    const filteredDocumentos = useMemo(() => documents.filter(matchQuery), [documents, q]);
    const filteredVideos = useMemo(() => videos.filter(matchQuery), [videos, q]);

    const showActividades = (filter === 'todos' || filter === 'actividades') && filteredActividades.length > 0;
    const showDocumentos = (filter === 'todos' || filter === 'documents') && filteredDocumentos.length > 0;
    const showVideos = (filter === 'todos' || filter === 'videos') && filteredVideos.length > 0;
    const empty = !showActividades && !showDocumentos && !showVideos;

    return (
        <>
            <div className="mat-toolbar">
                <div className="chip-row">
                    <button type="button" className="fchip" aria-pressed={filter === 'todos'} onClick={() => setFilter('todos')}>
                        Todo <span className="n">{actividades.length + documents.length + videos.length}</span>
                    </button>
                    <button type="button" className="fchip" aria-pressed={filter === 'actividades'} onClick={() => setFilter('actividades')}>
                        <span className="swatch" style={{ background: 'var(--pink)' }} /> Actividades <span className="n">{actividades.length}</span>
                    </button>
                    <button type="button" className="fchip" aria-pressed={filter === 'documents'} onClick={() => setFilter('documents')}>
                        <span className="swatch" style={{ background: 'var(--yellow)' }} /> Documentos <span className="n">{documents.length}</span>
                    </button>
                    <button type="button" className="fchip" aria-pressed={filter === 'videos'} onClick={() => setFilter('videos')}>
                        <span className="swatch" style={{ background: 'var(--green)' }} /> Videos <span className="n">{videos.length}</span>
                    </button>
                </div>
                <div className="mat-search">
                    <span style={{ color: 'var(--t3)' }}>⌕</span>
                    <input placeholder="Buscar por título…" value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
            </div>

            {showActividades && (
                <section className="mat-section">
                    <div className="mat-section-head">
                        <h3>
                            <span className="swatch" style={{ background: 'var(--pink)' }} />
                            Actividades
                            <span className="count-pill">{filteredActividades.length}</span>
                        </h3>
                        {filter === 'todos' && filteredActividades.length > 4 && (
                            <button type="button" className="more" onClick={() => setFilter('actividades')}>Ver todas →</button>
                        )}
                    </div>
                    <div className="mat-grid">
                        {(filter === 'todos' ? filteredActividades.slice(0, 4) : filteredActividades).map((c) => (
                            <CourseCard key={c._id} element={c} contentType="actividades" onOpen={open} />
                        ))}
                    </div>
                </section>
            )}

            {showDocumentos && (
                <section className="mat-section">
                    <div className="mat-section-head">
                        <h3>
                            <span className="swatch" style={{ background: 'var(--yellow)' }} />
                            Documentos
                            <span className="count-pill">{filteredDocumentos.length}</span>
                        </h3>
                        {filter === 'todos' && filteredDocumentos.length > 4 && (
                            <button type="button" className="more" onClick={() => setFilter('documents')}>Ver todos →</button>
                        )}
                    </div>
                    <div className="mat-grid">
                        {(filter === 'todos' ? filteredDocumentos.slice(0, 4) : filteredDocumentos).map((c) => (
                            <CourseCard key={c._id} element={c} contentType="documents" onOpen={open} />
                        ))}
                    </div>
                </section>
            )}

            {showVideos && (
                <section className="mat-section">
                    <div className="mat-section-head">
                        <h3>
                            <span className="swatch" style={{ background: 'var(--green)' }} />
                            Videos
                            <span className="count-pill">{filteredVideos.length}</span>
                        </h3>
                        {filter === 'todos' && filteredVideos.length > 4 && (
                            <button type="button" className="more" onClick={() => setFilter('videos')}>Ver todos →</button>
                        )}
                    </div>
                    <div className="mat-grid">
                        {(filter === 'todos' ? filteredVideos.slice(0, 4) : filteredVideos).map((c) => (
                            <CourseCard key={c._id} element={c} contentType="videos" onOpen={open} />
                        ))}
                    </div>
                </section>
            )}

            {empty && (
                <div className="empty">
                    <h4>Sin resultados</h4>
                    <p>Probá con otra palabra o cambiá el filtro.</p>
                </div>
            )}
        </>
    );
};

export default MaterialsCourses;
