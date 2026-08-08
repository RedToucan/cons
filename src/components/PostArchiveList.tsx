import Link from "next/link";
import { posts } from "@/lib/posts";
import { getCategoryHref, getCategoryLabel } from "@/data/categories";

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
      {items.map((post) => (
        <li key={post.slug} className="post-index-item">
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
        </li>
      ))}
    </ol>
  );
}
