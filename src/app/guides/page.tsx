import type { Metadata } from "next";
import Link from "next/link";
import HomeModeTabs from "@/components/HomeModeTabs";
import { readingGuides } from "@/lib/guides";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "읽기 가이드 | 아르고스의 노트",
  description:
    "주제별로 글을 순서대로 읽을 수 있는 큐레이션 가이드입니다. 처음이라면 '아르고스의 노트를 처음 읽는다면'부터 시작하세요.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "읽기 가이드 | 아르고스의 노트",
    description:
      "주제별로 글을 순서대로 읽을 수 있는 큐레이션 가이드입니다.",
    url: "/guides",
    type: "website",
  },
};

export default function GuidesIndexPage() {
  return (
    <div>
      <HomeModeTabs active="guide" postCount={posts.length} />

      <header className="guide-hero">
        <p className="guide-kicker">읽기 가이드</p>
        <h1>순서대로 읽기</h1>
        <p className="guide-lead">
          366편의 글을 어디서부터 읽을지 막막하다면, 주제별로 엮은 아래 가이드를 따라가 보세요.
          처음이라면 <strong>아르고스의 노트를 처음 읽는다면</strong>부터 권합니다.
        </p>
      </header>

      <ol className="guides-index">
        {readingGuides.map((guide) => {
          const postCount = guide.slugs.length;

          return (
            <li key={guide.slug}>
              <Link href={`/guides/${guide.slug}`}>
                <p className="guides-index-kicker">{guide.kicker}</p>
                <h2>{guide.title}</h2>
                <p className="guides-index-desc">{guide.description}</p>
                <p className="guides-index-meta">
                  {guide.chapters.length}개 장 · 글 {postCount}편
                </p>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
