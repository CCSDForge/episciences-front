import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { Node, Root } from 'mdast'

export const generateIdFromText = (text: string): string => {
  return text.toLowerCase().replace(/\s+/g, '-');
};

export const unifiedProcessor = unified()
  .use(remarkParse)
  .use(remarkStringify);

export const serializeMarkdown = (node: Node) => unifiedProcessor.stringify(node as Root);
