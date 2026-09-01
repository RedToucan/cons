import { posts } from "@/lib/posts";
import { getCategoryLabel } from "@/data/categories";

// Build-time static generation; the site rebuilds on every deploy, so the feed stays fresh.
export const dynamic = "force-static";

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://argosnotes.com").replace(
  /\/+$/,
  "",
);

const FEED_SIZE = 30;

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const latestPostUpdate = posts.reduce((latest, post) => {
    const updated = new Date(post.updated);
    return updated > latest ? updated : latest;
  }, new Date(0));
  const lastBuildDate =
    latestPostUpdate.getTime() > 0 ? latestPostUpdate : new Date();

  const items = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, FEED_SIZE)
    .map((post) => {
      const url = `${SITE}/posts/${post.slug}`;
      const description = post.description || `${getCategoryLabel(post.category)} 에세이`;

      return `    <item>
      <title>${esc(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>${esc(getCategoryLabel(post.category))}</category>
      <description>${esc(description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>아르고스의 노트</title>
    <link>${SITE}</link>
    <description>심리학과 경험주의로 읽는 세상</description>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
