import type { LucideIcon } from 'lucide-react';
import { BookOpen, Github, Globe, Mail, Twitter } from 'lucide-react';

/** 社交图标白名单：配置里写图标名，未命中时降级为 Globe。 `/admin` 的下拉也读这份映射。 */
export const SOCIAL_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Github,
  Globe,
  Mail,
  Twitter,
};

export const SOCIAL_ICON_NAMES = Object.keys(SOCIAL_ICONS);

export const FALLBACK_SOCIAL_ICON: LucideIcon = Globe;
