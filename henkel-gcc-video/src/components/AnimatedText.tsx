import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { fadeIn, slideUpIn, scaleIn } from '../config/animation';
import { FONT_FAMILY } from '../config/brand';

interface AnimatedTextProps {
  text: string;
  appearFrame: number;
  fontSize: number;
  fontWeight: number;
  color: string;
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  fadeInDuration?: number;
  slideUp?: boolean;
  slideDistance?: number;
  scaleFrom?: number;
  style?: React.CSSProperties;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  appearFrame,
  fontSize,
  fontWeight,
  color,
  letterSpacing = 0,
  lineHeight = 1.2,
  textAlign = 'center',
  fadeInDuration = 15,
  slideUp = true,
  slideDistance = 40,
  scaleFrom,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < appearFrame) return null;

  const opacity = fadeIn(frame, appearFrame, fadeInDuration);
  const translateY = slideUp ? slideUpIn(frame, fps, appearFrame, slideDistance) : 0;
  const scale = scaleFrom ? scaleIn(frame, fps, appearFrame, scaleFrom) : 1;

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        color,
        letterSpacing,
        lineHeight,
        textAlign,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        whiteSpace: 'pre-line',
        ...style,
      }}
    >
      {text}
    </div>
  );
};
