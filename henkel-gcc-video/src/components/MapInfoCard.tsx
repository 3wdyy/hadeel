import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fadeIn, fadeOut, counterAnimate } from '../config/animation';
import { FONT_FAMILY, COLORS, SHADOWS } from '../config/brand';
import { S4 } from '../config/timing';

interface MapInfoCardProps {
  flag: string;
  country: string;
  sobPercent: number;
  appearFrame: number;
  counterStartFrame: number;
  x: number;
  y: number;
}

export const MapInfoCard: React.FC<MapInfoCardProps> = ({
  flag,
  country,
  sobPercent,
  appearFrame,
  counterStartFrame,
  x,
  y,
}) => {
  const frame = useCurrentFrame();

  if (frame < appearFrame) return null;

  // Graceful fade-out using timing config
  const fadeOutStart = S4.cardsHideStart;
  const fadeOutDuration = S4.cardsHideDuration;
  const exitOpacity = frame >= fadeOutStart
    ? fadeOut(frame, fadeOutStart, fadeOutDuration)
    : 1;

  const opacity = fadeIn(frame, appearFrame, 15) * exitOpacity;
  const counterVal = counterAnimate(frame, counterStartFrame, sobPercent, 35);

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 10,
      }}
    >
      <div
        style={{
          position: 'relative',
          background: COLORS.glassBg,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 12,
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          border: `1px solid ${COLORS.glassBorder}`,
          boxShadow: SHADOWS.card,
        }}
      >
        <span style={{ fontSize: 24 }}>{flag}</span>

        <div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.iceWhite,
              letterSpacing: 0.3,
              lineHeight: 1.2,
            }}
          >
            {country}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 28,
                fontWeight: 700,
                color: COLORS.radiantRed,
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {Math.round(counterVal)}%
            </span>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 12,
                fontWeight: 400,
                color: COLORS.coolSilver,
                letterSpacing: 0.5,
              }}
            >
              Share of Business
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
