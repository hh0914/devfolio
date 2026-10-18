/**
 * 生成一份最小可用的 PDF 简历占位文件（纯 ASCII 文本，Helvetica）。
 * 用法：node scripts/generate-resume.mjs
 * 换成真实简历时，直接用同名 PDF 覆盖 public/resume/wen-resume.pdf 即可。
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'resume');
mkdirSync(outDir, { recursive: true });

const escapeText = (text) => text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

let cursorY = 742;
const ops = ['0.145 0.388 0.921 rg 56 800 64 4 re f'];

function text(value, { size = 9.5, bold = false, color = '0.1 0.1 0.12 rg', gap = 1.6 } = {}) {
  const font = bold ? 'F2' : 'F1';
  ops.push(`BT /${font} ${size} Tf ${color} 1 0 0 1 56 ${cursorY} Tm (${escapeText(value)}) Tj ET`);
  cursorY -= size * gap;
}

function section(title) {
  cursorY -= 10;
  text(title.toUpperCase(), { size: 9, bold: true, color: '0.145 0.388 0.921 rg', gap: 1.9 });
  ops.push(`0.85 0.88 0.92 RG 0.6 w 56 ${cursorY + 12} m 539 ${cursorY + 12} l S`);
  cursorY -= 2;
}

function bullet(value) {
  text(`-  ${value}`, { size: 9.5, gap: 1.55 });
}

text('Wen', { size: 24, bold: true, gap: 1.5 });
text('Frontend Engineer  /  React  /  TypeScript  /  Build Tooling', {
  size: 10.5,
  color: '0.29 0.33 0.39 rg',
  gap: 1.9,
});
text('Hangzhou, China  ·  wen@example.com  ·  github.com/wen', {
  size: 9,
  color: '0.29 0.33 0.39 rg',
  gap: 1.8,
});

section('Summary');
text('5 years building data-heavy web products. Focus on component architecture,', { gap: 1.5 });
text('build performance and accessibility. Comfortable owning a feature end to end.', { gap: 1.5 });

section('Experience');
text('Senior Frontend Engineer  ·  Xingtu Data  ·  2022.07 - Present', { bold: true, gap: 1.5 });
bullet('Abstracted 12 duplicated data tables into a config-driven component; new dashboards ship in 2 hours instead of 2 days.');
bullet('Cut first-load JS from 1.2 MB to 380 KB and LCP from 4.1s to 1.7s.');
bullet('Built the shared component library and docs site used by 20+ engineers.');

cursorY -= 6;
text('Frontend Engineer  ·  Yunfan Tech  ·  2020.03 - 2022.06', { bold: true, gap: 1.5 });
bullet('Implemented a JSON Schema driven form engine covering 60+ internal forms.');
bullet('Migrated releases from manual FTP to GitHub Actions: 20 min to 3 min.');

section('Selected Projects');
text('DevFolio - static portfolio driven entirely by config files and Markdown.', { gap: 1.5 });
text('md-press - zero-runtime Markdown documentation generator, published on npm.', { gap: 1.5 });

section('Skills');
text('React, TypeScript, Vite, TailwindCSS, Node.js, PostgreSQL, Playwright, Figma', { gap: 1.5 });

section('Education');
text('B.Eng. in Computer Science  ·  Zhejiang University of Technology  ·  2016 - 2020', { gap: 1.5 });

const stream = ops.join('\n');
const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  `<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}\nendstream`,
];

let pdf = '%PDF-1.4\n';
const offsets = [];

objects.forEach((body, index) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'));
  pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefOffset = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of offsets) {
  pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
}
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

const target = join(outDir, 'wen-resume.pdf');
writeFileSync(target, Buffer.from(pdf, 'latin1'));
console.log(`resume written: ${target} (${Buffer.byteLength(pdf, 'latin1')} bytes)`);
