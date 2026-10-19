import { continueRender, delayRender, staticFile } from 'remotion';
import { GLYPH_TEXT } from '../content/glyphs.generated';
import { FONTS } from '../theme';

/**
 * 中文字型載入 + 缺字檢查（渲染前的硬性守門員）。
 *
 * 背景：Noto Sans TC 是「依 unicode-range 切成的多個子集」。若只等待 FontFaceSet
 * 整體就緒，任何一個子集就緒就會結束等待，其他子集可能還沒下載完就截圖，
 * 結果就是該字重的部分字變成豆腐方塊（在沒有字型快取的乾淨環境特別容易發生）。
 *
 * 因此這裡做三件事：
 *   1. 逐一載入 manifest 的每個子集（FontFace.load()）
 *   2. 對「每種字重」重複呼叫 document.fonts.load()，直到回傳非空、且
 *      執行時會用到的每個字都被判定為已載入（document.fonts.check()）
 *   3. 用 Canvas measureText 逐字量測做最終驗證；任何缺字都直接讓渲染失敗
 */

type FontFaceEntry = { weight: number; file: string };
type FontManifest = { family: string; faces: FontFaceEntry[] };

let ready: Promise<void> | null = null;

const USED_WEIGHTS = [400, 500, 700, 900];

/** 等待單一字重的所有子集都真正可用 */
const ensureWeightLoaded = async (family: string, weight: number, text: string) => {
  const spec = `${weight} 48px "${family}"`;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const loaded = await document.fonts.load(spec, text);
    const everyCharReady = [...text].every((ch) =>
      ch.trim().length === 0 ? true : document.fonts.check(`${weight} 48px "${family}"`, ch),
    );
    if (loaded.length > 0 && everyCharReady) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`字型字重 ${weight} 載入逾時（${family}）`);
};

const loadFaces = async () => {
  const response = await fetch(staticFile('fonts/fonts.manifest.json'));
  if (!response.ok) {
    throw new Error(
      '找不到 public/fonts/fonts.manifest.json，請先執行 node scripts/fetch-fonts.mjs',
    );
  }
  const manifest = (await response.json()) as FontManifest;

  // 1. 逐一載入每個子集
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

  // 2. 每個字重都確認「會用到的字」全部就緒（避免只等整體 ready 就截圖）
  for (const weight of USED_WEIGHTS) {
    await ensureWeightLoaded(manifest.family, weight, GLYPH_TEXT);
  }
  await document.fonts.ready;
};

/** 最終驗證：任何字寬度為 0 就視為缺字 */
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
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`中文字型載入失敗：${message}`);
    })
    .finally(() => {
      continueRender(handle);
    });
  return ready;
};
