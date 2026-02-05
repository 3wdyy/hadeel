import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY, GRADIENTS } from '../config/brand';
import { S3 } from '../config/timing';
import { SCENE3_TITLE } from '../config/data';
import { fadeIn, scaleIn } from '../config/animation';

export const Scene3_Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Underline draw animation
  const underlineWidth = frame >= S3.underlineStart
    ? interpolate(frame, [S3.underlineStart, S3.underlineStart + 25], [0, 100], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <AbsoluteFill style={{ background: GRADIENTS.titleCard }}>
      {/* Vignette */}
      <AbsoluteFill style={{ background: GRADIENTS.vignette, pointerEvents: 'none' }} />

      {/* Subtle dot grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <pattern id="titleGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="0.5" fill="rgba(148, 163, 184, 0.08)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#titleGrid)" />
      </svg>

      {/* Title */}
      {frame >= S3.titleAppear && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: fadeIn(frame, S3.titleAppear, 12),
          transform: `scale(${scaleIn(frame, fps, S3.titleAppear, 0.8, 'cinematic')})`,
        }}>
          <span style={{
            fontFamily: FONT_FAMILY,
            fontSize: TYPOGRAPHY.hero.fontSize,
            fontWeight: TYPOGRAPHY.hero.fontWeight,
            letterSpacing: TYPOGRAPHY.hero.letterSpacing,
            lineHeight: TYPOGRAPHY.hero.lineHeight,
            background: `linear-gradient(135deg, ${COLORS.henkelRed} 0%, ${COLORS.radiantRed} 50%, ${COLORS.henkelRed} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            filter: 'drop-shadow(0 0 30px rgba(225, 0, 15, 0.2))',
          }}>
            {SCENE3_TITLE}
          </span>

          {/* Animated underline */}
          <div style={{
            marginTop: 16,
            height: 3,
            width: `${underlineWidth}%`,
            maxWidth: 300,
            background: `linear-gradient(90deg, transparent, ${COLORS.henkelRed}, transparent)`,
            borderRadius: 2,
            boxShadow: `0 0 10px ${COLORS.redGlow}`,
          }} />
        </div>
      )}
    </AbsoluteFill>
  );
};
