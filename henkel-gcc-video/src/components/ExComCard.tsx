import React from 'react';
import { useCurrentFrame, useVideoConfig, staticFile, Img } from 'remotion';
import { fadeIn, scaleIn } from '../config/animation';
import { COLORS, FONT_FAMILY, SHADOWS } from '../config/brand';
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
        background: COLORS.glassBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 16,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        opacity,
        transform: `scale(${scale})`,
        overflow: 'hidden',
        border: `1px solid rgba(225, 0, 15, 0.2)`,
        boxShadow: `${SHADOWS.card}, ${SHADOWS.innerLight}`,
        position: 'relative',
      }}
    >
      {/* Red accent line at top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '20%',
          right: '20%',
          height: 2,
          background: 'linear-gradient(90deg, transparent, #E1000F, transparent)',
          borderRadius: '0 0 2px 2px',
        }}
      />

      {/* Headshot circle */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          overflow: 'hidden',
          border: `2px solid rgba(225, 0, 15, 0.4)`,
          marginTop: 4,
          flexShrink: 0,
          boxShadow: SHADOWS.redGlow,
        }}
      >
        <Img
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
          fontSize: 20,
          fontWeight: 700,
          color: COLORS.iceWhite,
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
          fontSize: 15,
          fontWeight: 400,
          color: COLORS.coolSilver,
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
          fontSize: 13,
          fontWeight: 400,
          color: COLORS.mutedText,
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
