import React from 'react';
import { AbsoluteFill, Series } from 'remotion';
import { FeaturePlugins } from './features/FeaturePlugins';
import { FeatureTasks } from './features/FeatureTasks';
import { FeatureWorkStyle } from './features/FeatureWorkStyle';
import { FeatureDeliverables } from './features/FeatureDeliverables';

/**
 * S3 核心能力（22–45s，本地幀 0–689）
 *
 * 四項能力以 Series 依序播放，每一項都是獨立、可單獨編輯的節點：
 *   01 一切皆插件            22.0–31.0s（270 幀）
 *   02 完成各類任務          31.0–36.0s（150 幀）
 *   03 適應你的工作方式      36.0–43.0s（210 幀）
 *   04 成果交回同一段對話    43.0–45.0s（ 60 幀）
 *
 * Series 會自動接續，改某一項長度時只需改這裡的 durationInFrames。
 */
export const S3Features: React.FC = () => (
  <AbsoluteFill>
    <Series>
      <Series.Sequence name="01 一切皆插件" durationInFrames={270}>
        <FeaturePlugins />
      </Series.Sequence>
      <Series.Sequence name="02 完成各類任務" durationInFrames={150}>
        <FeatureTasks />
      </Series.Sequence>
      <Series.Sequence name="03 適應你的工作方式" durationInFrames={210}>
        <FeatureWorkStyle />
      </Series.Sequence>
      <Series.Sequence name="04 成果交回對話" durationInFrames={60}>
        <FeatureDeliverables />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
