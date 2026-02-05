import React from 'react';
import { useCurrentFrame, staticFile, Img } from 'remotion';
import { fadeIn } from '../config/animation';
import { LOGO } from '../config/brand';

export const HenkelLogo: React.FC = () => {
  const frame = useCurrentFrame();

  // Only visible from frame 600 to 3510
  if (frame < LOGO.startFrame || frame > LOGO.endFrame) return null;

  const opacity = fadeIn(frame, LOGO.startFrame, 15) * LOGO.opacity;

  return (
    <div
      style={{
        position: 'absolute',
        right: LOGO.placement.right,
        bottom: LOGO.placement.bottom,
        opacity,
        zIndex: 100,
      }}
    >
      <Img
        src={staticFile('henkel-logo.png')}
        style={{ height: LOGO.maxHeight, width: 'auto' }}
      />
    </div>
  );
};
