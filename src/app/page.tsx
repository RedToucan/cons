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
  humanism: "인본주의",
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
  anger: "분노",
  charity: "자선",
  drug: "마약",
  happiness: "행복",
  honest: "정직",
  barbrastreisand: "바브라 스트라이샌드",
  soros: "조지 소로스",
  pelosi: "낸시 펠로시",
  elainechao: "일레인 차오",
  angelachao: "앤절라 차오",
  mcconnell: "미치 매코널",
  machinepolitics: "기계정치",
  chomsky: "노암 촘스키",
  psychology: "심리학",
};


export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const categoryFilter = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
  const subcategoryFilter = typeof resolvedSearchParams.subcategory === "string" ? resolvedSearchParams.subcategory : undefined;
  const tagFilter = typeof resolvedSearchParams.tag === "string" ? resolvedSearchParams.tag : undefined;
  const modeFilter = typeof resolvedSearchParams.mode === "string" ? resolvedSearchParams.mode : undefined;

  const isDefaultHome = !categoryFilter && !tagFilter && !subcategoryFilter && modeFilter !== "all";

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

  if (isDefaultHome) {
    // Keep only the featured posts
    const featuredList = sortedPosts.filter((p) => p.featured);

    // Sort featured posts by order ascending
    featuredList.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Capped at 10 items for the featured curation
    filteredPosts = featuredList.slice(0, 10);
  } else {
    if (categoryFilter) {
      filteredPosts = filteredPosts.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (subcategoryFilter) {
      filteredPosts = filteredPosts.filter((p) => p.subcategory && p.subcategory.toLowerCase() === subcategoryFilter.toLowerCase());
    }
    if (tagFilter) {
      filteredPosts = filteredPosts.filter((p) => p.tags && p.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase()));
    }
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

  // The first post of the list is featured (Only on default home curation)
  const featuredPost = isDefaultHome ? filteredPosts[0] : undefined;
  const gridPosts = isDefaultHome ? filteredPosts.slice(1) : filteredPosts;

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
      {/* All Posts Section Title */}
      {/* Archive Mode Switcher Tabs (Show under top navigation bar) */}
      {!categoryFilter && !tagFilter && (
        <div className="archive-mode-tabs" style={{ display: "flex", gap: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "0.75rem", marginBottom: "2rem", marginTop: "0.5rem" }}>
          <Link 
            href="/" 
            className={`nav-link-tab ${isDefaultHome ? 'active' : ''}`}
            style={{ 
              fontFamily: "var(--font-serif)", 
              fontSize: "1.1rem", 
              paddingBottom: "0.75rem", 
              borderBottom: isDefaultHome ? "2px solid var(--brand-navy)" : "none", 
              color: isDefaultHome ? "var(--brand-navy)" : "var(--text-muted)",
              fontWeight: isDefaultHome ? "bold" : "normal",
              textDecoration: "none"
            }}
          >
            추천 사색
          </Link>
          <Link 
            href="/?mode=all" 
            className={`nav-link-tab ${modeFilter === "all" ? 'active' : ''}`}
            style={{ 
              fontFamily: "var(--font-serif)", 
              fontSize: "1.1rem", 
              paddingBottom: "0.75rem", 
              borderBottom: modeFilter === "all" ? "2px solid var(--brand-navy)" : "none", 
              color: modeFilter === "all" ? "var(--brand-navy)" : "var(--text-muted)",
              fontWeight: modeFilter === "all" ? "bold" : "normal",
              textDecoration: "none"
            }}
          >
            전체 사색 아카이브 ({sortedPosts.length}편)
          </Link>
        </div>
      )}

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
            {categoryFilter ? "이 카테고리의 다른 사색" : (isDefaultHome ? "주요 사색" : "전체 사색 아카이브")}
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

      {/* Explore All Posts Banner on Default Home */}
      {isDefaultHome && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3.5rem 2rem",
          margin: "3rem 0 5rem 0",
          backgroundColor: "var(--bg-secondary)",
          border: "1px dashed var(--border-color)",
          borderRadius: "8px",
          textAlign: "center"
        }}>
          <h4 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.5rem",
            color: "var(--brand-navy)",
            marginBottom: "1rem"
          }}>
            보수주의자의 정원 서재 전체 탐색하기
          </h4>
          <p style={{
            color: "var(--text-muted)",
            fontSize: "0.95rem",
            maxWidth: "600px",
            marginBottom: "2rem",
            lineHeight: "1.7"
          }}>
            철학, 심리학, 인물 비평, 문화 분석 등 정원사 헤론이 기록해 온 총 {sortedPosts.length}편의 모든 사색 에세이를 연대기 순으로 만나보실 수 있습니다.
          </p>
          <Link href="/?mode=all" className="read-more-btn" style={{
            fontSize: "1.1rem",
            padding: "0.25rem 0.5rem",
            borderBottomWidth: "3px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            cursor: "pointer"
          }}>
            전체 글 아카이브 보기 ({sortedPosts.length}편) →
          </Link>
        </div>
      )}
    </div>
  );
}
