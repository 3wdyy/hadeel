import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { SplitText } from "../components/SplitText";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

const countries = [
  { name: "Saudi Arabia", population: "35.3M", percentage: 54, flag: "🇸🇦" },
  { name: "UAE", population: "10.5M", percentage: 22, flag: "🇦🇪" },
  { name: "Kuwait", population: "4.9M", percentage: 13, flag: "🇰🇼" },
  { name: "Oman", population: "5.0M", percentage: 6, flag: "🇴🇲" },
  { name: "Bahrain", population: "1.6M", percentage: 3, flag: "🇧🇭" },
  { name: "Qatar", population: "2.7M", percentage: 2, flag: "🇶🇦" },
];

// Enhanced progress bar with glow effect
const GlowingProgressBar: React.FC<{
  percentage: number;
  label: string;
  sublabel: string;
  flag: string;
  delay: number;
  index: number;
}> = ({ percentage, label, sublabel, flag, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.smooth,
    durationInFrames: 45,
  });

  const barProgress = spring({
    frame: Math.max(0, adjustedFrame - 10),
    fps,
    config: { damping: 20, stiffness: 80, mass: 0.8 },
    durationInFrames: 60,
  });

  // Bar width animation
  const barWidth = interpolate(barProgress, [0, 1], [0, percentage]);

  // Glow intensity based on bar size
  const glowIntensity = (percentage / 100) * 0.8;

  // Shimmer effect
  const shimmerPosition = ((frame + index * 20) % 120) - 20;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: 20,
        opacity: progress,
        transform: `translateX(${interpolate(progress, [0, 1], [50, 0])}px)`,
      }}
    >
      {/* Flag */}
      <div
        style={{
          fontSize: 42,
          marginRight: 20,
          transform: `scale(${interpolate(progress, [0, 0.5, 1], [0.5, 1.1, 1])})`,
          filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
        }}
      >
        {flag}
      </div>

      {/* Bar container */}
      <div style={{ flex: 1 }}>
        {/* Label row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: COLORS.white,
              fontFamily: FONTS.heading,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: COLORS.whiteAlpha60,
              fontFamily: FONTS.body,
            }}
          >
            {sublabel}
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: "relative",
            height: 12,
            background: COLORS.whiteAlpha10,
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          {/* Filled portion */}
          <div
            style={{
              position: "absolute",
              height: "100%",
              width: `${barWidth}%`,
              background: `linear-gradient(90deg, ${COLORS.henkelRed}, ${COLORS.henkelRedLight})`,
              borderRadius: 6,
              boxShadow: `0 0 ${15 * glowIntensity}px ${COLORS.henkelRed}`,
            }}
          />

          {/* Shimmer effect */}
          <div
            style={{
              position: "absolute",
              height: "100%",
              width: "30%",
              left: `${shimmerPosition}%`,
              background: `linear-gradient(90deg, transparent, ${COLORS.white}20, transparent)`,
              opacity: barProgress > 0.5 ? 0.6 : 0,
            }}
          />
        </div>

        {/* Percentage label */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            fontSize: 14,
            fontWeight: 700,
            color: COLORS.henkelRed,
            fontFamily: FONTS.accent,
            opacity: barProgress,
          }}
        >
          {Math.round(barWidth)}%
        </div>
      </div>
    </div>
  );
};

export const CountriesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const marketProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Glow for "1 Market"
  const marketGlow = 0.5 + Math.sin(frame * 0.1) * 0.3;

  return (
    <AbsoluteFill>
      <Background variant="stats" intensity={1.1} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 70,
          gap: 80,
        }}
      >
        {/* Left side - Title */}
        <div
          style={{
            flex: "0 0 380px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: FONTS.heading,
              lineHeight: 1.1,
              opacity: titleProgress,
              transform: `translateX(${interpolate(titleProgress, [0, 1], [-40, 0])}px)`,
              textShadow: `0 4px 30px rgba(0,0,0,0.5)`,
            }}
          >
            6 Countries.
          </div>

          <div
            style={{
              position: "relative",
            }}
          >
            {/* Glow behind text */}
            <div
              style={{
                position: "absolute",
                inset: -20,
                background: `radial-gradient(ellipse at left, ${COLORS.henkelRed}30 0%, transparent 70%)`,
                opacity: marketProgress,
                filter: "blur(20px)",
              }}
            />

            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                color: COLORS.henkelRed,
                fontFamily: FONTS.heading,
                lineHeight: 1.1,
                opacity: marketProgress,
                transform: `translateX(${interpolate(marketProgress, [0, 1], [-40, 0])}px)`,
                textShadow: `
                  0 0 ${20 * marketGlow}px ${COLORS.henkelRed},
                  0 0 ${40 * marketGlow}px ${COLORS.henkelRed}60,
                  0 4px 30px rgba(0,0,0,0.5)
                `,
                position: "relative",
              }}
            >
              1 Market.
            </div>
          </div>

          {/* Subtitle */}
          <div
            style={{
              marginTop: 30,
            }}
          >
            <SplitText
              text="GCC Business Distribution"
              delay={30}
              staggerDelay={2}
              fontSize={22}
              fontWeight={400}
              color={COLORS.whiteAlpha60}
              animation="fadeUp"
            />
          </div>

          {/* Decorative line */}
          <div
            style={{
              marginTop: 20,
              height: 2,
              width: `${interpolate(titleProgress, [0, 1], [0, 100])}%`,
              maxWidth: 200,
              background: `linear-gradient(90deg, ${COLORS.henkelRed}, transparent)`,
            }}
          />
        </div>

        {/* Right side - Progress bars */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {countries.map((country, index) => (
            <GlowingProgressBar
              key={country.name}
              percentage={country.percentage}
              label={country.name}
              sublabel={country.population}
              flag={country.flag}
              delay={20 + index * 12}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
