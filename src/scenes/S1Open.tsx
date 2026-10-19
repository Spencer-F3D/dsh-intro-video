import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import {
  Backdrop,
  StrokeRing,
  WhaleLogo,
} from '../components/Backdrop';
import { Screenshot, type Rect } from '../components/Screenshot';
import { IMG } from '../content/shots';
import { COLORS, FONTS } from '../theme';

/**
 * S1 開場（0–8s，本地幀 0–239）
 *
 * 0.0–1.2  中央藍→青細線展開
 * 1.2–2.6  DSH 大字淡入＋字距收斂
 * 2.6–4.2  副標與一行說明依序上移淡入
 * 4.2–5.8  鯨魚 logo 與描邊圓環
 * 5.8–7.4  標題組縮小，主畫面由底部遮罩揭示
 * 7.4–8.0  截圖滿版，交棒給 S2
 */

const ease = Easing.out(Easing.cubic);

const RISE = (frame: number, start: number, duration = 18, distance = 26) => {
  const t = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return { opacity: t, transform: `translateY(${(1 - t) * distance}px)` };
};

/** 主畫面在 S1 的出現區：由底部往上揭示 */
const revealRect: Rect = { x: 0, y: 0, w: 1920, h: 1080 };

export const S1Open: React.FC = () => {
  const frame = useCurrentFrame();

  // 細線
  const lineWidth = interpolate(frame, [0, 34], [0, 620], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const lineOpacity =
    interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) *
    interpolate(frame, [34, 58], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // DSH 字距收斂
  const letterSpacing = interpolate(frame, [36, 82], [64, 8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const dshRise = RISE(frame, 36, 24, 30);

  // 標題組整體縮小上移（5.8s 起）
  const groupScale = interpolate(frame, [166, 206], [1, 0.78], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const groupY = interpolate(frame, [166, 206], [0, -40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const groupOpacity = interpolate(frame, [186, 222], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 主畫面揭示：6.0s 開始，由上往下蓋住整個畫面
  const reveal = interpolate(frame, [180, 228], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // logo
  const logoOpacity = interpolate(frame, [126, 158], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringProgress = interpolate(frame, [128, 186], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
  const logoScale = interpolate(frame, [126, 172], [0.86, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  return (
    <AbsoluteFill>
      <Backdrop />

      {/* 主畫面：由下往上揭開 */}
      <AbsoluteFill style={{ clipPath: `inset(${(1 - reveal) * 100}% 0% 0% 0%)` }}>
        <Screenshot
          src={IMG.home.src}
          naturalWidth={IMG.home.w}
          naturalHeight={IMG.home.h}
          frame={revealRect}
          zoomProgress={interpolate(frame, [204, 240], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}
          zoomAmount={0.04}
          radius={0}
          opacity={reveal > 0 ? 1 : 0}
          style={{ border: 'none', boxShadow: 'none' }}
        />
        {/* 壓暗主畫面，讓標題組在揭示前仍然清楚 */}
        <AbsoluteFill
          style={{ backgroundColor: `rgba(4,8,15,${interpolate(reveal, [0, 1], [0.55, 0])})` }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            transform: `translateY(${groupY}px) scale(${groupScale})`,
            opacity: groupOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo 與圓環 */}
          <div
            style={{
              position: 'relative',
              width: 180,
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
              opacity: logoOpacity,
              transform: `scale(${logoScale})`,
            }}
          >
            <StrokeRing size={168} progress={ringProgress} strokeWidth={1.5} />
            <WhaleLogo size={136} />
          </div>

          {/* DSH */}
          <div
            style={{
              fontFamily: FONTS.sans,
              fontSize: 156,
              fontWeight: 900,
              letterSpacing,
              paddingLeft: letterSpacing,
              lineHeight: 1,
              color: COLORS.text,
              textShadow: '0 0 48px rgba(34,211,238,0.35)',
              ...dshRise,
            }}
          >
            DSH
          </div>

          <div
            style={{
              marginTop: 22,
              fontFamily: FONTS.sans,
              fontSize: 46,
              fontWeight: 500,
              letterSpacing: 14,
              color: COLORS.textDim,
              ...RISE(frame, 82, 18, 20),
            }}
          >
            DeepSeek Harness
          </div>

          <div
            style={{
              marginTop: 26,
              width: 1,
              height: 44,
              background: `linear-gradient(to bottom, ${COLORS.cyan}, transparent)`,
              opacity: interpolate(frame, [104, 128], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          />

          <div
            style={{
              marginTop: 24,
              fontFamily: FONTS.sans,
              fontSize: 34,
              fontWeight: 400,
              letterSpacing: 8,
              color: COLORS.text,
              ...RISE(frame, 106, 20, 16),
            }}
          >
            把想法，變成成果
          </div>
        </div>
      </AbsoluteFill>

      {/* 開場細線 */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: lineWidth,
            height: 2,
            borderRadius: 1,
            background: `linear-gradient(90deg, transparent, ${COLORS.blue}, ${COLORS.cyan}, transparent)`,
            opacity: lineOpacity,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
