/**
 * 为 Cloudflare Pages 生成 dist/_redirects。
 *
 * Workers 静态资源部署会校验 _redirects：`/*  /index.html  200` 会被判定为
 * 无限循环（改写目标同样命中来源规则），直接拒绝上传。因此该文件不能放在
 * public/ 里随每次构建产出，只在显式执行 `npm run build:pages` 时写入。
 * Workers 路径的回退由 wrangler.jsonc 的 not_found_handling 负责。
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const target = join(root, 'dist', '_redirects');

writeFileSync(target, '/*  /index.html  200\n', 'utf8');
console.log('已写入 dist/_redirects（Cloudflare Pages 的 SPA 回退）');
