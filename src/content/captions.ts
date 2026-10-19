/**
 * 字幕內容（全片唯一的文字來源）。
 * 幀 = 秒 × 30。改文案只改這裡，然後重跑：
 *   node scripts/gen-glyphs.mjs && node scripts/fetch-fonts.mjs
 *
 * 用詞以 docs/事實對照.md 為準：不出現效能數字、評價或相容性斷言。
 * 時間窗彼此不重疊，避免字幕疊字。
 */

export type Caption = {
  /** 起始幀（含） */
  from: number;
  /** 結束幀（不含） */
  to: number;
  /** 以 \n 手動分行，避免自動斷行出現孤字 */
  text: string;
};

export const CAPTIONS: Caption[] = [
  // S1 開場 0–8s
  { from: 78, to: 168, text: '你交給它工作，\n它交回成果。' },
  { from: 174, to: 236, text: '這是 DSH。' },

  // S2 定位 8–22s
  { from: 246, to: 366, text: 'DSH 是 DeepSeek 開源的 harness 架構' },
  { from: 372, to: 486, text: '也可以是網頁' },
  { from: 490, to: 648, text: '工具、技能與介面，都能用插件擴展' },

  // S3-1 一切皆插件 22–31s
  { from: 666, to: 810, text: '一切皆插件' },
  { from: 816, to: 925, text: '在「創造模式」開啟對話，就能製作插件' },

  // S3-2 完成各類任務 31–36s
  { from: 936, to: 1075, text: '完成各類任務' },

  // S3-3 適應你的工作方式 36–43s
  { from: 1086, to: 1190, text: '適應你的工作方式' },
  { from: 1196, to: 1285, text: '重複的工作，交給自動化任務' },

  // S3-4 成果回到對話 43–45s
  { from: 1291, to: 1346, text: '成果，交回同一段對話' },

  // S4 真實案例 45–70s
  { from: 1356, to: 1440, text: '真實案例：用 DSH 做一支介紹影片' },
  { from: 1446, to: 1590, text: '從一個工作區開始' },
  { from: 1596, to: 1770, text: '說清楚要什麼，它自己找路' },
  { from: 1776, to: 1950, text: '改一行腳本，重跑就重出片' },
  { from: 1956, to: 2094, text: '取回可直接播放的成品' },

  // S5 總結 70–90s
  { from: 2106, to: 2232, text: '把多步工作，留在同一段對話裡' },
  { from: 2238, to: 2370, text: 'DSH：把想法變成成果' },
  { from: 2376, to: 2490, text: '探索未至之境' },
  { from: 2496, to: 2586, text: '開源、預覽版' },
];
