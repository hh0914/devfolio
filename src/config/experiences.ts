import type { TimelineItem } from '@/types';

/** 工作与教育时间线，渲染时按 start 倒序。end 填 'present' 表示至今。 */
export const experiences: TimelineItem[] = [
  {
    id: 'xingtu',
    type: 'work',
    title: '高级前端工程师',
    org: '星图数据',
    start: '2022-07',
    end: 'present',
    location: '杭州',
    summary: '负责指标看板与数据探索产品的前端架构，带 3 人小组。',
    highlights: [
      '把 12 个重复的业务表格抽象成配置化组件，新看板页面开发时间从 2 天降到 2 小时。',
      '主导打包体积治理，首屏 JS 从 1.2MB 降到 380KB，LCP 从 4.1s 降到 1.7s。',
      '搭建组件库与文档站，团队 20+ 人复用。',
    ],
    tags: ['React', 'TypeScript', 'Vite', 'ECharts'],
  },
  {
    id: 'yunfan',
    type: 'work',
    title: '前端工程师',
    org: '云帆科技',
    start: '2020-03',
    end: '2022-06',
    location: '杭州',
    summary: '负责 SaaS 后台的表单与权限模块。',
    highlights: [
      '实现基于 JSON Schema 的动态表单引擎，覆盖 60+ 业务表单。',
      '把发布流程从手动 FTP 迁移到 GitHub Actions，发布耗时从 20 分钟降到 3 分钟。',
    ],
    tags: ['Vue 3', 'JavaScript', 'Webpack'],
  },
  {
    id: 'zjut',
    type: 'education',
    title: '计算机科学与技术 · 本科',
    org: '浙江工业大学',
    start: '2016-09',
    end: '2020-06',
    location: '杭州',
    summary: '主修数据结构、操作系统、计算机网络；校 ACM 队成员。',
  },
];
