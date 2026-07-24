import { MetadataRoute } from "next";
import { posts } from "@/lib/posts";

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
    ...postEntries,
  ];
}
