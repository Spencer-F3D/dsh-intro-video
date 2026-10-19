import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { Backdrop, ProgressPills, SpecNote } from '../../components/Backdrop';
import { COLORS, FONTS } from '../../theme';

/**
 * S3-3 適應你的工作方式（36–43s，本地幀 0–209）
 *
 * 官方原文：「啟用自動化任務插件，隨時發起任務，讓重複工作按計劃執行。
 *            掌握關鍵進展，按需展開工具調用詳情。」
 * 官方示例：「已建立『專案周報』，每週五 17:00（北京時間）觸發。」
 *
 * 左：自動化任務卡（示意）；右：按需展開工具調用詳情的示意。
 */

const ease = Easing.out(Easing.cubic);

const DETAIL_ROWS = [
  { k: '進展', v: '關鍵節點可查' },
  { k: '詳情', v: '按需展開工具調用' },
  { k: '節奏', v: '按計劃自動執行' },
] as const;

export const FeatureWorkStyle: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Backdrop />

      <div style={{ position: 'absolute', left: 96, top: 150, width: 620 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: FONTS.mono,
            fontSize: 22,
            letterSpacing: 4,
            opacity: interpolate(frame, [0, 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <span
            style={{
              border: '1px solid rgba(34,211,238,0.55)',
              borderRadius: 999,
              padding: '2px 12px',
              fontWeight: 700,
              color: COLORS.cyan,
            }}
          >
            03
          </span>
          <span style={{ color: COLORS.textDim }}>官方能力</span>
        </div>

        <div
          style={{
            marginTop: 20,
            fontFamily: FONTS.sans,
            fontSize: 76,
            fontWeight: 900,
            lineHeight: 1.18,
            color: COLORS.text,
            opacity: interpolate(frame, [4, 24], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            transform: `translateY(${interpolate(frame, [4, 24], [24, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: ease,
            })}px)`,
          }}
        >
          適應你的
          <br />
          工作方式
        </div>

        <div
          style={{
            marginTop: 22,
            fontFamily: FONTS.sans,
            fontSize: 30,
            lineHeight: 1.62,
            color: COLORS.textDim,
            opacity: interpolate(frame, [14, 34], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          啟用自動化任務插件，隨時發起任務，
          <br />
          讓重複工作按計劃執行；
          <br />
          掌握關鍵進展，按需展開工具調用詳情。
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 780,
          top: 196,
          width: 1000,
          padding: '30px 34px',
          borderRadius: 22,
          border: '1px solid rgba(59,130,246,0.4)',
          background: 'linear-gradient(160deg, rgba(12,24,44,0.96), rgba(8,16,30,0.96))',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          opacity: interpolate(frame, [20, 44], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `translateY(${interpolate(frame, [20, 44], [20, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: ease,
          })}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <svg width={26} height={26} viewBox="0 0 24 24">
            <circle cx={12} cy={12} r={9} fill="none" stroke={COLORS.cyan} strokeWidth={1.8} />
            <path
              d="M12 7v5l3.4 2"
              fill="none"
              stroke={COLORS.cyan}
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </svg>
          <span
            style={{ fontFamily: FONTS.sans, fontSize: 24, color: COLORS.textDim, letterSpacing: 2 }}
          >
            自動化任務
          </span>
          <SpecNote text="示意圖" style={{ marginLeft: 'auto' }} />
        </div>
        <div
          style={{ fontFamily: FONTS.sans, fontSize: 38, fontWeight: 700, color: COLORS.text }}
        >
          已建立「專案週報」
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: FONTS.sans,
            fontSize: 28,
            color: COLORS.textDim,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 24,
              color: COLORS.cyan,
              border: '1px solid rgba(34,211,238,0.45)',
              borderRadius: 8,
              padding: '2px 10px',
            }}
          >
            每週五 17:00
          </span>
          北京時間觸發
        </div>

        <div
          style={{ marginTop: 26, borderTop: '1px solid rgba(59,130,246,0.25)', paddingTop: 20 }}
        >
          {DETAIL_ROWS.map((row, index) => {
            const p = interpolate(frame, [58 + index * 12, 82 + index * 12], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: ease,
            });
            return (
              <div
                key={row.k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: '12px 0',
                  borderBottom:
                    index === DETAIL_ROWS.length - 1 ? 'none' : '1px solid rgba(59,130,246,0.14)',
                  opacity: p,
                  transform: `translateX(${(1 - p) * 16}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 22,
                    color: COLORS.cyan,
                    minWidth: 82,
                  }}
                >
                  {row.k}
                </span>
                <span style={{ fontFamily: FONTS.sans, fontSize: 27, color: COLORS.text }}>
                  {row.v}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <ProgressPills total={4} active={2} style={{ position: 'absolute', left: 96, top: 962 }} />
    </AbsoluteFill>
  );
};
