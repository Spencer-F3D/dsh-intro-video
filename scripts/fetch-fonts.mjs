// 下載 Noto Sans TC（OFL-1.1）並依 GLYPH_TEXT 挑選子集，輸出到 public/fonts/。
//
// 本機與 GitHub Actions 共用；可重複執行。
// 用法：node scripts/gen-glyphs.mjs && node scripts/fetch-fonts.mjs
//
// 產出：
//   public/fonts/source/*.woff2       子集檔（檔名含該子集的 hash，換版本不會用到舊快取）
//   public/fonts/fonts.manifest.json  給 src/lib/fonts.ts 使用（weight + file + unicodeRange）
//
// 重要：Google Fonts 回傳 100+ 個 @font-face，每個 block 的 unicode-range 與 URL 必須
// 「成對」取出。曾經因為只比對 range、卻誤取到另一個 block 的 URL，導致
// manifest 記錄的範圍與實際字型檔不符，中文落到拉丁子集而在 Linux CI 變成方塊。
// 因此這裡：
//   1. 以 block 為單位解析（range 與 url 同源）
//   2. 下載後驗證 woff2 簽名
//   3. 最後逐一檢查每個 GLYPH_TEXT 字元都被「至少一個」子集涵蓋，否則直接報錯

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "public", "fonts");
const cacheDir = path.join(outDir, "source");
fs.mkdirSync(cacheDir, { recursive: true });

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

const WEIGHTS = [400, 500, 700, 900];

/** 以 @font-face 區塊為單位取出 { range, url }，保證兩者同源 */
function parseFaces(css) {
  const faces = [];
  for (const block of css.split("@font-face").slice(1)) {
    const range = block.match(/unicode-range:\s*([^;]+);/);
    const url = block.match(/url\((?:"|')?(https:\/\/[^)"']+\.woff2)/);
    if (range && url) faces.push({ range: range[1].trim(), url: url[1] });
  }
  return faces;
}

/** range 是否涵蓋某一 codepoint */
function rangeCovers(range, cp) {
  return range.split(",").some((part) => {
    const m = part.trim().match(/^U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?$/);
    if (!m) return false;
    const lo = parseInt(m[1], 16);
    const hi = m[2] ? parseInt(m[2], 16) : lo;
    return cp >= lo && cp <= hi;
  });
}

/** 用 URL 末段（通常是 12 碼 hash）當檔名，避免舊子集殘留 */
function fileNameFor(weight, url) {
  const base = decodeURIComponent(url.split("/").pop() ?? "subset");
  return `NotoSansTC-${weight}-${base}`;
}

async function download(url, dest) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1024) {
    const head = fs.readFileSync(dest).subarray(0, 4).toString("latin1");
    if (head === "wOF2") return false;
  }
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`下載失敗 ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.subarray(0, 4).toString("latin1") !== "wOF2") {
    throw new Error(`不是合法的 woff2（signature 錯誤）：${url}`);
  }
  fs.writeFileSync(dest, buf);
  return true;
}

const { GLYPH_TEXT } = await import(
  new URL("../src/content/glyphs.generated.ts", import.meta.url).href
);
const codepoints = [...new Set([...GLYPH_TEXT].map((c) => c.codePointAt(0)))].filter(
  (cp) => !(cp >= 0x00 && cp <= 0x20),
);

const facesOut = [];
const covered = new Set();

for (const weight of WEIGHTS) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@${weight}&display=swap`;
  const css = await (await fetch(cssUrl, { headers: { "User-Agent": UA } })).text();
  const faces = parseFaces(css);

  // 只保留「有涵蓋到我們用到的字」的子集
  const picked = faces.filter((f) => codepoints.some((cp) => rangeCovers(f.range, cp)));

  for (const face of picked) {
    const name = fileNameFor(weight, face.url);
    const dest = path.join(cacheDir, name);
    await download(face.url, dest);
    facesOut.push({ weight, file: `fonts/source/${name}`, unicodeRange: face.range });
    for (const cp of codepoints) {
      if (rangeCovers(face.range, cp)) covered.add(cp);
    }
  }
  console.log(`weight ${weight}: ${faces.length} 個子集 → 取用 ${picked.length} 個`);
}

// 收尾驗證：每個字都必須有子集涵蓋，否則直接失敗（不要把問題帶到渲染階段）
const missing = codepoints.filter((cp) => !covered.has(cp)).map((cp) => String.fromCodePoint(cp));
if (missing.length > 0) {
  throw new Error(`以下字元沒有任何子集涵蓋：${missing.join("")}`);
}

fs.writeFileSync(
  path.join(outDir, "fonts.manifest.json"),
  JSON.stringify({ family: "Noto Sans TC", faces: facesOut }, null, 2) + "\n",
  "utf8",
);

console.log(
  `完成：${facesOut.length} 個子集，涵蓋 ${covered.size}/${codepoints.length} 個字元，manifest 已寫入 public/fonts/fonts.manifest.json`,
);
