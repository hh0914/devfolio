---
title: 暗色主题不闪白：Tailwind 双主题的工程细节
summary: 主题切换本身只是一行 class，真正麻烦的是首帧：React 还没挂载时，页面已经画出来了。
date: 2025-01-07
tags: [TailwindCSS, 主题, 可访问性]
draft: false
---

## 闪白的来源

常见实现是在组件挂载后读取 `localStorage` 再切 class：

```tsx
useEffect(() => {
  const theme = localStorage.getItem('theme');
  document.documentElement.classList.toggle('dark', theme === 'dark');
}, []);
```

这段代码本身没错，但它执行时浏览器已经完成了首次绘制。暗色用户会看到一帧白底，视觉上像一次闪烁。

## 把决策提前到首次绘制之前

在 `index.html` 的 `<head>` 里放一段同步脚本，它会在 CSS 生效前决定 html 的 class：

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem('devfolio-theme');
      var dark = stored
        ? stored === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', dark);
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    } catch (e) {}
  })();
</script>
```

两个细节值得注意：

1. `try/catch` 不是可有可无。隐私模式下访问 `localStorage` 可能抛异常，一旦抛出，后面的代码全部中断。
2. `colorScheme` 会影响浏览器原生控件（滚动条、表单、日期选择器）的配色，只切背景色是不够的。

## 颜色用 CSS 变量，而不是两套类名

```css
:root {
  --bg: 255 255 255;
  --text: 17 24 39;
  --accent: 37 99 235;
}

.dark {
  --bg: 11 15 20;
  --text: 230 234 240;
  --accent: 96 165 250;
}
```

```js
colors: {
  page: 'rgb(var(--bg) / <alpha-value>)',
  ink: 'rgb(var(--text) / <alpha-value>)',
  accent: 'rgb(var(--accent) / <alpha-value>)',
}
```

好处是组件里只写 `bg-page text-ink`，不需要任何 `dark:` 前缀。`<alpha-value>` 让 `bg-page/80` 这类透明度修饰符继续可用。

## 几个容易踩的坑

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 部分元素没变暗 | 用了 `bg-white` 之类硬编码 | 全部替换为 token 类名 |
| 暗色下文字发灰 | 直接复用亮色的 muted 值 | 暗色单独给一组色值，并复核对比度 |
| 切换后刷新回退 | 只改了 class 没写存储 | 切换时同步写 `localStorage` |
| 动画很突兀 | 全局 `transition` 覆盖了颜色与背景 | 只对具体属性加 200ms 过渡 |

## 别忘减少动效偏好

```css
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

平滑滚动在暗色主题里同样会触发不适，这和配色无关，属于同一类可访问性问题。
