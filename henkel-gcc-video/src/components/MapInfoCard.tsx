import React from 'react';
import { useCurrentFrame } from 'remotion';
import { fadeIn, counterAnimate } from '../config/animation';
import { FONT_FAMILY, COLORS } from '../config/brand';

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

  const opacity = fadeIn(frame, appearFrame, 15);
  const counterVal = counterAnimate(frame, counterStartFrame, sobPercent, 35);

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
      {/* Card body */}
      <div
        style={{
          position: 'relative',
          backgroundColor: COLORS.white,
          borderRadius: 8,
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {/* Shadow layer behind card */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 8,
            backgroundColor: 'rgba(0,0,0,0.08)',
            transform: 'translate(2px, 2px)',
            zIndex: -1,
          }}
        />

        <span style={{ fontSize: 24 }}>{flag}</span>

        <div>
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.darkGray,
              letterSpacing: 0.3,
              lineHeight: 1.2,
            }}
          >
            {country}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 28,
                fontWeight: 700,
                color: COLORS.henkelRed,
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
                color: COLORS.lightText,
                letterSpacing: 0.3,
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
