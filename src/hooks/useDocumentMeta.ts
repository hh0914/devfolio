import { useEffect } from 'react';

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/** 纯静态 SPA 的页面级元信息：路由切换时写入 title / description / OG。 */
export function useDocumentMeta({
  title,
  description,
}: {
  title: string;
  description?: string;
}): void {
  useEffect(() => {
    document.title = title;
    upsertMeta('property', 'og:title', title);
    if (description) {
      upsertMeta('name', 'description', description);
      upsertMeta('property', 'og:description', description);
    }
  }, [title, description]);
}
