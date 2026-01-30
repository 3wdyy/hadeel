import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { FlagRow } from "../components/AnimatedFlag";

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flags = ["🇷🇺", "🇪🇬", "🇫🇷", "🇱🇰", "🇩🇪"];

  const statsReveal = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const messageReveal = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const missionReveal = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 10, stiffness: 60 },
  });

  const finalReveal = spring({
    frame: Math.max(0, frame - 160),
    fps,
    config: { damping: 8, stiffness: 50, mass: 1 },
  });

  // Pulsing glow for final logo
  const glowIntensity = interpolate(
    Math.sin((frame - 160) * 0.08),
    [-1, 1],
    [0.3, 0.7]
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
          padding: 80,
        }}
      >
        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 120,
            marginBottom: 50,
            opacity: statsReveal,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <AnimatedCounter value={5} delay={0} fontSize={100} />
            <div
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'Montserrat', sans-serif",
                marginTop: 5,
              }}
            >
              COUNTRIES
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <AnimatedCounter value={6} delay={15} fontSize={100} />
            <div
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'Montserrat', sans-serif",
                marginTop: 5,
              }}
            >
              PEOPLE
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <AnimatedCounter value={1} delay={30} fontSize={100} />
            <div
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "rgba(255,255,255,0.6)",
                fontFamily: "'Montserrat', sans-serif",
                marginTop: 5,
              }}
            >
              GCC TEAM
            </div>
          </div>
        </div>

        {/* Flags */}
        <div style={{ marginBottom: 50 }}>
          <FlagRow flags={flags} staggerDelay={8} startDelay={50} size={60} />
        </div>

        {/* "Different roots. One mission." */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 600,
              color: "#FFFFFF",
              fontFamily: "'Montserrat', sans-serif",
              opacity: messageReveal,
              transform: `translateY(${interpolate(messageReveal, [0, 1], [30, 0])}px)`,
            }}
          >
            Different roots.
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#E2001A",
              fontFamily: "'Montserrat', sans-serif",
              opacity: missionReveal,
              transform: `translateY(${interpolate(missionReveal, [0, 1], [30, 0])}px)`,
            }}
          >
            One mission.
          </div>
        </div>

        {/* ELEVATE MENAT */}
        <div
          style={{
            position: "relative",
            opacity: finalReveal,
            transform: `scale(${interpolate(finalReveal, [0, 1], [0.8, 1])})`,
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              inset: -60,
              background: `radial-gradient(ellipse, rgba(226,0,26,${glowIntensity}) 0%, transparent 70%)`,
              filter: "blur(50px)",
            }}
          />

          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Montserrat', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.5em",
              marginBottom: 10,
              position: "relative",
            }}
          >
            Elevate
          </div>
          <div
            style={{
              fontSize: 90,
              fontWeight: 900,
              color: "#FFFFFF",
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: "0.1em",
              textShadow: "0 0 60px rgba(226,0,26,0.6)",
              position: "relative",
            }}
          >
            MENAT
          </div>
        </div>

        {/* Henkel GCC */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            fontSize: 24,
            fontWeight: 600,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.3em",
            opacity: finalReveal,
          }}
        >
          HENKEL GCC
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
