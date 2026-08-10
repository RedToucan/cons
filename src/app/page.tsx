import { posts } from '@/lib/posts';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import HomeContent, { PostItemMeta } from '@/components/HomeContent';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  const postMeta: PostItemMeta[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    subcategory: p.subcategory,
    tags: p.tags,
    featured: p.featured,
    order: p.order,
    author: p.author,
    description: p.description,
    cover: p.cover,
    metadata: {
      readingTime: p.metadata?.readingTime,
    },
  }));

  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <HomeContent allPosts={postMeta} />
    </Suspense>
  );
}
