// 產生「成片抽樣影格」的網格總覽，用來一眼檢查整片是否有缺字或排版異常。
// 用法：node scripts/final-sheet.mjs <stills 資料夾>
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) {
  console.error('用法：node scripts/final-sheet.mjs <stills 資料夾>');
  process.exit(1);
}

const chrome = path.join(
  root,
  'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe',
);

const frames = fs
  .readdirSync(dir)
  .filter((f) => f.startsWith('frame-') && f.endsWith('.png'))
  .map((f) => Number(f.replace('frame-', '').replace('.png', '')))
  .sort((a, b) => a - b);

const cols = 6;
const cell = 320;
const rows = Math.ceil(frames.length / cols);
const toUrl = (p) => 'file:///' + p.replace(/\\/g, '/');

const html = `<html><body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${cols},${cell}px)">
${frames
  .map(
    (f) => `<div style="position:relative;width:${cell}px;height:${Math.round((cell * 1080) / 1920)}px">
<img src="${toUrl(path.join(dir, `frame-${f}.png`))}" style="width:100%;display:block">
<span style="position:absolute;left:3px;top:1px;color:#0ff;font:11px monospace;background:#000a;padding:0 3px">${(f / 30).toFixed(1)}s</span></div>`,
  )
  .join('')}
</body></html>`;

const outDir = path.join(root, 'out', 'check');
fs.mkdirSync(outDir, { recursive: true });
const htmlPath = path.join(outDir, 'final-sheet.html');
fs.writeFileSync(htmlPath, html, 'utf8');

const outPath = path.join(outDir, 'final-sheet.png');
const result = spawnSync(
  chrome,
  [
    '--headless',
    '--disable-gpu',
    '--allow-file-access-from-files',
    '--hide-scrollbars',
    `--screenshot=${outPath}`,
    `--window-size=${cols * cell},${rows * Math.round((cell * 1080) / 1920)}`,
    toUrl(htmlPath),
  ],
  { stdio: 'ignore' },
);

console.log(result.status === 0 ? `OK ${outPath}` : 'FAILED');
console.log(`frames: ${frames.length}`);
