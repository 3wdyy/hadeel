import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { AnimatedCounter } from "../components/AnimatedCounter";

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleReveal = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      <Background variant="stats" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "'Montserrat', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            marginBottom: 60,
            opacity: titleReveal,
          }}
        >
          The GCC Region
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 80,
            width: "100%",
            maxWidth: 1400,
          }}
        >
          {/* 44 Years */}
          <div style={{ textAlign: "center" }}>
            <AnimatedCounter
              value={44}
              delay={20}
              fontSize={140}
              color="#FFFFFF"
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "#E2001A",
                fontFamily: "'Montserrat', sans-serif",
                marginTop: 10,
                opacity: spring({
                  frame: Math.max(0, frame - 50),
                  fps,
                  config: { damping: 15, stiffness: 100 },
                }),
              }}
            >
              YEARS
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Montserrat', sans-serif",
                marginTop: 5,
              }}
            >
              in the region
            </div>
          </div>

          {/* 60M People */}
          <div style={{ textAlign: "center" }}>
            <AnimatedCounter
              value={60}
              suffix="M"
              delay={35}
              fontSize={140}
              color="#FFFFFF"
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "#E2001A",
                fontFamily: "'Montserrat', sans-serif",
                marginTop: 10,
                opacity: spring({
                  frame: Math.max(0, frame - 65),
                  fps,
                  config: { damping: 15, stiffness: 100 },
                }),
              }}
            >
              PEOPLE
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Montserrat', sans-serif",
                marginTop: 5,
              }}
            >
              total population
            </div>
          </div>

          {/* 6 Countries */}
          <div style={{ textAlign: "center" }}>
            <AnimatedCounter
              value={6}
              delay={50}
              fontSize={140}
              color="#FFFFFF"
            />
            <div
              style={{
                fontSize: 28,
                fontWeight: 500,
                color: "#E2001A",
                fontFamily: "'Montserrat', sans-serif",
                marginTop: 10,
                opacity: spring({
                  frame: Math.max(0, frame - 80),
                  fps,
                  config: { damping: 15, stiffness: 100 },
                }),
              }}
            >
              COUNTRIES
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 400,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Montserrat', sans-serif",
                marginTop: 5,
              }}
            >
              one market
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
