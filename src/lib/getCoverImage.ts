export function getPostCoverImage(post: { slug: string; path?: string; cover?: string }): string | undefined {
  return post.cover || undefined;
}

