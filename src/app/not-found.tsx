import Link from "next/link";
import { posts } from "@/lib/posts";

const recentPosts = [...posts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3);

export default function NotFound() {
  return (
    <>
      <title>페이지를 찾을 수 없습니다 | 아르고스의 노트</title>
      <section className="not-found-page">
        <p className="not-found-code" aria-hidden="true">404</p>
        <h1>페이지를 찾을 수 없습니다</h1>
        <p className="not-found-description">
          주소가 바뀌었거나 존재하지 않는 페이지입니다. 최근 글을 읽거나 전체 아카이브에서
          원하는 글을 찾아보세요.
        </p>

        <nav className="not-found-actions" aria-label="404 페이지 이동">
          <Link href="/" className="back-to-home">첫 화면으로</Link>
          <Link href="/archive" className="back-to-home">전체 아카이브</Link>
        </nav>

        <div className="not-found-recent">
          <h2>최근 글</h2>
          <ul>
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
