import type { Profile } from '@/types';

/**
 * 个人信息：修改本文件即可替换 Hero、关于我、联系模块的全部内容。
 * 必改字段：name / role / slogan / avatar / email / resumeUrl / socials
 */
export const profile = {
  name: '文',
  role: '前端工程师',
  headline: ['React', 'TypeScript', '工程化'],
  slogan: '把复杂交互拆成可维护的组件，把想法在一个下午上线。',
  avatar: '/avatar.svg',
  avatarAlt: '文的头像',
  location: '杭州',
  email: 'wen@example.com',
  resumeUrl: '/resume/wen-resume.pdf',
  bio: [
    '5 年前端开发经验，主要做中后台与数据类产品。写过业务表单、搭过组件库、也维护过几条 CI 流水线。',
    '偏好在动手之前先把数据结构想清楚：类型定准了，组件自然就好拆。日常关注构建工具与可访问性，习惯用 Lighthouse 而不是感觉来判断页面好坏。',
    '工作之外会写一些工具和文章，把踩过的坑整理成可以复用的结论。',
  ],
  availability: { status: 'open', text: '目前开放全职机会' },
  socials: [
    {
      id: 'github',
      label: 'GitHub',
      url: 'https://github.com/wen',
      icon: 'Github',
      handle: '@wen',
    },
    {
      id: 'juejin',
      label: '掘金',
      url: 'https://juejin.cn/user/wen',
      icon: 'BookOpen',
      handle: '文',
    },
    {
      id: 'mail',
      label: '邮箱',
      url: 'mailto:wen@example.com',
      icon: 'Mail',
    },
  ],
} satisfies Profile;
