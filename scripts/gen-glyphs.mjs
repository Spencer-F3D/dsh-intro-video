// 掃出畫面用到的所有字元，產生 GLYPH_TEXT（供字型子集化與缺字檢查共用）。
//
// 為什麼要「掃描」而不是手寫字表：畫面文字分散在多個場景檔，漏一個字就會在
// 影片裡變成豆腐方塊（□）。此腳本是唯一來源，請在改了任何畫面文字後重跑：
//   node scripts/gen-glyphs.mjs
//
// 掃描策略（寧可多抓、不可漏抓）：
//   1. 先移除區塊註解與行註解
//   2. 再抓所有引號字串（支援 '…'、"…"、`…`），不管它出現在陣列、JSX 或樣式裡
//   3. 只要是包含中文（含全形標點）的字串，就把每個字元收進字表
//   4. 純 ASCII 的識別字（import、屬性名、顏色碼等）一律略過，避免字表被污染
//   5. 最後補上一定會出現的品牌字串（標語、產品名）

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcDir = path.join(root, "src");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

/** 移除區塊註解與行註解（保持字串內容完整：先切掉註解區段，再處理字串） */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

/** 抓出所有字串常值內容（含模板字串中的靜態文字） */
function extractStrings(source) {
  const results = [];
  // 逐字掃描，避免正則分支造成的提前截斷
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      let buf = "";
      while (j < source.length) {
        const c = source[j];
        if (c === "\\") {
          buf += source[j + 1] ?? "";
          j += 2;
          continue;
        }
        if (c === quote) break;
        buf += c;
        j += 1;
      }
      results.push(buf);
      i = j + 1;
      continue;
    }
    i += 1;
  }
  return results;
}

const files = walk(srcDir).filter((f) => /\.tsx?$/.test(f));
const chars = new Set();

/** 一定會出現的品牌字串（即使暫時沒被引用也要保留字型） */
const SEED = [
  "DSH",
  "DeepSeek Harness",
  "探索未至之境",
  "Cordis",
  "MIT",
  "預覽版",
  "開源",
  "示意圖",
  "72 秒",
  "1080p",
];
for (const s of SEED) for (const ch of s) chars.add(ch);

const HAS_CJK = /[\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;
/** 純 ASCII 的樣式／識別字不需要進字表（含 CSS 函式、路徑、顏色） */
const ASCII_ONLY = /^[\x00-\x7F]*$/;

let stringCount = 0;
for (const file of files) {
  if (file.includes("glyphs.generated")) continue;
  const source = stripComments(fs.readFileSync(file, "utf8"));
  for (const value of extractStrings(source)) {
    if (ASCII_ONLY.test(value)) continue;
    if (!HAS_CJK.test(value)) continue;
    stringCount += 1;
    for (const ch of value) chars.add(ch);
  }
}

const sorted = [...chars].filter((c) => !/\s/.test(c)).sort();
const outPath = path.join(root, "src", "content", "glyphs.generated.ts");
fs.writeFileSync(
  outPath,
  "// 由 scripts/gen-glyphs.mjs 自動產生，請勿手動編輯。\n" +
    "// 修改畫面文字後請重跑：node scripts/gen-glyphs.mjs && node scripts/fetch-fonts.mjs\n" +
    `export const GLYPH_TEXT = ${JSON.stringify(sorted.join(""))};\n`,
  "utf8",
);

console.log(`scanned ${files.length} files, ${stringCount} CJK strings -> ${sorted.length} unique characters`);
console.log(sorted.join(""));
