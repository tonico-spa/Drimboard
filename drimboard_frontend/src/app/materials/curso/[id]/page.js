"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { client } from "../../../../lib/sanity";
import styles from "../../../../styles/Materiales.module.css";
import MaterialsSingleCourse from "@/components/materials/MaterialSingleCourse";

const groq = String.raw;

const CONTENT_TYPE_BY_TYPE = {
  actividades: "actividades",
  videos: "videos",
  pdf_document: "documents",
};

export default function MaterialsCursoPage() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const query = groq`
      *[_id == $id][0]{
        _id,
        _type,
        title,
        "pdfFile": pdfFile.asset->url,
        youtubeUrls,
        description,
        "coverImage": coverImage.asset->url,
        publishedAt
      }
    `;
    client
      .fetch(query, { id })
      .then((data) => {
        if (!data) {
          setNotFound(true);
          return;
        }
        setCourse({
          ...data,
          contentType: CONTENT_TYPE_BY_TYPE[data._type] || data._type,
        });
      })
      .catch((err) => {
        console.error("Error loading course:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const wrapStyle = {
    minHeight: "100vh",
    background: "var(--paper)",
    paddingTop: 116,
  };
  const innerStyle = {
    maxWidth: 1240,
    margin: "0 auto",
    padding: "clamp(24px,4vw,44px) clamp(20px,5vw,40px) 96px",
  };

  if (loading) {
    return (
      <div className={styles.matRoot} style={wrapStyle}>
        <div style={innerStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "4rem",
              color: "#8a7d6e",
              fontFamily: '"Geist Mono", monospace',
            }}
          >
            Cargando curso...
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !course) {
    return (
      <div className={styles.matRoot} style={wrapStyle}>
        <div style={innerStyle}>
          <div className={styles.empty}>
            <h4>Curso no encontrado</h4>
            <p>Probá volver al material para elegir otro.</p>
            <button
              type="button"
              onClick={() => router.push("/materials/cursos")}
              className={styles.backBtn}
              style={{ marginTop: 16 }}
            >
              ← Volver al material
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.matRoot} style={wrapStyle}>
      <div style={innerStyle}>
        <MaterialsSingleCourse course={course} />
      </div>
    </div>
  );
}
