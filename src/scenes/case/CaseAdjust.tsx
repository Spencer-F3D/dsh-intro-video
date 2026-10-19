import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { CaseBackdrop, CaseBox, CaseLabel, IMG } from './CaseFrame';
import { FLOW2 } from '../../content/shots';

/**
 * S4 Step 3：可調整、可重跑（59–65s，本地幀 0–179）
 *
 * 聚焦 dsh-workflow-02.png 的「後續調整」段落：
 * 「改字幕或秒數：編輯 make_video.py 底下的 SCENES 清單，再重跑即可」
 */

export const CaseAdjust: React.FC = () => {
  const frame = useCurrentFrame();
  const zoomProgress = interpolate(frame, [0, 179], [0, 1]);
  const focus = FLOW2.adjustBlock;

  return (
    <AbsoluteFill>
      <CaseBackdrop
        src={IMG.flow2.src}
        naturalWidth={IMG.flow2.w}
        naturalHeight={IMG.flow2.h}
        focus={focus}
        zoomProgress={zoomProgress}
      />

      {[FLOW2.adjustLine1, FLOW2.adjustLine2].map((rect, index) => {
        const start = 20 + index * 26;
        return (
          <CaseBox
            key={index}
            rect={rect}
            naturalWidth={IMG.flow2.w}
            naturalHeight={IMG.flow2.h}
            focus={focus}
            zoomProgress={zoomProgress}
            lineWidth={1.5}
            glow={false}
            radius={8}
            opacity={interpolate(frame, [start, start + 14], [0, 0.9], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
          />
        );
      })}

      <CaseLabel
        step="STEP 3"
        title={
          <>
            可調整
            <br />
            可重跑
          </>
        }
        lines={['改字幕或秒數', '編輯 SCENES 清單', '重跑即可重出片']}
        frame={frame}
      />
    </AbsoluteFill>
  );
};
