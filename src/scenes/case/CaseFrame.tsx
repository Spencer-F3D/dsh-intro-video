import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { Screenshot, HighlightBox, type Rect } from '../../components/Screenshot';
import { IMG } from '../../content/shots';
import { COLORS, FONTS } from '../../theme';

/**
 * S4 真實案例的共用排版（45–70s）
 *
 * 版面：來源截圖縮到右側 1360×714（y 200–914），左側留給說明文字，
 * 上緣 200px 與下緣 166px 讓出給步驟標籤與字幕，因此說明、標籤、字幕都不會壓到截圖內容。
 * 截圖內的座標一律使用來源原圖像素，經 focus 推近後高亮框仍精準對位。
 */

export const CASE_SHOT: Rect = { x: 560, y: 200, w: 1360, h: 714 };

const ease = Easing.out(Easing.cubic);

/** 截圖背景 + 左側與上下漸層（讓文字與字幕都有乾淨底色） */
export const CaseBackdrop: React.FC<{
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  focus: Rect;
  zoomProgress: number;
  zoomAmount?: number;
}> = ({ src, naturalWidth, naturalHeight, focus, zoomProgress, zoomAmount = 0.04 }) => (
  <>
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }} />
    <Screenshot
      src={src}
      naturalWidth={naturalWidth}
      naturalHeight={naturalHeight}
      frame={CASE_SHOT}
      focus={focus}
      zoomProgress={zoomProgress}
      zoomAmount={zoomAmount}
    />
    {/* 左側漸層：只在文字欄（< 560px）內淡化，不壓到截圖內容 */}
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 560,
        height: 1080,
        background:
          'linear-gradient(90deg, #04080F 0%, #04080F 88%, rgba(4,8,15,0) 100%)',
      }}
    />
    {/* 上下漸層只作用於截圖外圍，截圖區（200–914）保持清晰 */}
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
  </>
);

/** 左側步驟說明 */
export const CaseLabel: React.FC<{
  step: string;
  title: React.ReactNode;
  lines: readonly string[];
  frame: number;
}> = ({ step, title, lines, frame }) => {
  const p = interpolate(frame, [4, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        top: 296,
        width: 336,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.mono,
          fontSize: 19,
          letterSpacing: 4,
          color: COLORS.cyan,
          border: '1px solid rgba(34,211,238,0.5)',
          borderRadius: 999,
          padding: '3px 14px',
          display: 'inline-block',
        }}
      >
        {step}
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: FONTS.sans,
          fontSize: 44,
          fontWeight: 700,
          lineHeight: 1.28,
          color: COLORS.text,
        }}
      >
        {title}
      </div>
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {lines.map((line, index) => {
          const lp = interpolate(frame, [16 + index * 8, 34 + index * 8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: ease,
          });
          return (
            <div
              key={line}
              style={{
                fontFamily: FONTS.sans,
                fontSize: 23,
                lineHeight: 1.5,
                color: COLORS.textDim,
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
  );
};

/** 截圖高亮框：自動帶入顯示區與推近參數 */
export const CaseBox: React.FC<{
  rect: Rect;
  naturalWidth: number;
  naturalHeight: number;
  focus: Rect;
  zoomProgress: number;
  zoomAmount?: number;
  opacity?: number;
  lineWidth?: number;
  glow?: boolean;
  radius?: number;
}> = ({ rect, naturalWidth, naturalHeight, focus, zoomProgress, zoomAmount = 0.04, opacity = 1, lineWidth = 2, glow = true, radius = 10 }) => (
  <HighlightBox
    rect={rect}
    naturalWidth={naturalWidth}
    naturalHeight={naturalHeight}
    frame={CASE_SHOT}
    focus={focus}
    zoomProgress={zoomProgress}
    zoomAmount={zoomAmount}
    color={COLORS.cyan}
    opacity={opacity}
    lineWidth={lineWidth}
    glow={glow}
    radius={radius}
  />
);

export { IMG };
