import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { Backdrop, SpecNote } from '../../components/Backdrop';
import { COLORS, FONTS } from '../../theme';

/**
 * S4 章節卡（45–48s，本地幀 0–89）
 *
 * 標明這是「使用案例」，並註明所有畫面取自 DSH 介面截圖。
 */
const ease = Easing.out(Easing.cubic);

export const ChapterCard: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 88,
            fontWeight: 700,
            color: 'rgba(34,211,238,0.30)',
            letterSpacing: 6,
            opacity: interpolate(frame, [0, 16], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          04
        </div>

        <div
          style={{
            marginTop: 6,
            fontFamily: FONTS.sans,
            fontSize: 28,
            letterSpacing: 10,
            color: COLORS.cyan,
            opacity: interpolate(frame, [6, 22], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          真實案例
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: FONTS.sans,
            fontSize: 84,
            fontWeight: 900,
            color: COLORS.text,
            letterSpacing: 2,
            opacity: interpolate(frame, [12, 34], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            transform: `translateY(${interpolate(frame, [12, 34], [24, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: ease,
            })}px)`,
          }}
        >
          在 DSH 裡做一支介紹影片
        </div>

        <div
          style={{
            marginTop: 34,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            opacity: interpolate(frame, [26, 46], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <div
            style={{
              width: 56,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${COLORS.cyan})`,
            }}
          />
          <div style={{ fontFamily: FONTS.sans, fontSize: 26, color: COLORS.textDim }}>
            接下來的畫面取自 DSH 介面截圖
          </div>
          <div
            style={{
              width: 56,
              height: 2,
              background: `linear-gradient(90deg, ${COLORS.cyan}, transparent)`,
            }}
          />
        </div>
      </AbsoluteFill>

      <SpecNote
        text="非示意圖・實際介面"
        style={{ position: 'absolute', right: 96, bottom: 120 }}
      />
    </AbsoluteFill>
  );
};
