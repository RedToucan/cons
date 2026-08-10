import { posts as allPosts } from "content";
import { cache } from "react";

const redirectedPostSlugs = new Set([
  "where-does-campus-anger-come-from",
]);

export const posts = allPosts.filter(
  (post) => !redirectedPostSlugs.has(post.slug)
);

export const getPosts = cache(() => {
  return posts;
});

