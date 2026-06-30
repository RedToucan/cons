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
  psychology: "심리학",
  politics: "정치",
  history: "역사",
  culture: "문화",
  lifestyle: "생활",
  influencer: "인물 비평",
};

const subcategoryMap: { [key: string]: string } = {
  marriage: "결혼",
  money: "돈/자산",
  babrastraisand: "바브라 스트라이샌드",
  soros: "조지 소로스",
  pelosi: "낸시 펠로시",
  elainechao: "일레인 차오",
  angelachao: "앤절라 차오",
};

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const categoryFilter = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
  const subcategoryFilter = typeof resolvedSearchParams.subcategory === "string" ? resolvedSearchParams.subcategory : undefined;
  const tagFilter = typeof resolvedSearchParams.tag === "string" ? resolvedSearchParams.tag : undefined;

  // Sort posts by date descending and check for cover images
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ).map((post) => {
    let cover: string | undefined = undefined;
    const extensions = ["webp", "png", "jpg", "jpeg"];
    for (const ext of extensions) {
      if (fs.existsSync(path.join(process.cwd(), "public", "images", `${post.slug}.${ext}`))) {
        cover = `/images/${post.slug}.${ext}`;
        break;
      }
    }
    return {
      ...post,
      cover,
    };
  });

  // Filter posts based on query params
  let filteredPosts = sortedPosts;

  if (categoryFilter) {
    filteredPosts = filteredPosts.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  if (subcategoryFilter) {
    filteredPosts = filteredPosts.filter((p) => p.subcategory && p.subcategory.toLowerCase() === subcategoryFilter.toLowerCase());
  }

  if (tagFilter) {
    filteredPosts = filteredPosts.filter((p) => p.tags && p.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase()));
  }

  // Extract unique subcategories for the active category
  const activeCategoryPosts = categoryFilter
    ? sortedPosts.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase())
    : [];

  const availableSubcategories = activeCategoryPosts.reduce<string[]>((acc, post) => {
    if (post.subcategory && !acc.includes(post.subcategory.toLowerCase())) {
      acc.push(post.subcategory.toLowerCase());
    }
    return acc;
  }, []);

  const categoryDisplayName = categoryFilter
    ? (categoryMap[categoryFilter.toLowerCase()] || categoryFilter)
    : undefined;

  if (filteredPosts.length === 0) {
    const filterText = tagFilter ? `#${tagFilter}` : (categoryDisplayName || "선택된");
    return (
      <div style={{ textAlign: "center", padding: "4rem 0" }}>
        <h2 className="grid-section-title" style={{ borderBottom: "none" }}>등록된 글이 없습니다</h2>
        <p>현재 "{filterText}" 필터에 부합하는 에세이가 없습니다.</p>
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
      {/* Category or Tag Section Title */}
      {(categoryFilter || tagFilter) && (
        <div className="filter-header" style={{ marginBottom: "2rem", borderBottom: "2px solid var(--border-color)", paddingBottom: "1.5rem" }}>
          <h2 className="grid-section-title" style={{ borderBottom: "none", marginBottom: "0.5rem", paddingBottom: 0 }}>
            {tagFilter ? `태그: #${tagFilter}` : `카테고리: ${categoryDisplayName}`}
            {subcategoryFilter && ` > ${subcategoryMap[subcategoryFilter.toLowerCase()] || subcategoryFilter}`}
          </h2>
          {(tagFilter || subcategoryFilter) && (
            <Link href="/" className="back-to-home" style={{ fontSize: "0.9rem", display: "inline-block", marginTop: "0.5rem" }}>
              ← 전체 글 보기
            </Link>
          )}
        </div>
      )}

      {/* Subcategory Tabs */}
      {categoryFilter && availableSubcategories.length > 0 && (
        <div className="subcategory-tabs">
          <Link 
            href={`/?category=${categoryFilter}`} 
            className={`subcategory-tab ${!subcategoryFilter ? 'active' : ''}`}
          >
            전체
          </Link>
          {availableSubcategories.map((sub) => {
            const isActive = subcategoryFilter?.toLowerCase() === sub;
            const displayName = subcategoryMap[sub] || sub;
            return (
              <Link 
                key={sub}
                href={`/?category=${categoryFilter}&subcategory=${sub}`}
                className={`subcategory-tab ${isActive ? 'active' : ''}`}
              >
                {displayName}
              </Link>
            );
          })}
        </div>
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
            <span className="category-tag">
              {categoryMap[featuredPost.category.toLowerCase()] || featuredPost.category}
              {featuredPost.subcategory && ` > ${subcategoryMap[featuredPost.subcategory.toLowerCase()] || featuredPost.subcategory}`}
            </span>
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
            {featuredPost.tags && featuredPost.tags.length > 0 && (
              <div className="tag-list" style={{ marginBottom: "1.25rem" }}>
                {featuredPost.tags.map(tag => (
                  <Link key={tag} href={`/?tag=${tag}`} className="tag-badge">
                    #{tag}
                  </Link>
                ))}
              </div>
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
            <span className="category-tag">
              {categoryMap[featuredPost.category.toLowerCase()] || featuredPost.category}
              {featuredPost.subcategory && ` > ${subcategoryMap[featuredPost.subcategory.toLowerCase()] || featuredPost.subcategory}`}
            </span>
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
            {featuredPost.tags && featuredPost.tags.length > 0 && (
              <div className="tag-list" style={{ marginBottom: "1.25rem" }}>
                {featuredPost.tags.map(tag => (
                  <Link key={tag} href={`/?tag=${tag}`} className="tag-badge">
                    #{tag}
                  </Link>
                ))}
              </div>
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
                  <span className="category-tag">
                    {categoryMap[post.category.toLowerCase()] || post.category}
                    {post.subcategory && ` > ${subcategoryMap[post.subcategory.toLowerCase()] || post.subcategory}`}
                  </span>
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
                  {post.tags && post.tags.length > 0 && (
                    <div className="tag-list" style={{ marginBottom: "1rem" }}>
                      {post.tags.map(tag => (
                        <Link key={tag} href={`/?tag=${tag}`} className="tag-badge">
                          #{tag}
                        </Link>
                      ))}
                    </div>
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
