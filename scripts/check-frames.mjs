// 全片關鍵影格抽樣 + 自動檢查：
//   1. 渲染指定幀為 PNG
//   2. 用瀏覽器把 PNG 併成一張網格總覽（方便一次看完 90 秒）
// 用法：node scripts/check-frames.mjs [--sheet]
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const nodeBin = process.execPath;
const cli = path.join(root, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
const chrome = path.join(
  root,
  'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe',
);

/** 每段抽 2–3 個關鍵時間點（毫秒 → 幀） */
const SECONDS = [
  // S1 開場 0–8
  1.4, 3.6, 6.0, 7.6,
  // S2 定位 8–22
  9.5, 13.0, 16.5, 21.0,
  // S3 核心能力 22–45
  23.5, 28.0, 32.5, 38.0, 41.0, 44.0,
  // S4 真實案例 45–70
  46.5, 51.0, 55.5, 61.0, 66.0, 69.0,
  // S5 結尾 70–90
  72.5, 77.0, 82.0, 87.0, 89.0,
];

const outDir = path.join(root, 'out', 'check', 'sheet');
fs.mkdirSync(outDir, { recursive: true });

const frames = SECONDS.map((s) => Math.round(s * 30));
const files = [];
for (const frame of frames) {
  const file = path.join(outDir, `f${String(frame).padStart(4, '0')}.png`);
  if (!fs.existsSync(file)) {
    const res = spawnSync(
      nodeBin,
      [cli, 'still', 'DshIntro', file, `--frame=${frame}`, '--log=error'],
      { cwd: root, encoding: 'utf8' },
    );
    if (res.status !== 0) {
      console.error(`frame ${frame} FAILED`, res.stderr?.slice(0, 400));
      continue;
    }
    console.log(`rendered frame ${frame} (${(frame / 30).toFixed(1)}s)`);
  }
  files.push(file);
}

if (process.argv.includes('--sheet')) {
  const cols = 5;
  const cell = 384;
  const rows = Math.ceil(files.length / cols);
  const html = `<html><body style="margin:0;background:#000;display:grid;grid-template-columns:repeat(${cols},${cell}px)">
    ${files
      .map(
        (f, i) => `<div style="position:relative;width:${cell}px;height:${Math.round((cell * 1080) / 1920)}px">
        <img src="file:///${f.replace(/\\/g, '/')}" style="width:100%;display:block">
        <span style="position:absolute;left:4px;top:2px;color:#0ff;font:14px monospace;background:#000a;padding:1px 4px">${(SECONDS[i]).toFixed(1)}s</span>
      </div>`,
      )
      .join('')}
  </body></html>`;
  const htmlPath = path.join(outDir, 'sheet.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  const sheetPath = path.join(root, 'out', 'check', 'contact-sheet.png');
  const res = spawnSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--allow-file-access-from-files',
      '--hide-scrollbars',
      `--screenshot=${sheetPath}`,
      `--window-size=${cols * cell},${rows * Math.round((cell * 1080) / 1920)}`,
      `file:///${htmlPath.replace(/\\/g, '/')}`,
    ],
    { stdio: 'ignore' },
  );
  console.log(res.status === 0 ? `contact sheet: ${sheetPath}` : 'contact sheet failed');
}
