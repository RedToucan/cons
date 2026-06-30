import { defineConfig, s } from 'velite';

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
        description: s.string().optional(),
        category: s.string().default('Philosophy'),
        tags: s.array(s.string()).default([]),
        subcategory: s.string().optional(),
        author: s.string().default('Editorial'),
        // markdown() parses md to html, metadata() gets reading time, word count etc.
        content: s.mdx(),
        metadata: s.metadata(),
        path: s.path()
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

        // Extract subcategory from path if not explicitly provided
        const parts = data.path.split(/[/\\]/);
        let finalSubcategory = data.subcategory;
        if (!finalSubcategory && parts.length >= 4) {
          finalSubcategory = parts[2];
        }

        return {
          ...data,
          slug: finalSlug,
          subcategory: finalSubcategory,
          permalink: `/posts/${finalSlug}`
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
