# DevFolio · 配置驱动的开发者作品集

一个**纯静态**的开发者个人作品集站点。结构参考 `emmabostian/developer-portfolios` 中大量真实上线作品集的共性模块，内容全部由 TypeScript 配置文件与 Markdown 驱动 —— **换内容不需要改组件代码**。

- 技术栈：React 18 + TypeScript 5 + Vite 5 + TailwindCSS 3.4
- 无后端、无数据库、无运行时接口请求
- 产物 `dist/` 可直接部署到 Vercel、Cloudflare Workers 或 Cloudflare Pages
- 亮/暗双主题、响应式、键盘可操作

---

## 1. 功能一览

| 模块 | 内容 |
| --- | --- |
| Hero | 头像、姓名、职位标签、Slogan、三个 CTA（查看项目 / 下载简历 / 联系我） |
| 关于我 | 个人简介 + 工作与教育时间线 |
| 技能栈 | 分组展示，四档熟练度标识（精通 / 熟练 / 熟悉 / 了解） |
| 项目作品 | 卡片网格（封面、摘要、技术标签、源码与预览链接）+ 项目详情页 |
| 博客 | 本地 Markdown 渲染，支持 GFM 表格、代码高亮与一键复制 |
| 联系 | 一键复制邮箱 + 社交链接 |
| 全局 | 吸顶导航、移动端抽屉菜单、主题切换、平滑滚动、404 页、页面级 SEO |

首页首次加载的 JS 约 90KB（gzip），博客详情页按需加载 Markdown 与高亮模块。

---

## 2. 环境要求

| 项 | 版本 |
| --- | --- |
| Node.js | ≥ 18（推荐 20 LTS，本项目在 24 上验证） |
| npm | ≥ 9 |
| 浏览器 | Chrome / Edge / Safari 15+ / Firefox 最新版 |

---

## 3. 快速开始

```bash
npm install
npm run dev
# http://localhost:5173
```

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发，热更新 |
| `npm run build` | 校验 Markdown → 类型检查 → 构建，输出 `dist/` |
| `npm run preview` | 本地预览构建产物 |
| `npm run typecheck` | 仅做 TypeScript 类型检查 |
| `npm run lint` | ESLint 检查 |
| `npm run deploy` | 部署到 Cloudflare Workers（本地需先 `npx wrangler login`） |
| `node scripts/generate-resume.mjs` | 生成示例简历 PDF |

---

## 4. 修改内容（核心）

**所有个人内容都在 `src/config/` 与 `src/content/` 下，不需要打开 `src/components` 或 `src/pages`。**

### 4.1 个人信息 — `src/config/profile.ts`

| 字段 | 说明 | 必填 |
| --- | --- | --- |
| `name` | 姓名 | 是 |
| `role` | 职位，如「前端工程师」 | 是 |
| `headline` | 职位标签数组，显示在姓名下方 | 是 |
| `slogan` | 一句话介绍，建议 ≤ 60 字 | 是 |
| `avatar` | 头像地址，默认 `/avatar.svg`，可换成 `/avatar.webp` | 是 |
| `avatarAlt` | 头像替代文本 | 是 |
| `location` | 城市 | 是 |
| `email` | 邮箱，联系模块的复制按钮使用该值 | 是 |
| `resumeUrl` | 简历路径，文件放 `public/resume/` | 是 |
| `bio` | 个人简介，数组每项一段 | 是 |
| `availability` | 求职状态，`status` 取 `open` / `freelance` / `closed` | 是 |
| `socials` | 社交链接，`icon` 支持 `Github` / `BookOpen` / `Mail` / `Twitter` / `Globe` | 是 |

### 4.2 站点信息 — `src/config/site.ts`

修改 `title`、`description`、`url`（部署后的正式域名，用于分享卡片）、`nav`（导航项）、`footer`、`theme.default`。

`theme.default` 取 `system`（跟随系统）、`light` 或 `dark`（强制）。构建时该值会被注入 `index.html`，首帧即为正确配色；访客点击切换后以本地存储的偏好为准。

### 4.3 新增项目 — `src/config/projects.ts`

在 `projects` 数组里追加对象：

```ts
{
  slug: 'my-project',                 // 唯一，地址为 /projects/my-project
  title: '项目名称',
  summary: '一句话摘要，卡片显示，建议 ≤ 80 字',
  description: '详情页正文，支持 Markdown',
  cover: '/covers/my-project.webp',   // 放 public/covers/
  coverAlt: '项目首页截图',
  stack: ['React', 'TypeScript'],
  role: '独立开发',
  period: '2025.01 - 2025.03',
  highlights: ['上线 3 个月日活 2000+'],
  links: { github: 'https://github.com/...', demo: 'https://...' },
  featured: true,                     // 是否出现在首页精选区
  status: 'live',                     // live / maintained / archived / wip
  order: 1,                           // 越小越靠前
}
```

封面建议 WebP、宽 1200px、体积 < 200KB，比例 16:10。

### 4.4 新增博客 — `src/content/blog/*.md`

新建 `src/content/blog/your-slug.md`：

```markdown
---
title: 用 Vite 把静态站点部署到两个平台
summary: 一份配置同时适配 Vercel 与 Cloudflare Pages 的实践记录。
date: 2025-03-12
tags: [Vite, 部署]
draft: false
---

## 为什么需要两份配置

正文从这里开始。
```

| 字段 | 说明 | 必填 |
| --- | --- | --- |
| `title` | 文章标题 | 是 |
| `summary` | 摘要，列表页显示 | 是 |
| `date` | 发布日期，`YYYY-MM-DD` | 是 |
| `tags` | 标签数组 | 否 |
| `draft` | `true` 时构建产物中不可见 | 否 |
| `updated` | 更新日期 | 否 |

文件名即 URL：`vite-static-deploy.md` → `/blog/vite-static-deploy`。

代码块支持 `ts` / `tsx` / `js` / `json` / `bash` / `html` / `css`，其余语言降级为纯文本。改动不符合规则时，`npm run build` 会在第一步失败并指出文件名。

### 4.5 修改技能 — `src/config/skills.ts`

```ts
export const skillGroups = [
  {
    id: 'frontend',
    title: '前端',
    skills: [
      { name: 'React', level: 'expert', years: 5 },
      { name: 'TypeScript', level: 'advanced' },
    ],
  },
] satisfies SkillGroup[];
```

### 4.6 修改主题色

编辑 `src/index.css` 顶部的 CSS 变量（RGB 以空格分隔）：

```css
:root {
  --accent: 37 99 235;
}
.dark {
  --accent: 96 165 250;
}
```

---

## 5. 目录结构

```
src/
├── config/          ★ 全部业务内容
├── content/blog/    ★ Markdown 文章
├── types/           数据类型定义
├── lib/             Markdown 装载、格式化、主题、高亮插件
├── hooks/           主题、滚动监听、复制、元信息等
├── components/      layout / sections / ui / blog
├── pages/           6 个页面
├── router/          路由表（懒加载 + SPA 回退兼容）
├── App.tsx
└── index.css        主题变量、全局样式、文章排版
public/              原样复制的静态资源（头像、封面、简历、_redirects）
scripts/             构建前内容校验、简历生成
```

---

## 6. 构建与预览

```bash
npm run build    # 产出 dist/
npm run preview  # 本地模拟静态托管
```

`dist/` 内容：

```
dist/
├── index.html
├── assets/        带 hash 的 JS / CSS
├── covers/        项目封面
├── resume/        简历 PDF
├── avatar.svg
├── favicon.svg
├── og-image.svg
├── robots.txt
└── _redirects     SPA 路由回退
```

---

## 7. 部署

### 7.1 Vercel

1. 推送到 GitHub。
2. Vercel → **Add New → Project** → 导入仓库。
3. Framework Preset 选 **Vite**（构建 `npm run build`，输出 `dist`）。
4. Settings → General → Node.js Version 选 **20.x**。
5. **Deploy**。
6. 验证：打开首页 → 进入任意详情页 → **在该页按 Ctrl+R 强刷** → 应正常显示。

`vercel.json` 已包含 SPA 回退与静态资源长缓存，无需额外设置。

### 7.2 Cloudflare Workers（当前使用）

仓库根目录的 `wrangler.jsonc` 把项目声明为「纯静态资源」部署，不包含 Worker 脚本：

```jsonc
{
  "name": "devfolio",
  "compatibility_date": "2026-10-18",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

1. Workers & Pages → **Create → Workers → Connect to Git**，选择本仓库与 `main` 分支。
2. 构建命令 `npm run build`，部署命令保持默认 `npx wrangler deploy`。
3. 推送后自动构建，完成后访问 `https://devfolio.<你的子域>.workers.dev`。
4. 验证：进入任意详情页后按 Ctrl+R 强刷，应正常显示。

SPA 回退由 `assets.not_found_handling = "single-page-application"` 提供，不依赖 `_redirects`。Worker 名必须与 `wrangler.jsonc` 中的 `name` 一致，否则会部署成另一个 Worker。

> 若构建日志出现 `The version of Vite ... cannot be automatically configured`，说明 `wrangler.jsonc` 缺失，`wrangler deploy` 走了框架自动配置并试图接入 Cloudflare Vite 插件。恢复该文件即可，不要为此升级 Vite。

### 7.3 Cloudflare Pages（可选）

1. Workers & Pages → **Create → Pages → Connect to Git**。
2. 构建命令 `npm run build`，输出目录 `dist`。
3. 环境变量加 `NODE_VERSION = 20`。
4. **Save and Deploy**，同样验证深层路由刷新。

SPA 回退由 `public/_redirects`（构建后进入 `dist/_redirects`）提供。

### 7.4 部署到子路径（如 GitHub Pages 项目页）

```bash
VITE_BASE=/your-repo/ npm run build
```

此外需把 `src/router/index.tsx` 中的 `basename` 同步为 `/your-repo`（代码已读取 `BASE_URL`，通常无需改动）。

---

## 8. 常见问题

| 现象 | 原因 | 解决 |
| --- | --- | --- |
| 刷新深层路由 404 | 平台未做 SPA 回退 | 确认 `vercel.json` rewrites、`wrangler.jsonc` 的 SPA 模式或 `_redirects` 已生效 |
| Cloudflare 构建报 Vite 版本无法自动配置 | 缺少 `wrangler.jsonc`，`wrangler deploy` 走了框架自动配置 | 恢复根目录的 `wrangler.jsonc`，不要为此升级 Vite |
| 白屏、资源 404 | 部署在子路径但未设 `base` | 用 `VITE_BASE` 重新构建 |
| 首帧白屏后变黑 | 主题预置脚本被移除 | 检查 `index.html` 的 `<head>` 内联脚本 |
| 样式部分失效 | 动态拼接 Tailwind 类名 | 改为静态映射对象 |
| 新文章不显示 | `draft: true` 或日期格式错误 | 改为 `false`，日期用 `YYYY-MM-DD` |
| 构建第一步失败 | frontmatter 缺字段 | 按终端提示的文件名补齐 |
| 代码块无高亮 | 语言不在六种之内 | 改用支持的语言，或在 `src/lib/rehype-highlight-subset.ts` 注册 |
| 移动端横向滚动 | 固定宽度元素或长代码块 | 容器 `max-w-full`，代码块 `overflow-x-auto` |

---

## 9. 相关文档

| 文档 | 内容 |
| --- | --- |
| `PRD.md` | 需求背景、用户场景、功能优先级、验收标准 |
| `TECH_DESIGN.md` | 技术选型、目录结构、数据模型、部署方案 |
| `AGENTS.md` | 多 Agent 协作分工、代码与迭代规范 |

---

## 10. 许可

个人使用可自由修改。示例文案与图片仅作演示，替换为你自己的内容后再发布。
