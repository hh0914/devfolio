/**
 * 构建前校验 Markdown frontmatter，把内容错误挡在构建阶段。
 * 与 src/lib/markdown.ts 的规则保持一致（同一套 YAML schema 与必填字段）。
 */
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'src', 'content', 'blog');

const files = readdirSync(dir).filter((file) => file.endsWith('.md'));
const errors = [];

for (const file of files) {
  const source = readFileSync(join(dir, file), 'utf8');
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);

  if (!match || match[1] === undefined) {
    errors.push(`${file}: 缺少 frontmatter 区块`);
    continue;
  }

  let meta;
  try {
    meta = yaml.load(match[1], { schema: yaml.JSON_SCHEMA });
  } catch (error) {
    errors.push(`${file}: frontmatter 不是合法 YAML（${String(error)}）`);
    continue;
  }

  if (typeof meta !== 'object' || meta === null || Array.isArray(meta)) {
    errors.push(`${file}: frontmatter 不是对象`);
    continue;
  }

  const record = meta;
  if (typeof record.title !== 'string' || record.title.trim() === '') {
    errors.push(`${file}: 缺少 title`);
  }
  if (typeof record.summary !== 'string' || record.summary.trim() === '') {
    errors.push(`${file}: 缺少 summary`);
  }
  if (typeof record.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(record.date)) {
    errors.push(`${file}: date 缺失或不是 YYYY-MM-DD`);
  }
  if (record.tags !== undefined && !Array.isArray(record.tags)) {
    errors.push(`${file}: tags 必须是数组`);
  }
  if (record.draft !== undefined && typeof record.draft !== 'boolean') {
    errors.push(`${file}: draft 必须是布尔值`);
  }
}

if (errors.length > 0) {
  console.error('[content] Markdown 校验失败：');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`[content] ${files.length} 篇 Markdown 校验通过`);
