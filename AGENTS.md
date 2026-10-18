# AGENTS · 协作与迭代规范

适用对象：参与本项目的所有 AI Agent 与人类协作者。动手前先读本文件，冲突时以本文件为准。

---

## 1. 项目一句话

配置驱动的开发者作品集：内容在 `src/config/` 与 `src/content/blog/`，组件只负责渲染。

**任何改动开始前先确认：这次改动属于「内容」还是「代码」？**

| 改动类型 | 允许触碰的位置 |
| --- | --- |
| 换个人信息、加项目、加文章、调主题色 | `src/config/`、`src/content/`、`public/`、`index.css` 顶部变量 |
| 改布局、交互、组件 | `src/components/`、`src/pages/`、`src/hooks/`、`src/lib/` |
| 改数据结构 | `src/types/` + 所有读取该字段的组件（需全量检索） |
| 改构建与部署 | `vite.config.ts`、`vercel.json`、`wrangler.jsonc`、`scripts/` |

`/admin` 的编辑能力不改变上面这条边界：它写的是浏览器 `localStorage`（`src/lib/content-override.ts`），不产生仓库文件改动，也不上传数据。

---

## 2. 角色分工

四个角色，单人项目可合并，但每个阶段必须有人对结果负责。

### 2.1 产品 / 架构 Agent

职责：

- 维护 `PRD.md` 与 `TECH_DESIGN.md`，保证文档与实际实现一致
- 决定模块取舍，拒绝「看起来酷但无用户价值」的需求
- 定义数据模型：先改 `src/types/`，再改配置与组件
- 评审时检查：是否违反「内容与代码分离」、是否引入运行时请求、是否新增依赖

产出物：需求条目（含验收标准）、类型定义、任务拆分。

### 2.2 界面 Agent

职责：

- 实现页面、区块与交互，遵循 `TECH_DESIGN.md` 第 9、10 节
- 保证亮/暗两套配色、320px 起的响应式、键盘可操作
- 新增组件时先找 `ui/` 是否已有可复用原语

产出物：组件代码、必要的样式变量、交互说明。

### 2.3 内容 Agent

职责：

- 维护 `src/config/*` 与 Markdown 文章
- 保证字段完整、日期格式 `YYYY-MM-DD`、slug 唯一
- 替换所有示例文案；上线前不得残留 lorem ipsum 或占位邮箱

产出物：可构建的内容文件、封面图、简历 PDF。

### 2.4 质量 Agent

职责：

- 执行第 6 节校验清单，复现并记录问题
- 对每个 bug 给出「现象 → 原因 → 修复 → 验证」四段式结论
- 拒绝以「看起来没问题」作为验收依据

---

## 3. 协作流程

```
需求 → 架构评审 → 实现 → 自检 → 质量验收 → 交付
```

| 阶段 | 输入 | 输出 | 交接条件 |
| --- | --- | --- | --- |
| 需求 | 用户诉求 | PRD 条目 + 验收标准 | 验收标准可被逐条勾选 |
| 架构评审 | PRD 条目 | 类型定义 + 影响面清单 | 明确涉及哪些文件 |
| 实现 | 类型 + 设计 | 代码 / 内容 | `npm run build` 通过 |
| 自检 | 代码 | 变更说明 | 通过第 6 节前四项 |
| 质量验收 | 变更说明 | 问题清单或通过结论 | 深层路由、暗色、移动端均验证 |
| 交付 | 全部 | 变更摘要 | 文档同步更新 |

交接时必须说明：**改了什么文件、为什么改、怎么验证、还有哪些已知限制**。禁止只说「已修复」。

---

## 4. 代码规范

### 4.1 TypeScript

- 严格模式，不使用 `any`；确需逃逸用 `unknown` + 收窄
- 配置对象用 `satisfies X`，不要用 `: X`（保留字面量推导）
- 枚举字段用联合字面量类型，不用 `enum`
- 外部数据（frontmatter）解析后必须逐字段收窄，不直接断言

### 4.2 React

- 函数组件 + hooks，不写 class 组件
- 一个文件一个主要导出；组件文件用 PascalCase
- 副作用统一放 `useEffect`，事件监听与 `IntersectionObserver` 必须在清理函数中断开
- 列表 `key` 使用稳定业务 id（`slug`、`id`），不用数组下标
- 避免 `useMemo`/`useCallback` 的默认堆砌：仅在依赖稳定性能收益或作为 effect 依赖时使用
- 不引入全局状态库。跨组件共享优先通过 props 或「读 DOM / 读配置」

### 4.3 样式

- 颜色只用 token：`bg-page`、`text-ink`、`border-line`、`text-muted`、`text-accent`
- 禁止动态拼接类名（`bg-${color}-500`），条件类用 `cn()` + 静态映射对象
- 新增设计变量加在 `src/index.css` 的 `:root` 与 `.dark` 两处，再映射到 `tailwind.config.js`
- 移动优先；交互元素高度不小于 36px（按钮 44px）
- 焦点状态必须有 `focus-visible:ring-2 focus-visible:ring-accent`

### 4.4 命名与组织

| 对象 | 约定 | 示例 |
| --- | --- | --- |
| 组件文件 | PascalCase | `ProjectCard.tsx` |
| Hook | `use` 前缀 | `useScrollSpy.ts` |
| 工具函数 | camelCase | `formatDate` |
| 配置导出 | 名词复数 / 单数 | `projects`、`profile`、`site` |
| 类型 | PascalCase | `BlogPostMeta` |
| CSS 变量 | `--kebab-case` | `--text-muted` |

导入顺序：第三方 → `@/` 别名 → 相对路径 → 样式。组内按字母序。

### 4.5 依赖

新增依赖前必须回答：

1. 现有依赖能否实现？
2. 包的 gzip 体积与维护状态？
3. 是否引入运行时网络请求或 Node API？

答案不充分则不引入。禁止为单个图标引入整套图标库（`lucide-react` 按需导入即可）。

---

## 5. 内容规范

### 5.1 文案

- 中文为主，中英文之间留空格；标点用中文全角
- 标题层级不跳级，正文不出现两个 `<h1>`
- 项目摘要 ≤ 80 字，Slogan ≤ 60 字
- 量化成果优先于形容词：「首屏从 3.2s 降到 1.1s」优于「性能大幅提升」

### 5.2 Markdown 文章

- 文件名即 URL，使用小写英文与连字符：`vite-static-deploy.md`
- frontmatter 必填 `title`、`summary`、`date`；`draft: true` 的文章不进产物
- 代码块必须标注语言，且限于 `ts` / `tsx` / `js` / `json` / `bash` / `html` / `css`
- 图片放 `public/`，用绝对路径引用；不使用外链图床
- 一篇一主题，长度 800–2500 字为宜

### 5.3 资源

| 资源 | 规格 |
| --- | --- |
| 头像 | 正方形，≥ 400×400，WebP/SVG |
| 项目封面 | 16:10，1200px 宽，≤ 200KB |
| 简历 PDF | A4，命名 `姓名-resume.pdf`，≤ 1MB |
| OG 图 | 1200×630（当前为 SVG，可换 PNG） |

---

## 6. 校验清单

提交前必须全部通过：

```bash
npm run build   # 内容校验 → 类型检查 → 打包
npm run lint    # 无 error
npm run preview # 人工验证用
```

人工验证：

- [ ] 五个路由可直接访问，**在每个页面按 Ctrl+R 强刷**不 404
- [ ] `/admin` 修改姓名后保存，刷新首页可见；「恢复默认」后回到配置值；导出的 JSON 能重新导入
- [ ] 暗色与亮色下正文、次要文字、边框均清晰
- [ ] 320px、768px、1280px 三个宽度无横向滚动、无遮挡
- [ ] 仅用键盘完成：跳至主内容 → 导航 → 项目详情 → 复制代码 → 返回
- [ ] 移动端菜单可用 Esc 关闭，关闭后焦点回到触发按钮
- [ ] 新增文章出现在列表；`draft: true` 的文章不出现
- [ ] 浏览器控制台无报错、无缺失资源的 404
- [ ] 所有示例内容已替换为真实信息

---

## 7. 迭代规范

### 7.1 提交

- 一个提交只做一件事；内容更新与代码改动分开提交
- 信息格式：`<type>: <简述>`，type 取 `feat` / `fix` / `style` / `content` / `docs` / `chore` / `refactor`
- 示例：`content: 新增 Vite 静态部署一文`、`fix: 修复深层路由刷新 404`

### 7.2 分支

- `main` 始终可构建、可部署
- 功能分支 `feat/<描述>`，修复分支 `fix/<描述>`
- 合并前必须通过第 6 节清单

### 7.3 文档同步

以下改动必须同步文档，否则视为未完成：

| 改动 | 需更新 |
| --- | --- |
| 配置字段增删 | `README.md` 字段表 + `src/types/` + `TECH_DESIGN.md` 第 5 节 |
| 新增命令或脚本 | `README.md` 命令表 |
| 部署方式变化 | `README.md` 第 7 节 + `TECH_DESIGN.md` 第 13 节 |
| 功能范围变化 | `PRD.md` 对应条目与验收标准 |

---

## 8. 禁止事项

- 在组件里硬编码个人信息、项目数据或文章正文
- 引入后端、数据库、运行时接口请求来完成本可静态化的功能
- 使用 `dangerouslySetInnerHTML` 渲染 Markdown
- 动态拼接 Tailwind 类名
- 为「以后可能用到」提前抽象组件或状态层
- 提交 `.env`、`node_modules`、`dist`、个人证件类文件
- 修改 `scripts/write-pages-redirects.mjs`、`wrangler.jsonc` 或 `vercel.json` 的 rewrites 而不做深层路由刷新验证
- 把 `_redirects` 放回 `public/`（Workers 会拒绝部署，见第 9 节）
- 让 `/admin` 或任何组件发起运行时网络请求、写入服务端或提交数据库
- 在 `/admin` 之外的组件里直接读写 `localStorage`（持久化统一走 `src/lib/content-override.ts`）
- 删除或绕过 `scripts/validate-content.mjs` 的校验
- 用「应该可以」代替实际运行构建

---

## 9. 常见故障定位

| 现象 | 先查 |
| --- | --- |
| 构建第一步失败 | 终端列出的 Markdown 文件名，按第 5.2 节补齐 frontmatter |
| 类型报错指向配置 | 是否漏了必填字段；`satisfies` 会精确指出 |
| 深层路由 404 | `vercel.json` rewrites 是否覆盖该路径；Workers 下检查 `wrangler.jsonc` 的 `not_found_handling`；Pages 下 `dist/_redirects` 是否存在（用 `build:pages`） |
| Cloudflare 报 `Invalid _redirects configuration` / `Infinite loop detected` | `public/_redirects` 是否被误加回来；Workers 不需要该文件，回退交给 `not_found_handling` |
| Cloudflare 构建报 Vite 版本无法自动配置 | `wrangler.jsonc` 是否缺失；不要升级 Vite 来绕过 |
| 首帧配色错误 | `dist/index.html` 中 `data-theme-default` 的值；内联脚本是否被改动 |
| `/admin` 保存后页面没变化 | 是否真的点到了「保存并在本机生效」；`localStorage` 中 `devfolio-content-v1` 是否存在；浏览器是否禁用了站点数据 |
| `/admin` 修改了但配置文件改了不生效 | 本地覆盖遮蔽了配置，先「恢复默认」或调整 `/admin` 里的值 |
| 样式部分失效 | 是否动态拼类名；新 token 是否同时加在 `:root` 与 `.dark` |
| 代码块无高亮 | 语言是否在 6 种之内；`rehype-highlight-subset.ts` 是否注册 |
| 移动端横向滚动 | 固定宽度元素、长代码块、超长无空格文本 |

---

## 10. Agent 回复要求

- 结论先行：先给「改了什么、结果如何」，再给细节
- 引用代码使用 `文件:行号` 格式
- 不夸大验证范围：没跑过的命令不说「已验证」
- 遇到需求冲突，先指出冲突并给出建议，不擅自扩大范围
- 每一步完成后说明下一步，长任务给出阶段小结
