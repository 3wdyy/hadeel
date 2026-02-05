import React from 'react';
import { useCurrentFrame, staticFile, Img } from 'remotion';
import { fadeIn, fadeOut } from '../config/animation';
import { LOGO } from '../config/brand';

export const HenkelLogo: React.FC = () => {
  const frame = useCurrentFrame();

  if (frame < LOGO.startFrame || frame > LOGO.endFrame) return null;

  const fadeInOp = fadeIn(frame, LOGO.startFrame, 15);
  const fadeOutOp = frame >= LOGO.endFrame - 20
    ? fadeOut(frame, LOGO.endFrame - 20, 20)
    : 1;
  const opacity = fadeInOp * fadeOutOp * LOGO.opacity;

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
