import React from 'react';
import { AbsoluteFill, Sequence, useVideoConfig } from 'remotion';
import { CaptionTrack } from './components/CaptionTrack';
import { CAPTIONS } from './content/captions';
import { loadChineseFont } from './lib/fonts';
import { S1Open } from './scenes/S1Open';
import { S2Positioning } from './scenes/S2Positioning';
import { S3Features } from './scenes/S3Features';
import { S4CaseStudy } from './scenes/S4CaseStudy';
import { S5Outro } from './scenes/S5Outro';
import { COLORS, TIMELINE, VIDEO } from './theme';

/**
 * 整條影片只做三件事：
 * 1. 撐住渲染直到中文字型就緒（缺字會直接報錯，而不是輸出空白）
 * 2. 依 TIMELINE 把五個場景排上時間軸（場景內部使用場景本地幀）
 * 3. 最上層鋪一條全片字幕軌
 *
 * 角色的分層：場景 → 字幕，確保字幕永遠在最上層。
 */
export const DshIntro: React.FC = () => {
  const { fps } = useVideoConfig();
  loadChineseFont();

  const toFrames = (seconds: number) => Math.round(seconds * fps);
  const { s1Open, s2Positioning, s3Features, s4CaseStudy, s5Outro } = TIMELINE;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <Sequence name="S1 開場" from={toFrames(s1Open.from)} durationInFrames={toFrames(s1Open.to - s1Open.from)}>
        <S1Open />
      </Sequence>
      <Sequence
        name="S2 定位"
        from={toFrames(s2Positioning.from)}
        durationInFrames={toFrames(s2Positioning.to - s2Positioning.from)}
      >
        <S2Positioning />
      </Sequence>
      <Sequence
        name="S3 核心能力"
        from={toFrames(s3Features.from)}
        durationInFrames={toFrames(s3Features.to - s3Features.from)}
      >
        <S3Features />
      </Sequence>
      <Sequence
        name="S4 真實案例"
        from={toFrames(s4CaseStudy.from)}
        durationInFrames={toFrames(s4CaseStudy.to - s4CaseStudy.from)}
      >
        <S4CaseStudy />
      </Sequence>
      <Sequence name="S5 結尾" from={toFrames(s5Outro.from)} durationInFrames={toFrames(s5Outro.to - s5Outro.from)}>
        <S5Outro />
      </Sequence>

      <Sequence name="字幕軌" from={0} durationInFrames={VIDEO.totalSeconds * fps}>
        <CaptionTrack cues={CAPTIONS} />
      </Sequence>
    </AbsoluteFill>
  );
};
