import { about } from "content";
import Link from "next/link";
import MdxContent from "@/components/mdx-content";

export const metadata = {
  title: "블로그 소개 | argos's notes",
  description: "argos's notes 블로그의 개설 취지와 가치관에 대한 소개글입니다.",
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

