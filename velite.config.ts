import { defineConfig, s } from 'velite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash].[ext]',
    clean: true
  },
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/**/*.{md,mdx}',
      schema: s.object({
        title: s.string().max(100),
        slug: s.string().optional(),
        date: s.isodate(),
        updated: s.isodate().optional(),
        description: s.string().optional(),
        category: s.string().default('Philosophy'),
        tags: s.array(s.string()).default([]),
        featured: s.boolean().default(false),
        order: s.number().default(0),
        subcategory: s.string().optional(),
        author: s.string().default('Editorial'),
        content: s.mdx(),
        metadata: s.metadata(),
        path: s.path(),
        cover: s.string().optional()
      })
      .transform((data) => {
        let finalSlug = data.slug;
        if (!finalSlug) {
          const parts = data.path.split(/[/\\]/);
          const filename = parts[parts.length - 1];
          const nameParts = filename.split('.');
          if (nameParts.length > 1) {
            nameParts.pop();
          }
          finalSlug = nameParts.join('.');
        }

        const parts = data.path.split(/[/\\]/);
        let finalSubcategory = data.subcategory;
        if (!finalSubcategory && parts.length >= 4) {
          finalSubcategory = parts[2];
        }

        // Dynamic Korean readingTime calculation & cover precomputation
        let rawContent = '';
        const possibleExtensions = ['.mdx', '.md'];
        for (const ext of possibleExtensions) {
          const fullPath = path.join('content', data.path + ext);
          if (fs.existsSync(fullPath)) {
            rawContent = fs.readFileSync(fullPath, 'utf-8');
            break;
          }
        }

        const cleanContent = rawContent.replace(/---[\s\S]*?---/, '').trim();
        const charCount = cleanContent.length;
        const koreanReadingTime = Math.max(1, Math.round(charCount / 1200));

        // Pre-compute cover image at build time
        let coverImage: string | undefined = undefined;
        const match = rawContent.match(/<PostImage\s+[^>]*src=["']([^"']+)["']/i);
        if (match && match[1]) {
          const imageRelativePath = match[1];
          const publicImagePath = path.join(process.cwd(), 'public', imageRelativePath.replace(/^\//, ''));
          if (fs.existsSync(publicImagePath)) {
            coverImage = imageRelativePath;
          }
        }

        if (!coverImage) {
          const extensions = ['webp', 'png', 'jpg', 'jpeg', 'svg'];
          for (const ext of extensions) {
            const imgPath = path.join(process.cwd(), 'public', 'images', `${finalSlug}.${ext}`);
            if (fs.existsSync(imgPath)) {
              coverImage = `/images/${finalSlug}.${ext}`;
              break;
            }
          }
        }

        return {
          ...data,
          updated: data.updated ?? data.date,
          slug: finalSlug,
          subcategory: finalSubcategory,
          permalink: `/posts/${finalSlug}`,
          cover: coverImage,
          metadata: {
            ...data.metadata,
            readingTime: koreanReadingTime
          }
        };
      })
    },
    about: {
      name: 'About',
      pattern: 'about.mdx',
      single: true,
      schema: s.object({
        title: s.string().max(100),
        content: s.mdx()
      })
    }
  }
});
