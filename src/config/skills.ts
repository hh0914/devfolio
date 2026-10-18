import type { SkillGroup } from '@/types';

/**
 * 技能分组。level 只影响四档标识，不要填百分比：
 * expert 精通 / advanced 熟练 / proficient 熟悉 / learning 了解
 */
export const skillGroups = [
  {
    id: 'frontend',
    title: '前端',
    description: '日常主力，能独立负责从搭建到上线的完整链路。',
    skills: [
      { name: 'React', level: 'expert', years: 5 },
      { name: 'TypeScript', level: 'expert', years: 4 },
      { name: 'TailwindCSS', level: 'advanced', years: 3 },
      { name: 'Vue 3', level: 'proficient', years: 2 },
      { name: 'Next.js', level: 'proficient', years: 2 },
    ],
  },
  {
    id: 'build',
    title: '工程化',
    description: '关注构建速度、产物体积与协作流程。',
    skills: [
      { name: 'Vite', level: 'advanced', years: 3 },
      { name: 'GitHub Actions', level: 'advanced', years: 3 },
      { name: 'ESLint / Prettier', level: 'expert', years: 5 },
      { name: 'pnpm / Monorepo', level: 'advanced', years: 2 },
      { name: 'Playwright', level: 'proficient', years: 1 },
    ],
  },
  {
    id: 'backend',
    title: '后端与数据',
    description: '能读写接口与 SQL，足够支撑前端联调与自建小工具。',
    skills: [
      { name: 'Node.js', level: 'advanced', years: 4 },
      { name: 'PostgreSQL', level: 'proficient', years: 2 },
      { name: 'Prisma', level: 'proficient', years: 2 },
      { name: 'Redis', level: 'learning', years: 1 },
    ],
  },
  {
    id: 'other',
    title: '协作与其他',
    description: '让代码之外的环节也顺畅。',
    skills: [
      { name: 'Figma', level: 'proficient', years: 3 },
      { name: '技术写作', level: 'advanced', years: 3 },
      { name: '性能优化', level: 'advanced', years: 3 },
      { name: '可访问性', level: 'proficient', years: 2 },
    ],
  },
] satisfies SkillGroup[];
