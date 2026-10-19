import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { type Caption } from '../content/captions';
import { COLORS, FONTS, SAFE, TYPE } from '../theme';

/**
 * 全片字幕軌（繁體中文）。
 *
 * - 位置鎖死在安全區底部（距底 64px、左右最多 1400px），永不壓到上方 UI 或說明文字
 * - 多行以 \n 手動分行並置中；底襯讓字幕在任何截圖上都可讀
 * - 切換時以 10 幀淡入、8 幀淡出；時間窗互不重疊
 * - 字幕與畫面同一個 frame 驅動，預覽與輸出完全一致
 */
const fadeCurve = Easing.out(Easing.quad);

export const CaptionTrack: React.FC<{ cues: Caption[] }> = ({ cues }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {cues.map((cue) => {
        if (frame < cue.from || frame >= cue.to) return null;
        const fadeIn = interpolate(frame, [cue.from, cue.from + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: fadeCurve,
        });
        const fadeOut = interpolate(frame, [cue.to - 8, cue.to], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = Math.min(fadeIn, fadeOut);
        const lines = cue.text.split('\n');

        return (
          <div
            key={`cue-${cue.from}`}
            style={{
              position: 'absolute',
              bottom: SAFE.bottom,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              opacity,
            }}
          >
            <div
              style={{
                maxWidth: SAFE.captionMaxWidth,
                padding: '14px 34px',
                borderRadius: 14,
                backgroundColor: 'rgba(3, 8, 16, 0.62)',
                border: '1px solid rgba(96,165,250,0.22)',
                boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
                fontFamily: FONTS.sans,
                fontSize: TYPE.caption,
                fontWeight: 500,
                lineHeight: 1.45,
                letterSpacing: 1.2,
                color: COLORS.text,
                textAlign: 'center',
                textShadow: '0 2px 10px rgba(0,0,0,0.6)',
              }}
            >
              {lines.map((line, index) => (
                <div key={`line-${index}`}>{line}</div>
              ))}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
