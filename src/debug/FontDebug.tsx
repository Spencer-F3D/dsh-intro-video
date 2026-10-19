import React from 'react';
import { AbsoluteFill, continueRender, delayRender, staticFile } from 'remotion';
import { loadChineseFont } from '../lib/fonts';
import { FONTS } from '../theme';

/**
 * 診斷用：直接輸出字型載入的原始狀態，不用「寬度比較」這種間接推論。
 *
 * 需要看到的三件事：
 * 1. manifest 是否抓到、有幾個 face
 * 2. <style> 是否插進 head、內容前段長什麼樣
 * 3. document.fonts 裡實際註冊了幾個 FontFace、狀態是什麼
 * 4. check() 對中文的回報（true/false）與實際渲染寬度
 */

const SAMPLE = '分鏡表旁跑';

export const FontDebug: React.FC = () => {
  const [lines, setLines] = React.useState<string[]>(['等待中…']);
  const [handle] = React.useState(() => delayRender('FontDebug 收集狀態'));

  React.useEffect(() => {
    const collected: string[] = [];
    const run = async () => {
      const manifestUrl = staticFile('fonts/fonts.manifest.json');
      collected.push(`manifest staticFile url: ${manifestUrl}`);
      const manifestResp = await fetch(manifestUrl);
      collected.push(`manifest status: ${manifestResp.status}`);
      const manifest = await manifestResp.json();
      collected.push(`manifest faces: ${manifest.faces?.length ?? 'undefined'}`);
      collected.push(`sample face file: ${manifest.faces?.[0]?.file}`);
      collected.push(`sample range: ${String(manifest.faces?.[0]?.unicodeRange).slice(0, 50)}`);

      await loadChineseFont();
      collected.push('loadChineseFont(): resolved');

      const style = document.querySelector('style[data-dsh-fonts]') as HTMLStyleElement | null;
      collected.push(`style injected: ${style ? 'yes' : 'NO'}`);
      if (style) collected.push(`style head: ${style.textContent?.slice(0, 160)}`);

      let count = 0;
      const statuses: Record<string, number> = {};
      document.fonts.forEach((f: FontFace) => {
        count += 1;
        statuses[f.status] = (statuses[f.status] ?? 0) + 1;
      });
      collected.push(`document.fonts size: ${count} / ${JSON.stringify(statuses)}`);
      collected.push(`document.fonts.status: ${document.fonts.status}`);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      for (const family of [FONTS.sans, '"__NoSuchFontFamily__"']) {
        ctx.font = `700 64px ${family}`;
        const w = ctx.measureText(SAMPLE).width.toFixed(2);
        collected.push(`width [${family}] = ${w}`);
      }
      collected.push(
        `check 700 Noto 分: ${document.fonts.check(`700 64px ${FONTS.sans}`, '分')}`,
      );
      collected.push(
        `check 700 Noto 跑: ${document.fonts.check(`700 64px ${FONTS.sans}`, '跑')}`,
      );
      setLines(collected);
    };
    run()
      .catch((error: unknown) => {
        setLines([`ERROR: ${error instanceof Error ? error.message : String(error)}`]);
      })
      .finally(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#04080F',
        color: '#EAF3FF',
        padding: 36,
        fontFamily: 'monospace',
        fontSize: 22,
        lineHeight: 1.6,
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 18 }}>Font Debug / 字型載入狀態</div>
      {lines.map((line, i) => (
        <div key={i} style={{ wordBreak: 'break-all' }}>
          {line}
        </div>
      ))}
      <div style={{ marginTop: 20, fontSize: 40, fontFamily: FONTS.sans }}>樣本：{SAMPLE}</div>
    </AbsoluteFill>
  );
};
