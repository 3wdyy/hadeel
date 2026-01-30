import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

interface TransitionProps {
  type?: "wipe" | "fade" | "zoom" | "slide";
  direction?: "in" | "out";
  duration?: number;
}

export const Transition: React.FC<TransitionProps> = ({
  type = "wipe",
  direction = "in",
  duration = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
    durationInFrames: duration,
  });

  const adjustedProgress = direction === "out" ? 1 - progress : progress;

  switch (type) {
    case "wipe":
      return (
        <AbsoluteFill
          style={{
            backgroundColor: "#E2001A",
            transform: `translateX(${interpolate(adjustedProgress, [0, 1], [-100, 100])}%)`,
          }}
        />
      );

    case "fade":
      return (
        <AbsoluteFill
          style={{
            backgroundColor: "#000000",
            opacity: interpolate(adjustedProgress, [0, 0.5, 1], [1, 0, 0]),
          }}
        />
      );

    case "zoom":
      return (
        <AbsoluteFill
          style={{
            backgroundColor: "#E2001A",
            borderRadius: "50%",
            transform: `scale(${interpolate(adjustedProgress, [0, 1], [0, 3])})`,
          }}
        />
      );

    case "slide":
      return (
        <AbsoluteFill
          style={{
            backgroundColor: "#0A0A0A",
            transform: `translateY(${interpolate(adjustedProgress, [0, 1], [100, -100])}%)`,
          }}
        />
      );

    default:
      return null;
  }
};
