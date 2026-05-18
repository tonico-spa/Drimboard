"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../../styles/Materiales.module.css";
import useAppStore from "@/store/useAppStore";
import { client } from "../../../lib/sanity";

const groq = String.raw;

export default function MaterialsTabsLayout({ children }) {
  const pathname = usePathname();
  const [loadingData, setLoadingData] = useState(true);
  const { setActividades, setVideos, setDocuments } = useAppStore((s) => s);
  const actividades = useAppStore((s) => s.actividades);
  const videos = useAppStore((s) => s.videos);
  const documents = useAppStore((s) => s.documents);
  const issues = useAppStore((s) => s.issues);

  const tabsRef = useRef(null);
  const [bar, setBar] = useState({ left: 0, width: 0 });

  const tabs = [
    { href: "/materials/inicio", label: "Inicio" },
    { href: "/materials/cursos", label: "Material", count: actividades.length + videos.length + documents.length },
    { href: "/materials/foro", label: "Foro", count: issues?.length || undefined },
  ];

  useEffect(() => {
    const getActividades = async () => {
      const data = await client.fetch(groq`
        *[_type == "actividades"]{
          _id, title,
          "pdfFile": pdfFile.asset->url,
          youtubeUrls, description,
          "coverImage": coverImage.asset->url,
          publishedAt
        } | order(publishedAt desc)
      `);
      setActividades(data);
    };
    const getVideos = async () => {
      const data = await client.fetch(groq`
        *[_type == "videos"]{
          _id, title, youtubeUrls, description,
          "coverImage": coverImage.asset->url, publishedAt
        } | order(publishedAt desc)
      `);
      setVideos(data);
    };
    const getDocuments = async () => {
      const data = await client.fetch(groq`
        *[_type == "pdf_document"]{
          _id, title,
          "pdfFile": pdfFile.asset->url,
          description, "coverImage": coverImage.asset->url, publishedAt
        } | order(publishedAt desc)
      `);
      setDocuments(data);
    };
    Promise.all([getActividades(), getVideos(), getDocuments()])
      .catch((err) => console.error("Error loading materials:", err))
      .finally(() => setLoadingData(false));
  }, [setActividades, setVideos, setDocuments]);

  useEffect(() => {
    const el = tabsRef.current?.querySelector(`[data-tab="${pathname}"]`);
    if (el) setBar({ left: el.offsetLeft, width: el.offsetWidth });
  }, [pathname, loadingData, actividades.length, videos.length, documents.length, issues?.length]);

  return (
    <div className={styles.matRoot} style={{ minHeight: "100vh", background: "var(--paper)", paddingTop: 116 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(24px,4vw,44px) clamp(20px,5vw,40px) 96px" }}>
        <div className={styles.tabs} ref={tabsRef}>
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              data-tab={t.href}
              className={`${styles.tab} ${pathname === t.href ? styles.tabActive : ""}`}
            >
              {t.label}
              {t.count != null && <span className={styles.count}>{t.count}</span>}
            </Link>
          ))}
          <div className={styles.tabBar} style={{ left: bar.left, width: bar.width }} />
        </div>

        {loadingData ? (
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
            Cargando materiales...
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
