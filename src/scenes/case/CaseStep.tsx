import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { CaseBackdrop, CaseBox, CaseLabel, IMG } from './CaseFrame';

/**
 * S4 Step 1 / Step 2（48–59s）
 *
 * step=1：聚焦左側工作區樹，框出「dsh 簡介影片腳本」工作區。
 * step=2：聚焦對話流——先框使用者需求，再讓四行工具狀態依序亮起
 *         （狀態文字取自 dsh-workflow-01.png 實際畫面）。
 *
 * 座標全部來自 content/shots.ts 的量測表。
 */

/** 工作區樹：包含 deepseek / 預設工作區 / 三個對話項目 */
const SIDEBAR_FOCUS = { x: 0, y: 545, w: 400, h: 340 };
/** 「dsh 簡介影片腳本」這一列 */
const WORKSPACE_ITEM = { x: 20, y: 755, w: 380, h: 46 };
/** 對話流：先框住需求氣泡，再逐行亮起工具狀態 */
const CONVO_FOCUS = { x: 500, y: 150, w: 1420, h: 600 };
const USER_BUBBLE = { x: 925, y: 200, w: 820, h: 120 };
const TOOL_ROWS = [
  { x: 570, y: 372, w: 1010, h: 38 },
  { x: 570, y: 468, w: 1010, h: 36 },
  { x: 570, y: 560, w: 1010, h: 36 },
  { x: 570, y: 652, w: 1010, h: 36 },
];

const LABEL = {
  1: {
    step: 'STEP 1',
    title: '從一個\n工作區開始',
    lines: ['同一個工作區裡', '把「影片腳本」從頭做到尾'],
  },
  2: {
    step: 'STEP 2',
    title: '說清楚要什麼\n它自己找路',
    lines: ['搜尋代碼', '讀取文件', '執行命令', '訪問網頁'],
  },
} as const;

export const CaseStep: React.FC<{ step: 1 | 2 }> = ({ step }) => {
  const frame = useCurrentFrame();
  const total = step === 1 ? 149 : 179;
  const zoomProgress = interpolate(frame, [0, total], [0, 1]);
  const focus = step === 1 ? SIDEBAR_FOCUS : CONVO_FOCUS;
  const label = LABEL[step];

  return (
    <AbsoluteFill>
      <CaseBackdrop
        src={IMG.flow1.src}
        naturalWidth={IMG.flow1.w}
        naturalHeight={IMG.flow1.h}
        focus={focus}
        zoomProgress={zoomProgress}
      />

      {step === 1 ? (
        <CaseBox
          rect={WORKSPACE_ITEM}
          naturalWidth={IMG.flow1.w}
          naturalHeight={IMG.flow1.h}
          focus={focus}
          zoomProgress={zoomProgress}
          opacity={interpolate(frame, [22, 42], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
        />
      ) : (
        <>
          <CaseBox
            rect={USER_BUBBLE}
            naturalWidth={IMG.flow1.w}
            naturalHeight={IMG.flow1.h}
            focus={focus}
            zoomProgress={zoomProgress}
            opacity={interpolate(frame, [8, 24, 56, 70], [0, 1, 1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
          />
          {TOOL_ROWS.map((row, index) => {
            const start = 24 + index * 16;
            return (
              <CaseBox
                key={index}
                rect={row}
                naturalWidth={IMG.flow1.w}
                naturalHeight={IMG.flow1.h}
                focus={focus}
                zoomProgress={zoomProgress}
                lineWidth={1.5}
                glow={false}
                radius={8}
                opacity={interpolate(frame, [start, start + 12], [0, 0.85], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })}
              />
            );
          })}
        </>
      )}

      <CaseLabel
        step={label.step}
        title={
          <>
            {label.title.split('\n')[0]}
            <br />
            {label.title.split('\n')[1]}
          </>
        }
        lines={label.lines}
        frame={frame}
      />
    </AbsoluteFill>
  );
};
