"use client";
import { useMemo } from "react";
import useAppStore from '@/store/useAppStore';
import { capitalizeWords } from "@/utils/utils";

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

const TYPE_TO_DISPLAY = {
    actividades: 'actividad',
    documents: 'documento',
    videos: 'video',
};

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
                {!cover && (
                    <div className="cover-glyph"><Glyph type={contentType} /></div>
                )}
            </div>
            <div className="course-body">
                <h4 className="course-title">{element.title}</h4>
                <div className="course-meta">
                    <span>Drim · drim</span>
                </div>
            </div>
        </button>
    );
}

const MaterialsMain = () => {
    const logged = useAppStore((state) => state.logged);
    const actividades = useAppStore((state) => state.actividades);
    const videos = useAppStore((state) => state.videos);
    const documents = useAppStore((state) => state.documents);
    const setOpenMaterialCourse = useAppStore((s) => s.setOpenMaterialCourse);

    const byPublishedDesc = (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt);

    const recentMaterials = useMemo(() => {
        const all = [
            ...actividades.map((i) => ({ ...i, contentType: 'actividades' })),
            ...videos.map((i) => ({ ...i, contentType: 'videos' })),
            ...documents.map((i) => ({ ...i, contentType: 'documents' })),
        ];
        return [...all].sort(byPublishedDesc).slice(0, 3);
    }, [actividades, videos, documents]);

    const recentActividades = useMemo(() => {
        const shown = new Set(recentMaterials.map((m) => m._id));
        return [...actividades]
            .sort(byPublishedDesc)
            .filter((a) => !shown.has(a._id))
            .slice(0, 4);
    }, [actividades, recentMaterials]);

    const continueItem = recentMaterials[0];

    const open = (element, contentType) => {
        setOpenMaterialCourse({ ...element, open: true, contentType });
    };

    const greetingName = capitalizeWords(logged?.user_name)?.split(' ')[0] || '';

    return (
        <>
            <div className="welcome">
                <div>
                    <h1 className="mat-greet">
                        Bienvenid@{greetingName ? <> <span className="you">{greetingName}</span></> : ''} <span className="wave">👋</span>
                    </h1>
                    <p className="mat-sub">
                        Tu mundo, tus reglas. Tienes <b>{actividades.length}</b> actividades disponibles ·
                        <b> {documents.length}</b> documentos · <b>{videos.length}</b> videos.
                    </p>
                </div>
                <div className="stat-cluster">
                    <div className="stat" data-tone="pink">
                        <span className="k">Actividades</span>
                        <span className="v">{actividades.length}</span>
                    </div>
                    <div className="stat" data-tone="yellow">
                        <span className="k">Documentos</span>
                        <span className="v">{documents.length}</span>
                    </div>
                    <div className="stat" data-tone="green">
                        <span className="k">Videos</span>
                        <span className="v">{videos.length}</span>
                    </div>
                </div>
            </div>

            {continueItem && (
                <button
                    type="button"
                    className="continue"
                    onClick={() => open(continueItem, continueItem.contentType)}
                    aria-label={`Abrir ${continueItem.title}`}
                >
                    <div
                        className="continue-cover"
                        style={continueItem.coverImage ? { backgroundImage: `url(${continueItem.coverImage})` } : undefined}
                    >
                        {!continueItem.coverImage && (
                            <div className="glyph"><Glyph type={continueItem.contentType} /></div>
                        )}
                    </div>
                    <div className="continue-body">
                        <span className="eyebrow">Material reciente</span>
                        <h2>{continueItem.title}</h2>
                        <p>{continueItem.description || 'Empieza con el material más reciente. Aprende jugando con tu drim.'}</p>
                        <div className="continue-meta">
                            <span>{TYPE_TO_DISPLAY[continueItem.contentType] || continueItem.contentType}</span>
                            <span>· nuevo</span>
                        </div>
                    </div>
                    <span className="continue-cta">Abrir →</span>
                </button>
            )}

            {recentMaterials.length > 0 && (
                <section className="mat-section">
                    <div className="mat-section-head">
                        <h3><span className="swatch" style={{ background: 'var(--ink)' }} />Visto recientemente</h3>
                    </div>
                    <div className="mat-grid">
                        {recentMaterials.map((c) => (
                            <CourseCard key={c._id} element={c} contentType={c.contentType} onOpen={open} />
                        ))}
                    </div>
                </section>
            )}

            {recentActividades.length > 0 && (
                <section className="mat-section">
                    <div className="mat-section-head">
                        <h3><span className="swatch" style={{ background: 'var(--pink)' }} />Sugeridas para ti</h3>
                    </div>
                    <div className="mat-grid">
                        {recentActividades.map((c) => (
                            <CourseCard key={c._id} element={c} contentType="actividades" onOpen={open} />
                        ))}
                    </div>
                </section>
            )}
        </>
    );
};

export default MaterialsMain;
