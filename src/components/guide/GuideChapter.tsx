import type { ReactNode } from "react";

interface GuideChapterProps {
  id: string;
  number: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function GuideChapter({
  id,
  number,
  title,
  description,
  children,
}: GuideChapterProps) {
  return (
    <section id={id} className="guide-chapter">
      <div className="guide-chapter-heading">
        <p>{number}</p>
        <h2>{title}</h2>
        {description && <span>{description}</span>}
      </div>
      <ol className="guide-reading-list">{children}</ol>
    </section>
  );
}
