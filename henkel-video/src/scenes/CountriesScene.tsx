import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { ProgressBar } from "../components/ProgressBar";

const countries = [
  { name: "Saudi Arabia", population: "35.3M", percentage: 54, flag: "🇸🇦" },
  { name: "UAE", population: "10.5M", percentage: 22, flag: "🇦🇪" },
  { name: "Kuwait", population: "4.9M", percentage: 13, flag: "🇰🇼" },
  { name: "Oman", population: "5.0M", percentage: 6, flag: "🇴🇲" },
  { name: "Bahrain", population: "1.6M", percentage: 3, flag: "🇧🇭" },
  { name: "Qatar", population: "2.7M", percentage: 2, flag: "🇶🇦" },
];

export const CountriesScene: React.FC = () => {
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
          flexDirection: "row",
          padding: 80,
          gap: 80,
        }}
      >
        {/* Left side - Title */}
        <div
          style={{
            flex: "0 0 400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: "'Montserrat', sans-serif",
              lineHeight: 1.1,
              opacity: titleReveal,
              transform: `translateX(${interpolate(titleReveal, [0, 1], [-30, 0])}px)`,
            }}
          >
            6 Countries.
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#E2001A",
              fontFamily: "'Montserrat', sans-serif",
              lineHeight: 1.1,
              opacity: spring({
                frame: Math.max(0, frame - 15),
                fps,
                config: { damping: 15, stiffness: 100 },
              }),
              transform: `translateX(${interpolate(
                spring({
                  frame: Math.max(0, frame - 15),
                  fps,
                  config: { damping: 15, stiffness: 100 },
                }),
                [0, 1],
                [-30, 0]
              )}px)`,
            }}
          >
            1 Market.
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Montserrat', sans-serif",
              marginTop: 20,
              opacity: spring({
                frame: Math.max(0, frame - 30),
                fps,
                config: { damping: 15, stiffness: 100 },
              }),
            }}
          >
            GCC Business Distribution
          </div>
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
            <div
              key={country.name}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  marginRight: 16,
                  opacity: spring({
                    frame: Math.max(0, frame - 20 - index * 8),
                    fps,
                    config: { damping: 12, stiffness: 100 },
                  }),
                }}
              >
                {country.flag}
              </span>
              <div style={{ flex: 1 }}>
                <ProgressBar
                  percentage={country.percentage}
                  label={country.name}
                  sublabel={country.population}
                  delay={25 + index * 10}
                  color="#E2001A"
                  height={10}
                />
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
