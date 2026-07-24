import { posts as allPosts } from "content";

const redirectedPostSlugs = new Set([
  "where-does-campus-anger-come-from",
]);

export const posts = allPosts.filter(
  (post) => !redirectedPostSlugs.has(post.slug)
);
