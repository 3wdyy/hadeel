import React from 'react';
import { useCurrentFrame } from 'remotion';
import { counterAnimate, fadeIn } from '../config/animation';
import { FONT_FAMILY } from '../config/brand';

interface CounterNumberProps {
  target: number;
  suffix?: string;
  startFrame: number;
  duration?: number;
  fontSize: number;
  fontWeight?: number;
  color: string;
  decimals?: number;
  style?: React.CSSProperties;
}

export const CounterNumber: React.FC<CounterNumberProps> = ({
  target,
  suffix = '',
  startFrame,
  duration = 45,
  fontSize,
  fontWeight = 700,
  color,
  decimals = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const value = counterAnimate(frame, startFrame, target, duration);
  const opacity = fadeIn(frame, startFrame, 10);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();

  return (
    <span
      style={{
        fontFamily: FONT_FAMILY,
        fontSize,
        fontWeight,
        color,
        opacity,
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
    >
      {display}
      {suffix}
    </span>
  );
};
