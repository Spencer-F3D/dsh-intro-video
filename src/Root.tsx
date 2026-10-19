import React from 'react';
import { Composition } from 'remotion';
import { DshIntro } from './Composition';
import { VIDEO } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id={VIDEO.id}
      component={DshIntro}
      durationInFrames={VIDEO.totalSeconds * VIDEO.fps}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
};
