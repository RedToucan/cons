'use client';

import Image from 'next/image';

interface PostImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function PostImage({ src, alt, caption, width = 1200, height = 800, priority = false }: PostImageProps) {
  return (
    <figure className="post-figure">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, 680px"
        priority={priority}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
