import type { Metadata } from "next";
import Link from "next/link";
import HomeModeTabs from "@/components/HomeModeTabs";
import PostArchiveList from "@/components/PostArchiveList";
import { categoryDefinitions } from "@/data/categories";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "전체 사색 아카이브 | 아르고스의 노트",
  description: "아르고스의 노트에 실린 철학, 심리학, 정치, 문화와 인물 비평 에세이 전체를 둘러봅니다.",
  alternates: {
    canonical: "/archive",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ArchivePage() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div>
      <HomeModeTabs active="archive" postCount={posts.length} />

      <header className="index-page-header">
        <p className="index-page-kicker">Archive</p>
        <h1>전체 사색 아카이브</h1>
        <p>
          아르고스의 노트에 기록한 총 {posts.length}편의 글을 최근 발행 순서로 모았습니다.
          관심 있는 분야를 선택하거나 전체 목록을 따라가며 읽을 수 있습니다.
        </p>
      </header>

      <nav className="category-directory" aria-label="분야별 글">
        {categoryDefinitions.map((category) => {
          const count = posts.filter(
            (post) => post.category.toLowerCase() === category.value.toLowerCase(),
          ).length;

          if (count === 0) {
            return null;
          }

          return (
            <Link key={category.slug} href={`/categories/${category.slug}`}>
              <span>{category.label}</span>
              <small>{count}편</small>
            </Link>
          );
        })}
      </nav>

      <section className="post-index-section">
        <div className="post-index-heading">
          <h2>모든 글</h2>
          <span>{sortedPosts.length}편</span>
        </div>
        <PostArchiveList items={sortedPosts} />
      </section>
    </div>
  );
}
