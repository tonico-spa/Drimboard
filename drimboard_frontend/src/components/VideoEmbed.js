const VideoEmbed = ({ videoUrl, styles }) => {

    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getDriveId = (url) => {
        const match = url.match(/\/file\/d\/([^/]+)/);
        return match ? match[1] : null;
    };

    const isYouTube = /youtu\.be|youtube\.com/.test(videoUrl);
    const isDrive = /drive\.google\.com/.test(videoUrl);
    if (isYouTube) {
        const videoId = getYouTubeId(videoUrl);
        if (!videoId) return <div>Invalid YouTube URL</div>;
        return (
            <div className={styles.container}>
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className={styles.iframe}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video"
                />
            </div>
        );
    }

    if (isDrive) {
        const fileId = getDriveId(videoUrl);
        if (!fileId) return <div>Invalid Google Drive URL</div>;
        return (
            <div className={styles.container}>
                <iframe
                    src={`https://drive.google.com/file/d/${fileId}/preview`}
                    className={styles.iframe}
                    allow="autoplay"
                    allowFullScreen
                    title="Google Drive video"
                />
            </div>
        );
    }

    return <div>Unsupported video URL</div>;
};

export default VideoEmbed