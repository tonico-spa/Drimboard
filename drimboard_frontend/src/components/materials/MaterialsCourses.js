"use client";

import { useMemo, useState } from "react";
import styles from "../../styles/Materiales.module.css";
import useAppStore from "@/store/useAppStore";
import CourseCard from "./CourseCard";

const FILTERS = [
  { id: "todos", label: "Todo", tone: null },
  { id: "actividades", label: "Actividades", tone: "#F397C1" },
  { id: "documents", label: "Documentos", tone: "#FFB71A" },
  { id: "videos", label: "Videos", tone: "#53C68E" },
];

const MaterialsCourses = () => {
  const actividades = useAppStore((s) => s.actividades);
  const videos = useAppStore((s) => s.videos);
  const documents = useAppStore((s) => s.documents);
  const [filter, setFilter] = useState("todos");
  const [q, setQ] = useState("");

  const matches = (item) => !q.trim() || item.title?.toLowerCase().includes(q.toLowerCase());

  const fActividades = useMemo(() => actividades.filter(matches), [actividades, q]);
  const fDocumentos = useMemo(() => documents.filter(matches), [documents, q]);
  const fVideos = useMemo(() => videos.filter(matches), [videos, q]);

  const counts = {
    todos: actividades.length + documents.length + videos.length,
    actividades: actividades.length,
    documents: documents.length,
    videos: videos.length,
  };

  const total = fActividades.length + fDocumentos.length + fVideos.length;

  return (
    <>
      <div className={styles.matToolbar}>
        <div className={styles.chipRow}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`${styles.fchip} ${filter === f.id ? styles.fchipActive : ""}`}
            >
              {f.tone && (
                <span className={styles.swatch} style={{ background: f.tone }} />
              )}
              {f.label} <span className={styles.n}>{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <div className={styles.matSearch}>
          <span style={{ color: "#8a7d6e" }}>⌕</span>
          <input
            placeholder="Buscar por título…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className={styles.kbd}>⌘K</span>
        </div>
      </div>

      {(filter === "todos" || filter === "actividades") && fActividades.length > 0 && (
        <section className={styles.matSection}>
          <div className={styles.matSectionHead}>
            <h3>
              <span className={styles.swatch} style={{ background: "#F397C1" }} />
              Actividades
              <span className={styles.countPill}>{fActividades.length}</span>
            </h3>
            {filter === "todos" && (
              <button type="button" onClick={() => setFilter("actividades")} className={styles.more}>
                Ver todas →
              </button>
            )}
          </div>
          <div className={styles.matGrid}>
            {(filter === "todos" ? fActividades.slice(0, 4) : fActividades).map((c) => (
              <CourseCard key={c._id} course={c} contentType="actividades" />
            ))}
          </div>
        </section>
      )}

      {(filter === "todos" || filter === "documents") && fDocumentos.length > 0 && (
        <section className={styles.matSection}>
          <div className={styles.matSectionHead}>
            <h3>
              <span className={styles.swatch} style={{ background: "#FFB71A" }} />
              Documentos
              <span className={styles.countPill}>{fDocumentos.length}</span>
            </h3>
            {filter === "todos" && (
              <button type="button" onClick={() => setFilter("documents")} className={styles.more}>
                Ver todos →
              </button>
            )}
          </div>
          <div className={styles.matGrid}>
            {(filter === "todos" ? fDocumentos.slice(0, 4) : fDocumentos).map((c) => (
              <CourseCard key={c._id} course={c} contentType="documents" />
            ))}
          </div>
        </section>
      )}

      {(filter === "todos" || filter === "videos") && fVideos.length > 0 && (
        <section className={styles.matSection}>
          <div className={styles.matSectionHead}>
            <h3>
              <span className={styles.swatch} style={{ background: "#53C68E" }} />
              Videos
              <span className={styles.countPill}>{fVideos.length}</span>
            </h3>
            {filter === "todos" && (
              <button type="button" onClick={() => setFilter("videos")} className={styles.more}>
                Ver todos →
              </button>
            )}
          </div>
          <div className={styles.matGrid}>
            {(filter === "todos" ? fVideos.slice(0, 4) : fVideos).map((c) => (
              <CourseCard key={c._id} course={c} contentType="videos" />
            ))}
          </div>
        </section>
      )}

      {total === 0 && (
        <div className={styles.empty}>
          <h4>Sin resultados</h4>
          <p>Probá con otra palabra o cambiá el filtro.</p>
        </div>
      )}
    </>
  );
};

export default MaterialsCourses;
