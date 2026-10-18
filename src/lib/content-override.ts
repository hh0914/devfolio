import { profile, site } from '@/config';
import type {
  Availability,
  AvailabilityStatus,
  ContentOverride,
  ContentOverrideParseResult,
  ProfileOverride,
  SiteOverride,
  SocialLink,
} from '@/types';

/** localStorage 键名带版本号：结构升级时换键，旧数据自然失效而不是把页面写坏。 */
export const CONTENT_OVERRIDE_KEY = 'devfolio-content-v1';

const STATUSES: readonly AvailabilityStatus[] = ['open', 'freelance', 'closed'];
export const MAX_HEADLINE = 8;
export const MAX_BIO = 12;
export const MAX_SOCIALS = 8;
const MIN_YEAR = 1990;

type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseText(value: unknown, field: string, max: number): Result<string> {
  if (typeof value !== 'string') return { ok: false, error: `${field} 必须是字符串` };
  const trimmed = value.trim();
  if (trimmed === '') return { ok: false, error: `${field} 不能为空` };
  if (trimmed.length > max) return { ok: false, error: `${field} 超过 ${max} 个字符` };
  return { ok: true, value: trimmed };
}

function parseTextList(value: unknown, field: string, max: number): Result<string[]> {
  if (!Array.isArray(value)) return { ok: false, error: `${field} 必须是数组` };
  if (value.length === 0) return { ok: false, error: `${field} 至少需要一项` };
  if (value.length > max) return { ok: false, error: `${field} 最多 ${max} 项` };

  const items: string[] = [];
  for (const item of value) {
    const parsed = parseText(item, field, 600);
    if (!parsed.ok) return parsed;
    items.push(parsed.value);
  }
  return { ok: true, value: items };
}

function parseAvailability(value: unknown): Result<Availability> {
  if (!isRecord(value)) return { ok: false, error: '求职状态必须是对象' };

  const status = value.status;
  if (typeof status !== 'string' || !STATUSES.includes(status as AvailabilityStatus)) {
    return { ok: false, error: `求职状态取值必须是 ${STATUSES.join(' / ')}` };
  }

  const text = parseText(value.text, '求职状态文案', 40);
  if (!text.ok) return text;

  return { ok: true, value: { status: status as AvailabilityStatus, text: text.value } };
}

function parseSocial(value: unknown, index: number): Result<SocialLink> {
  const at = `社交链接 ${index + 1}`;
  if (!isRecord(value)) return { ok: false, error: `${at} 必须是对象` };

  const id = parseText(value.id, `${at} 的 id`, 40);
  if (!id.ok) return id;

  const label = parseText(value.label, `${at} 的名称`, 20);
  if (!label.ok) return label;

  const url = parseText(value.url, `${at} 的链接`, 200);
  if (!url.ok) return url;
  if (!/^(https?:\/\/|mailto:|\/)/.test(url.value)) {
    return { ok: false, error: `${at} 的链接需以 http(s)://、mailto: 或 / 开头` };
  }

  const icon = parseText(value.icon, `${at} 的图标`, 30);
  if (!icon.ok) return icon;

  const handle =
    value.handle === undefined
      ? { ok: true as const, value: '' }
      : parseText(value.handle, `${at} 的账号`, 40);
  if (!handle.ok) return handle;

  const link: SocialLink = {
    id: id.value,
    label: label.value,
    url: url.value,
    icon: icon.value,
  };
  if (handle.value !== '') link.handle = handle.value;

  return { ok: true, value: link };
}

function parseProfileOverride(value: unknown): Result<ProfileOverride> {
  if (!isRecord(value)) return { ok: false, error: 'profile 必须是对象' };

  const name = parseText(value.name, '姓名', 30);
  if (!name.ok) return name;

  const role = parseText(value.role, '职位', 40);
  if (!role.ok) return role;

  const headline = parseTextList(value.headline, '技能标签', MAX_HEADLINE);
  if (!headline.ok) return headline;

  const slogan = parseText(value.slogan, 'Slogan', 60);
  if (!slogan.ok) return slogan;

  const avatar = parseText(value.avatar, '头像路径', 200);
  if (!avatar.ok) return avatar;

  const avatarAlt = parseText(value.avatarAlt, '头像替代文本', 60);
  if (!avatarAlt.ok) return avatarAlt;

  const location = parseText(value.location, '所在城市', 30);
  if (!location.ok) return location;

  const email = parseText(value.email, '邮箱', 80);
  if (!email.ok) return email;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    return { ok: false, error: '邮箱格式不正确' };
  }

  const resumeUrl = parseText(value.resumeUrl, '简历路径', 200);
  if (!resumeUrl.ok) return resumeUrl;

  const bio = parseTextList(value.bio, '个人简介', MAX_BIO);
  if (!bio.ok) return bio;

  const availability = parseAvailability(value.availability);
  if (!availability.ok) return availability;

  if (!Array.isArray(value.socials)) return { ok: false, error: '社交链接必须是数组' };
  if (value.socials.length > MAX_SOCIALS) {
    return { ok: false, error: `社交链接最多 ${MAX_SOCIALS} 个` };
  }

  const socials: SocialLink[] = [];
  for (const [index, item] of value.socials.entries()) {
    const parsed = parseSocial(item, index);
    if (!parsed.ok) return parsed;
    if (socials.some((link) => link.id === parsed.value.id)) {
      return { ok: false, error: `社交链接 id 重复：${parsed.value.id}` };
    }
    socials.push(parsed.value);
  }

  return {
    ok: true,
    value: {
      name: name.value,
      role: role.value,
      headline: headline.value,
      slogan: slogan.value,
      avatar: avatar.value,
      avatarAlt: avatarAlt.value,
      location: location.value,
      email: email.value,
      resumeUrl: resumeUrl.value,
      bio: bio.value,
      availability: availability.value,
      socials,
    },
  };
}

function parseSiteOverride(value: unknown): Result<SiteOverride> {
  if (!isRecord(value)) return { ok: false, error: 'site 必须是对象' };

  const title = parseText(value.title, '站点标题', 60);
  if (!title.ok) return title;

  const description = parseText(value.description, '站点描述', 160);
  if (!description.ok) return description;

  const author = parseText(value.author, '作者名', 30);
  if (!author.ok) return author;

  if (!isRecord(value.footer)) return { ok: false, error: '页脚配置必须是对象' };

  const { since, note } = value.footer;
  if (typeof since !== 'number' || !Number.isInteger(since)) {
    return { ok: false, error: '页脚起始年份必须是整数' };
  }
  if (since < MIN_YEAR || since > new Date().getFullYear()) {
    return { ok: false, error: `页脚起始年份需在 ${MIN_YEAR} 到当前年份之间` };
  }

  const noteText = parseText(note, '页脚备注', 120);
  if (!noteText.ok) return noteText;

  return {
    ok: true,
    value: {
      title: title.value,
      description: description.value,
      author: author.value,
      footer: { since, note: noteText.value },
    },
  };
}

/** 逐字段收窄外部数据（localStorage / 导入的 JSON），不直接断言。 */
export function parseContentOverride(raw: unknown): ContentOverrideParseResult {
  if (!isRecord(raw)) return { ok: false, error: '配置必须是 JSON 对象' };

  const profileResult = parseProfileOverride(raw.profile);
  if (!profileResult.ok) return profileResult;

  const siteResult = parseSiteOverride(raw.site);
  if (!siteResult.ok) return siteResult;

  return {
    ok: true,
    value: {
      version: 1,
      updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
      profile: profileResult.value,
      site: siteResult.value,
    },
  };
}

export function loadContentOverride(): ContentOverride | null {
  try {
    const raw = window.localStorage.getItem(CONTENT_OVERRIDE_KEY);
    if (!raw) return null;
    const parsed = parseContentOverride(JSON.parse(raw) as unknown);
    return parsed.ok ? parsed.value : null;
  } catch {
    return null;
  }
}

export function saveContentOverride(input: unknown): Result<ContentOverride> {
  const parsed = parseContentOverride(input);
  if (!parsed.ok) return parsed;

  const stamped: ContentOverride = { ...parsed.value, updatedAt: new Date().toISOString() };

  try {
    window.localStorage.setItem(CONTENT_OVERRIDE_KEY, JSON.stringify(stamped));
  } catch {
    return { ok: false, error: '保存失败：浏览器禁用了本地存储（无痕模式或站点数据被限制）' };
  }

  return { ok: true, value: stamped };
}

export function clearContentOverride(): void {
  try {
    window.localStorage.removeItem(CONTENT_OVERRIDE_KEY);
  } catch {
    /* 无存储权限时无需处理：刷新后本就回到配置默认值 */
  }
}

/**
 * 在 React 挂载前调用，把本地覆盖写回配置单例。
 * 组件仍然读 `@/config`，因此不需要为「可编辑」改造任何展示组件。
 */
export function applyContentOverride(source: ContentOverride | null = loadContentOverride()): void {
  if (!source) return;

  Object.assign(profile, source.profile);
  const { footer, ...rest } = source.site;
  Object.assign(site, rest);
  Object.assign(site.footer, footer);
}
