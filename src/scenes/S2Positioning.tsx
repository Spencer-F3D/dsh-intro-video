import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { Screenshot, HighlightBox, type Rect } from '../components/Screenshot';
import { CheckIcon } from '../components/Backdrop';
import { IMG } from '../content/shots';
import { COLORS, FONTS, TYPE } from '../theme';

/**
 * S2 定位（8–22s，本地幀 0–419；全局幀 = 本地幀 + 240）
 *
 * 0.0–8.5   主畫面滿版；下方漸層安全帶容納說明文字，避免壓到截圖上的 UI
 *           側欄四項依序高亮：插件／插件市場／自動化任務／上下文洞察
 * 8.5–11.5  輸入框推近到右側，左側列出三種操作方式
 *             （/ 調用指令、@ 帶入文件或對話、自動審查）
 * 11.5–14.0 官方五大用途滑入：日常工作／編寫程式／資料查證／後台任務／插件擴展
 */

const ease = Easing.out(Easing.cubic);

const reveal = (frame: number, start: number, duration = 18, distance = 22) => {
  const p = interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return { opacity: p, transform: `translateY(${(1 - p) * distance}px)` };
};

/** 主畫面顯示區 */
const MAIN_SHOT: Rect = { x: 0, y: -10, w: 1920, h: 1080 };
/** 輸入框推近的顯示區（右側） */
const FOCUS_FRAME: Rect = { x: 900, y: 300, w: 900, h: 470 };
/** 輸入框在原圖中的位置 */
const COMPOSER_FOCUS: Rect = { x: 540, y: 470, w: 1240, h: 240 };

const NAV_ITEMS = [
  { label: '插件', rect: { x: 20, y: 206, w: 372, h: 58 } },
  { label: '插件市場', rect: { x: 20, y: 266, w: 372, h: 58 } },
  { label: '自動化任務', rect: { x: 20, y: 326, w: 372, h: 58 } },
  { label: '上下文洞察', rect: { x: 20, y: 386, w: 372, h: 58 } },
] as const;

const OPERATORS = [
  { glyph: '/', label: '調用指令' },
  { glyph: '@', label: '帶入文件或對話' },
  { glyph: '✓', label: '自動審查' },
] as const;

const USES = ['日常工作', '編寫程式', '資料查證', '後台任務', '插件擴展'] as const;

export const S2Positioning: React.FC = () => {
  const frame = useCurrentFrame();

  const fullOpacity = interpolate(frame, [0, 14, 250, 272], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const highlightIndex = Math.min(
    NAV_ITEMS.length - 1,
    Math.floor(
      interpolate(frame, [80, 80 + 30 * NAV_ITEMS.length], [0, NAV_ITEMS.length], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    ),
  );
  const navVisible = interpolate(frame, [72, 90, 236, 250], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bandIn = interpolate(frame, [8, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const bandOut = interpolate(frame, [238, 258], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const focusIn = interpolate(frame, [250, 278], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  const usesIn = interpolate(frame, [336, 364], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  return (
    <AbsoluteFill>
      {/* 主畫面 */}
      <AbsoluteFill style={{ opacity: fullOpacity }}>
        <Screenshot
          src={IMG.home.src}
          naturalWidth={IMG.home.w}
          naturalHeight={IMG.home.h}
          frame={MAIN_SHOT}
          zoomProgress={interpolate(frame, [0, 419], [0, 1])}
          zoomAmount={0.04}
          radius={0}
          style={{ border: 'none', boxShadow: 'none' }}
        />
        {/* 底部漸層安全帶 */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(4,8,15,0) 56%, rgba(4,8,15,0.92) 78%, #04080F 100%)',
          }}
        />

        {/* 側欄高亮 */}
        <div style={{ opacity: navVisible }}>
          {NAV_ITEMS.map((item, index) => (
            <HighlightBox
              key={item.label}
              rect={item.rect}
              naturalWidth={IMG.home.w}
              naturalHeight={IMG.home.h}
              frame={MAIN_SHOT}
              zoomProgress={interpolate(frame, [0, 419], [0, 1])}
              zoomAmount={0.04}
              color={COLORS.cyan}
              opacity={index <= highlightIndex ? (index === highlightIndex ? 1 : 0.45) : 0}
              radius={8}
            />
          ))}
        </div>

        {/* 下方說明帶 */}
        <div
          style={{
            position: 'absolute',
            left: 96,
            right: 96,
            top: 748,
            opacity: bandIn * bandOut,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 22,
              letterSpacing: 5,
              color: COLORS.cyan,
              ...reveal(frame, 10, 16, 12),
            }}
          >
            DEEPSEEK HARNESS
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 22,
              marginTop: 6,
              ...reveal(frame, 14, 22, 26),
            }}
          >
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 60,
                fontWeight: 700,
                lineHeight: 1.15,
                color: COLORS.text,
                whiteSpace: 'nowrap',
              }}
            >
              DeepSeek 開源的 harness 架構
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {['桌面應用', '程式碼啟動為網頁', '開源 · MIT'].map((tag, index) => (
                <div
                  key={tag}
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 22,
                    color: COLORS.textDim,
                    border: '1px solid rgba(59,130,246,0.45)',
                    borderRadius: 999,
                    padding: '4px 14px',
                    whiteSpace: 'nowrap',
                    ...reveal(frame, 34 + index * 6, 16, 12),
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: FONTS.sans,
              fontSize: 32,
              color: COLORS.textDim,
              whiteSpace: 'nowrap',
              ...reveal(frame, 26, 20, 18),
            }}
          >
            基於 Cordis 的「一切皆插件」架構建構，以可自由組合的插件拓展 Agent 能力。
          </div>
        </div>
      </AbsoluteFill>

      {/* 輸入框推近 */}
      <AbsoluteFill style={{ opacity: focusIn }}>
        <Screenshot
          src={IMG.home.src}
          naturalWidth={IMG.home.w}
          naturalHeight={IMG.home.h}
          frame={FOCUS_FRAME}
          focus={COMPOSER_FOCUS}
          zoomProgress={interpolate(frame, [278, 419], [0, 1])}
          zoomAmount={0.03}
        />
        <div style={{ position: 'absolute', left: 120, top: 300, width: 720 }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 22,
              letterSpacing: 5,
              color: COLORS.cyan,
              marginBottom: 22,
              ...reveal(frame, 266, 16, 12),
            }}
          >
            一句話開始工作
          </div>
          {OPERATORS.map((op, index) => (
            <div
              key={op.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                marginBottom: 24,
                ...reveal(frame, 274 + index * 9, 18, 18),
              }}
            >
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(34,211,238,0.5)',
                  backgroundColor: 'rgba(34,211,238,0.10)',
                  fontFamily: FONTS.sans,
                  fontSize: 30,
                  fontWeight: 700,
                  color: COLORS.cyan,
                }}
              >
                {op.glyph}
              </div>
              <div
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: TYPE.h3,
                  fontWeight: 500,
                  color: COLORS.text,
                }}
              >
                {op.label}
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* 官方五大用途 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 236,
          display: 'flex',
          justifyContent: 'center',
          gap: 18,
          opacity: usesIn,
        }}
      >
        {USES.map((use, index) => (
          <div
            key={use}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 24px',
              borderRadius: 14,
              border: '1px solid rgba(59,130,246,0.32)',
              backgroundColor: 'rgba(10,20,38,0.85)',
              transform: `translateY(${interpolate(
                frame,
                [336 + index * 6, 364 + index * 6],
                [18, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease },
              )}px)`,
            }}
          >
            <CheckIcon size={24} color={COLORS.check} />
            <span
              style={{
                fontFamily: FONTS.sans,
                fontSize: 30,
                fontWeight: 500,
                color: COLORS.text,
                whiteSpace: 'nowrap',
              }}
            >
              {use}
            </span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
