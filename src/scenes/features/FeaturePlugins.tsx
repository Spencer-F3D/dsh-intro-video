import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { Backdrop, CheckIcon, ProgressPills, SpecNote } from '../../components/Backdrop';
import { COLORS, FONTS } from '../../theme';

/**
 * S3-1 一切皆插件（22–31s，本地幀 0–269）
 *
 * 左：官方概念原文「安裝現有插件，或在『創造模式』中透過對話建立插件，擴展工具、技能和介面」
 * 右：示意圖（角落標示「示意圖」）——中央 Cordis 核心，三顆衛星：工具／技能／介面，
 *     由「對話」泡泡流出、沿弧線滑入並描邊連線；下方是官方「番茄時鐘」案例的四行狀態。
 *
 * 所有示意元素皆為向量繪製，不代表產品實際畫面；不引用官方頁的耗時數字。
 */

const ease = Easing.out(Easing.cubic);

/** 官方頁「番茄時鐘」插件案例的狀態行（文字取自官方頁 demo） */
const POMODORO_STEPS = [
  '讀取 SKILL.md（cordis-plugin-development）',
  '檢查提供方：9 個檢查提供方',
  '寫入 package.json／client.js',
  'install_bundle・檢查插件運行狀態',
] as const;

const SATELLITES = [
  { label: '工具', angle: -90 },
  { label: '技能', angle: 30 },
  { label: '介面', angle: 150 },
] as const;

/** 示意圖座標（SVG 本地座標） */
const SVG_W = 900;
const SVG_H = 470;
const CX = 450;
const CY = 250;
const R = 160;

export const FeaturePlugins: React.FC = () => {
  const frame = useCurrentFrame();

  const satelliteIn = (index: number) =>
    interpolate(frame, [40 + index * 12, 66 + index * 12], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: ease,
    });
  const lineProgress = interpolate(frame, [52, 92], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const stepBase = 120;

  return (
    <AbsoluteFill>
      <Backdrop />

      {/* 左側文字 */}
      <div style={{ position: 'absolute', left: 96, top: 150, width: 800 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: FONTS.mono,
            fontSize: 22,
            letterSpacing: 4,
            opacity: interpolate(frame, [0, 14], [0, 1], {
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
            01
          </span>
          <span style={{ color: COLORS.textDim }}>官方能力</span>
        </div>

        <div
          style={{
            marginTop: 22,
            fontFamily: FONTS.sans,
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1.12,
            color: COLORS.text,
            letterSpacing: 2,
            opacity: interpolate(frame, [6, 28], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            transform: `translateY(${interpolate(frame, [6, 28], [26, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: ease,
            })}px)`,
          }}
        >
          一切皆插件
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: FONTS.sans,
            fontSize: 32,
            lineHeight: 1.62,
            color: COLORS.textDim,
            opacity: interpolate(frame, [16, 36], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          安裝現有插件，或在「創造模式」中
          <br />
          透過對話建立插件，
          <br />
          擴展工具、技能和介面。
        </div>

        {/* 案例四步 */}
        <div style={{ marginTop: 34 }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 20,
              letterSpacing: 3,
              color: COLORS.textDim,
              marginBottom: 14,
              opacity: interpolate(frame, [stepBase - 14, stepBase], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            官方案例：用一句話做出「番茄時鐘」插件
          </div>
          {POMODORO_STEPS.map((step, index) => {
            const start = stepBase + index * 14;
            const p = interpolate(frame, [start, start + 14], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: ease,
            });
            return (
              <div
                key={step}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 10,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -14}px)`,
                }}
              >
                <CheckIcon size={24} draw={p} />
                <span
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 25,
                    color: COLORS.text,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右側示意圖 */}
      <div style={{ position: 'absolute', left: 950, top: 150 }}>
        <SpecNote text="示意圖・不代表產品畫面" style={{ marginBottom: 18 }} />
        <div style={{ position: 'relative', width: SVG_W, height: SVG_H }}>
          <svg width={SVG_W} height={SVG_H} style={{ position: 'absolute', inset: 0 }}>
            {/* 外環 */}
            <circle
              cx={CX}
              cy={CY}
              r={R}
              fill="none"
              stroke="rgba(59,130,246,0.30)"
              strokeWidth={1.5}
              strokeDasharray="4 9"
              opacity={interpolate(frame, [20, 44], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}
            />
            {/* 核心到衛星的連線 */}
            {SATELLITES.map((s, index) => {
              const rad = (s.angle * Math.PI) / 180;
              const x1 = CX + Math.cos(rad) * 92;
              const y1 = CY + Math.sin(rad) * 58;
              const x2 = CX + Math.cos(rad) * (R - 44);
              const y2 = CY + Math.sin(rad) * (R - 44);
              const len = Math.hypot(x2 - x1, y2 - y1);
              const p = Math.max(0, Math.min(1, lineProgress * 1.5 - index * 0.2));
              return (
                <line
                  key={s.label}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={COLORS.cyan}
                  strokeWidth={2}
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - p)}
                  opacity={0.6}
                />
              );
            })}
            {/* 對話泡泡 */}
            <g
              opacity={interpolate(frame, [10, 30], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}
            >
              <rect
                x={CX - 78}
                y={CY - 172}
                width={156}
                height={54}
                rx={18}
                fill="rgba(10,20,38,0.96)"
                stroke="rgba(34,211,238,0.55)"
                strokeWidth={1.5}
              />
              <text
                x={CX}
                y={CY - 136}
                textAnchor="middle"
                fill={COLORS.text}
                fontFamily={FONTS.sans}
                fontSize={25}
                fontWeight={500}
              >
                對話
              </text>
              <line
                x1={CX}
                y1={CY - 118}
                x2={CX}
                y2={CY - 70}
                stroke="rgba(34,211,238,0.55)"
                strokeWidth={1.5}
                strokeDasharray="3 5"
              />
            </g>
          </svg>

          {/* 核心 */}
          <div
            style={{
              position: 'absolute',
              left: CX - 92,
              top: CY - 62,
              width: 184,
              height: 124,
              borderRadius: 24,
              border: '1px solid rgba(34,211,238,0.6)',
              background:
                'linear-gradient(160deg, rgba(59,130,246,0.24), rgba(34,211,238,0.10))',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 48px rgba(34,211,238,0.22)',
              opacity: interpolate(frame, [18, 40], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              transform: `scale(${interpolate(frame, [18, 40], [0.9, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: ease,
              })})`,
            }}
          >
            <div style={{ fontFamily: FONTS.mono, fontSize: 18, color: COLORS.textDim }}>
              CORDIS
            </div>
            <div
              style={{
                fontFamily: FONTS.sans,
                fontSize: 32,
                fontWeight: 700,
                color: COLORS.text,
              }}
            >
              插件核心
            </div>
          </div>

          {/* 衛星 */}
          {SATELLITES.map((s, index) => {
            const rad = (s.angle * Math.PI) / 180;
            const p = satelliteIn(index);
            const x = CX + Math.cos(rad) * (R + 44) - 62;
            const y = CY + Math.sin(rad) * (R + 44) - 30;
            return (
              <div
                key={s.label}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: 124,
                  height: 60,
                  borderRadius: 16,
                  border: '1px solid rgba(59,130,246,0.5)',
                  backgroundColor: 'rgba(8,18,32,0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONTS.sans,
                  fontSize: 28,
                  fontWeight: 500,
                  color: COLORS.text,
                  opacity: p,
                  transform: `scale(${0.86 + p * 0.14})`,
                }}
              >
                {s.label}
              </div>
            );
          })}
        </div>
      </div>

      <ProgressPills total={4} active={0} style={{ position: 'absolute', left: 96, top: 962 }} />
    </AbsoluteFill>
  );
};
