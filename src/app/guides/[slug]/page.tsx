import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HomeModeTabs from "@/components/HomeModeTabs";
import MdxContent from "@/components/mdx-content";
import GuideChapter from "@/components/guide/GuideChapter";
import GuideItem from "@/components/guide/GuideItem";
import { getReadingGuide, readingGuides } from "@/lib/guides";
import { posts } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

const guideComponents = {
  GuideChapter,
  GuideItem,
} as unknown as Record<string, React.ComponentType<Record<string, unknown>>>;

export const dynamicParams = false;

export function generateStaticParams() {
  return readingGuides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getReadingGuide(slug);

  if (!guide) {
    return {
      title: "읽기 가이드를 찾을 수 없습니다 | 아르고스의 노트",
      robots: { index: false, follow: false },
    };
  }

  const title = `${guide.title} | 읽기 가이드`;

  return {
    title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      title,
      description: guide.description,
      url: `/guides/${guide.slug}`,
      type: "article",
    },
  };
}

export default async function ReadingGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getReadingGuide(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div>
      <HomeModeTabs active="guide" postCount={posts.length} />

      <header className="guide-hero">
        <p className="guide-kicker">{guide.kicker}</p>
        <h1>{guide.title}</h1>
        <p className="guide-lead">{guide.description}</p>

        {guide.chapters.length > 0 && (
          <nav className="guide-chapter-nav" aria-label="읽기 가이드 목차">
            {guide.chapters.map((chapter) => (
              <Link key={chapter.id} href={`#${chapter.id}`}>
                <span>{chapter.number}</span>
                {chapter.title}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {guide.note && (
        <aside className="guide-note">
          <span aria-hidden="true">i</span>
          <p>{guide.note}</p>
        </aside>
      )}

      <div className="guide-chapters">
        <MdxContent code={guide.content} components={guideComponents} />
      </div>

      <div className="guide-footer-cta">
        <p>순서와 관계없이 더 많은 글을 둘러보고 싶다면</p>
        <Link href="/archive" className="read-more-btn">
          전체 사색 아카이브 보기 →
        </Link>
      </div>
    </div>
  );
}
