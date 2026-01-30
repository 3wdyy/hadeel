import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface ProgressBarProps {
  percentage: number;
  label: string;
  sublabel?: string;
  delay?: number;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label,
  sublabel,
  delay = 0,
  color = "#E2001A",
  height = 12,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 30, stiffness: 80, mass: 1 },
    durationInFrames: 40,
  });

  const width = interpolate(progress, [0, 1], [0, percentage]);

  const fadeIn = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <div
      style={{
        opacity: fadeIn,
        transform: `translateX(${interpolate(fadeIn, [0, 1], [-30, 0])}px)`,
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 600, color: "#FFFFFF" }}>
          {label}
        </span>
        <span style={{ fontSize: 20, fontWeight: 500, color: "#FFFFFF99" }}>
          {sublabel}
        </span>
      </div>
      <div
        style={{
          height,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: height / 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            backgroundColor: color,
            borderRadius: height / 2,
            boxShadow: `0 0 20px ${color}80`,
          }}
        />
      </div>
      <div
        style={{
          textAlign: "right",
          marginTop: 4,
          fontSize: 18,
          fontWeight: 700,
          color,
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        {Math.round(width)}%
      </div>
    </div>
  );
};
