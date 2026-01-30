import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { FlagRow } from "../components/AnimatedFlag";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const questionProgress = spring({
    frame: Math.max(0, frame - 45),
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const complicatedProgress = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  const flags = ["🇷🇺", "🇪🇬", "🇫🇷", "🇱🇰", "🇩🇪"];

  return (
    <AbsoluteFill>
      <Background variant="gradient" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
        }}
      >
        {/* Opening Question */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Montserrat', sans-serif",
            marginBottom: 20,
            opacity: textProgress,
            transform: `translateY(${interpolate(textProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          When people ask
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#FFFFFF",
            fontFamily: "'Montserrat', sans-serif",
            marginBottom: 60,
            opacity: questionProgress,
            transform: `translateY(${interpolate(questionProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          where we're from...
        </div>

        {/* Flags */}
        <div style={{ marginBottom: 60 }}>
          <FlagRow flags={flags} staggerDelay={10} startDelay={60} size={90} />
        </div>

        {/* "It's complicated" */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            color: "#E2001A",
            fontFamily: "'Montserrat', sans-serif",
            fontStyle: "italic",
            opacity: complicatedProgress,
            transform: `scale(${interpolate(complicatedProgress, [0, 1], [0.8, 1])})`,
          }}
        >
          ...it's complicated.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
