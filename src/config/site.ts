import type { SiteConfig } from '@/types';

/** 站点级配置：导航、页脚、SEO 默认值。部署后请把 url 改为正式域名。 */
export const site = {
  title: '文 · 前端工程师',
  description: '文的前端作品集：React / TypeScript / 工程化实践，项目作品与技术文章。',
  url: 'https://devfolio.example.com',
  locale: 'zh-CN',
  author: '文',
  ogImage: '/og-image.svg',
  nav: [
    { label: '关于', href: '#about' },
    { label: '技能', href: '#skills' },
    { label: '项目', href: '#projects' },
    { label: '博客', href: '/blog' },
    { label: '联系', href: '#contact' },
  ],
  footer: {
    since: 2021,
    note: '纯静态站点，内容全部由本地配置驱动。',
  },
  theme: { default: 'system' },
} satisfies SiteConfig;
