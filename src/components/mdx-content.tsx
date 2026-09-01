import * as runtime from 'react/jsx-runtime';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import Link from 'next/link';
import PostImage from './PostImage';
import RelatedPosts from './RelatedPosts';
import YouTube from './YouTube';

// Flatten a React children tree down to its plain text, for slug generation.
function extractText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    return extractText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return '';
}

// Keep Korean/letters/numbers, collapse the rest to single hyphens.
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

function makeHeading(Tag: 'h2' | 'h3' | 'h4') {
  return function Heading({ children, ...props }: ComponentPropsWithoutRef<'h2'>) {
    const id = slugify(extractText(children));
    return (
      <Tag id={id || undefined} {...props}>
        {children}
      </Tag>
    );
  };
}

function Anchor({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (/^https?:\/\//i.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer nofollow" {...props}>
        {children}
      </a>
    );
  }
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

// Map custom React components that can be used directly inside MDX content
const components = {
  PostImage,
  RelatedPosts,
  YouTube,
  // A body-level <h1> would duplicate the post title, so demote it to <h2>.
  h1: makeHeading('h2'),
  h2: makeHeading('h2'),
  h3: makeHeading('h3'),
  h4: makeHeading('h4'),
  a: Anchor,
};


interface MdxContentProps {
  code: string;
}

export default function MdxContent({ code }: MdxContentProps) {
  if (!code) return null;

  // Velite compiles MDX files into executable code strings.
  // Here, we evaluate the code using Function constructor, passing the React jsx-runtime
  // to reconstitute the MDX content as a renderable React component.
  const Component = new Function(code)(runtime).default;
  return <Component components={components} />;
}
