---
title: 把内容从组件里赶出去：配置驱动作品集的设计
summary: 判断一个作品集项目是否好维护，只看一件事：改一句自我介绍，需要打开几个文件。
date: 2025-02-18
tags: [React, TypeScript, 架构]
draft: false
---

## 问题出在"顺手"

写作品集时最容易出现这样的代码：

```tsx
<section>
  <h1>张三</h1>
  <p>5 年前端，擅长 React</p>
  <a href="mailto:zhangsan@example.com">联系我</a>
</section>
```

写的时候很快，三个月后想更新职位，就得在 JSX 里搜"前端工程师"四个字，然后判断哪一处是标题、哪一处是页脚、哪一处是 SEO 描述。

## 把"内容"和"形状"分开

配置驱动的核心不是"把数据放进 JSON"，而是**先定义形状，再填充内容**：

```ts
export interface Profile {
  name: string;
  role: string;
  headline: string[];
  slogan: string;
  email: string;
  bio: string[];
}
```

形状一旦固定，组件就只负责渲染：

```tsx
export function HeroSection({ profile }: { profile: Profile }) {
  return (
    <section id="home">
      <h1>{profile.name}</h1>
      <p>{profile.role}</p>
      <p>{profile.slogan}</p>
    </section>
  );
}
```

此时"改内容"变成了"改一个对象字面量"，不需要理解任何 JSX。

## 为什么用 `satisfies` 而不是 `as`

```ts
export const profile = {
  name: '文',
  role: '前端工程师',
  headline: ['React', 'TypeScript'],
  slogan: '...',
  email: 'wen@example.com',
  bio: [...],
} satisfies Profile;
```

两者的区别在实际维护中很明显：

| 写法 | 少写一个字段 | 保留字面量类型 | 编辑器提示 |
| --- | --- | --- | --- |
| `as Profile` | 不报错（断言绕过检查） | 丢失 | 弱 |
| `satisfies Profile` | 编译期报错 | 保留 | 强 |

配置写错时，你最希望发生的事情是**构建直接失败**。作品集可能半年才更新一次，运行时才发现白屏的成本太高。

## 组件里应该保留什么

把内容全部抽走之后，组件里剩下的应该只有三类东西：

- **布局**：栅格、间距、断点。
- **状态**：hover / focus / 展开收起。
- **语义**：`h1` 只能有一个，项目列表是 `ul`，文章是 `article`。

如果组件里出现了"星图数据""杭州"这类具体名词，说明抽象的位置放错了。

## 一个可执行的检查

在项目根目录跑：

```bash
rg "你的邮箱|你的姓名" src/components src/pages
```

输出为空，说明内容与视图已经分离干净。这个检查可以放进 CI，成本几乎为零。
