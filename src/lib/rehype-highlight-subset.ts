import type { Element, ElementContent, Root } from 'hast';
import { createLowlight } from 'lowlight';
import { visit } from 'unist-util-visit';

import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';

/**
 * 只注册站点实际用到的六种语法。
 * 不使用 rehype-highlight 的原因：它会静态引入 lowlight 的 common 语法包，
 * 即使传入自定义 languages，体积也无法 tree-shake 掉。
 */
const lowlight = createLowlight({ bash, css, javascript, json, typescript, xml });

function readText(node: Element): string {
  let text = '';
  for (const child of node.children) {
    if (child.type === 'text') text += child.value;
    else if (child.type === 'element') text += readText(child);
  }
  return text;
}

export function rehypeHighlightSubset() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName !== 'pre') return;

      const code = node.children.find(
        (child): child is Element => child.type === 'element' && child.tagName === 'code',
      );
      if (!code) return;

      const classNames = Array.isArray(code.properties?.className) ? code.properties.className : [];
      const languageClass = classNames.find(
        (value): value is string => typeof value === 'string' && value.startsWith('language-'),
      );
      const language = languageClass?.slice('language-'.length);
      if (!language || !lowlight.registered(language)) return;

      const result = lowlight.highlight(language, readText(code));
      code.children = result.children.filter(
        (child): child is ElementContent => child.type !== 'doctype',
      );
      code.properties = { ...code.properties, className: ['hljs', `language-${language}`] };
    });
  };
}
