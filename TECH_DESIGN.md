# TECH DESIGN · DevFolio

| 项 | 内容 |
| --- | --- |
| 架构类型 | 纯静态单页应用（CSR），构建期完成内容校验与打包 |
| 关键依赖 | React 18、TypeScript 5.6、Vite 5、TailwindCSS 3.4、React Router 6 |
| 运行时外部请求 | 无（不调用任何接口，不加载远端字体） |
| 产物 | `dist/` 静态文件，可托管于任意静态服务 |

---

## 1. 设计原则

1. **内容即数据**。页面组件只读 `src/config/*` 与 Markdown，不硬编码任何个人信息。
2. **构建期失败优于线上白屏**。frontmatter、类型、枚举在构建阶段校验，坏内容进不了产物。
3. **静态优先，按需加载**。无 SSR、无边缘函数；重模块（Markdown 渲染、语法高亮）不进首页包。
4. **样式单一来源**。颜色走 CSS 变量 → Tailwind token，禁止组件内写死色值。
5. **渐进增强**。核心内容以语义化 HTML 输出，JS 失效时仍可阅读（导航与复制功能除外）。

---

## 2. 技术选型

| 领域 | 选择 | 理由 | 未选方案 |
| --- | --- | --- | --- |
| 构建工具 | Vite 5 | 冷启动快，`import.meta.glob` 天然适合内容装载，配置面小 | Next.js（个人站不需要 SSR 与 RSC，成本过高） |
| 框架 | React 18 | 生态成熟，招聘场景熟悉度高 | Vue / Svelte（无技术理由，团队习惯） |
| 语言 | TypeScript 严格模式 | 配置对象用 `satisfies` 约束，改错字段立即报错 | 纯 JS（内容模型失去校验） |
| 样式 | TailwindCSS 3.4 + CSS 变量 | 原子类便于保持一致性；变量让主题切换只改一处 | CSS-in-JS（增加运行时与包体） |
| 路由 | React Router 6（`createBrowserRouter`） | 支持路由级懒加载、`basename`、嵌套布局 | 手写路由（重复造轮子） |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-slug` | 纯 AST 渲染，不引入 `dangerouslySetInnerHTML` | `marked` + `innerHTML`（XSS 面更大） |
| 高亮 | `lowlight` + 自写 rehype 插件 | 只注册 6 种语法，包体最小 | `rehype-highlight`（静态引入 common 语法包，无法 tree-shake） |
| frontmatter | `js-yaml` + `JSON_SCHEMA` | 避免 YAML 隐式类型把日期变成 Date 对象 | 手写正则解析（易错） |
| 图标 | `lucide-react` | 按需导入，风格统一 | 图标字体（额外请求） |
| 状态管理 | 无（React 内置） | 全站无跨页共享状态，`useState` + Context 足够 | Redux / Zustand（过度设计） |

---

## 3. 运行时架构

```
main.tsx
  └─ RouterProvider (basename 来自 BASE_URL)
       └─ App.tsx
            ├─ SkipToContent
            ├─ Header → DesktopNav / MobileMenu / ThemeToggle
            ├─ <main id="main"> → Suspense → 懒加载页面
            │    ├─ HomePage（Hero / Projects / Skills / About / BlogPreview / Contact）
            │    ├─ ProjectsPage → ProjectCard[]
            │    ├─ ProjectDetailPage → MarkdownRenderer
            │    ├─ BlogListPage → PostCard[]
            │    ├─ BlogPostPage → MarkdownRenderer
            │    └─ NotFoundPage
            ├─ Footer
            ├─ ScrollManager（滚动复位 / 锚点）
            └─ ScrollToTopButton
```

数据自下而上单向流动：`config → 页面 → 区块 → 展示组件`。没有全局 store，没有数据请求，也没有异步状态。

---

## 4. 目录结构

```
src/
├── config/                 ★ 业务内容（唯一需要日常编辑的目录之一）
│   ├── site.ts             站点信息、导航、页脚、默认主题
│   ├── profile.ts          个人信息、简介、社交链接
│   ├── projects.ts         项目数组
│   ├── skills.ts           技能分组
│   ├── experiences.ts      工作与教育时间线
│   ├── blog.ts             博客列表页文案与每页数量
│   └── index.ts            统一出口
├── content/blog/*.md       ★ 文章（另一个日常编辑目录）
├── types/                  Profile / Project / Skill / BlogPost / SiteConfig 等
├── lib/
│   ├── markdown.ts         glob 装载 + frontmatter 解析 + 排序 + 阅读时长
│   ├── rehype-highlight-subset.ts  自写高亮插件（6 种语言）
│   ├── theme.ts            主题读写与 DOM 应用
│   ├── format.ts           日期、数字、阅读时长格式化
│   ├── constants.ts        存储键、分页等常量
│   └── cn.ts               clsx + tailwind-merge
├── hooks/                  useTheme / useScrollSpy / useCopyToClipboard / useDocumentMeta / useMediaQuery / useLockBodyScroll
├── components/
│   ├── layout/             Header、DesktopNav、MobileMenu、Footer、ScrollManager、ScrollToTopButton、SkipToContent、ThemeToggle
│   ├── sections/           Hero、Projects、Skills、About、BlogPreview、Contact、ProjectCard
│   ├── ui/                 Button、Container、Tag、SectionHeading、Timeline、SkillLevelDots、EmailButton
│   └── blog/               MarkdownRenderer、PostCard
├── pages/                  6 个路由页面
├── router/index.tsx        路由表 + 懒加载 + Suspense 骨架
├── App.tsx                 布局壳
├── main.tsx                挂载入口
└── index.css               CSS 变量、全局样式、文章排版、滚动行为
```

---

## 5. 数据模型

```ts
type Theme = 'light' | 'dark';

interface Profile {
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
  availability: { status: 'open' | 'freelance' | 'closed'; text: string };
  socials: { id: string; label: string; url: string; icon: string; handle?: string }[];
}

interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;        // Markdown
  cover: string;
  coverAlt: string;
  stack: string[];
  role?: string;
  period?: string;
  highlights?: string[];
  links: { github?: string; demo?: string; article?: string };
  featured: boolean;
  status: 'live' | 'maintained' | 'archived' | 'wip';
  order: number;
}

type SkillLevel = 'expert' | 'advanced' | 'proficient' | 'learning';
interface SkillGroup { id: string; title: string; description?: string; skills: Skill[] }
interface Skill { name: string; level: SkillLevel; years?: number; icon?: string }

interface TimelineItem {
  id: string;
  type: 'work' | 'education';
  title: string;
  org: string;
  start: string;              // YYYY-MM
  end: string | 'present';
  location?: string;
  summary?: string;
  highlights?: string[];
  tags?: string[];
}

interface BlogPostMeta {
  slug: string;               // 由文件名派生
  title: string;
  summary: string;
  date: string;               // YYYY-MM-DD
  updated?: string;
  tags: string[];
  cover?: string;
  draft?: boolean;
  readingTime: number;        // 构建期估算
}
interface BlogPost extends BlogPostMeta { content: string }

interface SiteConfig {
  title: string;
  description: string;
  url: string;
  locale: string;
  author: string;
  ogImage: string;
  nav: { label: string; href: string }[];
  footer: { since: number; note: string };
  theme: { default: Theme | 'system' };
}
```

配置对象一律以 `satisfies X` 声明而不是 `: X`，既获得字段校验，又保留字面量类型用于推导。

---

## 6. 内容管线

### 6.1 TypeScript 配置

编译期直接 `import`。没有运行时解析开销，字段错误由 `tsc --noEmit` 捕获。

### 6.2 Markdown

`src/lib/markdown.ts`：

```ts
const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
```

流程：

1. Vite 在构建期把每个 `.md` 当字符串打包（`?raw`）。
2. `splitFrontmatter` 用正则切出 `---` 区段与正文。
3. `yaml.load(front, { schema: JSON_SCHEMA })` 解析，禁用隐式日期转换，日期统一按字符串处理。
4. 校验 `title`、`summary`、`date` 必填，缺失直接抛错（开发时错误浮层、构建时中断）。
5. `estimateReadingTime`：中文字数 / 400 + 英文词数 / 220，最少 1 分钟。
6. 过滤 `draft`，按 `date` 倒序，导出 `posts` 与 `getPostBySlug`。

**双保险**：`scripts/validate-content.mjs` 在 `npm run build` 第一步独立跑一遍同样的规则（Node 侧，不依赖 Vite）。目的是在类型检查与打包之前给出可读的文件级错误，而不是让 Vite 抛出 module 解析错误。

### 6.3 Markdown 渲染

`MarkdownRenderer` 使用 `react-markdown`，插件链：

| 插件 | 作用 |
| --- | --- |
| `remark-gfm` | 表格、任务列表、删除线、自动链接 |
| `rehype-slug` | 给标题加 id，支持 `#anchor` 直达 |
| `rehypeHighlightSubset` | 自写：只对 `language-*` 且已注册的语言做高亮 |

高亮插件的关键点：`createLowlight({ bash, css, javascript, json, typescript, xml })` 只引入这 6 个 `highlight.js/lib/languages/*`，因此 `highlight.js` 的 `common` 大包不进产物。未注册的语言保留原始文本，不报错。

`pre` 组件被替换为 `CodeShell`：顶部显示语言标签与复制按钮，正文 `overflow-x-auto`。复制读取 `preRef.current.textContent`，避免二次序列化。

---

## 7. 路由与代码分割

| 路由 | 组件 | 加载时机 |
| --- | --- | --- |
| `/` | HomePage | 首屏 |
| `/projects` | ProjectsPage | 进入时懒加载 |
| `/projects/:slug` | ProjectDetailPage | 进入时懒加载 |
| `/blog` | BlogListPage | 进入时懒加载 |
| `/blog/:slug` | BlogPostPage | 进入时懒加载（含 Markdown 渲染） |
| `*` | NotFoundPage | 进入时懒加载 |

- 所有页面 `React.lazy`，统一由 `withSuspense` 包裹，回退为与真实布局同尺寸的骨架，避免布局跳动。
- `basename` 从 `import.meta.env.BASE_URL` 派生：`'/'` 保持根路径，其余去掉末尾斜杠。实现「一份代码部署到子路径」。
- `vercel.json` 的 rewrites 与 `public/_redirects` 负责 SPA 回退，避免深层路由刷新 404。

实测包体（gzip）：

| chunk | 大小 | 说明 |
| --- | --- | --- |
| `react` | 66.7 KB | react + react-dom + router，手动分包便于长缓存 |
| `index` | 13.7 KB | 应用壳、布局、hooks |
| `HomePage` | 5.8 KB | 首页六区块 |
| `markdown` | 21.1 KB | 解析与插件 |
| `MarkdownRenderer` | 71.1 KB | 渲染器 + 高亮，仅博文与项目详情加载 |

首页首次加载约 90 KB（gzip）。

---

## 8. 主题系统

三层结构：

```
index.css  :root / .dark 定义 RGB 变量
   ↓
tailwind.config.js  colors: rgb(var(--x) / <alpha-value>)
   ↓
组件使用 bg-page / text-ink / border-line
```

切换与持久化：

1. `index.html` 的 `<head>` 内联脚本在首帧前读取 `localStorage['devfolio-theme']`（键名定义在 `src/lib/theme.ts`），无存储时读取 `document.documentElement.dataset.themeDefault`。
2. `data-theme-default` 由 `vite.config.ts` 的 `themeDefaultPlugin` 在 `transformIndexHtml` 阶段用 `site.theme.default` 替换 `%THEME_DEFAULT%`。这样默认值只有一处来源，且不会出现「先白后黑」。
3. 内联脚本同时设置 `color-scheme` 与 `meta[name="theme-color"]`。
4. 运行时 `useTheme` 读取当前 class，`applyTheme` 执行切换并写回存储。

为什么不用 `prefers-color-scheme` 媒体查询直接写 CSS：需要用户手动覆盖系统偏好，且要保证刷新后选择不丢，所以以 class 为准。

### 无障碍细节

- 内联脚本 `try/catch` 包裹：localStorage 被禁用时按系统偏好渲染，不阻断页面。
- 切换按钮带 `aria-label` 与 `aria-pressed`，焦点环可见。
- 动画使用 `motion-reduce:` 变体，尊重「减少动态效果」。

---

## 9. 样式与布局

- `maxWidth.container = 1120px`，页面统一通过 `Container` 应用 `px-5 sm:px-8`。
- 断点使用 Tailwind 默认值，移动优先；主要断点为 `sm`（640）与 `lg`（1024）。
- 字体栈不加载网络字体：中文走系统 `PingFang SC` / `Microsoft YaHei`，代码走 `ui-monospace` / `Consolas`。
- 文章排版在 `index.css` 的 `.prose-post` 下统一定义，避免引入 typography 插件。
- 类名一律静态书写。需要条件类时用 `cn()` 合并，不拼接字符串，保证 Tailwind 扫描得到。

---

## 10. 组件分层

| 层 | 职责 | 约束 |
| --- | --- | --- |
| `pages` | 组织数据与区块、设置页面元信息 | 不写可复用样式逻辑 |
| `sections` | 首页区块与卡片 | 只读 config，不发请求 |
| `ui` | 无业务语义的原语（Button、Tag、Container） | 不 import `@/config` |
| `layout` | 导航、页脚、滚动、跳转 | 可读 `site`/`profile` 的导航信息 |
| `blog` | Markdown 渲染与文章卡片 | 渲染器不感知具体文章 |

`ui` 层不使用业务数据，保证可以直接复制到其他项目复用。

---

## 11. 状态与 Hooks

| Hook | 作用 | 备注 |
| --- | --- | --- |
| `useTheme` | 当前主题 + 切换 | 初值从 DOM class 读取，避免与水合/内联脚本冲突 |
| `useScrollSpy` | 首页锚点高亮 | `IntersectionObserver`，卸载时断开 |
| `useCopyToClipboard` | 复制文本 + 2 秒回执 | `navigator.clipboard` 失败静默降级 |
| `useDocumentMeta` | 写入 title / description / og | 路由切换时更新，无 react-helmet 依赖 |
| `useMediaQuery` | 响应式 / 偏好查询 | `matchMedia` 监听；`usePrefersReducedMotion` 供滚动与动画降级使用 |
| `useLockBodyScroll` | 抽屉打开时锁定滚动 | 关闭时恢复原值，避免污染全局 |

无 Context Provider：主题状态只被 Header 使用，`useTheme` 直接读 DOM，天然全局一致。

---

## 12. 构建与校验

```
npm run build
  ├─ node scripts/validate-content.mjs   frontmatter 校验（失败即停）
  ├─ tsc --noEmit                        类型检查
  └─ vite build                          打包到 dist/
```

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 开发服务器，端口 5173 |
| `npm run build` | 上述三步 |
| `npm run preview` | 预览 `dist/`，用于验证回退与缓存 |
| `npm run typecheck` | 仅类型检查 |
| `npm run lint` | ESLint 9 flat config，含 `react-hooks` 规则 |
| `node scripts/generate-resume.mjs` | 生成示例简历 PDF |

ESLint 配置要点：TS 文件关闭 `no-undef`（由 TS 负责），保留 `react-hooks/rules-of-hooks` 为 error、`exhaustive-deps` 为 warn；`scripts/**/*.mjs` 单独注入 Node globals。

---

## 13. 部署

### 13.1 Vercel

`vercel.json`：

- `buildCommand` / `outputDirectory` 固定，导入仓库即可部署
- `rewrites`：除 `/assets/` 外全部回退 `index.html`（同时保留静态文件命中）
- `headers`：`/assets/*` 设置 `immutable` 长缓存（文件名带 hash，可安全强缓存）

### 13.2 Cloudflare Pages

构建命令与输出目录同上，`NODE_VERSION=20`。SPA 回退由 `public/_redirects` 提供，构建时原样复制到 `dist/_redirects`。

### 13.3 子路径

```bash
VITE_BASE=/repo/ npm run build
```

`base` 与路由 `basename` 同步派生，静态资源路径自动带前缀。

---

## 14. 已知限制

| 限制 | 说明 | 缓解 |
| --- | --- | --- |
| CSR，无预渲染 | 首屏依赖 JS；爬虫对 JS 渲染支持不一 | 首页静态 meta 完整；如需更强 SEO 可加 `vite-plugin-ssg` |
| 无全文搜索 | 文章数量增长后检索不便 | 当前按日期浏览即可；后续可加客户端索引 |
| `og:image` 为 SVG | 部分社交平台不渲染 SVG 卡片 | 替换为 1200×630 PNG |
| 无 sitemap | 依赖搜索引擎自行发现 | 需要时在构建后生成 |
| 主题仅两种 | 首访可跟随系统，之后只能亮/暗 | 依赖系统偏好的用户需手动切换一次 |

---

## 15. 扩展指引

**新增一种代码高亮语言**：在 `src/lib/rehype-highlight-subset.ts` 引入 `highlight.js/lib/languages/<lang>` 并加入 `createLowlight({...})`，同时在文章中使用对应 `language-<lang>`。

**新增页面**：在 `src/pages` 建组件 → 在 `router/index.tsx` 注册为 `lazy` → 如需导航入口，在 `src/config/site.ts` 的 `nav` 增加项。

**新增枚举值**（如项目状态）：先改 `src/types/*.ts`，再补组件内的静态映射对象（文案 + 颜色）。不要用模板字符串拼类名。

**替换头像 / 封面**：放入 `public/`，更新配置中的路径；建议 WebP、封面 1200px 宽、比例 16:10。
