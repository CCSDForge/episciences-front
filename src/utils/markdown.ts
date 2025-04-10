import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { Node, Root } from 'mdast'
import he from 'he'

export const generateIdFromText = (text: string): string => {

  if (!text) {
    return "";
  }

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

export const serializeMarkdown = (node: Node) => {
  const serialized= unifiedProcessor.stringify(node as Root);
  return serialized + (needsExtraLineBreaks(node) ? '\n\n' : '\n');
}
function needsExtraLineBreaks(node: Node): boolean {
  return ['paragraph', 'list', 'heading'].includes(node.type);
}
export const getMarkdownImageURL = (path: string, rvcode: string) => `https://${rvcode}.episciences.org${path}`

export const decodeText = (text: string): string => {
  return he.decode(text)
      .replace(/\\_/g, '_')
      .replace(/\\\*/g, '*')
      .replace(/\\\(/g, '(')
      .replace(/\\\)/g, ')')
      .replace(/\\\[/g, '[')
      .replace(/\\\]/g, ']')  
      .replace(/\\\\/g, '\\')
      .trim()
  ;
}

export const adjustNestedListsInMarkdownContent = (content?: string): string => {
  if (!content) return '';
  // First fix single bullet points after headers
  let fixedContent = content
      .replace(/(#{1,6}\s+[^\n]+\n+)\s*-\s+([^\n]+)/g, '$1$2');

  // Preserve proper multi-item lists
  fixedContent = fixedContent.replace(
      /(#{1,6}\s+[^\n]+\n+)(\s*-\s+[^\n]+\n+)(\s*-\s+[^\n]+\n+)/g,
      '$1\n$2$3'
  );

  // Handle nested lists with colons
  fixedContent = fixedContent.replace(/(- [^\n]+:\n)((- .+\n)+)/g,
      (_: string, parent: string, children: string) => {
        const indentedChildren = children.replace(/(- )/g, '  $1');
        return parent + indentedChildren;
      }
  );

  return fixedContent;
}


