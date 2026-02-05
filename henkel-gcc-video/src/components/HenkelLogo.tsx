import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fadeIn } from '../config/animation';
import { LOGO, FONT_FAMILY, COLORS } from '../config/brand';

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
      {/* SVG Henkel logo placeholder — replace with actual henkel-logo.svg when available */}
      <svg width="120" height={LOGO.maxHeight} viewBox="0 0 120 40">
        <rect
          x="0" y="5" width="120" height="30" rx="4"
          fill={COLORS.henkelRed}
        />
        <text
          x="60" y="26"
          textAnchor="middle"
          fontFamily={FONT_FAMILY}
          fontSize="16"
          fontWeight="700"
          fill="white"
          letterSpacing="2"
        >
          HENKEL
        </text>
      </svg>
    </div>
  );
};
