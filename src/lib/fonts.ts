import { continueRender, delayRender, staticFile } from 'remotion';
import { GLYPH_TEXT } from '../content/glyphs.generated';
import { FONTS } from '../theme';

/**
 * 中文字型載入 + 缺字檢查。
 *
 * 1. 讀取 public/fonts/fonts.manifest.json（由 scripts/fetch-fonts.mjs 產生），
 *    用 FontFace API 載入每個子集；URL 一律經過 staticFile()，符合 Remotion 的資源規則。
 * 2. 以 delayRender 撐住渲染，直到所有字型就緒——否則截圖時中文會空白。
 * 3. 載入後用 Canvas measureText 逐字量測；寬度為 0 代表該字不在子集內，
 *    直接讓渲染失敗並列出缺字，而不是輸出一堆豆腐塊。
 */

type FontManifest = {
  family: string;
  faces: { weight: number; file: string }[];
};

let ready: Promise<void> | null = null;

const loadFaces = async () => {
  const response = await fetch(staticFile('fonts/fonts.manifest.json'));
  if (!response.ok) {
    throw new Error('找不到 public/fonts/fonts.manifest.json，請先執行 node scripts/fetch-fonts.mjs');
  }
  const manifest = (await response.json()) as FontManifest;

  await Promise.all(
    manifest.faces.map(async ({ weight, file }) => {
      const face = new FontFace(manifest.family, `url(${staticFile(file)}) format("woff2")`, {
        weight: String(weight),
        style: 'normal',
        display: 'block',
      });
      await face.load();
      document.fonts.add(face);
    }),
  );

  // 每種字重都用實際會出現的字串觸發一次排版，確保子集都被使用到
  await Promise.all(
    [400, 500, 700, 900].map((weight) =>
      document.fonts.load(`${weight} 48px "${manifest.family}"`, GLYPH_TEXT),
    ),
  );
  await document.fonts.ready;
};

const findMissingGlyphs = (): string[] => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];
  ctx.font = `500 48px ${FONTS.sans}`;
  const missing: string[] = [];
  for (const ch of GLYPH_TEXT) {
    if (ch.trim().length === 0) continue;
    if (ctx.measureText(ch).width < 0.5) missing.push(ch);
  }
  return missing;
};

export const loadChineseFont = () => {
  if (ready) return ready;
  const handle = delayRender('載入 Noto Sans TC 子集並檢查缺字');
  ready = loadFaces()
    .then(() => {
      const missing = findMissingGlyphs();
      if (missing.length > 0) {
        throw new Error(
          `字型子集缺少 ${missing.length} 個字：${missing.join('')}。` +
            '請依序執行 node scripts/gen-glyphs.mjs 與 node scripts/fetch-fonts.mjs。',
        );
      }
    })
    .finally(() => {
      continueRender(handle);
    });
  return ready;
};
