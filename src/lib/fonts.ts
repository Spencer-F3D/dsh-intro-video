import { continueRender, delayRender, staticFile } from 'remotion';
import { GLYPH_TEXT } from '../content/glyphs.generated';
import { FONTS } from '../theme';

/**
 * 中文字型載入 + 缺字檢查（渲染前的硬性守門員）。
 *
 * 為什麼用 CSS @font-face 而不是 FontFace API：
 * Noto Sans TC 被 Google Fonts 切成 100+ 個子集，每個子集只含特定 unicode-range。
 * 若用 FontFace API 逐一 new FontFace() 註冊，44 個 face 的 weight 完全相同
 * （同一字重有 11 個子集），部分瀏覽器會忽略 unicode-range、只認第一個符合的 face，
 * 結果整段中文被拉丁子集接管 → 畫面上全是方塊（在沒有系統中文字型的 Linux CI 特別明顯）。
 *
 * 正確做法是用 CSS 宣告，並把子集自己的 unicode-range 一起寫進去：
 * 瀏覽器會依字元自動選擇正確的子集，不會互相搶。
 *
 * 等待策略：CSS 插入後仍用 document.fonts.load() 等字重就緒，
 * 但判定「就緒」不靠 measureText（notdef 寬度可能與中文字寬相同而誤判），
 * 而是要求 document.fonts.check() 對每個字都回報 true，超時則直接讓渲染失敗。
 */

type FontManifest = {
  family: string;
  faces: { weight: number; file: string; unicodeRange?: string }[];
};

let ready: Promise<void> | null = null;

const USED_WEIGHTS = [400, 500, 700, 900];

/** 把 manifest 轉成 @font-face CSS（保留各子集自己的 unicode-range） */
const buildCss = (manifest: FontManifest) => {
  const rules = manifest.faces.map(({ weight, file, unicodeRange }) => {
    const url = staticFile(file);
    const range = unicodeRange ? `unicode-range: ${unicodeRange};` : '';
    return `@font-face{font-family:"${manifest.family}";font-style:normal;font-weight:${weight};font-display:block;src:url("${url}") format("woff2");${range}}`;
  });
  return rules.join('\n');
};

const injectStyle = (css: string) => {
  if (document.querySelector('style[data-dsh-fonts]')) return;
  const style = document.createElement('style');
  style.dataset.dshFonts = 'true';
  style.textContent = css;
  document.head.appendChild(style);
};

/** 等待某字重就緒：以 check() 判定每個字都可畫，而不是量寬度 */
const waitForWeight = async (family: string, weight: number) => {
  const spec = `${weight} 48px "${family}"`;
  const chars = [...GLYPH_TEXT].filter((ch) => ch.trim().length > 0);
  for (let attempt = 0; attempt < 80; attempt += 1) {
    await document.fonts.load(spec, GLYPH_TEXT);
    const ready = chars.every((ch) => document.fonts.check(spec, ch));
    if (ready) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(
    `字型 ${family} 字重 ${weight} 在 8 秒內未就緒；請確認 public/fonts 下的子集檔是否完整。`,
  );
};

const loadFaces = async () => {
  const response = await fetch(staticFile('fonts/fonts.manifest.json'));
  if (!response.ok) {
    throw new Error(
      '找不到 public/fonts/fonts.manifest.json，請先執行 node scripts/fetch-fonts.mjs',
    );
  }
  const manifest = (await response.json()) as FontManifest;
  injectStyle(buildCss(manifest));
  for (const weight of USED_WEIGHTS) {
    await waitForWeight(manifest.family, weight);
  }
  await document.fonts.ready;
};

export const loadChineseFont = () => {
  if (ready) return ready;
  const handle = delayRender('載入 Noto Sans TC 子集');
  ready = loadFaces()
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`中文字型載入失敗：${message}`);
    })
    .finally(() => {
      continueRender(handle);
    });
  return ready;
};

/** 保留給其他地方查詢用 */
export const FONT_FAMILY = FONTS.sans;
