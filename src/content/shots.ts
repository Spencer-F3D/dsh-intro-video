/**
 * 截圖區域座標表。
 *
 * 來源：資料圖片/dsh-*.png。原始像素尺寸 1918×1006（workflow-02 為 1918×996）。
 * 下面所有數字都是「原圖像素」座標，以左上角 (0,0) 起算。
 *
 * 量測方法：scripts/grid-overlay.cjs 會把截圖壓成 1920 寬並疊上 100px 網格，
 * 畫面上讀到的 1920 基準座標再乘上 (1918/1920)≈0.999 即為原圖座標。
 * 換了新截圖時，只需要更新這張表。
 */

export type Box = { x: number; y: number; w: number; h: number };

export const IMG = {
  home: { src: 'assets/dsh-home.png', w: 1918, h: 1006 },
  flow1: { src: 'assets/dsh-workflow-01.png', w: 1918, h: 1006 },
  flow2: { src: 'assets/dsh-workflow-02.png', w: 1918, h: 996 },
  logo: { src: 'assets/dsh_logo.png', w: 288, h: 288 },
} as const;

/** dsh-home.png */
export const HOME = {
  /** 左側導覽四項（每項約 60px 高） */
  navPlugins: { x: 18, y: 210, w: 380, h: 50 },
  navMarket: { x: 18, y: 290, w: 380, h: 50 },
  navAuto: { x: 18, y: 340, w: 380, h: 50 },
  navContext: { x: 18, y: 398, w: 380, h: 50 },
  /** 中央副標：探索未至之境 */
  hero: { x: 950, y: 355, w: 400, h: 90 },
  /** 輸入框（含底部控制列） */
  composer: { x: 548, y: 508, w: 1226, h: 196 },
  /** 輸入框內的文字提示 */
  composerHint: { x: 566, y: 528, w: 1000, h: 48 },
  /** 輸入框底部左側：＋ 與「自動審查」 */
  composerAccept: { x: 552, y: 618, w: 236, h: 52 },
  /** 輸入框底部右側：模型與傳送 */
  composerSend: { x: 1130, y: 618, w: 640, h: 52 },
} as const;

/** dsh-workflow-01.png */
export const FLOW1 = {
  /** 左側工作區樹（含「dsh 簡介影片腳本」） */
  sidebarWork: { x: 0, y: 530, w: 420, h: 360 },
  /** dsh 簡介影片腳本 這一列 */
  workspaceItem: { x: 20, y: 755, w: 380, h: 46 },
  /** 使用者需求氣泡 */
  userBubble: { x: 925, y: 200, w: 820, h: 120 },
  /** 四行工具狀態（已調用工具 / 已讀取文件 / 已訪問網頁 / 已執行命令） */
  toolRow1: { x: 570, y: 372, w: 1010, h: 38 },
  toolRow2: { x: 570, y: 468, w: 1010, h: 36 },
  toolRow3: { x: 570, y: 560, w: 1010, h: 36 },
  toolRow4: { x: 570, y: 652, w: 1010, h: 36 },
  /** 對話流全域 */
  conversation: { x: 430, y: 130, w: 1480, h: 640 },
  /** 頂部標籤頁：對話／軌跡／上下文／畫廊／編隊 */
  tabs: { x: 435, y: 128, w: 460, h: 40 },
  /** 底部統計列 */
  stats: { x: 830, y: 966, w: 690, h: 34 },
} as const;

/** dsh-workflow-02.png */
export const FLOW2 = {
  /** 「後續調整」段落：兩條重點列 */
  adjustHeading: { x: 490, y: 240, w: 260, h: 46 },
  /** 第一條重點：「改字幕或秒數：編輯 make_video.py 底下的 SCENES 清單，再重跑即可」 */
  adjustLine1: { x: 594, y: 310, w: 1090, h: 50 },
  /** 第二條重點：「加旁白/配樂…」那一列 */
  adjustLine2: { x: 594, y: 396, w: 1090, h: 46 },
  /** 推近焦點：含「後續調整」標題，左右裁到文字實際範圍（右側留白不必放大） */
  adjustBlock: { x: 480, y: 222, w: 1230, h: 236 },
  /** intro_dsh.mp4 卡片 */
  mp4Card: { x: 602, y: 520, w: 558, h: 78 },
  /**
   * 檔案卡區焦點：寬 1240 / 高 190，
   * 使放大倍率由高度決定，兩張卡片的標題與說明都能完整入鏡。
   */
  fileCards: { x: 515, y: 492, w: 1240, h: 190 },
  /** 底部統計列 */
  stats: { x: 815, y: 955, w: 690, h: 34 },
} as const;

/**
 * 版面分區：左欄放說明文字、右欄放截圖。
 * 截圖顯示區固定為 x 560–1920、y 200–914；因此上方 200px 給步驟標籤、下方 166px 給字幕。
 */
export const CASE_LAYOUT = {
  /** 左欄文字區右緣 */
  textColumnRight: 520,
  /** 截圖顯示區 */
  shot: { x: 560, y: 200, w: 1360, h: 714 },
} as const;
