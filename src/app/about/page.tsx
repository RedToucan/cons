import { about } from "content";
import type { Metadata } from "next";
import Link from "next/link";
import MdxContent from "@/components/mdx-content";

export const metadata: Metadata = {
  title: "블로그 소개 | 아르고스의 노트",
  description: "아르고스의 노트 블로그의 개설 취지와 가치관에 대한 소개글입니다.",
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  return (
    <div className="about-container">
      <div className="post-body">
        <MdxContent code={about.content} />
      </div>

      <hr className="editorial-hr" />

      <Link href="/" className="back-to-home">
        ← 첫 화면으로 돌아가기
      </Link>
    </div>
  );
}
