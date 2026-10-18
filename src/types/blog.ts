export interface BlogPostMeta {
  slug: string;
  title: string;
  summary: string;
  /** ISO 日期，形如 2025-03-12 */
  date: string;
  updated?: string;
  tags: string[];
  cover?: string;
  draft?: boolean;
  /** 分钟，构建期按中英文分别估算 */
  readingTime: number;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}
