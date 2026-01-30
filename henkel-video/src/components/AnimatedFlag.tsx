import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface AnimatedFlagProps {
  flag: string;
  delay?: number;
  size?: number;
  style?: React.CSSProperties;
}

export const AnimatedFlag: React.FC<AnimatedFlagProps> = ({
  flag,
  delay = 0,
  size = 80,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const bounceIn = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 8, stiffness: 150, mass: 0.6 },
  });

  const rotate = interpolate(bounceIn, [0, 0.5, 1], [0, -10, 0]);
  const scale = interpolate(bounceIn, [0, 0.5, 1], [0, 1.2, 1]);

  return (
    <div
      style={{
        fontSize: size,
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity: bounceIn,
        display: "inline-block",
        margin: "0 10px",
        filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.3))`,
        ...style,
      }}
    >
      {flag}
    </div>
  );
};

interface FlagRowProps {
  flags: string[];
  staggerDelay?: number;
  startDelay?: number;
  size?: number;
}

export const FlagRow: React.FC<FlagRowProps> = ({
  flags,
  staggerDelay = 8,
  startDelay = 0,
  size = 80,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      {flags.map((flag, index) => (
        <AnimatedFlag
          key={index}
          flag={flag}
          delay={startDelay + index * staggerDelay}
          size={size}
        />
      ))}
    </div>
  );
};
