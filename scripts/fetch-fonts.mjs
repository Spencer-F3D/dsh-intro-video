// 下載 Noto Sans TC（OFL-1.1）並依 GLYPH_TEXT 縮小子集，輸出到 public/fonts/。
// 本機與 GitHub Actions 共用；可重複執行（已存在則略過下載）。
// 用法：node scripts/fetch-fonts.mjs
//
// 產出：
//   public/fonts/source/*.woff2       原始子集檔
//   public/fonts/fonts.manifest.json  給 src/lib/fonts.ts 用（URL 一律經 staticFile 包裝）
// 不使用 CSS，因為 Remotion 要求 public/ 資源必須經過 staticFile()。

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "public", "fonts");
const cacheDir = path.join(outDir, "source");
fs.mkdirSync(cacheDir, { recursive: true });

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const WEIGHTS = [400, 500, 700, 900];

function parseFaces(css) {
  const faces = [];
  for (const block of css.split("@font-face").slice(1)) {
    const range = block.match(/unicode-range:\s*([^;]+);/);
    const url = block.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (range && url) faces.push({ range: range[1].trim(), url: url[1] });
  }
  return faces;
}

function covers(range, codepoints) {
  return range.split(",").some((part) => {
    const m = part.trim().match(/^U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?$/);
    if (!m) return false;
    const lo = parseInt(m[1], 16);
    const hi = m[2] ? parseInt(m[2], 16) : lo;
    return codepoints.some((cp) => cp >= lo && cp <= hi);
  });
}

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return false;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`下載失敗 ${res.status}: ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return true;
}

const { GLYPH_TEXT } = await import(
  new URL("../src/content/glyphs.generated.ts", import.meta.url).href
);
const codepoints = [...new Set([...GLYPH_TEXT].map((c) => c.codePointAt(0)))];

const facesOut = [];
for (const weight of WEIGHTS) {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@${weight}&display=swap`, {
      headers: { "User-Agent": UA },
    })
  ).text();
  const picked = parseFaces(css).filter((f) => covers(f.range, codepoints));
  if (picked.length === 0) throw new Error(`weight ${weight}: 找不到涵蓋所需字元的子集`);

  for (const [i, face] of picked.entries()) {
    const name = `NotoSansTC-${weight}-subset${i}.woff2`;
    const dest = path.join(cacheDir, name);
    await download(face.url, dest);
    // 保留 unicode-range：載入時據此建立 @font-face，瀏覽器才會把每個字交給正確的子集
    facesOut.push({ weight, file: `fonts/source/${name}`, unicodeRange: face.range });
  }
  console.log(`weight ${weight}: ${picked.length} 個子集`);
}

fs.writeFileSync(
  path.join(outDir, "fonts.manifest.json"),
  JSON.stringify({ family: "Noto Sans TC", faces: facesOut }, null, 2) + "\n",
  "utf8",
);
console.log(`完成：${facesOut.length} 個子集，manifest 已寫入 public/fonts/fonts.manifest.json`);
