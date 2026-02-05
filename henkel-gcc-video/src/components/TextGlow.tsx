import React from 'react';
import { FONT_FAMILY } from '../config/brand';

interface TextGlowProps {
  text: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  glowColor?: string;
  style?: React.CSSProperties;
}

export const TextGlow: React.FC<TextGlowProps> = ({
  text,
  fontSize,
  fontWeight,
  color,
  glowColor,
  style = {},
}) => {
  const glow = glowColor || (color === '#FFFFFF' || color === 'white'
    ? 'rgba(255, 255, 255, 0.15)'
    : 'rgba(225, 0, 15, 0.15)');

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Glow layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          fontFamily: FONT_FAMILY,
          fontSize,
          fontWeight,
          color: glow,
          transform: 'scale(1.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 0,
        }}
      >
        {text}
      </div>
      {/* Main text */}
      <div
        style={{
          position: 'relative',
          fontFamily: FONT_FAMILY,
          fontSize,
          fontWeight,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {text}
      </div>
    </div>
  );
};
