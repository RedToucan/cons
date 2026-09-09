import { guides } from "content";

export type Guide = (typeof guides)[number];
export type GuideChapter = Guide["chapters"][number];

export const readingGuides: Guide[] = [...guides].sort((a, b) =>
  a.kicker.localeCompare(b.kicker, "ko"),
);

export function getReadingGuide(slug: string): Guide | undefined {
  return readingGuides.find((guide) => guide.slug === slug);
}

export function getGuidesForPost(postSlug: string): Array<{
  guide: Guide;
  chapters: GuideChapter[];
}> {
  return readingGuides
    .map((guide) => ({
      guide,
      chapters: guide.chapters.filter((chapter) => chapter.slugs.includes(postSlug)),
    }))
    .filter((entry) => entry.chapters.length > 0);
}
