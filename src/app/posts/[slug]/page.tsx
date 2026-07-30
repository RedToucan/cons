import { posts } from "@/lib/posts";
import { getPostCoverImage } from "@/lib/getCoverImage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import MdxContent from "@/components/mdx-content";
import fs from "fs";
import path from "path";

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
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: "글을 찾을 수 없습니다 | 아르고스의 노트",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://argosnotes.com").replace(/\/+$/, "");
  const coverRelative = getPostCoverImage(post);
  const imageUrl = coverRelative ? `${siteUrl}${coverRelative}` : undefined;

  const title = `${post.title} | 아르고스의 노트`;
  const description = post.description || `${post.author}의 ${post.category} 에세이.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/posts/${post.slug}`,
      siteName: "아르고스의 노트",
      locale: "ko_KR",
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      modifiedTime: new Date(post.updated).toISOString(),
      authors: [post.author],
      images: imageUrl ? [{ url: imageUrl, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Format the date beautifully
  const formattedDate = new Date(post.date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedUpdatedDate = new Date(post.updated).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // JSON-LD Structured Data for Google Blog/Article Recognition
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://argosnotes.com").replace(/\/+$/, "");
  const coverRelative = getPostCoverImage(post);
  const imageUrl = coverRelative ? `${siteUrl}${coverRelative}` : undefined;

  const categoryKorean = categoryMap[post.category.toLowerCase()] || post.category;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/posts/${post.slug}`,
    },
    "headline": post.title,
    "description": post.description || `${post.author}의 ${post.category} 에세이.`,
    "image": imageUrl ? [imageUrl] : undefined,
    "datePublished": new Date(post.date).toISOString(),
    "dateModified": new Date(post.updated).toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": `${siteUrl}/about`,
    },
    "publisher": {
      "@type": "Organization",
      "name": "아르고스의 노트",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/favicon.ico`,
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": siteUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": categoryKorean,
        "item": `${siteUrl}/?category=${encodeURIComponent(post.category)}`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `${siteUrl}/posts/${post.slug}`,
      },
    ],
  };

  return (
    <article className="post-container">
      {/* Inject JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="post-header">
        <span className="category-tag">
          {categoryMap[post.category.toLowerCase()] || post.category}
          {post.subcategory && ` > ${subcategoryMap[post.subcategory.toLowerCase()] || post.subcategory}`}
        </span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          글쓴이: <span>{post.author}</span> — 발행일: {formattedDate} — 최종 수정일: {formattedUpdatedDate}
          {post.metadata?.readingTime && (
            <> • 읽는 시간: 약 {Math.round(post.metadata.readingTime)}분</>
          )}
        </div>
      </header>

      <hr className="editorial-hr" />

      {post.description && (
        <p className="excerpt text-center" style={{ maxWidth: "700px", margin: "0 auto 2.5rem auto" }}>
          {post.description}
        </p>
      )}

      <div className="post-body">
        <MdxContent code={post.content} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div style={{ marginTop: "3rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>관련 태그:</span>
          <div className="tag-list">
            {post.tags.map(tag => (
              <Link key={tag} href={`/?tag=${tag}`} rel="nofollow" className="tag-badge">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link href="/" className="back-to-home">
        ← 정원 첫 화면으로 돌아가기
      </Link>
    </article>
  );
}
