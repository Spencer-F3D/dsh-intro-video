import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { Screenshot, HighlightBox, type Rect } from '../../components/Screenshot';
import { Backdrop } from '../../components/Backdrop';
import { IMG } from '../../content/shots';
import { COLORS, FONTS } from '../../theme';

/**
 * S3-4 成果回到對話（43–45s，本地幀 0–89）
 *
 * 使用使用者提供的真實截圖 dsh-workflow-02.png（同一段對話交回多個檔案）。
 * 這裡只框選右側 script.md 卡片，因為該卡片是完整的（不切邊），適合當作「交回成果」的視覺焦點。
 * 統計數字僅展示截圖原值，不做效能結論。
 * 標題置於截圖上方乾淨區域。
 */

const ease = Easing.out(Easing.cubic);

/** 截圖顯示區 */
const SHOT: Rect = { x: 460, y: 250, w: 1000, h: 520 };
/** 推近目標：原圖右側 script.md 卡片 */
const CARD_FOCUS: Rect = { x: 1120, y: 480, w: 560, h: 130 };

export const FeatureDeliverables: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Backdrop />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 96,
          textAlign: 'center',
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          transform: `translateY(${interpolate(frame, [0, 18], [16, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: ease,
          })}px)`,
        }}
      >
        <div
          style={{ fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 5, color: COLORS.cyan }}
        >
          04 · 真實工作流
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONTS.sans,
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.text,
          }}
        >
          成果，交回同一段對話
        </div>
      </div>

      <Screenshot
        src={IMG.flow2.src}
        naturalWidth={IMG.flow2.w}
        naturalHeight={IMG.flow2.h}
        frame={SHOT}
        focus={CARD_FOCUS}
        zoomProgress={interpolate(frame, [12, 89], [0, 1])}
        zoomAmount={0.06}
        opacity={interpolate(frame, [0, 16], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
      />

      {/* 框選 script.md：分鏡表與旁白全文 */}
      <HighlightBox
        rect={CARD_FOCUS}
        naturalWidth={IMG.flow2.w}
        naturalHeight={IMG.flow2.h}
        frame={SHOT}
        focus={CARD_FOCUS}
        color={COLORS.cyan}
        radius={12}
        opacity={interpolate(frame, [22, 40], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 180,
          display: 'flex',
          justifyContent: 'center',
          gap: 16,
          opacity: interpolate(frame, [40, 58], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {['影片成品', '分鏡表與旁白', '可重跑的腳本'].map((item) => (
          <div
            key={item}
            style={{
              fontFamily: FONTS.sans,
              fontSize: 26,
              color: COLORS.text,
              border: '1px solid rgba(59,130,246,0.38)',
              backgroundColor: 'rgba(10,20,38,0.9)',
              borderRadius: 999,
              padding: '10px 22px',
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
