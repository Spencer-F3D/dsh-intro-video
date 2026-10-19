import React from 'react';
import { Easing, Img, interpolate, staticFile } from 'remotion';

export type Rect = { x: number; y: number; w: number; h: number };

/** 截圖會自動換算的顯示參數，高亮框／裁切標註共用以保證對位 */
type Placement = {
  naturalWidth: number;
  naturalHeight: number;
  frame: Rect;
  focus?: Rect;
  zoomProgress?: number;
  zoomAmount?: number;
};

const resolvePlacement = ({
  naturalWidth,
  naturalHeight,
  frame,
  focus,
  zoomProgress = 0,
  zoomAmount = 0,
}: Placement) => {
  const fitScale = Math.min(frame.w / naturalWidth, frame.h / naturalHeight);
  const target = focus ?? { x: 0, y: 0, w: naturalWidth, h: naturalHeight };
  const focusScale = Math.max(frame.w / target.w, frame.h / target.h) * fitScale;
  const zoom = interpolate(zoomProgress, [0, 1], [0, zoomAmount], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const scale = focusScale * (1 + zoom);
  const imgW = naturalWidth * scale;
  const imgH = naturalHeight * scale;
  // 讓 focus 中心對齊 frame 中心
  const offsetX = frame.w / 2 - (target.x + target.w / 2) * scale;
  const offsetY = frame.h / 2 - (target.y + target.h / 2) * scale;
  return { scale, imgW, imgH, offsetX, offsetY };
};

/**
 * 截圖：整張等比縮放放入 frame，或用 focus 推近某段 UI。
 * 全程只用尺寸換算，不重新取樣，文字保持銳利。
 */
export const Screenshot: React.FC<Placement & {
  src: string;
  opacity?: number;
  radius?: number;
  style?: React.CSSProperties;
}> = ({ src, opacity = 1, radius = 16, style, ...placement }) => {
  const { imgW, imgH, offsetX, offsetY } = resolvePlacement(placement);
  const { frame } = placement;

  return (
    <div
      style={{
        position: 'absolute',
        left: frame.x,
        top: frame.y,
        width: frame.w,
        height: frame.h,
        overflow: 'hidden',
        borderRadius: radius,
        border: '1px solid rgba(96,165,250,0.35)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.4)',
        opacity,
        ...style,
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          width: imgW,
          height: imgH,
          left: offsetX,
          top: offsetY,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.04)',
        }}
      />
    </div>
  );
};

/**
 * 截圖上的高亮框：以原圖像素座標指定要框住的 UI 元素。
 * 和 Screenshot 使用同一組 placement 參數，因此推近時仍然精準對位。
 */
export const HighlightBox: React.FC<Placement & {
  rect: Rect;
  opacity?: number;
  color?: string;
  radius?: number;
  lineWidth?: number;
  glow?: boolean;
}> = ({
  rect,
  opacity = 1,
  color = 'rgba(34,211,238,0.95)',
  radius = 10,
  lineWidth = 2,
  glow = true,
  ...placement
}) => {
  const { scale, offsetX, offsetY } = resolvePlacement(placement);
  const { frame } = placement;
  const x = frame.x + offsetX + rect.x * scale;
  const y = frame.y + offsetY + rect.y * scale;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: rect.w * scale,
        height: rect.h * scale,
        borderRadius: radius,
        border: `${lineWidth}px solid ${color}`,
        boxShadow: glow
          ? `0 0 0 1px rgba(0,0,0,0.45), 0 0 26px rgba(34,211,238,0.40)`
          : '0 0 0 1px rgba(0,0,0,0.45)',
        opacity,
      }}
    />
  );
};

/** 將局部的「原圖座標」誤差控制在可忽略範圍：只用於除錯畫面 */
export const __debugPlacement = resolvePlacement;
