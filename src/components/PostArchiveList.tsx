import Image from "next/image";
import Link from "next/link";
import { posts } from "@/lib/posts";
import { getCategoryHref, getCategoryLabel } from "@/data/categories";
import { getPostCoverImage } from "@/lib/getCoverImage";

type Post = (typeof posts)[number];

type PostArchiveListProps = {
  items: Post[];
  showCategory?: boolean;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostArchiveList({
  items,
  showCategory = true,
}: PostArchiveListProps) {
  return (
    <ol className="post-index-list">
      {items.map((post) => {
        const cover = getPostCoverImage(post);

        return (
          <li
            key={post.slug}
            className={`post-index-item ${cover ? "" : "post-index-item-without-cover"}`}
          >
            {cover && (
              <Link
                href={`/posts/${post.slug}`}
                className="post-index-cover"
                aria-label={`${post.title} 읽기`}
              >
                <Image
                  src={cover}
                  alt=""
                  width={360}
                  height={203}
                  sizes="(max-width: 650px) 112px, 180px"
                />
              </Link>
            )}
            <div className="post-index-content">
              <div className="post-index-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {showCategory && (
                  <Link href={getCategoryHref(post.category)}>
                    {getCategoryLabel(post.category)}
                  </Link>
                )}
              </div>
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.description && <p>{post.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
