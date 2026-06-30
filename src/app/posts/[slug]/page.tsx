import { posts } from "content";
import { notFound } from "next/navigation";
import Link from "next/link";
import MdxContent from "@/components/mdx-content";
import fs from "fs";
import path from "path";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) {
    return {
      title: "글을 찾을 수 없습니다 | 아르고스의 노트",
    };
  }
  return {
    title: `${post.title} | 아르고스의 노트`,
    description: post.description || `${post.author}의 ${post.category} 에세이.`,
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

  // JSON-LD Structured Data for Google Blog/Article Recognition
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://heron-conserv.vercel.app";
  let imageUrl: string | undefined = undefined;
  const extensions = ["webp", "png", "jpg", "jpeg"];
  for (const ext of extensions) {
    if (fs.existsSync(path.join(process.cwd(), "public", "images", `${post.slug}.${ext}`))) {
      imageUrl = `${siteUrl}/images/${post.slug}.${ext}`;
      break;
    }
  }

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
    "dateModified": new Date(post.date).toISOString(),
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

  return (
    <article className="post-container">
      {/* Inject JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="post-header">
        <span className="category-tag">{post.category}</span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          글쓴이: <span>{post.author}</span> — 발행일: {formattedDate}
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

      <Link href="/" className="back-to-home">
        ← 정원 첫 화면으로 돌아가기
      </Link>
    </article>
  );
}
