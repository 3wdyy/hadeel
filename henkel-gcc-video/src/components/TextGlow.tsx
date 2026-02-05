import React from 'react';
import { FONT_FAMILY } from '../config/brand';

interface TextGlowProps {
  text: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  glowColor?: string;
  glowIntensity?: number;
  style?: React.CSSProperties;
}

export const TextGlow: React.FC<TextGlowProps> = ({
  text,
  fontSize,
  fontWeight,
  color,
  glowColor,
  glowIntensity = 1,
  style = {},
}) => {
  const glow = glowColor || (color === '#FFFFFF' || color === 'white' || color === '#F1F5F9'
    ? 'rgba(255, 255, 255, 0.3)'
    : 'rgba(225, 0, 15, 0.3)');

  return (
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        color,
        textShadow: [
          `0 0 ${10 * glowIntensity}px ${glow}`,
          `0 0 ${20 * glowIntensity}px ${glow}`,
          `0 0 ${40 * glowIntensity}px ${glow}`,
          `0 0 ${80 * glowIntensity}px rgba(225, 0, 15, 0.08)`,
        ].join(', '),
        ...style,
      }}
    >
      {text}
    </span>
  );
};
