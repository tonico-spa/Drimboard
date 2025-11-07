

const VideoEmbed = ({ videoUrl, styles }) => {

    const getVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getVideoId(videoUrl);

    if (!videoId) {
        return <div>Invalid YouTube URL</div>;
    }

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

export default VideoEmbed