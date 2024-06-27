import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { Node, Root } from 'mdast'

export const generateIdFromText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-');
};

export const unifiedProcessor = unified()
  .use(remarkParse)
  .use(remarkStringify);

export const serializeMarkdown = (node: Node) => unifiedProcessor.stringify(node as Root);

export const getImageURL = (path: string) => `https://${import.meta.env.VITE_JOURNAL_RVCODE}.episciences.org${path}`
