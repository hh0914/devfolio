import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Download, RotateCcw, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Field, Select, TextArea, TextInput } from '@/components/ui/FormField';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import {
  MAX_BIO,
  MAX_HEADLINE,
  MAX_SOCIALS,
  applyContentOverride,
  clearContentOverride,
  loadContentOverride,
  parseContentOverride,
  saveContentOverride,
} from '@/lib/content-override';
import { SOCIAL_ICON_NAMES } from '@/lib/social-icons';
import { profile, site } from '@/config';
import type { AvailabilityStatus, ContentOverride, ProfileOverride, SiteOverride } from '@/types';

const SAVED_FLAG = 'devfolio-admin-saved';

const STATUS_OPTIONS: { value: AvailabilityStatus; label: string }[] = [
  { value: 'open', label: '开放全职机会' },
  { value: 'freelance', label: '可接外包' },
  { value: 'closed', label: '暂不考虑' },
];

const SOCIAL_URL_PATTERN = /^(https?:\/\/|mailto:|\/)/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SocialDraft {
  id: string;
  label: string;
  url: string;
  icon: string;
  handle: string;
}

interface Draft {
  name: string;
  role: string;
  location: string;
  email: string;
  slogan: string;
  avatar: string;
  avatarAlt: string;
  resumeUrl: string;
  headline: string;
  bio: string;
  availabilityStatus: AvailabilityStatus;
  availabilityText: string;
  socials: SocialDraft[];
  siteTitle: string;
  siteDescription: string;
  siteAuthor: string;
  footerSince: string;
  footerNote: string;
}

interface DraftSource {
  profile: ProfileOverride;
  site: SiteOverride;
}

type BuildResult =
  | { ok: true; value: ContentOverride }
  | { ok: false; errors: Record<string, string> };

function toDraft(source: DraftSource): Draft {
  return {
    name: source.profile.name,
    role: source.profile.role,
    location: source.profile.location,
    email: source.profile.email,
    slogan: source.profile.slogan,
    avatar: source.profile.avatar,
    avatarAlt: source.profile.avatarAlt,
    resumeUrl: source.profile.resumeUrl,
    headline: source.profile.headline.join(', '),
    bio: source.profile.bio.join('\n'),
    availabilityStatus: source.profile.availability.status,
    availabilityText: source.profile.availability.text,
    socials: source.profile.socials.map((social) => ({
      id: social.id,
      label: social.label,
      url: social.url,
      icon: social.icon,
      handle: social.handle ?? '',
    })),
    siteTitle: source.site.title,
    siteDescription: source.site.description,
    siteAuthor: source.site.author,
    footerSince: String(source.site.footer.since),
    footerNote: source.site.footer.note,
  };
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

function splitTags(value: string): string[] {
  return value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '');
}

function buildOverride(draft: Draft): BuildResult {
  const errors: Record<string, string> = {};

  const name = draft.name.trim();
  if (name === '') errors['admin-name'] = '姓名不能为空';

  const role = draft.role.trim();
  if (role === '') errors['admin-role'] = '职位不能为空';

  const location = draft.location.trim();
  if (location === '') errors['admin-location'] = '所在城市不能为空';

  const email = draft.email.trim();
  if (!EMAIL_PATTERN.test(email)) errors['admin-email'] = '邮箱格式不正确';

  const slogan = draft.slogan.trim();
  if (slogan === '') errors['admin-slogan'] = 'Slogan 不能为空';
  else if (slogan.length > 60) errors['admin-slogan'] = `Slogan 最多 60 个字符，当前 ${slogan.length}`;

  const avatar = draft.avatar.trim();
  if (avatar === '') errors['admin-avatar'] = '头像路径不能为空';

  const avatarAlt = draft.avatarAlt.trim();
  if (avatarAlt === '') errors['admin-avatar-alt'] = '头像替代文本不能为空';

  const resumeUrl = draft.resumeUrl.trim();
  if (resumeUrl === '') errors['admin-resume'] = '简历路径不能为空';

  const headline = splitTags(draft.headline);
  if (headline.length === 0) errors['admin-headline'] = '至少填一个技能标签';
  else if (headline.length > MAX_HEADLINE) {
    errors['admin-headline'] = `技能标签最多 ${MAX_HEADLINE} 个`;
  }

  const bio = splitLines(draft.bio);
  if (bio.length === 0) errors['admin-bio'] = '至少填一段简介';
  else if (bio.length > MAX_BIO) errors['admin-bio'] = `简介最多 ${MAX_BIO} 段`;

  const availabilityText = draft.availabilityText.trim();
  if (availabilityText === '') errors['admin-status-text'] = '状态文案不能为空';

  const socials: ProfileOverride['socials'] = [];
  draft.socials.forEach((social, index) => {
    const label = social.label.trim();
    const url = social.url.trim();
    if (label === '') errors[`admin-social-label-${index}`] = '名称不能为空';
    if (!SOCIAL_URL_PATTERN.test(url)) {
      errors[`admin-social-url-${index}`] = '链接需以 http(s)://、mailto: 或 / 开头';
    }
    socials.push({
      id: social.id,
      label,
      url,
      icon: social.icon,
      ...(social.handle.trim() === '' ? {} : { handle: social.handle.trim() }),
    });
  });

  const siteTitle = draft.siteTitle.trim();
  if (siteTitle === '') errors['admin-site-title'] = '站点标题不能为空';

  const siteDescription = draft.siteDescription.trim();
  if (siteDescription === '') errors['admin-site-description'] = '站点描述不能为空';
  else if (siteDescription.length > 160) {
    errors['admin-site-description'] = `站点描述最多 160 个字符，当前 ${siteDescription.length}`;
  }

  const siteAuthor = draft.siteAuthor.trim();
  if (siteAuthor === '') errors['admin-site-author'] = '作者名不能为空';

  const footerSince = Number(draft.footerSince);
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(footerSince) || footerSince < 1990 || footerSince > currentYear) {
    errors['admin-footer-since'] = `起始年份需在 1990 到 ${currentYear} 之间`;
  }

  const footerNote = draft.footerNote.trim();
  if (footerNote === '') errors['admin-footer-note'] = '页脚备注不能为空';

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      version: 1,
      updatedAt: new Date().toISOString(),
      profile: {
        name,
        role,
        headline,
        slogan,
        avatar,
        avatarAlt,
        location,
        email,
        resumeUrl,
        bio,
        availability: { status: draft.availabilityStatus, text: availabilityText },
        socials,
      },
      site: {
        title: siteTitle,
        description: siteDescription,
        author: siteAuthor,
        footer: { since: footerSince, note: footerNote },
      },
    },
  };
}

let savedFlashCache: boolean | null = null;

function readSavedFlash(): boolean {
  if (savedFlashCache !== null) return savedFlashCache;
  try {
    const flag = window.sessionStorage.getItem(SAVED_FLAG);
    savedFlashCache = flag === '1';
    if (savedFlashCache) window.sessionStorage.removeItem(SAVED_FLAG);
  } catch {
    savedFlashCache = false;
  }
  return savedFlashCache;
}

export default function AdminPage() {
  useDocumentMeta({
    title: `编辑资料 · ${site.author}`,
    description: '在本机浏览器编辑个人信息，保存后立即在站点展示。',
  });

  const [draft, setDraft] = useState<Draft>(() => toDraft({ profile, site }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAt] = useState<string | null>(() => loadContentOverride()?.updatedAt ?? null);
  const [justSaved] = useState<boolean>(readSavedFlash);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { copied, copy } = useCopyToClipboard();

  const update = <K extends keyof Draft>(key: K, value: Draft[K]): void => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const updateSocial = (index: number, patch: Partial<SocialDraft>): void => {
    setDraft((prev) => ({
      ...prev,
      socials: prev.socials.map((social, at) => (at === index ? { ...social, ...patch } : social)),
    }));
  };

  const addSocial = (): void => {
    if (draft.socials.length >= MAX_SOCIALS) return;
    setDraft((prev) => ({
      ...prev,
      socials: [
        ...prev.socials,
        {
          id: `social-${Date.now().toString(36)}`,
          label: '',
          url: '',
          icon: 'Globe',
          handle: '',
        },
      ],
    }));
  };

  const removeSocial = (index: number): void => {
    setDraft((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, at) => at !== index),
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const built = buildOverride(draft);
    if (!built.ok) {
      setErrors(built.errors);
      setNotice({ tone: 'error', text: '有字段未通过校验，请检查标红项。' });
      return;
    }

    const saved = saveContentOverride(built.value);
    if (!saved.ok) {
      setNotice({ tone: 'error', text: saved.error });
      return;
    }

    applyContentOverride(saved.value);
    try {
      window.sessionStorage.setItem(SAVED_FLAG, '1');
    } catch {
      /* 会话存储不可用时只是少一条保存提示 */
    }
    window.location.reload();
  };

  const handleExport = (): void => {
    const built = buildOverride(draft);
    if (!built.ok) {
      setErrors(built.errors);
      setNotice({ tone: 'error', text: '有字段未通过校验，先修正后再导出。' });
      return;
    }

    const blob = new Blob([JSON.stringify(built.value, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'devfolio-content.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setNotice({ tone: 'ok', text: '已导出 devfolio-content.json，可用于备份或迁移到其他浏览器。' });
  };

  const handleCopy = async (): Promise<void> => {
    const built = buildOverride(draft);
    if (!built.ok) {
      setErrors(built.errors);
      setNotice({ tone: 'error', text: '有字段未通过校验，先修正后再复制。' });
      return;
    }

    const ok = await copy(JSON.stringify(built.value, null, 2));
    setNotice(
      ok
        ? { tone: 'ok', text: '配置 JSON 已复制到剪贴板。' }
        : { tone: 'error', text: '复制失败：浏览器拒绝了剪贴板权限，请改用「导出 JSON」。' },
    );
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const raw: unknown = JSON.parse(await file.text());
      const parsed = parseContentOverride(raw);
      if (!parsed.ok) {
        setNotice({ tone: 'error', text: `导入失败：${parsed.error}` });
        return;
      }
      setDraft(toDraft(parsed.value));
      setErrors({});
      setNotice({ tone: 'ok', text: '已载入文件内容，确认无误后点「保存并在本机生效」。' });
    } catch {
      setNotice({ tone: 'error', text: '导入失败：文件不是合法的 JSON。' });
    }
  };

  const handleReset = (): void => {
    if (!window.confirm('恢复默认会清除本机保存的修改（不会改动仓库里的配置文件），继续？')) {
      return;
    }
    clearContentOverride();
    window.location.reload();
  };

  const formatSavedAt = (value: string): string => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString('zh-CN');
  };

  return (
    <Container>
      <div className="mx-auto max-w-3xl py-12 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center rounded text-xs text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          ← 返回首页
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          编辑资料
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          修改保存在当前浏览器的 localStorage，刷新即刻在站点生效。数据不会上传到任何服务器，也不会改动仓库里的{' '}
          <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-[12px]">
            src/config/
          </code>
          ，因此其他访客看到的仍是配置文件里的内容。
        </p>

        {savedAt ? (
          <p className="mt-4 rounded-lg border border-line bg-subtle px-4 py-3 text-xs leading-6 text-muted">
            当前展示的是本机保存的数据，最后更新：
            <span className="ml-1 font-mono text-ink">{formatSavedAt(savedAt)}</span>
            。要让所有访客看到这些内容，请把导出的值写回配置文件并提交。
          </p>
        ) : null}

        {justSaved ? (
          <p
            role="status"
            className="mt-4 rounded-lg border border-accent/40 bg-accent/5 px-4 py-3 text-xs text-ink"
          >
            已保存并在本机生效，下面的表单显示的就是当前生效值。
          </p>
        ) : null}

        {notice ? (
          <p
            role={notice.tone === 'error' ? 'alert' : 'status'}
            className={
              notice.tone === 'error'
                ? 'mt-4 rounded-lg border border-danger/50 px-4 py-3 text-xs text-danger'
                : 'mt-4 rounded-lg border border-line bg-subtle px-4 py-3 text-xs text-muted'
            }
          >
            {notice.text}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-12">
          <fieldset className="space-y-5">
            <legend className="text-base font-semibold text-ink">基本信息</legend>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="admin-name" label="姓名" error={errors['admin-name']}>
                <TextInput
                  id="admin-name"
                  value={draft.name}
                  onChange={(event) => update('name', event.target.value)}
                  invalid={Boolean(errors['admin-name'])}
                  aria-describedby={errors['admin-name'] ? 'admin-name-error' : undefined}
                  autoComplete="name"
                />
              </Field>

              <Field id="admin-role" label="职位" error={errors['admin-role']}>
                <TextInput
                  id="admin-role"
                  value={draft.role}
                  onChange={(event) => update('role', event.target.value)}
                  invalid={Boolean(errors['admin-role'])}
                  aria-describedby={errors['admin-role'] ? 'admin-role-error' : undefined}
                />
              </Field>

              <Field
                id="admin-headline"
                label="技能标签"
                hint={`用逗号分隔，最多 ${MAX_HEADLINE} 个`}
                error={errors['admin-headline']}
              >
                <TextInput
                  id="admin-headline"
                  value={draft.headline}
                  onChange={(event) => update('headline', event.target.value)}
                  invalid={Boolean(errors['admin-headline'])}
                  aria-describedby={
                    errors['admin-headline'] ? 'admin-headline-error' : 'admin-headline-hint'
                  }
                />
              </Field>

              <Field id="admin-location" label="所在城市" error={errors['admin-location']}>
                <TextInput
                  id="admin-location"
                  value={draft.location}
                  onChange={(event) => update('location', event.target.value)}
                  invalid={Boolean(errors['admin-location'])}
                  aria-describedby={errors['admin-location'] ? 'admin-location-error' : undefined}
                />
              </Field>
            </div>

            <Field
              id="admin-slogan"
              label="Slogan"
              hint={`${draft.slogan.trim().length}/60，显示在首页姓名下方`}
              error={errors['admin-slogan']}
            >
              <TextArea
                id="admin-slogan"
                rows={2}
                value={draft.slogan}
                onChange={(event) => update('slogan', event.target.value)}
                invalid={Boolean(errors['admin-slogan'])}
                aria-describedby={
                  errors['admin-slogan'] ? 'admin-slogan-error' : 'admin-slogan-hint'
                }
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="admin-email"
                label="邮箱"
                hint="联系模块的复制按钮使用该地址"
                error={errors['admin-email']}
              >
                <TextInput
                  id="admin-email"
                  type="email"
                  value={draft.email}
                  onChange={(event) => update('email', event.target.value)}
                  invalid={Boolean(errors['admin-email'])}
                  aria-describedby={errors['admin-email'] ? 'admin-email-error' : undefined}
                  autoComplete="email"
                />
              </Field>

              <Field
                id="admin-resume"
                label="简历文件路径"
                hint="文件放在 public/ 下，例如 /resume/wen-resume.pdf"
                error={errors['admin-resume']}
              >
                <TextInput
                  id="admin-resume"
                  value={draft.resumeUrl}
                  onChange={(event) => update('resumeUrl', event.target.value)}
                  invalid={Boolean(errors['admin-resume'])}
                  aria-describedby={errors['admin-resume'] ? 'admin-resume-error' : undefined}
                />
              </Field>

              <Field
                id="admin-avatar"
                label="头像路径"
                hint="支持 public/ 下的相对路径或图片 URL"
                error={errors['admin-avatar']}
              >
                <TextInput
                  id="admin-avatar"
                  value={draft.avatar}
                  onChange={(event) => update('avatar', event.target.value)}
                  invalid={Boolean(errors['admin-avatar'])}
                  aria-describedby={errors['admin-avatar'] ? 'admin-avatar-error' : undefined}
                />
              </Field>

              <Field
                id="admin-avatar-alt"
                label="头像替代文本"
                hint="给屏幕阅读器描述这张图"
                error={errors['admin-avatar-alt']}
              >
                <TextInput
                  id="admin-avatar-alt"
                  value={draft.avatarAlt}
                  onChange={(event) => update('avatarAlt', event.target.value)}
                  invalid={Boolean(errors['admin-avatar-alt'])}
                  aria-describedby={
                    errors['admin-avatar-alt'] ? 'admin-avatar-alt-error' : undefined
                  }
                />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="text-base font-semibold text-ink">简介与求职状态</legend>

            <Field
              id="admin-bio"
              label="个人简介"
              hint={`每行一段，最多 ${MAX_BIO} 段`}
              error={errors['admin-bio']}
            >
              <TextArea
                id="admin-bio"
                rows={8}
                value={draft.bio}
                onChange={(event) => update('bio', event.target.value)}
                invalid={Boolean(errors['admin-bio'])}
                aria-describedby={errors['admin-bio'] ? 'admin-bio-error' : 'admin-bio-hint'}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="admin-status" label="求职状态" error={errors['admin-status']}>
                <Select
                  id="admin-status"
                  value={draft.availabilityStatus}
                  onChange={(event) =>
                    update('availabilityStatus', event.target.value as AvailabilityStatus)
                  }
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                id="admin-status-text"
                label="状态文案"
                hint="显示在首页顶部标签与关于我列表"
                error={errors['admin-status-text']}
              >
                <TextInput
                  id="admin-status-text"
                  value={draft.availabilityText}
                  onChange={(event) => update('availabilityText', event.target.value)}
                  invalid={Boolean(errors['admin-status-text'])}
                  aria-describedby={
                    errors['admin-status-text'] ? 'admin-status-text-error' : undefined
                  }
                />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-base font-semibold text-ink">社交链接</legend>
            <p className="text-xs text-muted">最多 {MAX_SOCIALS} 个，显示在联系模块与页脚。</p>

            {draft.socials.map((social, index) => (
              <div key={social.id} className="rounded-xl border border-line p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id={`admin-social-label-${index}`}
                    label="名称"
                    error={errors[`admin-social-label-${index}`]}
                  >
                    <TextInput
                      id={`admin-social-label-${index}`}
                      value={social.label}
                      onChange={(event) => updateSocial(index, { label: event.target.value })}
                      invalid={Boolean(errors[`admin-social-label-${index}`])}
                    />
                  </Field>

                  <Field
                    id={`admin-social-url-${index}`}
                    label="链接"
                    error={errors[`admin-social-url-${index}`]}
                  >
                    <TextInput
                      id={`admin-social-url-${index}`}
                      value={social.url}
                      onChange={(event) => updateSocial(index, { url: event.target.value })}
                      invalid={Boolean(errors[`admin-social-url-${index}`])}
                    />
                  </Field>

                  <Field id={`admin-social-icon-${index}`} label="图标">
                    <Select
                      id={`admin-social-icon-${index}`}
                      value={social.icon}
                      onChange={(event) => updateSocial(index, { icon: event.target.value })}
                    >
                      {SOCIAL_ICON_NAMES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field
                    id={`admin-social-handle-${index}`}
                    label="账号"
                    hint="可留空"
                  >
                    <TextInput
                      id={`admin-social-handle-${index}`}
                      value={social.handle}
                      onChange={(event) => updateSocial(index, { handle: event.target.value })}
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSocial(index)}
                    className="text-danger hover:bg-danger/10 hover:text-danger"
                  >
                    删除这条链接
                  </Button>
                </div>
              </div>
            ))}

            <Button
              variant="secondary"
              size="sm"
              onClick={addSocial}
              disabled={draft.socials.length >= MAX_SOCIALS}
            >
              添加链接
            </Button>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="text-base font-semibold text-ink">站点信息</legend>

            <Field id="admin-site-title" label="站点标题" error={errors['admin-site-title']}>
              <TextInput
                id="admin-site-title"
                value={draft.siteTitle}
                onChange={(event) => update('siteTitle', event.target.value)}
                invalid={Boolean(errors['admin-site-title'])}
                aria-describedby={errors['admin-site-title'] ? 'admin-site-title-error' : undefined}
              />
            </Field>

            <Field
              id="admin-site-description"
              label="站点描述"
              hint={`${draft.siteDescription.trim().length}/160，用于搜索结果与分享卡片`}
              error={errors['admin-site-description']}
            >
              <TextArea
                id="admin-site-description"
                rows={3}
                value={draft.siteDescription}
                onChange={(event) => update('siteDescription', event.target.value)}
                invalid={Boolean(errors['admin-site-description'])}
                aria-describedby={
                  errors['admin-site-description']
                    ? 'admin-site-description-error'
                    : 'admin-site-description-hint'
                }
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="admin-site-author" label="作者名" error={errors['admin-site-author']}>
                <TextInput
                  id="admin-site-author"
                  value={draft.siteAuthor}
                  onChange={(event) => update('siteAuthor', event.target.value)}
                  invalid={Boolean(errors['admin-site-author'])}
                  aria-describedby={
                    errors['admin-site-author'] ? 'admin-site-author-error' : undefined
                  }
                />
              </Field>

              <Field
                id="admin-footer-since"
                label="页脚起始年份"
                error={errors['admin-footer-since']}
              >
                <TextInput
                  id="admin-footer-since"
                  type="number"
                  inputMode="numeric"
                  min={1990}
                  max={new Date().getFullYear()}
                  value={draft.footerSince}
                  onChange={(event) => update('footerSince', event.target.value)}
                  invalid={Boolean(errors['admin-footer-since'])}
                  aria-describedby={
                    errors['admin-footer-since'] ? 'admin-footer-since-error' : undefined
                  }
                />
              </Field>
            </div>

            <Field id="admin-footer-note" label="页脚备注" error={errors['admin-footer-note']}>
              <TextInput
                id="admin-footer-note"
                value={draft.footerNote}
                onChange={(event) => update('footerNote', event.target.value)}
                invalid={Boolean(errors['admin-footer-note'])}
                aria-describedby={
                  errors['admin-footer-note'] ? 'admin-footer-note-error' : undefined
                }
              />
            </Field>
          </fieldset>

          <div className="flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-center">
            <Button type="submit">
              <Save className="h-4 w-4" aria-hidden="true" />
              保存并在本机生效
            </Button>
            <Button variant="secondary" onClick={handleExport}>
              <Download className="h-4 w-4" aria-hidden="true" />
              导出 JSON
            </Button>
            <Button variant="secondary" onClick={() => void handleCopy()}>
              <Copy className="h-4 w-4" aria-hidden="true" />
              {copied ? '已复制' : '复制 JSON'}
            </Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" aria-hidden="true" />
              导入 JSON
            </Button>
            <Button variant="ghost" onClick={handleReset} className="sm:ml-auto">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              恢复默认
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                void handleImport(event);
              }}
            />
          </div>
        </form>
      </div>
    </Container>
  );
}
