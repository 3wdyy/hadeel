import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

// Circular progress ring with animated counter
const StatRing: React.FC<{
  value: number;
  suffix?: string;
  label: string;
  sublabel: string;
  delay: number;
  ringColor?: string;
}> = ({ value, suffix = "", label, sublabel, delay, ringColor = COLORS.henkelRed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.smooth,
    durationInFrames: 50,
  });

  // Counter animation
  const displayValue = Math.round(interpolate(progress, [0, 1], [0, value]));

  // Ring animation
  const ringProgress = interpolate(progress, [0, 1], [0, 0.75]); // 75% of circle
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDashoffset = circumference * (1 - ringProgress);

  // Scale and opacity
  const scale = interpolate(progress, [0, 0.5, 1], [0.8, 1.05, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });

  // Glow pulse
  const glowPulse = progress > 0.8 ? 0.5 + Math.sin((frame - delay) * 0.1) * 0.3 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* SVG Ring */}
      <div style={{ position: "relative", width: 220, height: 220, marginBottom: 20 }}>
        {/* Background ring */}
        <svg
          width="220"
          height="220"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke={COLORS.whiteAlpha10}
            strokeWidth="8"
          />
        </svg>

        {/* Animated ring */}
        <svg
          width="220"
          height="220"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "rotate(-90deg)",
            filter: `drop-shadow(0 0 ${10 + glowPulse * 20}px ${ringColor})`,
          }}
        >
          <circle
            cx="110"
            cy="110"
            r="90"
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 0.1s ease-out",
            }}
          />
        </svg>

        {/* Center content */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: FONTS.heading,
              lineHeight: 1,
              textShadow: `0 0 30px ${ringColor}60`,
            }}
          >
            {displayValue}
            <span style={{ fontSize: 48, fontWeight: 700 }}>{suffix}</span>
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: ringColor,
          fontFamily: FONTS.heading,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          textShadow: `0 0 20px ${ringColor}60`,
        }}
      >
        {label}
      </div>

      {/* Sublabel */}
      <div
        style={{
          fontSize: 16,
          fontWeight: 400,
          color: COLORS.whiteAlpha40,
          fontFamily: FONTS.body,
          marginTop: 5,
        }}
      >
        {sublabel}
      </div>
    </div>
  );
};

export const StatsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  return (
    <AbsoluteFill>
      <Background variant="stats" intensity={0.8} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
        }}
      >
        {/* Title with animated line */}
        <div
          style={{
            marginBottom: 80,
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: COLORS.whiteAlpha40,
              fontFamily: FONTS.heading,
              textTransform: "uppercase",
              letterSpacing: "0.5em",
              opacity: titleProgress,
              transform: `translateY(${interpolate(titleProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            The GCC Region
          </div>

          {/* Animated underline */}
          <div
            style={{
              position: "absolute",
              bottom: -15,
              left: "50%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${COLORS.henkelRed}60, transparent)`,
              width: `${interpolate(titleProgress, [0, 1], [0, 120])}%`,
              maxWidth: 400,
              transform: "translateX(-50%)",
            }}
          />
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: 100,
          }}
        >
          <StatRing
            value={44}
            label="Years"
            sublabel="in the region"
            delay={15}
          />

          <StatRing
            value={60}
            suffix="M"
            label="People"
            sublabel="total population"
            delay={30}
          />

          <StatRing
            value={6}
            label="Countries"
            sublabel="one market"
            delay={45}
          />
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            marginTop: 80,
            opacity: spring({
              frame: Math.max(0, frame - 70),
              fps,
              config: SPRING_CONFIGS.smooth,
            }),
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 300,
              color: COLORS.whiteAlpha40,
              fontFamily: FONTS.body,
              fontStyle: "italic",
            }}
          >
            Endless Opportunity
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
