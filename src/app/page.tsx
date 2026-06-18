import { posts } from "content";
import Link from "next/link";
import Image from "next/image";
import fs from "fs";
import path from "path";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Props = {
  searchParams: SearchParams;
};

const categoryMap: { [key: string]: string } = {
  philosophy: "철학",
  history: "역사",
  culture: "문화",
  lifestyle: "생활",
};

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const categoryFilter = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;

  // Sort posts by date descending and check for cover images
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).map((post) => {
    const hasCover = fs.existsSync(
      path.join(process.cwd(), "public", "images", `${post.slug}.webp`)
    );
    return {
      ...post,
      cover: hasCover ? `/images/${post.slug}.webp` : undefined,
    };
  });

  // Filter posts if category filter is specified
  const filteredPosts = categoryFilter
    ? sortedPosts.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase())
    : sortedPosts;

  const categoryDisplayName = categoryFilter
    ? (categoryMap[categoryFilter.toLowerCase()] || categoryFilter)
    : undefined;

  if (filteredPosts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <h2 className="grid-section-title" style={{ borderBottom: "none" }}>등록된 글이 없습니다</h2>
        <p>현재 "{categoryDisplayName}" 카테고리에 작성된 에세이가 없습니다.</p>
        <Link href="/" className="back-to-home" style={{ marginTop: "2rem" }}>
          ← 첫 화면으로 돌아가기
        </Link>
      </div>
    );
  }

  // The first post of the list is featured
  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  // Format date utility
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Category Section Title if filtering */}
      {categoryFilter && (
        <h2 className="grid-section-title">
          카테고리: {categoryDisplayName}
        </h2>
      )}

      {/* Featured Hero Article */}
      {!categoryFilter && featuredPost && (
        <section className="featured-hero">
          {featuredPost.cover && (
            <div className="featured-image-wrapper">
              <Image
                src={featuredPost.cover}
                alt={featuredPost.title}
                width={1200}
                height={675}
                className="featured-image"
                priority
              />
            </div>
          )}
          <div className="featured-content" style={featuredPost.cover ? {} : { gridColumn: "1 / -1" }}>
            <span className="category-tag">{categoryMap[featuredPost.category.toLowerCase()] || featuredPost.category}</span>
            <h2 className="featured-title">
              <Link href={`/posts/${featuredPost.slug}`}>
                {featuredPost.title}
              </Link>
            </h2>
            <div className="meta-line">
              <span>글쓴이: {featuredPost.author}</span>
              <span>{formatDate(featuredPost.date)}</span>
              {featuredPost.metadata?.readingTime && (
                <span>읽는 시간: 약 {Math.round(featuredPost.metadata.readingTime)}분</span>
              )}
            </div>
            {featuredPost.description && (
              <p className="excerpt">{featuredPost.description}</p>
            )}
            <Link href={`/posts/${featuredPost.slug}`} className="read-more-btn">
              에세이 읽기
            </Link>
          </div>
        </section>
      )}

      {/* If category filter is active, we treat the first post as part of the grid list, or show it differently */}
      {categoryFilter && featuredPost && (
        <section className="featured-hero" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "2.5rem" }}>
          {featuredPost.cover && (
            <div className="featured-image-wrapper">
              <Image
                src={featuredPost.cover}
                alt={featuredPost.title}
                width={1200}
                height={675}
                className="featured-image"
                priority
              />
            </div>
          )}
          <div className="featured-content" style={featuredPost.cover ? {} : { gridColumn: "1 / -1" }}>
            <span className="category-tag">{categoryMap[featuredPost.category.toLowerCase()] || featuredPost.category}</span>
            <h2 className="featured-title">
              <Link href={`/posts/${featuredPost.slug}`}>
                {featuredPost.title}
              </Link>
            </h2>
            <div className="meta-line">
              <span>글쓴이: {featuredPost.author}</span>
              <span>{formatDate(featuredPost.date)}</span>
              {featuredPost.metadata?.readingTime && (
                <span>읽는 시간: 약 {Math.round(featuredPost.metadata.readingTime)}분</span>
              )}
            </div>
            {featuredPost.description && (
              <p className="excerpt">{featuredPost.description}</p>
            )}
            <Link href={`/posts/${featuredPost.slug}`} className="read-more-btn">
              에세이 읽기
            </Link>
          </div>
        </section>
      )}

      {/* Article Grid */}
      {gridPosts.length > 0 && (
        <section style={{ marginTop: "2rem" }}>
          <h3 className="grid-section-title">
            {categoryFilter ? "이 카테고리의 다른 사색" : "최근 등록된 사색"}
          </h3>
          <div className="article-grid">
            {gridPosts.map((post) => (
              <article key={post.slug} className="article-card">
                {post.cover && (
                  <div className="card-image-wrapper">
                    <Image
                      src={post.cover}
                      alt={post.title}
                      width={600}
                      height={337}
                      className="card-image"
                    />
                  </div>
                )}
                <div className="article-card-content">
                  <span className="category-tag">{categoryMap[post.category.toLowerCase()] || post.category}</span>
                  <h4 className="card-title">
                    <Link href={`/posts/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h4>
                  <div className="meta-line" style={{ fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                    <span>{formatDate(post.date)}</span>
                    <span>{post.author}</span>
                  </div>
                  {post.description && (
                    <p className="card-excerpt">{post.description}</p>
                  )}
                  <Link href={`/posts/${post.slug}`} className="read-more-btn" style={{ fontSize: "0.9rem", alignSelf: "flex-start" }}>
                    에세이 읽기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
