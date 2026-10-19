import React from 'react';
import { Composition } from 'remotion';
import { DshIntro } from './Composition';
import { FontDebug } from './debug/FontDebug';
import { FontDiagnostics } from './debug/FontDiagnostics';
import { FontProbe } from './debug/FontProbe';
import { VIDEO } from './theme';

/** CI 出現方塊的那幾行文字，用來做字型診斷 */
const PROBE = '分鏡表與旁白 可重跑的腳本 影片成品 取回可直接播放';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={VIDEO.id}
        component={DshIntro}
        durationInFrames={VIDEO.totalSeconds * VIDEO.fps}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      {/* 診斷用（不在正式影片裡）：渲染時指定 weight 與 sample 即可比較 CI 與本機 */}
      <Composition
        id="FontDiag400"
        component={FontDiagnostics}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ weight: 400, sample: PROBE }}
      />
      <Composition
        id="FontDiag500"
        component={FontDiagnostics}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ weight: 500, sample: PROBE }}
      />
      <Composition
        id="FontDiag700"
        component={FontDiagnostics}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ weight: 700, sample: PROBE }}
      />
      <Composition
        id="FontDiag900"
        component={FontDiagnostics}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ weight: 900, sample: PROBE }}
      />
      <Composition
        id="FontProbe"
        component={FontProbe}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="FontDebug"
        component={FontDebug}
        durationInFrames={1}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
