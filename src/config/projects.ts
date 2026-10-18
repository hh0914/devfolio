import type { Project } from '@/types';

/**
 * 项目作品集。新增项目：在数组里追加对象即可，
 * 封面图放 public/covers/，slug 会成为 /projects/<slug> 的地址。
 */
export const projects: Project[] = [
  {
    slug: 'devfolio',
    title: 'DevFolio · 配置驱动作品集',
    summary: '把内容从组件里赶出去：一份 TypeScript 配置生成完整作品集站点，10 分钟完成替换。',
    description: `
## 背景

做作品集最大的成本不是写页面，而是每次更新都要翻组件找文案。这个项目把结构固化成骨架，把内容全部外置到 \`src/config\` 与 \`src/content\`。

## 我做了什么

- 设计 Profile / Skill / Project / BlogPost 四组类型，配置用 \`satisfies\` 约束，写错字段在构建期就报错。
- 博客走 \`import.meta.glob\` + \`?raw\` 在构建期装载 Markdown，运行时不发任何请求。
- 主题采用 \`<head>\` 内联脚本预置 class，首帧即正确，避免"先白后黑"。
- 路由级懒加载，Markdown 渲染器只随博客详情页加载。

## 结果

| 指标 | 数值 |
| --- | --- |
| 首屏 JS（gzip） | 152 KB |
| Lighthouse 移动端 | 98 分 |
| 部署平台 | Vercel / Cloudflare Pages |
| 后端依赖 | 0 |
    `.trim(),
    cover: '/covers/devfolio.svg',
    coverAlt: 'DevFolio 首页在浏览器中的截图占位图',
    stack: ['React', 'TypeScript', 'Vite', 'TailwindCSS'],
    role: '独立开发',
    period: '2025.02 - 2025.03',
    highlights: [
      '全站文案 0 处硬编码，替换内容不改组件代码',
      '双平台部署验证，深层路由刷新不 404',
    ],
    links: {
      github: 'https://github.com/wen/devfolio',
      demo: 'https://devfolio.example.com',
    },
    featured: true,
    status: 'live',
    order: 1,
  },
  {
    slug: 'opsboard',
    title: 'Opsboard · 指标看板',
    summary: '面向运营的实时指标看板，支持拖拽布局与 30+ 图表类型，服务公司内 200+ 用户。',
    description: `
## 背景

运营团队每天要从 6 个系统里手工汇总数据，一次周报要花 3 小时。项目目标是把这些查询固化成可复用的看板。

## 我做了什么

- 基于 grid layout 实现拖拽编排，布局以 JSON 持久化，支持模板复制。
- 封装图表配置层，30+ 图表共用一套数据映射，新增图表类型平均 1 天。
- 引入增量渲染与虚拟滚动，单页 200 个卡片仍保持 60fps。
- 与后端约定统一的查询 DSL，前端只描述"要什么"，不拼 SQL。

## 结果

| 指标 | 优化前 | 优化后 |
| --- | --- | --- |
| 周报耗时 | 180 分钟 | 15 分钟 |
| 首屏渲染 | 3.8s | 1.2s |
| 日均活跃 | 30 | 200+ |
    `.trim(),
    cover: '/covers/opsboard.svg',
    coverAlt: 'Opsboard 指标看板界面占位图',
    stack: ['React', 'TypeScript', 'ECharts', 'Zustand', 'Node.js'],
    role: '前端负责人',
    period: '2023.04 - 2024.08',
    highlights: [
      '看板配置化，新页面开发从 2 天缩短到 2 小时',
      '单页 200 卡片保持 60fps',
    ],
    links: {
      github: 'https://github.com/wen/opsboard',
    },
    featured: true,
    status: 'maintained',
    order: 2,
  },
  {
    slug: 'md-press',
    title: 'md-press · 文档站生成器',
    summary: '一个命令把 Markdown 目录变成文档站，零运行时依赖，产物可直接丢到 CDN。',
    description: `
## 背景

团队内部有 6 个文档仓库，样式各不相同。需要一个足够小的工具，把 Markdown 目录直接编译成静态站点。

## 我做了什么

- 用 Node 读取目录树，解析 frontmatter 生成侧边栏与搜索索引。
- 输出纯静态 HTML + 一份 JSON 索引，浏览器端不依赖任何框架。
- 支持代码高亮、表格、任务列表，以及基于标题的锚点跳转。
- 发布到 npm，提供 \`build\` 与 \`deploy\` 两个子命令。

## 结果

42 篇文档构建耗时 1.2 秒，产物体积 1.8MB，已被 3 个内部仓库采用。
    `.trim(),
    cover: '/covers/mdpress.svg',
    coverAlt: 'md-press 命令行输出占位图',
    stack: ['Node.js', 'TypeScript', 'Markdown', 'CLI'],
    role: '独立开发',
    period: '2024.10 - 2024.12',
    highlights: ['42 篇文档构建 1.2s', 'npm 周下载 200+'],
    links: {
      github: 'https://github.com/wen/md-press',
      article: 'https://juejin.cn/post/000000',
    },
    featured: true,
    status: 'live',
    order: 3,
  },
  {
    slug: 'ui-kit',
    title: '内部组件库',
    summary: '20 人团队共用的 React 组件库，覆盖表单、表格、弹层三类高频场景。',
    description: `
## 背景

三个产品线各自维护一套按钮和表格，改一次样式要改三遍。

## 我做了什么

- 以 Tailwind + 设计 token 为基础，输出 32 个组件与一份可交互文档站。
- 建立语义化版本与变更日志，破坏性变更提前一个大版本标注。
- 接入 Visual Regression 检查，避免样式改动误伤其他产品线。

## 结果

组件复用率 78%，同类需求开发时间平均下降 40%。
    `.trim(),
    cover: '/covers/ui-kit.svg',
    coverAlt: '组件库文档站占位图',
    stack: ['React', 'TypeScript', 'TailwindCSS', 'Storybook'],
    role: '核心维护者',
    period: '2023.09 - 至今',
    highlights: ['32 个组件，复用率 78%', '三端产品线统一升级'],
    links: {
      github: 'https://github.com/wen/ui-kit',
    },
    featured: false,
    status: 'maintained',
    order: 4,
  },
];
