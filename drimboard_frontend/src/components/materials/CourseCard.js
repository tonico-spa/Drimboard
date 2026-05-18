"use client";

import { useRouter } from "next/navigation";
import styles from "../../styles/Materiales.module.css";
import Glyph from "./Glyph";

const TYPE_LABEL = {
  actividades: "actividad",
  documents: "documento",
  videos: "video",
};

const DATA_TYPE = {
  actividades: "actividad",
  documents: "documento",
  videos: "video",
};

export default function CourseCard({ course, contentType, onOpen }) {
  const router = useRouter();
  const ct = contentType || course.contentType;
  const tagType = DATA_TYPE[ct] || ct;
  const glyphType = TYPE_LABEL[ct] || ct;

  const handleClick = () => {
    if (onOpen) {
      onOpen(course, ct);
      return;
    }
    router.push(`/materials/curso/${course._id}`);
  };

  const cover = course.coverImage;
  const coverStyle = cover
    ? { backgroundImage: `url(${cover})` }
    : undefined;

  return (
    <button
      type="button"
      className={styles.course}
      data-type={tagType}
      onClick={handleClick}
    >
      <div
        className={`${styles.courseCover} ${cover ? styles.hasImage : ""}`}
        style={coverStyle}
      >
        <span className={styles.courseTag}>{TYPE_LABEL[ct] || ct}</span>
        {!cover && (
          <div className={styles.coverGlyph}>
            <Glyph type={glyphType} />
          </div>
        )}
      </div>
      <div className={styles.courseBody}>
        <h4 className={styles.courseTitle}>{course.title}</h4>
        <div className={styles.courseMeta}>
          {course.publishedAt && (
            <span>
              {new Date(course.publishedAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
