import React from 'react';
import { useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { fadeIn, scaleIn } from '../config/animation';
import { COLORS, FONT_FAMILY, SPACING } from '../config/brand';
import type { ExComMember } from '../config/data';

interface ExComCardProps {
  member: ExComMember;
  appearFrame: number;
  width?: number;
  height?: number;
}

export const ExComCard: React.FC<ExComCardProps> = ({
  member,
  appearFrame,
  width = 248,
  height = 170,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < appearFrame) return null;

  const opacity = fadeIn(frame, appearFrame, 12);
  const scale = scaleIn(frame, fps, appearFrame, 0.7, 'gentle');

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: COLORS.henkelRed,
        borderRadius: SPACING.cardRadius,
        padding: SPACING.cardPadding,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        opacity,
        transform: `scale(${scale})`,
        overflow: 'hidden',
      }}
    >
      {/* Headshot circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(255,255,255,0.3)',
          marginTop: 4,
          flexShrink: 0,
        }}
      >
        <img
          src={staticFile(member.headshot)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Name */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 22,
          fontWeight: 700,
          color: COLORS.white,
          letterSpacing: 0.3,
          marginTop: 8,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {member.name}
      </div>

      {/* Role */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 16,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: 0.2,
          marginTop: 4,
          textAlign: 'center',
        }}
      >
        {member.role}
      </div>

      {/* Nationality */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 14,
          fontWeight: 400,
          color: 'rgba(255,255,255,0.7)',
          letterSpacing: 0.3,
          marginTop: 4,
          textAlign: 'center',
        }}
      >
        {member.flag} {member.nationality}
      </div>
    </div>
  );
};
