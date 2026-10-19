import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Screenshot } from '../../components/Screenshot';
import { CASE_SHOT } from './CaseFrame';

/**
 * S4 Step 4（65–70s，本地幀 0–149）
 *
 * 刻意不推近：來源截圖整張剛好放入 1360×714 的顯示區，
 * 因此三張交付檔案卡（intro_dsh.mp4／script.md／make_video.py）
 * 與底部統計列都完整、可讀，不用擔心被裁切。
 * 畫面仍使用同一個左欄文字 ＋ 右側截圖的版面，維持五步一致的節奏。
 */

const LABEL_LINES = ['影片成品', '分鏡表與旁白', '可重跑的腳本'] as const;

/** 截圖去背：這張 PNG 四周有大片近黑留白，裁掉後內容會放大約 1.4 倍，更容易看清 */
const CROP = { x: 610, y: 60, w: 1300, h: 940 };

export const CaseResult: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#04080F' }}>
      <Screenshot
        src="assets/dsh-workflow-02.png"
        naturalWidth={1918}
        naturalHeight={996}
        frame={CASE_SHOT}
        focus={CROP}
        zoomProgress={interpolate(frame, [0, 149], [0, 1])}
        zoomAmount={0.03}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 560,
          height: 1080,
          background: 'linear-gradient(90deg, #04080F 0%, #04080F 88%, rgba(4,8,15,0) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 560,
          right: 0,
          top: 170,
          height: 40,
          background: 'linear-gradient(180deg, #04080F 0%, rgba(4,8,15,0) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 560,
          right: 0,
          top: 880,
          height: 60,
          background: 'linear-gradient(180deg, rgba(4,8,15,0) 0%, #04080F 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 64,
          top: 296,
          width: 336,
        }}
      >
        <div
          style={{
            fontFamily: '"Cascadia Mono", Consolas, monospace',
            fontSize: 19,
            letterSpacing: 4,
            color: '#22D3EE',
            border: '1px solid rgba(34,211,238,0.5)',
            borderRadius: 999,
            padding: '3px 14px',
            display: 'inline-block',
          }}
        >
          STEP 4
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: '"Noto Sans TC", sans-serif',
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.28,
            color: '#EAF3FF',
          }}
        >
          取回可直接
          <br />
          播放的成品
        </div>
        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {LABEL_LINES.map((line, index) => {
            const lp = interpolate(frame, [16 + index * 8, 34 + index * 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={line}
                style={{
                  fontFamily: '"Noto Sans TC", sans-serif',
                  fontSize: 23,
                  lineHeight: 1.5,
                  color: '#9FB4CF',
                  paddingLeft: 14,
                  borderLeft: `2px solid rgba(34,211,238,${0.55 * lp})`,
                  opacity: lp,
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
