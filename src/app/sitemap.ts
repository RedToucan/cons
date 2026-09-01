import { MetadataRoute } from "next";
import { posts } from "@/lib/posts";
import { categoryDefinitions } from "@/data/categories";

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://argosnotes.com").replace(/\/+$/, "");
  const latestPostUpdate = posts.reduce(
    (latest, post) => {
      const updated = new Date(post.updated);
      return updated > latest ? updated : latest;
    },
    new Date(0)
  );

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/posts/${post.slug}`,
    lastModified: new Date(post.updated),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categoryDefinitions
    .map((category) => {
      const categoryPosts = posts.filter(
        (post) => post.category.toLowerCase() === category.value.toLowerCase(),
      );

      if (categoryPosts.length === 0) {
        return null;
      }

      const categoryLastModified = categoryPosts.reduce((latest, post) => {
        const updated = new Date(post.updated);
        return updated > latest ? updated : latest;
      }, new Date(0));

      return {
        url: `${siteUrl}/categories/${category.slug}`,
        lastModified: categoryLastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return [
    {
      url: siteUrl,
      lastModified: latestPostUpdate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/archive`,
      lastModified: latestPostUpdate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/guides/conservative-progressive`,
      lastModified: latestPostUpdate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...categoryEntries,
    ...postEntries,
  ];
}
