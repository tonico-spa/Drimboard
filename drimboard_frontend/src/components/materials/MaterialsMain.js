"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../styles/Materiales.module.css";
import useAppStore from "@/store/useAppStore";
import { capitalizeWords } from "@/utils/utils";
import Glyph from "./Glyph";
import CourseCard from "./CourseCard";

const MaterialsMain = () => {
  const router = useRouter();
  const logged = useAppStore((s) => s.logged);
  const actividades = useAppStore((s) => s.actividades);
  const videos = useAppStore((s) => s.videos);
  const documents = useAppStore((s) => s.documents);

  const recentMaterials = useMemo(() => {
    const all = [
      ...actividades.map((a) => ({ ...a, contentType: "actividades" })),
      ...videos.map((v) => ({ ...v, contentType: "videos" })),
      ...documents.map((d) => ({ ...d, contentType: "documents" })),
    ];
    return all
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 4);
  }, [actividades, videos, documents]);

  const featured = useMemo(() => {
    const pool = [
      ...actividades.slice(0, 2).map((a) => ({ ...a, contentType: "actividades" })),
      ...documents.slice(0, 1).map((d) => ({ ...d, contentType: "documents" })),
      ...videos.slice(0, 1).map((v) => ({ ...v, contentType: "videos" })),
    ];
    return pool.slice(0, 4);
  }, [actividades, videos, documents]);

  const continueCourse = actividades[0];
  const userName = logged?.user_name ? capitalizeWords(logged.user_name).split(" ")[0] : "Maker";

  return (
    <>
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.matGreet}>
            Bienvenid@ <span className={styles.you}>{userName}</span>{" "}
            <span className={styles.wave} role="img" aria-label="hola">👋</span>
          </h1>
          <p className={styles.matSub}>
            Tu mundo, tus reglas. Hay <b>{actividades.length}</b> actividades,{" "}
            <b>{documents.length}</b> documentos y <b>{videos.length}</b> videos esperándote.
          </p>
        </div>
        <div className={styles.statCluster}>
          <div className={`${styles.stat} ${styles.statPink}`}>
            <span className={styles.k}>Actividades</span>
            <span className={styles.v}>{actividades.length}</span>
          </div>
          <div className={`${styles.stat} ${styles.statYellow}`}>
            <span className={styles.k}>Documentos</span>
            <span className={styles.v}>{documents.length}</span>
          </div>
          <div className={`${styles.stat} ${styles.statGreen}`}>
            <span className={styles.k}>Videos</span>
            <span className={styles.v}>{videos.length}</span>
          </div>
        </div>
      </div>

      {continueCourse && (
        <button
          type="button"
          className={styles.continue}
          onClick={() => router.push(`/materials/curso/${continueCourse._id}`)}
          aria-label={`Abrir ${continueCourse.title}`}
        >
          <div
            className={styles.continueCover}
            style={continueCourse.coverImage ? { backgroundImage: `url(${continueCourse.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
          >
            {!continueCourse.coverImage && (
              <div className={styles.continueGlyph}>
                <Glyph type="actividad" />
              </div>
            )}
          </div>
          <div className={styles.continueBody}>
            <span className={styles.eyebrow}>Empezá por aquí</span>
            <h2>{continueCourse.title}</h2>
            <p>
              {continueCourse.description?.slice(0, 180) ||
                "Programá tu drim y desbloqueá tu primer proyecto. Sin instalar nada, sin cables: solo tu drim y tus ideas."}
            </p>
            <div className={styles.continueMeta}>
              <span>Actividad</span>
              {continueCourse.publishedAt && (
                <span>
                  · {new Date(continueCourse.publishedAt).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              )}
            </div>
          </div>
          <span
            className={styles.continueCta}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/materials/curso/${continueCourse._id}`);
            }}
          >
            Abrir →
          </span>
        </button>
      )}

      <section className={styles.matSection}>
        <div className={styles.matSectionHead}>
          <h3>
            <span className={styles.swatch} style={{ background: "#1f150b" }} />
            Visto recientemente
          </h3>
          <Link href="/materials/cursos" className={styles.more}>
            Ver todo →
          </Link>
        </div>
        <div className={styles.matGrid}>
          {recentMaterials.map((c) => (
            <CourseCard key={c._id} course={c} contentType={c.contentType} />
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className={styles.matSection}>
          <div className={styles.matSectionHead}>
            <h3>
              <span className={styles.swatch} style={{ background: "#F397C1" }} />
              Sugeridas para vos
            </h3>
            <Link href="/materials/cursos" className={styles.more}>
              Ver todas →
            </Link>
          </div>
          <div className={styles.matGrid}>
            {featured.map((c) => (
              <CourseCard key={c._id} course={c} contentType={c.contentType} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default MaterialsMain;
