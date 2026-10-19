// 由專案內所有 TSX/TS 字串常值中掃出中文與專有名詞字元，
// 產生 GLYPH_TEXT 供字型子集化與「缺字檢查」共用。
// 用法：node scripts/gen-glyphs.mjs（在 dsh-intro/ 目錄下執行）

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

const files = walk(srcDir).filter((f) => /\.tsx?$/.test(f));
const seed = ["DSH", "DeepSeek Harness", "探索未至之境", "Cordis", "MIT", "Preview"];
const chars = new Set(seed.join(""));

for (const file of files) {
  if (file.includes("glyphs.generated")) continue;
  const source = fs.readFileSync(file, "utf8");
  // 移除整行註解，避免把說明文字算進去
  const stripped = source.replace(/^\s*(\/\/|\*).*$/gm, "");
  for (const match of stripped.matchAll(/(['"`])((?:\\.|(?!\1)[\s\S])*?)\1/g)) {
    const value = match[2];
    if (!/[\u3000-\u9fff\uff00-\uffefA-Za-z]/.test(value)) continue;
    if (/^(import|from|export|const|use|#|rgba?\(|[0-9a-z-/]+\.(tsx?|png|woff2|json|css))/.test(value)) continue;
    for (const ch of value) chars.add(ch);
  }
}

const sorted = [...chars].filter((c) => !/\s/.test(c)).sort();
const outPath = path.join(root, "src", "content", "glyphs.generated.ts");
fs.writeFileSync(
  outPath,
  "// 由 scripts/gen-glyphs.mjs 自動產生，請勿手動編輯。\n" +
    "// 修改畫面文字後請重跑：node scripts/gen-glyphs.mjs\n" +
    `export const GLYPH_TEXT = ${JSON.stringify(sorted.join(""))};\n`,
  "utf8",
);

console.log(`scanned ${files.length} files -> ${sorted.length} unique characters`);
console.log(sorted.join(""));
