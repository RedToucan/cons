'use client';

interface YouTubeProps {
  id?: string;
  url?: string;
  title?: string;
}

export default function YouTube({ id, url, title = 'YouTube video player' }: YouTubeProps) {
  let videoId = id;
  if (!videoId && url) {
    // Extract ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
  }

  if (!videoId) {
    return (
      <div 
        style={{ 
          padding: '1rem', 
          border: '1px solid #ef4444', 
          borderRadius: '8px', 
          color: '#ef4444', 
          backgroundColor: '#fef2f2',
          margin: '1rem 0'
        }}
      >
        YouTube Video ID or URL is missing or invalid.
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div
      className="youtube-container"
      style={{
        position: 'relative',
        paddingBottom: '56.25%', // 16:9 aspect ratio
        height: 0,
        overflow: 'hidden',
        maxWidth: '100%',
        background: '#000',
        borderRadius: '12px',
        margin: '1.5rem 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
    >
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '12px',
        }}
      />
    </div>
  );
}
