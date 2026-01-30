import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";

export const PlotTwistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const butReveal = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const questionReveal = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const zeroReveal = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 6, stiffness: 60, mass: 1.5 },
  });

  const textReveal = spring({
    frame: Math.max(0, frame - 100),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  // Shake effect for the zero
  const shakeX = frame > 75 && frame < 90
    ? Math.sin(frame * 2) * interpolate(frame, [75, 90], [10, 0])
    : 0;

  return (
    <AbsoluteFill>
      <Background variant="dark" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
        }}
      >
        {/* "But..." */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'Montserrat', sans-serif",
            marginBottom: 30,
            opacity: butReveal,
            fontStyle: "italic",
          }}
        >
          But...
        </div>

        {/* Question */}
        <div
          style={{
            fontSize: 42,
            fontWeight: 500,
            color: "#FFFFFF",
            fontFamily: "'Montserrat', sans-serif",
            marginBottom: 60,
            textAlign: "center",
            maxWidth: 900,
            opacity: questionReveal,
            transform: `translateY(${interpolate(questionReveal, [0, 1], [20, 0])}px)`,
          }}
        >
          How many of us are actually from here?
        </div>

        {/* Giant ZERO */}
        <div
          style={{
            fontSize: 350,
            fontWeight: 900,
            color: "#E2001A",
            fontFamily: "'Montserrat', sans-serif",
            lineHeight: 0.9,
            opacity: zeroReveal,
            transform: `scale(${interpolate(zeroReveal, [0, 1], [2, 1])}) translateX(${shakeX}px)`,
            textShadow: "0 0 100px rgba(226,0,26,0.5), 0 0 200px rgba(226,0,26,0.3)",
          }}
        >
          0
        </div>

        {/* "Zero. None. Not a single one." */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'Montserrat', sans-serif",
            marginTop: 30,
            opacity: textReveal,
            transform: `translateY(${interpolate(textReveal, [0, 1], [20, 0])}px)`,
          }}
        >
          Zero. None. Not a single one.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
