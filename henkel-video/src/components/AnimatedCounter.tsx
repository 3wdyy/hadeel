import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
  duration?: number;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = "",
  prefix = "",
  delay = 0,
  duration = 45,
  fontSize = 120,
  color = "#FFFFFF",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 50, stiffness: 100, mass: 1 },
    durationInFrames: duration,
  });

  const currentValue = Math.round(interpolate(progress, [0, 1], [0, value]));

  const scale = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 8, stiffness: 100, mass: 0.5 },
  });

  return (
    <div
      style={{
        fontSize,
        fontWeight: 900,
        color,
        fontFamily: "'Montserrat', sans-serif",
        transform: `scale(${interpolate(scale, [0, 1], [0.8, 1])})`,
        opacity: scale,
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {prefix}
      {currentValue.toLocaleString()}
      {suffix}
    </div>
  );
};
