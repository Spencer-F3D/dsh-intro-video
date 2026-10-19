import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { Backdrop, ProgressPills, SpecNote } from '../../components/Backdrop';
import { COLORS, FONTS } from '../../theme';

/**
 * S3-2 完成各類任務（31–36s，本地幀 0–149）
 *
 * 官方原文：「整理文檔、分析表格、編寫代碼，直接預覽任務成果，並透過對話持續完善。」
 * 卡片上的檔名與類型取自官方頁「完成各類任務」區塊的成果示意。
 * 只陳述「有這些成果類型、可直接預覽」，不作為格式相容性聲明。
 */

const ease = Easing.out(Easing.cubic);

const FILES = [
  { name: '簡報.docx', type: 'Word 文檔' },
  { name: '數據.xlsx', type: 'Excel 表格' },
  { name: 'index.html', type: 'HTML 頁面' },
  { name: 'label.ts', type: 'TypeScript 代碼' },
  { name: 'analyze.py', type: 'Python 腳本' },
  { name: '報告.pdf', type: 'PDF 文檔' },
  { name: 'README.md', type: 'Markdown 文檔' },
] as const;

export const FeatureTasks: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <Backdrop />

      <div style={{ position: 'absolute', left: 96, top: 150, width: 680 }}>
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
            02
          </span>
          <span style={{ color: COLORS.textDim }}>官方能力</span>
        </div>

        <div
          style={{
            marginTop: 22,
            fontFamily: FONTS.sans,
            fontSize: 88,
            fontWeight: 900,
            lineHeight: 1.14,
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
          完成各類任務
        </div>

        <div
          style={{
            marginTop: 26,
            fontFamily: FONTS.sans,
            fontSize: 34,
            lineHeight: 1.62,
            color: COLORS.textDim,
            opacity: interpolate(frame, [14, 34], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          整理文檔、分析表格、編寫代碼，
          <br />
          直接預覽任務成果，
          <br />
          並透過對話持續完善。
        </div>
      </div>

      <div style={{ position: 'absolute', left: 880, top: 160, width: 960 }}>
        <SpecNote
          text="示意圖・成果類型取自官方頁"
          style={{ display: 'inline-block', marginBottom: 22 }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
          {FILES.map((file, index) => {
            const p = interpolate(frame, [16 + index * 7, 40 + index * 7], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: ease,
            });
            return (
              <div
                key={file.name}
                style={{
                  width: 292,
                  padding: '20px 24px',
                  borderRadius: 18,
                  border: '1px solid rgba(59,130,246,0.38)',
                  background:
                    'linear-gradient(160deg, rgba(12,24,44,0.95), rgba(8,16,30,0.95))',
                  boxShadow: '0 18px 40px rgba(0,0,0,0.4)',
                  opacity: p,
                  transform: `translateY(${(1 - p) * 22}px)`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <svg width={20} height={24} viewBox="0 0 20 24">
                    <path
                      d="M2 1h10l6 6v16H2z"
                      fill="none"
                      stroke={COLORS.cyan}
                      strokeWidth={1.6}
                      strokeLinejoin="round"
                    />
                    <path d="M12 1v6h6" fill="none" stroke={COLORS.cyan} strokeWidth={1.6} />
                  </svg>
                  <span
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 24,
                      color: COLORS.text,
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {file.name}
                  </span>
                </div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 22, color: COLORS.textDim }}>
                  {file.type}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ProgressPills total={4} active={1} style={{ position: 'absolute', left: 96, top: 962 }} />
    </AbsoluteFill>
  );
};
