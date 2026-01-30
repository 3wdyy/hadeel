import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";

export const LogoRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 80, mass: 1 },
  });

  const gccReveal = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const subtitleReveal = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // Pulsing glow effect
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.6]
  );

  return (
    <AbsoluteFill>
      <Background variant="henkel" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Henkel Logo Text */}
        <div
          style={{
            position: "relative",
            transform: `scale(${interpolate(logoScale, [0, 1], [0.5, 1])})`,
            opacity: logoScale,
          }}
        >
          {/* Glow effect */}
          <div
            style={{
              position: "absolute",
              inset: -40,
              background: `radial-gradient(ellipse, rgba(226,0,26,${glowIntensity}) 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />

          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: "#FFFFFF",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "-0.02em",
              textShadow: "0 0 60px rgba(226,0,26,0.5)",
              position: "relative",
            }}
          >
            HENKEL
          </div>
        </div>

        {/* GCC */}
        <div
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: "#E2001A",
            fontFamily: "'Montserrat', sans-serif",
            marginTop: 20,
            opacity: gccReveal,
            transform: `translateY(${interpolate(gccReveal, [0, 1], [40, 0])}px)`,
            letterSpacing: "0.3em",
          }}
        >
          GCC
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "'Montserrat', sans-serif",
            marginTop: 30,
            opacity: subtitleReveal,
            transform: `translateY(${interpolate(subtitleReveal, [0, 1], [20, 0])}px)`,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Welcome to the Team
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
