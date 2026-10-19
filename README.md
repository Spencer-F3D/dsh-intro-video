# DSH 產品介紹影片（Remotion）

DSH 的 90 秒科技產品宣傳影片，用 React 程式碼描述。可編輯、可重渲、可在 GitHub Actions 上雲端出片。

| 項目 | 設定 |
|---|---|
| 解析度 | 1920 × 1080（16:9） |
| 幀率 | 30 FPS |
| 長度 | 2700 幀 = 90.0 秒 |
| 語言 | 繁體中文字幕（無音訊） |
| 字型 | Noto Sans TC（OFL-1.1，本地子集化） |
| 輸出 | H.264 MP4（CRF 16） |

---

## 1. 專案結構

```
dsh-intro/
├─ .github/workflows/render.yml   ← GitHub Actions 雲端渲染
├─ public/
│  ├─ assets/                     ← 4 張 DSH 介面截圖與 Logo
│  └─ fonts/                      ← 自動產生的字型子集與 manifest（可重生成）
├─ scripts/
│  ├─ gen-glyphs.mjs              ← 掃出畫面用到的所有字元
│  ├─ fetch-fonts.mjs             ← 下載 Noto Sans TC 並子集化
│  ├─ check-frames.mjs            ← 抽樣關鍵影格並併成網格總覽
│  └─ grid-overlay.cjs            ← 截圖疊 100px 網格，用來量 UI 座標
└─ src/
   ├─ Root.tsx                    ← 註冊 Composition（DshIntro）
   ├─ Composition.tsx             ← 五段時間軸 + 全片字幕軌
   ├─ theme.ts                    ← 顏色／字級／安全區／節奏／時間表
   ├─ content/
   │  ├─ captions.ts              ← 全部字幕台詞（唯一的文字來源）
   │  ├─ shots.ts                 ← 截圖座標表（高亮框、推近焦點）
   │  └─ glyphs.generated.ts      ← 自動產生，勿手改
   ├─ components/
   │  ├─ Screenshot.tsx           ← 截圖顯示 + 指定區域推近 + 高亮框
   │  ├─ CaptionTrack.tsx         ← 字幕軌（鎖在安全區底部）
   │  └─ Backdrop.tsx             ← 背景、面板、Logo、打勾、圓環
   ├─ lib/
   │  ├─ anim.ts                  ← 幀→值的動畫小工具
   │  └─ fonts.ts                 ← 字型載入 + 缺字檢查（缺字直接讓渲染失敗）
   └─ scenes/
      ├─ S1Open.tsx               ← 0–8s    開場
      ├─ S2Positioning.tsx        ← 8–22s   定位
      ├─ S3Features.tsx           ← 22–45s  四項能力（features/ 內各一檔）
      ├─ S4CaseStudy.tsx          ← 45–70s  真實案例（case/ 內各一步）
      └─ S5Outro.tsx              ← 70–90s  總結與 Logo
```

**可維護性的三個原則**

1. **一個場景一個檔案**：改某一段只動那個檔；時間寫在 `<Sequence>` / `<Series>` 上。
2. **文字與座標集中**：台詞在 `content/captions.ts`，截圖座標在 `content/shots.ts`。
3. **設計集中**：顏色、字級、安全區、節奏都在 `theme.ts`，改一處全片生效。

---

## 2. 本機預覽

本機的 node / pnpm 不在 PATH，請用 DSH runtime 的絕對路徑：

```powershell
$node = 'C:\Users\Spencer\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe'
$pnpm = 'C:\Users\Spencer\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\pnpm\bin\pnpm.mjs'
Set-Location C:\Users\Spencer\Desktop\AI_video\dsh_demo\dsh-intro

# 開 Studio（http://localhost:3000）
& $node $pnpm exec remotion studio

# 型別檢查
& $node $pnpm exec tsc --noEmit

# 抽樣 25 格並產生總覽圖 out/check/contact-sheet.png
& $node scripts/check-frames.mjs --sheet

# 本機渲整片（較耗時；建議改用 GitHub Actions）
& $node $pnpm exec remotion render DshIntro out/dsh-intro-1080p.mp4 --codec=h264 --crf=16
```

> Studio 請用預設 3000 埠：`remotion still/render` 內部會用 3001，若 Studio 佔用 3001 會互相衝突。

---

## 3. 雲端渲染（GitHub Actions）

`.github/workflows/render.yml` 會在 `ubuntu-24.04` 上：

1. 安裝 Node 22 與 pnpm，安裝依賴
2. `remotion browser ensure` 預先下載 Chromium Headless Shell
3. `tsc --noEmit` 型別檢查
4. 先渲 12 張抽樣影格（字幕與安全區檢查，也是缺字守門員）
5. 渲整片 MP4：`out/dsh-intro-1080p.mp4`（H.264 / CRF 16 / yuv420p）
6. 上傳 `dsh-intro-render` artifact（保留 30 天）

**觸發方式**

- GitHub repo → **Actions** → 左側 **Render DSH Intro** → **Run workflow**
- 只想驗證畫面時，在 `frames` 欄位填 `60` 或 `120-180`，就只輸出那幾格 PNG
- 推送到 `main` 且改動 `src/`、`public/`、`package.json`、`pnpm-lock.yaml` 時自動觸發

**前置條件**

- 這個資料夾要是 Git repo（目前 `dsh-intro/` 已是 git repo，分支 `main`）
- 需要設定 remote 並推上去：

```powershell
Set-Location C:\Users\Spencer\Desktop\AI_video\dsh_demo\dsh-intro
git add -A
git commit -m "DSH intro video: Remotion project + CI render"
git remote add origin https://github.com/<你的帳號>/<repo>.git
git push -u origin main
```

> `out/`、`node_modules/` 已被 gitignore，Repo 不會被渲染產物與依賴撐大。
> 若把 repo 根目錄改成上一層 `dsh_demo/`，請把 `.github/workflows/render.yml`
> 移到根目錄，並在每個 step 加上 `working-directory: dsh-intro`。

---

## 4. 修改影片

| 想改什麼 | 改哪裡 |
|---|---|
| 字幕文字 | `src/content/captions.ts` |
| 字幕出現時間 | 同上（`from` / `to` 單位＝幀，秒 × 30） |
| 某一段長度 | `src/theme.ts` 的 `TIMELINE`，或場景內 `Series.Sequence durationInFrames` |
| 顏色 / 字級 | `src/theme.ts` |
| 截圖高亮位置 | `src/content/shots.ts`（用 `scripts/grid-overlay.cjs` 量） |
| 換截圖 | 放到 `public/assets/`，更新 `IMG` 尺寸與 `shots.ts` 座標 |

**改過畫面文字後，務必重跑字型管線**，否則新字可能不在子集內：

```powershell
& $node scripts/gen-glyphs.mjs
& $node scripts/fetch-fonts.mjs
```

若忘記跑，渲染時 `src/lib/fonts.ts` 會直接報錯並列出缺少哪些字，不會輸出豆腐塊。

---

## 5. 事實依據與邊界

- 官方說法來自 <https://www.deepseek.com/harness/>：
  「DeepSeek 開源的 harness 架構」「基於 Cordis 的『一切皆插件』架構建構」
  「既是桌面應用，也可以是透過程式碼啟動為網頁」、四項能力標題與示範、五大用途。
- 案例段落使用 `dsh-workflow-01.png` / `dsh-workflow-02.png` 的實際介面。
- 統計數字（輪次、步數、tok/s、上下文用量、緩存命中）只作**截圖原值展示**，不做效能結論。
- 全片不出現：效能提升百分比、用戶評價、下載量、相容性清單、定價。
- 所有非截圖的示意圖都在角落標示「示意圖」。

內容對照表在上一層 `dsh_demo/docs/`：`分鏡表.md`、`事實對照.md`。
