import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile } from 'remotion';
import { COLORS, FONTS } from '../theme';

/**
 * 全片共用視覺層：背景光暈、網格、面板與小標。
 * 全部為靜態樣式，不含動畫，避免與場景動畫互相干擾。
 */

export const Backdrop: React.FC<{ dim?: number }> = ({ dim = 0 }) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
    <AbsoluteFill
      style={{
        backgroundImage: 'radial-gradient(circle at 30% 18%, rgba(59,130,246,0.20) 0%, transparent 55%)',
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: 'radial-gradient(circle at 76% 78%, rgba(34,211,238,0.16) 0%, transparent 58%)',
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(96,165,250,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(96,165,250,0.05) 1px, transparent 1px)',
        backgroundSize: '96px 96px',
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(ellipse at center, transparent 42%, ${COLORS.bgDeep} 96%)`,
      }}
    />
    {dim > 0 ? (
      <AbsoluteFill style={{ backgroundColor: `rgba(4,8,15,${dim})` }} />
    ) : null}
  </AbsoluteFill>
);

export const Panel: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      backgroundColor: COLORS.panel,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 20,
      boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
      ...style,
    }}
  >
    {children}
  </div>
);

/** 「示意圖」小標，放在任何非截圖的示意畫面角落 */
export const SpecNote: React.FC<{ text?: string; style?: React.CSSProperties }> = ({
  text = '示意圖',
  style,
}) => (
  <div
    style={{
      fontFamily: FONTS.sans,
      fontSize: 20,
      letterSpacing: 2,
      color: COLORS.textFaint,
      border: '1px solid rgba(159,180,207,0.26)',
      borderRadius: 999,
      padding: '5px 16px',
      lineHeight: 1.3,
      ...style,
    }}
  >
    {text}
  </div>
);

/** Logo：預設為白鯨黑圖，深色背景時加上青色描邊光暈 */
export const WhaleLogo: React.FC<{
  size: number;
  style?: React.CSSProperties;
  opacity?: number;
}> = ({ size, style, opacity = 1 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle, rgba(34,211,238,0.16) 0%, transparent 70%)',
      opacity,
      ...style,
    }}
  >
    <Img
      src={staticFile('assets/dsh_logo.png')}
      style={{
        width: size * 0.86,
        height: size * 0.86,
        filter: 'invert(1) brightness(1.05) drop-shadow(0 0 18px rgba(34,211,238,0.45))',
      }}
    />
  </div>
);

/** 進度指示：目前在第幾項 */
export const ProgressPills: React.FC<{ total: number; active: number; style?: React.CSSProperties }> = ({
  total,
  active,
  style,
}) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'center', ...style }}>
    {Array.from({ length: total }).map((_, index) => (
      <div
        key={index}
        style={{
          width: index === active ? 48 : 16,
          height: 4,
          borderRadius: 2,
          backgroundColor:
            index === active ? COLORS.cyan : 'rgba(159,180,207,0.28)',
        }}
      />
    ))}
  </div>
);

/** 向量打勾 */
export const CheckIcon: React.FC<{ size?: number; color?: string; draw?: number }> = ({
  size = 26,
  color = COLORS.check,
  draw = 1,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: 'visible' }}>
    <circle cx={12} cy={12} r={10.5} fill="none" stroke={color} strokeWidth={1.4} opacity={0.5} />
    <path
      d="M6.8 12.4 L10.2 15.8 L17.4 8.2"
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={42}
      strokeDashoffset={42 * (1 - draw)}
    />
  </svg>
);

/** 沿著弧線描邊的圓環，用於開場 logo */
export const StrokeRing: React.FC<{
  size: number;
  progress: number;
  color?: string;
  strokeWidth?: number;
}> = ({ size, progress, color = COLORS.cyan, strokeWidth = 2 }) => {
  const r = size / 2 - strokeWidth;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ position: 'absolute' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        opacity={0.75}
        transform={`rotate(${interpolate(progress, [0, 1], [-90, -90 + 40])} ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};
