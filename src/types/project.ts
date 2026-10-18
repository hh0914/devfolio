export type ProjectStatus = 'live' | 'maintained' | 'archived' | 'wip';

export interface Project {
  slug: string;
  title: string;
  /** 卡片摘要，建议 80 字以内 */
  summary: string;
  /** 详情页正文，支持 Markdown */
  description: string;
  cover: string;
  coverAlt: string;
  stack: string[];
  role?: string;
  period?: string;
  highlights?: string[];
  links: {
    github?: string;
    demo?: string;
    article?: string;
  };
  featured: boolean;
  status: ProjectStatus;
  /** 越小越靠前 */
  order: number;
}
