import fs from "fs";
import path from "path";

export function getPostCoverImage(post: { slug: string; path?: string }): string | undefined {
  // 1. Check for <PostImage src="..." /> inside MDX content if path is available
  if (post.path) {
    const possibleExtensions = [".mdx", ".md"];
    for (const ext of possibleExtensions) {
      const fullPath = path.join(process.cwd(), "content", post.path + ext);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const match = content.match(/<PostImage\s+[^>]*src=["']([^"']+)["']/i);
        if (match && match[1]) {
          const imageRelativePath = match[1];
          const publicImagePath = path.join(process.cwd(), "public", imageRelativePath.replace(/^\//, ""));
          if (fs.existsSync(publicImagePath)) {
            return imageRelativePath;
          }
        }
        break;
      }
    }
  }

  // 2. Fallback: check for public/images/[slug].* selecting the most recently modified file
  const extensions = ["png", "webp", "jpg", "jpeg", "svg"];
  let newestImage: { path: string; mtime: number } | undefined = undefined;

  for (const ext of extensions) {
    const imgPath = path.join(process.cwd(), "public", "images", `${post.slug}.${ext}`);
    if (fs.existsSync(imgPath)) {
      const stat = fs.statSync(imgPath);
      if (!newestImage || stat.mtimeMs > newestImage.mtime) {
        newestImage = {
          path: `/images/${post.slug}.${ext}`,
          mtime: stat.mtimeMs,
        };
      }
    }
  }

  return newestImage?.path;
}
