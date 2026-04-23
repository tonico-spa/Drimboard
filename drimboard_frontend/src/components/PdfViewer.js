"use client";
import { useState } from 'react';
import styles from '../styles/PdfViewer.module.css';

const PdfViewer = ({ pdfUrl }) => {
    const [zoom, setZoom] = useState(100);

    const zoomIn  = () => setZoom(z => Math.min(z + 25, 300));
    const zoomOut = () => setZoom(z => Math.max(z - 25, 50));

    return (
        <div className={styles.wrapper}>
            <div className={styles.toolbar}>
                <button className={styles.zoomBtn} onClick={zoomOut} title="Zoom out">−</button>
                <span className={styles.zoomLabel}>{zoom}%</span>
                <button className={styles.zoomBtn} onClick={zoomIn} title="Zoom in">+</button>
            </div>
            <iframe
                key={zoom}
                src={`${pdfUrl}#toolbar=0&zoom=${zoom}`}
                className={styles.pdfFrame}
                title="PDF viewer"
            />
        </div>
    );
};

export default PdfViewer;
