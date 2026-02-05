import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY } from '../config/brand';
import { S3 } from '../config/timing';
import { SCENE3_TITLE } from '../config/data';
import { fadeIn, scaleIn } from '../config/animation';

export const Scene3_Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
      {/* Title: "This is the GCC." */}
      {frame >= S3.titleAppear && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: fadeIn(frame, S3.titleAppear, 10),
            transform: `scale(${scaleIn(frame, fps, S3.titleAppear, 0.8)})`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: TYPOGRAPHY.hero.fontSize,
              fontWeight: TYPOGRAPHY.hero.fontWeight,
              color: COLORS.henkelRed,
              letterSpacing: TYPOGRAPHY.hero.letterSpacing,
              lineHeight: TYPOGRAPHY.hero.lineHeight,
            }}
          >
            {SCENE3_TITLE}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
