export interface NavItem {
  label: string;
  /** 页内锚点 "#about" 或路由 "/blog" */
  href: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  /** 正式域名，用于 OG 与 sitemap */
  url: string;
  locale: string;
  author: string;
  ogImage: string;
  nav: NavItem[];
  footer: { since: number; note: string };
  theme: { default: 'light' | 'dark' | 'system' };
}
