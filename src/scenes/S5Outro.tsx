import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { Backdrop, CheckIcon, StrokeRing, WhaleLogo } from '../components/Backdrop';
import { COLORS, FONTS } from '../theme';

/**
 * S5 總結、Logo 與結尾（70–90s，本地幀 0–599）
 *
 * 0–4s   三點回顧（皆對應前面章節的內容）
 * 4–9s   三點收攏淡出，鯨魚 logo 由 0.82 放大到 1.0
 * 9–14s  字標與標語「探索未至之境」淡入（與主畫面副標一致）
 * 14–18s 小字：開源・MIT・預覽版；並註明畫面取自 DSH 介面截圖
 * 18–20s 全片淡出
 */

const ease = Easing.out(Easing.cubic);

const POINTS = [
  { title: '一切皆插件', note: '工具、技能、介面都能擴展' },
  { title: '任務直接產出成果', note: '文件、表格、程式都能預覽' },
  { title: '成果回到同一段對話', note: '輪次、步驟與用量都看得見' },
] as const;

export const S5Outro: React.FC = () => {
  const frame = useCurrentFrame();

  const pointsOut = interpolate(frame, [116, 142], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const logoIn = interpolate(frame, [130, 168], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const logoScale = interpolate(frame, [130, 172], [0.82, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const ringProgress = interpolate(frame, [136, 200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const wordmarkIn = interpolate(frame, [160, 196], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const taglineIn = interpolate(frame, [262, 296], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const creditIn = interpolate(frame, [418, 452], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [576, 599], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      <Backdrop />

      {/* 三點回顧 */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 28,
          opacity: pointsOut,
        }}
      >
        {POINTS.map((point, index) => {
          const p = interpolate(frame, [index * 10, 20 + index * 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: ease,
          });
          return (
            <div
              key={point.title}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                width: 1080,
                padding: '22px 30px',
                borderRadius: 18,
                border: '1px solid rgba(59,130,246,0.30)',
                backgroundColor: 'rgba(10,20,38,0.72)',
                opacity: p,
                transform: `translateY(${(1 - p) * 20}px)`,
              }}
            >
              <CheckIcon size={40} draw={p} />
              <div>
                <div
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 42,
                    fontWeight: 700,
                    color: COLORS.text,
                  }}
                >
                  {point.title}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontFamily: FONTS.sans,
                    fontSize: 26,
                    color: COLORS.textDim,
                  }}
                >
                  {point.note}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Logo 與結尾 */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          opacity: logoIn,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${logoScale})`,
          }}
        >
          <StrokeRing size={214} progress={ringProgress} strokeWidth={1.5} />
          <WhaleLogo size={178} />
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: FONTS.sans,
            fontSize: 62,
            fontWeight: 700,
            letterSpacing: 4,
            color: COLORS.text,
            opacity: wordmarkIn,
          }}
        >
          DeepSeek Harness
        </div>

        <div
          style={{
            marginTop: 22,
            fontFamily: FONTS.sans,
            fontSize: 40,
            fontWeight: 500,
            letterSpacing: 12,
            color: COLORS.cyan,
            opacity: taglineIn,
          }}
        >
          探索未至之境
        </div>

        <div
          style={{
            marginTop: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontFamily: FONTS.sans,
            fontSize: 22,
            color: COLORS.textFaint,
            opacity: creditIn,
          }}
        >
          <span>開源 · MIT</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>預覽版</span>
          <span style={{ opacity: 0.5 }}>|</span>
          <span>畫面取自 DSH 介面截圖</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
