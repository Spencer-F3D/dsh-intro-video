/**
 * 全片設計常數：顏色、字級、安全區、節奏與分鏡時間表。
 * 只改這裡就能整體換色／換節奏，不要在場景內寫死色碼。
 */

export const COLORS = {
  bgDeep: '#04080F',
  bg: '#070D1A',
  panel: 'rgba(10, 20, 38, 0.78)',
  border: 'rgba(59, 130, 246, 0.30)',
  borderStrong: 'rgba(34, 211, 238, 0.55)',
  blue: '#3B82F6',
  blueBright: '#60A5FA',
  cyan: '#22D3EE',
  text: '#EAF3FF',
  textDim: '#9FB4CF',
  textFaint: 'rgba(159, 180, 207, 0.62)',
  check: '#34D399',
  warn: '#FBBF24',
} as const;

export const FONTS = {
  /** 必須與 public/fonts/noto-sans-tc.css 的 family 名稱一致 */
  sans: '"Noto Sans TC", "Microsoft JhengHei", sans-serif',
  mono: '"Cascadia Mono", "Consolas", monospace',
} as const;

export const TYPE = {
  hero: 132,
  h1: 84,
  h2: 60,
  h3: 40,
  body: 30,
  small: 24,
  caption: 42,
  micro: 20,
} as const;

/** 字幕安全區：字幕底邊距畫布底部 64px；左右最多 1400px */
export const SAFE = {
  top: 72,
  bottom: 64,
  left: 96,
  right: 96,
  captionMaxWidth: 1400,
} as const;

/** 由字型檔宣告的載入進度（秒→幀由場景自行換算），統一節奏 */
export const MOTION = {
  quick: 12,
  base: 18,
  slow: 26,
} as const;

/** 分鏡時間表（秒）。改秒數只改這裡，Video.tsx 會自動換算成幀。 */
export const TIMELINE = {
  s1Open: { from: 0, to: 8 },
  s2Positioning: { from: 8, to: 22 },
  s3Features: { from: 22, to: 45 },
  s4CaseStudy: { from: 45, to: 70 },
  s5Outro: { from: 70, to: 90 },
} as const;

export const VIDEO = {
  id: 'DshIntro',
  width: 1920,
  height: 1080,
  fps: 30,
  totalSeconds: 90,
} as const;
