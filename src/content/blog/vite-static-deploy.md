---
title: 一份配置，两个平台：Vite 静态站部署实录
summary: 同一个 dist 目录同时适配 Vercel 与 Cloudflare Pages，需要处理的差异其实只有三点：回退规则、输出目录和 Node 版本。
date: 2025-03-12
tags: [Vite, 部署, 工程化]
draft: false
---

## 先明确：静态导出不是"额外功能"

`vite build` 的默认行为就是静态导出：把 `index.html`、`assets/` 和 `public/` 下的文件写进 `dist/`。没有服务端渲染，也没有需要启动的进程。

这带来两个直接结论：

1. 托管平台只要能"把未知路径回退到 index.html"，单页应用就能正常工作。
2. 平台之间真正的差异不在构建，而在**路由回退、输出目录、Node 版本**这三件事。

## 三个平台差异点

| 差异点 | Vercel | Cloudflare |
| --- | --- | --- |
| 构建命令 | `npm run build` | `npm run build` |
| 输出目录 | `dist` | `dist` |
| SPA 回退 | `vercel.json` 的 `rewrites` | Workers 用 `wrangler.jsonc` 的 `not_found_handling`，Pages 用 `_redirects` |
| Node 版本 | 控制台设置 | 环境变量 `NODE_VERSION` |
| 缓存头 | `vercel.json` 的 `headers` | 平台默认 |

### Vercel：用 rewrites 兜住深层路由

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/((?!assets/).*)", "destination": "/index.html" }
  ]
}
```

注意 `source` 里的负向前瞻：静态资源不参与回退，否则一张不存在的图片会返回 HTML，控制台只会报一个含义模糊的解析错误。

### Cloudflare：Workers 用配置，Pages 用文件

两个产品处理回退的方式不同，这一点值得单独记下来。

Workers 的静态资源部署在 `wrangler.jsonc` 里声明：

```json
{
  "name": "devfolio",
  "compatibility_date": "2026-10-18",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

没有 `main` 字段，就不存在 Worker 脚本，只有静态资源；未命中文件时返回 `index.html` 200。

Pages 没有这个开关，只认产物的根目录下的 `_redirects`：

```
# dist/_redirects
/*  /index.html  200
```

关键差别在于：**这个文件不能留在 `public/` 里**。它会被 `vite build` 原样复制进 `dist/`，而 Workers 上传前会校验它，`/*  /index.html  200` 被判为无限循环（改写后的路径同样命中规则来源），直接拒绝部署并报 `Invalid _redirects configuration ... [code: 100324]`。

所以它只在 Pages 需要时才生成：

```json
{
  "scripts": {
    "build": "node scripts/validate-content.mjs && tsc --noEmit && vite build",
    "build:pages": "npm run build && node scripts/write-pages-redirects.mjs"
  }
}
```

构建成功不等于部署成功，这个坑正是发生在「已经上传了 29 个静态文件、最后一步提交版本」的时候。

## 验证顺序不要省

部署成功后按这个顺序点一遍，能覆盖 90% 的配置错误：

1. 打开首页，确认样式与字体正常。
2. 进入任意详情页（如 `/blog/xxx`）。
3. **在该页按 Ctrl+R 强刷**。
4. 再手输一个不存在的路径，确认命中 404 页面而不是平台默认页。

第 3 步是最容易漏掉的一步。构建成功不代表路由可用，很多"上线后链接打不开"都出在这里。

## 一条经验

回退规则属于**部署配置**，不要试图用前端代码兜底。曾经见过在应用里判断 `location.pathname` 然后 `navigate` 回去的写法，刷新时浏览器拿到的仍然是平台的 404 响应，前端代码根本没有机会执行。
