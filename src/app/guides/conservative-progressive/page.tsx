import type { Metadata } from "next";
import Link from "next/link";
import HomeModeTabs from "@/components/HomeModeTabs";
import { conservativeProgressiveGuide } from "@/data/readingGuides";
import { getCategoryLabel } from "@/data/categories";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "보수와 진보는 무엇이 다른가 | 읽기 가이드",
  description: conservativeProgressiveGuide.description,
  alternates: {
    canonical: "/guides/conservative-progressive",
  },
  openGraph: {
    title: "보수와 진보는 무엇이 다른가 | 읽기 가이드",
    description: conservativeProgressiveGuide.description,
    url: "/guides/conservative-progressive",
    type: "article",
  },
};

const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

export default function ConservativeProgressiveGuidePage() {
  return (
    <div>
      <HomeModeTabs active="guide" postCount={posts.length} />

      <header className="guide-hero">
        <p className="guide-kicker">{conservativeProgressiveGuide.kicker}</p>
        <h1>{conservativeProgressiveGuide.title}</h1>
        <p className="guide-lead">{conservativeProgressiveGuide.description}</p>

        <nav className="guide-chapter-nav" aria-label="읽기 가이드 목차">
          {conservativeProgressiveGuide.chapters.map((chapter) => (
            <Link key={chapter.id} href={`#${chapter.id}`}>
              <span>{chapter.number}</span>
              {chapter.title}
            </Link>
          ))}
        </nav>
      </header>

      <aside className="guide-note">
        <span aria-hidden="true">i</span>
        <p>
          이 가이드는 보수와 진보를 고정된 두 종류의 인간으로 나누지 않습니다. 연구에서 나타난 집단 평균의 경향과 그 한계를 먼저 살피고, 서로 다른 가치가 실제 판단에서 어떻게 작동하는지 읽기 위한 순서입니다.
        </p>
      </aside>

      <div className="guide-chapters">
        {conservativeProgressiveGuide.chapters.map((chapter) => (
          <section key={chapter.id} id={chapter.id} className="guide-chapter">
            <div className="guide-chapter-heading">
              <p>{chapter.number}</p>
              <h2>{chapter.title}</h2>
              <span>{chapter.description}</span>
            </div>

            <ol className="guide-reading-list">
              {chapter.slugs.map((slug, index) => {
                const post = postsBySlug.get(slug);

                if (!post) {
                  return null;
                }

                return (
                  <li key={slug} className="guide-reading-item">
                    <span className="guide-item-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="guide-item-content">
                      <p className="guide-item-meta">
                        {getCategoryLabel(post.category)}
                        {post.metadata?.readingTime && ` · 약 ${Math.round(post.metadata.readingTime)}분`}
                      </p>
                      <h3>
                        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                      </h3>
                      {post.description && <p>{post.description}</p>}
                    </div>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="guide-item-arrow"
                      aria-label={`${post.title} 읽기`}
                    >
                      →
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
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
