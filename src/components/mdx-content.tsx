import * as runtime from 'react/jsx-runtime';
import PostImage from './PostImage';
import RelatedPosts from './RelatedPosts';
import YouTube from './YouTube';

// Map custom React components that can be used directly inside MDX content
const components = {
  PostImage,
  RelatedPosts,
  YouTube,
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
