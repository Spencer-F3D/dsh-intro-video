import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Series } from 'remotion';
import { ChapterCard } from './case/ChapterCard';
import { CaseStep } from './case/CaseStep';
import { CaseAdjust } from './case/CaseAdjust';
import { CaseResult } from './case/CaseResult';

/**
 * S4 真實案例（45–70s，本地幀 0–749）
 *
 * 全部使用使用者提供的工作流截圖，不重畫假介面；
 * 未出現在截圖的敘述只在字幕中出現，畫面以高亮框指出對應區域。
 *
 *   章節卡          45.0–48.0s（ 90 幀）
 *   Step 1 工作區   48.0–53.0s（150 幀）
 *   Step 2 說清楚   53.0–59.0s（180 幀）
 *   Step 3 可調整   59.0–65.0s（180 幀）
 *   Step 4 取回成品 65.0–70.0s（150 幀）
 */
export const S4CaseStudy: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence name="章節卡" durationInFrames={90}>
        <ChapterCard />
      </Series.Sequence>
      <Series.Sequence name="Step 1 工作區" durationInFrames={150}>
        <CaseStep step={1} />
      </Series.Sequence>
      <Series.Sequence name="Step 2 說清楚" durationInFrames={180}>
        <CaseStep step={2} />
      </Series.Sequence>
      <Series.Sequence name="Step 3 可調整" durationInFrames={180}>
        <CaseAdjust />
      </Series.Sequence>
      <Series.Sequence name="Step 4 取回成品" durationInFrames={150}>
        <CaseResult />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
