import { ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import './MarkdownRenderer.scss';
import rehypeRaw from "rehype-raw";

type MarkdownRendererProps = Omit<
  ComponentProps<typeof ReactMarkdown>,
  'remarkPlugins'
>;

export default function MarkdownRenderer({
  children,
  ...props
}: MarkdownRendererProps): JSX.Element {
  return (
    <div className="markdownRenderer">
      <ReactMarkdown remarkPlugins={[remarkGfm]}  rehypePlugins={[rehypeRaw]}  {...props}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
