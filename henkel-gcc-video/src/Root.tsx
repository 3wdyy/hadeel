import React from 'react';
import { Composition } from 'remotion';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { Video } from './Video';
import { VIDEO } from './config/timing';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="HenkelGCCVideo"
        component={Video}
        durationInFrames={VIDEO.totalFrames}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
