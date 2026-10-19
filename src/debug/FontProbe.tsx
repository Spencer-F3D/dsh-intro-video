import React from 'react';
import { AbsoluteFill, continueRender, delayRender } from 'remotion';
import { loadChineseFont } from '../lib/fonts';
import { FONTS } from '../theme';

/**
 * 診斷用 Composition：分辨「網頁字型是否真的生效」。
 *
 * 關鍵：量測必須在字型載入完成「之後」發生。
 * Remotion 的 delayRender 只延後截圖，不會延後元件執行；
 * 若在 render 階段同步呼叫 measureText，量到的永遠是系統 fallback。
 * 因此這裡用 useState + useEffect，等 loadChineseFont() resolve 後才量測。
 */

const SAMPLE = '分鏡表旁跑';
const SIZE = 64;

const widthOf = (family: string, text: string) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return -1;
  ctx.font = `700 ${SIZE}px ${family}`;
  return Number(ctx.measureText(text).width.toFixed(2));
};

type Row = { label: string; width: number };

export const FontProbe: React.FC = () => {
  const [rows, setRows] = React.useState<Row[] | null>(null);
  const [status, setStatus] = React.useState('loading');
  const [handle] = React.useState(() => delayRender('FontProbe 等待字型載入'));

  React.useEffect(() => {
    let cancelled = false;
    loadChineseFont()
      .then(() => {
        if (cancelled) return;
        setRows([
          { label: 'Noto Sans TC（我們的網頁字型）', width: widthOf(FONTS.sans, SAMPLE) },
          { label: '不存在的字型（純 fallback 基準）', width: widthOf('"__NoSuchFontFamily__"', SAMPLE) },
          { label: 'sans-serif（通用字族）', width: widthOf('sans-serif', SAMPLE) },
        ]);
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setStatus(error instanceof Error ? error.message : String(error));
      })
      .finally(() => continueRender(handle));
    return () => {
      cancelled = true;
    };
  }, [handle]);

  const notoActive = rows ? rows[0].width !== rows[1].width : false;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#04080F',
        color: '#EAF3FF',
        padding: 40,
        fontFamily: 'monospace',
        fontSize: 26,
        lineHeight: 1.7,
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 20 }}>Font Probe / 字型是否生效</div>
      {rows === null ? (
        <div style={{ color: '#FBBF24' }}>等待字型載入… status: {status}</div>
      ) : (
        <>
          <div
            style={{
              color: notoActive ? '#34D399' : '#FF7A7A',
              fontSize: 32,
              marginBottom: 16,
            }}
          >
            Noto Sans TC 生效：{notoActive ? 'YES（寬度與 fallback 不同）' : 'NO（落到 fallback）'}
          </div>
          {rows.map((row) => (
            <div key={row.label} style={{ fontFamily: 'sans-serif', fontSize: 28 }}>
              {row.label} → width {row.width}
            </div>
          ))}
        </>
      )}

      <div style={{ marginTop: 24, fontSize: 40, fontFamily: FONTS.sans }}>樣本：{SAMPLE}</div>
      <div style={{ marginTop: 8, fontSize: 22, color: '#9FB4CF' }}>
        三段寬度若完全相同，表示網頁字型沒有套用，中文來自系統字型。
      </div>
    </AbsoluteFill>
  );
};
