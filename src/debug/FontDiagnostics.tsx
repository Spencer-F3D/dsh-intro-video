import React from 'react';
import { AbsoluteFill } from 'remotion';
import { GLYPH_TEXT } from '../content/glyphs.generated';
import { loadChineseFont } from '../lib/fonts';
import { FONTS } from '../theme';

/**
 * 診斷用 Composition（不在正式影片裡）：把字型量測結果直接畫出來。
 *
 * 為什麼需要它：CI（Linux）上出現過豆腐方塊，而本機渲染同一幀正常。
 * 這張圖用「與正式影片完全相同」的載入流程（loadChineseFont）量測，
 * 讓 CI 與本機可以在同一基準上比對每個字的 advanceWidth。
 *
 * 判讀方式：同一字重下，若某字的寬度與拉丁字母（例如 "M"）剛好相同、
 * 但與其他中文不同，代表它用了拉丁子集而非中文字集 → 畫面上會出現方塊。
 */

const measure = (weight: number, text: string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return { widths: {} as Record<string, number>, latinM: 0 };
  ctx.font = `${weight} 64px ${FONTS.sans}`;
  const widths: Record<string, number> = {};
  for (const ch of text) {
    if (ch === ' ') continue;
    widths[ch] = Number(ctx.measureText(ch).width.toFixed(2));
  }
  return { widths, latinM: Number(ctx.measureText('M').width.toFixed(2)) };
};

export const FontDiagnostics: React.FC<{ weight: number; sample: string }> = ({
  weight,
  sample,
}) => {
  loadChineseFont();
  const { widths, latinM } = measure(weight, sample);
  const entries = Object.entries(widths);
  const counts = new Map<number, string[]>();
  for (const [ch, w] of entries) {
    const list = counts.get(w) ?? [];
    list.push(ch);
    counts.set(w, list);
  }
  const groups = [...counts.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#04080F',
        color: '#EAF3FF',
        padding: 40,
        fontFamily: FONTS.mono,
        fontSize: 22,
        lineHeight: 1.55,
      }}
    >
      <div style={{ fontSize: 34, fontFamily: FONTS.sans, marginBottom: 10 }}>
        字型診斷 / Font Diagnostics
      </div>
      <div>
        weight: {weight} ｜ latin M width: {latinM} ｜ glyph count: {GLYPH_TEXT.length}
      </div>

      <div style={{ marginTop: 14, fontSize: 20, color: '#9FB4CF' }}>
        依寬度分組（同一組＝同一個字型子集；若中文與 M 同組，代表用了拉丁字集→方塊）
      </div>
      {groups.map(([w, chars]) => {
        const suspicious = w === latinM && /[\u3400-\u9fff]/.test(chars.join(''));
        return (
          <div
            key={w}
            style={{
              marginTop: 6,
              color: suspicious ? '#FF7A7A' : '#EAF3FF',
              fontFamily: FONTS.sans,
              fontSize: 24,
            }}
          >
            width {w} ×{chars.length}
            {suspicious ? '  ← 疑似拉丁子集（方塊）' : ''}：{chars.join('')}
          </div>
        );
      })}

      <div style={{ marginTop: 20, fontSize: 34, fontFamily: FONTS.sans, fontWeight: weight }}>
        巨大字樣：{sample}
      </div>
    </AbsoluteFill>
  );
};
