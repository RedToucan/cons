import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostArchiveList from "@/components/PostArchiveList";
import {
  categoryDefinitions,
  getCategoryBySlug,
} from "@/data/categories";
import { posts } from "@/lib/posts";

type Props = {
  params: Promise<{ category: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryDefinitions.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "분야를 찾을 수 없습니다 | 아르고스의 노트",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${category.label} 글 모음 | 아르고스의 노트`,
    description: category.description,
    alternates: {
      canonical: `/categories/${category.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const categoryPosts = posts
    .filter(
      (post) => post.category.toLowerCase() === category.value.toLowerCase(),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <nav className="index-breadcrumb" aria-label="현재 위치">
        <Link href="/">홈</Link>
        <span aria-hidden="true">/</span>
        <Link href="/archive">전체 아카이브</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{category.label}</span>
      </nav>

      <header className="index-page-header category-page-header">
        <p className="index-page-kicker">Category</p>
        <h1>{category.label}</h1>
        <p>{category.description}</p>
        <span className="index-page-count">총 {categoryPosts.length}편</span>
      </header>

      <nav className="category-pills" aria-label="다른 분야 보기">
        {categoryDefinitions.map((item) => (
          <Link
            key={item.slug}
            href={`/categories/${item.slug}`}
            className={item.slug === category.slug ? "active" : ""}
            aria-current={item.slug === category.slug ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <section className="post-index-section">
        <div className="post-index-heading">
          <h2>{category.label}의 글</h2>
          <span>{categoryPosts.length}편</span>
        </div>
        <PostArchiveList items={categoryPosts} showCategory={false} />
      </section>
    </div>
  );
}
