import yaml from 'js-yaml';
import type { BlogPost } from '@/types';

const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function splitFrontmatter(source: string, file: string): { front: string; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  const front = match?.[1];
  if (!match || front === undefined) {
    throw new Error(`[blog] ${file} 缺少 frontmatter 区块（应以 --- 开始与结束）`);
  }
  return { front, body: match[2] ?? '' };
}

function estimateReadingTime(body: string): number {
  const cjk = (body.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = (body.match(/[a-zA-Z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round(cjk / 400 + words / 220));
}

function toPost(path: string, source: string): BlogPost {
  const file = path.split('/').pop() ?? path;
  const slug = file.replace(/\.md$/, '');
  const { front, body } = splitFrontmatter(source, file);
  const parsed = yaml.load(front, { schema: yaml.JSON_SCHEMA });

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`[blog] ${file} 的 frontmatter 不是合法对象`);
  }

  const meta = parsed as Record<string, unknown>;
  const title = typeof meta.title === 'string' ? meta.title.trim() : '';
  const summary = typeof meta.summary === 'string' ? meta.summary.trim() : '';
  const rawDate = meta.date;
  const date =
    typeof rawDate === 'string'
      ? rawDate
      : rawDate instanceof Date
        ? rawDate.toISOString().slice(0, 10)
        : '';

  if (!title || !summary || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`[blog] ${file} 的 title / summary / date 缺失或格式错误`);
  }

  return {
    slug,
    title,
    summary,
    date,
    tags: Array.isArray(meta.tags)
      ? meta.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
    updated: typeof meta.updated === 'string' ? meta.updated : undefined,
    cover: typeof meta.cover === 'string' ? meta.cover : undefined,
    draft: meta.draft === true,
    readingTime: estimateReadingTime(body),
    content: body.trim(),
  };
}

export const allPosts: BlogPost[] = Object.entries(modules)
  .map(([path, source]) => toPost(path, source))
  .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1));

export const publishedPosts: BlogPost[] = allPosts.filter((post) => !post.draft);

export function getPost(slug: string): BlogPost | undefined {
  return publishedPosts.find((post) => post.slug === slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of publishedPosts) {
    for (const tag of post.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}
