'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import HomeModeTabs from '@/components/HomeModeTabs';
import { getCategoryHref, getCategoryLabel } from '@/data/categories';

export interface PostItemMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  featured?: boolean;
  order?: number;
  author: string;
  description?: string;
  cover?: string;
  metadata?: {
    readingTime?: number;
  };
}

const subcategoryMap: { [key: string]: string } = {
  marriage: '결혼',
  money: '돈/자산',
  anger: '분노',
  charity: '자선',
  drug: '마약',
  happiness: '행복',
  honest: '정직',
  barbrastreisand: '바브라 스트라이샌드',
  soros: '조지 소로스',
  pelosi: '낸시 펠로시',
  elainechao: '일레인 차오',
  angelachao: '앤절라 차오',
  mcconnell: '미치 매코널',
  machinepolitics: '기계정치',
  chomsky: '노암 촘스키',
  psychology: '심리학',
  replicationcrisis: '재현성 위기',
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function HomeContent({ allPosts }: { allPosts: PostItemMeta[] }) {
  const searchParams = useSearchParams();

  const categoryFilter = searchParams.get('category') || undefined;
  const subcategoryFilter = searchParams.get('subcategory') || undefined;
  const tagFilter = searchParams.get('tag') || undefined;
  const modeFilter = searchParams.get('mode') || undefined;
  const searchFilter = searchParams.get('q') || undefined;

  const isDefaultHome = !categoryFilter && !tagFilter && !subcategoryFilter && !searchFilter && modeFilter !== 'all';

  const sortedPosts = useMemo(() => {
    return [...allPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    let result = sortedPosts;

    if (isDefaultHome) {
      const featuredList = sortedPosts.filter((p) => p.featured);
      featuredList.sort((a, b) => {
        if ((a.order ?? 0) !== (b.order ?? 0)) {
          return (a.order ?? 0) - (b.order ?? 0);
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      return featuredList.slice(0, 10);
    }

    if (categoryFilter) {
      result = result.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }
    if (subcategoryFilter) {
      result = result.filter((p) => p.subcategory && p.subcategory.toLowerCase() === subcategoryFilter.toLowerCase());
    }
    if (tagFilter) {
      result = result.filter((p) => p.tags && p.tags.some((t) => t.toLowerCase() === tagFilter.toLowerCase()));
    }
    if (searchFilter) {
      const query = searchFilter.toLowerCase().trim();
      result = result.filter((p) => {
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description ? p.description.toLowerCase().includes(query) : false;
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesSubcategory = p.subcategory ? p.subcategory.toLowerCase().includes(query) : false;
        const matchesTags = p.tags ? p.tags.some((t) => t.toLowerCase().includes(query)) : false;
        return matchesTitle || matchesDesc || matchesCategory || matchesSubcategory || matchesTags;
      });
    }

    return result;
  }, [sortedPosts, isDefaultHome, categoryFilter, subcategoryFilter, tagFilter, searchFilter]);

  const activeCategoryPosts = useMemo(() => {
    return categoryFilter
      ? sortedPosts.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase())
      : [];
  }, [categoryFilter, sortedPosts]);

  const availableSubcategories = useMemo(() => {
    return activeCategoryPosts.reduce<string[]>((acc, post) => {
      if (post.subcategory && !acc.includes(post.subcategory.toLowerCase())) {
        acc.push(post.subcategory.toLowerCase());
      }
      return acc;
    }, []);
  }, [activeCategoryPosts]);

  const categoryDisplayName = categoryFilter ? getCategoryLabel(categoryFilter) : undefined;

  if (filteredPosts.length === 0) {
    const filterText = searchFilter
      ? `검색어: "${searchFilter}"`
      : tagFilter
      ? `#${tagFilter}`
      : categoryDisplayName || '선택된';
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 className="grid-section-title" style={{ borderBottom: 'none' }}>
          등록된 글이 없습니다
        </h2>
        <p>현재 {filterText}에 부합하는 에세이가 없습니다.</p>
        <Link href="/" className="back-to-home" style={{ marginTop: '2rem' }}>
          ← 첫 화면으로 돌아가기
        </Link>
      </div>
    );
  }

  const featuredPost = isDefaultHome ? filteredPosts[0] : undefined;
  const gridPosts = isDefaultHome ? filteredPosts.slice(1) : filteredPosts;

  return (
    <div>
      {!categoryFilter && !tagFilter && !searchFilter && (
        <HomeModeTabs
          active={modeFilter === 'all' ? 'archive' : 'featured'}
          postCount={sortedPosts.length}
        />
      )}

      {(categoryFilter || tagFilter || searchFilter) && (
        <div
          className="filter-header"
          style={{
            marginBottom: '2rem',
            borderBottom: '2px solid var(--border-color)',
            paddingBottom: '1.5rem',
          }}
        >
          <h2
            className="grid-section-title"
            style={{ borderBottom: 'none', marginBottom: '0.5rem', paddingBottom: 0 }}
          >
            {searchFilter
              ? `검색 결과: "${searchFilter}"`
              : tagFilter
              ? `태그: #${tagFilter}`
              : `카테고리: ${categoryDisplayName}`}
            {subcategoryFilter && ` > ${subcategoryMap[subcategoryFilter.toLowerCase()] || subcategoryFilter}`}
            {searchFilter && (
              <span
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 'normal',
                  color: 'var(--text-muted)',
                  marginLeft: '0.75rem',
                }}
              >
                ({filteredPosts.length}편)
              </span>
            )}
          </h2>
          {(tagFilter || subcategoryFilter || searchFilter) && (
            <Link
              href="/"
              className="back-to-home"
              style={{ fontSize: '0.9rem', display: 'inline-block', marginTop: '0.5rem' }}
            >
              ← 전체 글 보기
            </Link>
          )}
        </div>
      )}

      {categoryFilter && availableSubcategories.length > 0 && (
        <div className="subcategory-tabs">
          <Link
            href={`/?category=${categoryFilter}`}
            rel="nofollow"
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
                rel="nofollow"
                className={`subcategory-tab ${isActive ? 'active' : ''}`}
              >
                {displayName}
              </Link>
            );
          })}
        </div>
      )}

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
          <div className="featured-content" style={featuredPost.cover ? {} : { gridColumn: '1 / -1' }}>
            <Link href={getCategoryHref(featuredPost.category)} className="category-tag">
              {getCategoryLabel(featuredPost.category)}
              {featuredPost.subcategory &&
                ` > ${subcategoryMap[featuredPost.subcategory.toLowerCase()] || featuredPost.subcategory}`}
            </Link>
            <h2 className="featured-title">
              <Link href={`/posts/${featuredPost.slug}`}>{featuredPost.title}</Link>
            </h2>
            <div className="meta-line">
              <span>글쓴이: {featuredPost.author}</span>
              <span>{formatDate(featuredPost.date)}</span>
              {featuredPost.metadata?.readingTime && (
                <span>읽는 시간: 약 {Math.round(featuredPost.metadata.readingTime)}분</span>
              )}
            </div>
            {featuredPost.description && <p className="excerpt">{featuredPost.description}</p>}
            {featuredPost.tags && featuredPost.tags.length > 0 && (
              <div className="tag-list" style={{ marginBottom: '1.25rem' }}>
                {featuredPost.tags.map((tag) => (
                  <Link key={tag} href={`/?tag=${tag}`} rel="nofollow" className="tag-badge">
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

      {categoryFilter && featuredPost && (
        <section
          className="featured-hero"
          style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2.5rem' }}
        >
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
          <div className="featured-content" style={featuredPost.cover ? {} : { gridColumn: '1 / -1' }}>
            <Link href={getCategoryHref(featuredPost.category)} className="category-tag">
              {getCategoryLabel(featuredPost.category)}
              {featuredPost.subcategory &&
                ` > ${subcategoryMap[featuredPost.subcategory.toLowerCase()] || featuredPost.subcategory}`}
            </Link>
            <h2 className="featured-title">
              <Link href={`/posts/${featuredPost.slug}`}>{featuredPost.title}</Link>
            </h2>
            <div className="meta-line">
              <span>글쓴이: {featuredPost.author}</span>
              <span>{formatDate(featuredPost.date)}</span>
              {featuredPost.metadata?.readingTime && (
                <span>읽는 시간: 약 {Math.round(featuredPost.metadata.readingTime)}분</span>
              )}
            </div>
            {featuredPost.description && <p className="excerpt">{featuredPost.description}</p>}
            {featuredPost.tags && featuredPost.tags.length > 0 && (
              <div className="tag-list" style={{ marginBottom: '1.25rem' }}>
                {featuredPost.tags.map((tag) => (
                  <Link key={tag} href={`/?tag=${tag}`} rel="nofollow" className="tag-badge">
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

      {gridPosts.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h3 className="grid-section-title">
            {searchFilter
              ? '검색 결과 에세이'
              : categoryFilter
              ? '이 카테고리의 다른 사색'
              : isDefaultHome
              ? '주요 사색'
              : '전체 사색 아카이브'}
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
                  <Link href={getCategoryHref(post.category)} className="category-tag">
                    {getCategoryLabel(post.category)}
                    {post.subcategory &&
                      ` > ${subcategoryMap[post.subcategory.toLowerCase()] || post.subcategory}`}
                  </Link>
                  <h4 className="card-title">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <div className="meta-line" style={{ fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                    <span>{formatDate(post.date)}</span>
                    <span>{post.author}</span>
                  </div>
                  {post.description && <p className="card-excerpt">{post.description}</p>}
                  {post.tags && post.tags.length > 0 && (
                    <div className="tag-list" style={{ marginBottom: '1rem' }}>
                      {post.tags.map((tag) => (
                        <Link key={tag} href={`/?tag=${tag}`} rel="nofollow" className="tag-badge">
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/posts/${post.slug}`}
                    className="read-more-btn"
                    style={{ fontSize: '0.9rem', alignSelf: 'flex-start' }}
                  >
                    에세이 읽기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {isDefaultHome && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3.5rem 2rem',
            margin: '3rem 0 5rem 0',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px dashed var(--border-color)',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <h4
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              color: 'var(--brand-navy)',
              marginBottom: '1rem',
            }}
          >
            아르고스의 노트 전체 탐색하기
          </h4>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.95rem',
              maxWidth: '600px',
              marginBottom: '2rem',
              lineHeight: '1.7',
            }}
          >
            철학, 심리학, 인물 비평, 문화 분석 등 헤론이 기록해 온 총 {sortedPosts.length}편의 모든 사색
            에세이를 연대기 순으로 만나보실 수 있습니다.
          </p>
          <Link
            href="/archive"
            className="read-more-btn"
            style={{
              fontSize: '1.1rem',
              padding: '0.25rem 0.5rem',
              borderBottomWidth: '3px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
            }}
          >
            전체 글 아카이브 보기 ({sortedPosts.length}편) →
          </Link>
        </div>
      )}
    </div>
  );
}
