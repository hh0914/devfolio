import type { Availability, SocialLink } from './profile';

/**
 * 本地覆盖数据：`/admin` 保存到 localStorage 的完整快照。
 * 所有字段必填，保存时整份替换，避免「部分字段过期」导致的半新半旧状态。
 */
export interface ProfileOverride {
  name: string;
  role: string;
  headline: string[];
  slogan: string;
  avatar: string;
  avatarAlt: string;
  location: string;
  email: string;
  resumeUrl: string;
  bio: string[];
  availability: Availability;
  socials: SocialLink[];
}

export interface SiteOverride {
  title: string;
  description: string;
  author: string;
  footer: {
    since: number;
    note: string;
  };
}

export interface ContentOverride {
  version: 1;
  updatedAt: string;
  profile: ProfileOverride;
  site: SiteOverride;
}

export type ContentOverrideParseResult =
  | { ok: true; value: ContentOverride }
  | { ok: false; error: string };
