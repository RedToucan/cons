import Image from "next/image";
import Link from "next/link";
import { posts } from "@/lib/posts";
import { getCategoryLabel } from "@/data/categories";
import { getPostCoverImage } from "@/lib/getCoverImage";

const postsBySlug = new Map(posts.map((post) => [post.slug, post]));

export default function GuideItem({ slug }: { slug: string }) {
  const post = postsBySlug.get(slug);

  if (!post) {
    return null;
  }

  const cover = getPostCoverImage(post);

  return (
    <li className="guide-reading-item">
      <Link
        href={`/posts/${post.slug}`}
        className={`guide-item-cover ${cover ? "" : "guide-item-cover-empty"}`}
        aria-label={`${post.title} 읽기`}
      >
        {cover && (
          <Image
            src={cover}
            alt=""
            width={320}
            height={180}
            sizes="(max-width: 700px) 105px, 140px"
          />
        )}
        <span aria-hidden="true" />
      </Link>
      <div className="guide-item-content">
        <p className="guide-item-meta">
          {getCategoryLabel(post.category)}
          {post.metadata?.readingTime && ` · 약 ${Math.round(post.metadata.readingTime)}분`}
        </p>
        <h3>
          <Link href={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.description && <p>{post.description}</p>}
      </div>
      <Link
        href={`/posts/${post.slug}`}
        className="guide-item-arrow"
        aria-label={`${post.title} 읽기`}
      >
        →
      </Link>
    </li>
  );
}
