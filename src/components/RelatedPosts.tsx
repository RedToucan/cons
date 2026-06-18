import Link from 'next/link';
import { posts } from 'content';

interface RelatedPostsProps {
  slugs: string[];
}

export default function RelatedPosts({ slugs }: RelatedPostsProps) {
  if (!slugs || slugs.length === 0) return null;

  // Filter posts matching the slugs provided
  const related = posts.filter((post) => slugs.includes(post.slug || ''));

  if (related.length === 0) return null;

  return (
    <div className="related-posts-section" style={{ margin: '3rem auto', maxWidth: '100%' }}>
      <h4 style={{ 
        fontFamily: 'var(--font-serif)', 
        fontSize: '1.2rem', 
        marginBottom: '1.25rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        color: 'var(--brand-navy)',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.5rem'
      }}>
        연관 글 읽기
      </h4>
      <div style={{
        display: 'grid',
        gridTemplateColumns: related.length > 1 ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
        gap: '1.5rem',
        marginTop: '1rem'
      }}>
        {related.map((post) => {
          const formattedDate = new Date(post.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="article-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="category-tag" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>{post.category}</span>
              <h5 className="card-title" style={{ fontSize: '1.2rem', margin: '0.25rem 0 0.5rem 0', fontFamily: 'var(--font-serif)' }}>
                {post.title}
              </h5>
              {post.description && (
                <p className="card-excerpt" style={{ fontSize: '0.85rem', lineHeight: '1.5', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  {post.description}
                </p>
              )}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto' }}>
                {formattedDate} {post.metadata?.readingTime && `• 약 ${Math.round(post.metadata.readingTime)}분`}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
