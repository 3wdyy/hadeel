import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate, Sequence } from "remotion";
import { Background } from "../components/Background";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

// Simplified GCC Map SVG component
const GCCMap: React.FC<{
  highlightedCountry?: string;
  showAll?: boolean;
  delay?: number;
}> = ({ highlightedCountry, showAll = false, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const countries = [
    { id: "KSA", name: "Saudi Arabia", x: 200, y: 180, width: 250, height: 200 },
    { id: "UAE", name: "UAE", x: 380, y: 220, width: 80, height: 50 },
    { id: "KWT", name: "Kuwait", x: 290, y: 100, width: 40, height: 40 },
    { id: "OMN", name: "Oman", x: 400, y: 280, width: 100, height: 120 },
    { id: "BHR", name: "Bahrain", x: 340, y: 150, width: 20, height: 25 },
    { id: "QAT", name: "Qatar", x: 360, y: 170, width: 25, height: 40 },
  ];

  return (
    <svg
      viewBox="0 0 600 450"
      style={{
        width: "100%",
        maxWidth: 800,
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
      }}
    >
      {/* Background water */}
      <rect x="0" y="0" width="600" height="450" fill={COLORS.darkBgAlt} rx="20" />

      {/* Arabian Gulf */}
      <path
        d="M 320 90 Q 380 120 400 200 Q 420 280 380 350 L 300 350 Q 320 280 310 200 Q 300 120 320 90"
        fill="#1a3a5c"
        opacity={0.6}
      />

      {/* Countries */}
      {countries.map((country) => {
        const isHighlighted = highlightedCountry === country.id || showAll;
        const countryProgress = isHighlighted ? spring({
          frame: adjustedFrame,
          fps,
          config: SPRING_CONFIGS.bouncy,
        }) : 0.3;

        return (
          <g key={country.id}>
            <rect
              x={country.x}
              y={country.y}
              width={country.width}
              height={country.height}
              rx={10}
              fill={isHighlighted ? COLORS.henkelRed : COLORS.whiteAlpha20}
              opacity={countryProgress}
              style={{
                filter: isHighlighted ? `drop-shadow(0 0 20px ${COLORS.henkelRed})` : "none",
              }}
            />
            {isHighlighted && (
              <text
                x={country.x + country.width / 2}
                y={country.y + country.height / 2 + 5}
                textAnchor="middle"
                fill={COLORS.white}
                fontSize={country.width > 50 ? 16 : 10}
                fontFamily={FONTS.heading}
                fontWeight="700"
              >
                {country.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// Animated stat counter
const StatCounter: React.FC<{
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  delay: number;
  size?: "large" | "medium";
}> = ({ value, suffix = "", prefix = "", label, delay, size = "large" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.smooth,
    durationInFrames: 45,
  });

  const displayValue = Math.round(interpolate(progress, [0, 1], [0, value]));
  const fontSize = size === "large" ? 120 : 72;

  return (
    <div
      style={{
        textAlign: "center",
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px) scale(${interpolate(progress, [0, 0.8, 1], [0.9, 1.02, 1])})`,
      }}
    >
      <div
        style={{
          fontSize,
          fontWeight: 900,
          color: COLORS.white,
          fontFamily: FONTS.heading,
          textShadow: `0 0 40px ${COLORS.henkelRed}60`,
          lineHeight: 1,
        }}
      >
        {prefix}{displayValue}{suffix}
      </div>
      <div
        style={{
          fontSize: size === "large" ? 28 : 20,
          fontWeight: 500,
          color: COLORS.henkelRed,
          fontFamily: FONTS.accent,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          marginTop: 15,
        }}
      >
        {label}
      </div>
    </div>
  );
};

// Country highlight card
const CountryCard: React.FC<{
  name: string;
  flag: string;
  population: string;
  business: string;
  delay: number;
}> = ({ name, flag, population, business, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "30px 50px",
        background: `linear-gradient(135deg, ${COLORS.darkBgAlt} 0%, ${COLORS.darkBg} 100%)`,
        borderRadius: 20,
        border: `1px solid ${COLORS.whiteAlpha10}`,
        opacity: progress,
        transform: `translateX(${interpolate(progress, [0, 1], [-50, 0])}px)`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${COLORS.henkelRed}20`,
      }}
    >
      <div style={{ fontSize: 80 }}>{flag}</div>
      <div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONTS.heading,
            marginBottom: 8,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 24,
            color: COLORS.whiteAlpha60,
            fontFamily: FONTS.body,
          }}
        >
          {population} • <span style={{ color: COLORS.henkelRed, fontWeight: 600 }}>{business}</span>
        </div>
      </div>
    </div>
  );
};

// Consumer breakdown bar
const ConsumerBar: React.FC<{
  segments: { label: string; percentage: number; color: string }[];
  delay: number;
}> = ({ segments, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 20, stiffness: 60, mass: 1 },
    durationInFrames: 60,
  });

  return (
    <div style={{ width: "100%", maxWidth: 900 }}>
      {/* Bar */}
      <div
        style={{
          height: 50,
          borderRadius: 25,
          overflow: "hidden",
          display: "flex",
          background: COLORS.darkBgAlt,
        }}
      >
        {segments.map((segment, index) => (
          <div
            key={index}
            style={{
              width: `${segment.percentage * progress}%`,
              height: "100%",
              background: segment.color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {segment.percentage > 10 && (
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: COLORS.white,
                  fontFamily: FONTS.accent,
                  opacity: progress > 0.8 ? 1 : 0,
                }}
              >
                {segment.percentage}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 20,
          flexWrap: "wrap",
          gap: 15,
        }}
      >
        {segments.map((segment, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: progress,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: segment.color,
              }}
            />
            <span
              style={{
                fontSize: 18,
                color: COLORS.whiteAlpha80,
                fontFamily: FONTS.body,
              }}
            >
              {segment.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick fact card
const QuickFact: React.FC<{
  icon: string;
  text: string;
  delay: number;
}> = ({ icon, text, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 25,
        padding: "25px 40px",
        background: COLORS.darkBgAlt,
        borderRadius: 15,
        border: `1px solid ${COLORS.whiteAlpha10}`,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
      }}
    >
      <div style={{ fontSize: 50 }}>{icon}</div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 600,
          color: COLORS.white,
          fontFamily: FONTS.heading,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const GCCRegionIntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // This scene runs for 110 seconds (3300 frames)
  // Sub-scene timing (relative to scene start):
  // 0-150: Welcome to GCC + map zoom (5 sec)
  // 150-270: 44 Years of Growth (4 sec)
  // 270-390: 60 Million Population (4 sec)
  // 390-540: KSA highlight (5 sec)
  // 540-690: UAE highlight (5 sec)
  // 690-810: Kuwait highlight (4 sec)
  // 810-930: Oman highlight (4 sec)
  // 930-1050: Bahrain highlight (4 sec)
  // 1050-1170: Qatar highlight (4 sec)
  // 1170-1260: 24 Million Consumers (3 sec)
  // 1260-1500: Consumer breakdown (8 sec)
  // 1500-1620: 88% expats fact (4 sec)
  // 1620-1740: Social media fact (4 sec)
  // 1740-1890: Closing statement (5 sec)

  const currentPhase =
    frame < 150 ? "welcome" :
    frame < 270 ? "years" :
    frame < 390 ? "population" :
    frame < 540 ? "KSA" :
    frame < 690 ? "UAE" :
    frame < 810 ? "KWT" :
    frame < 930 ? "OMN" :
    frame < 1050 ? "BHR" :
    frame < 1170 ? "QAT" :
    frame < 1260 ? "consumers" :
    frame < 1500 ? "breakdown" :
    frame < 1620 ? "expats" :
    frame < 1740 ? "social" :
    "closing";

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  return (
    <AbsoluteFill>
      <Background variant="gradient" intensity={1.0} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        {/* Welcome phase */}
        {currentPhase === "welcome" && (
          <>
            <div
              style={{
                fontSize: 36,
                fontWeight: 400,
                color: COLORS.whiteAlpha60,
                fontFamily: FONTS.heading,
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                marginBottom: 30,
                opacity: titleProgress,
              }}
            >
              Welcome to the
            </div>
            <div
              style={{
                fontSize: 90,
                fontWeight: 900,
                color: COLORS.white,
                fontFamily: FONTS.heading,
                marginBottom: 60,
                opacity: titleProgress,
                textShadow: `0 0 40px ${COLORS.henkelRed}40`,
              }}
            >
              GCC
            </div>
            <GCCMap showAll delay={30} />
          </>
        )}

        {/* 44 Years */}
        {currentPhase === "years" && (
          <div style={{ textAlign: "center" }}>
            <StatCounter value={44} label="Years of Growth" delay={150} />
            <div
              style={{
                marginTop: 30,
                fontSize: 24,
                color: COLORS.whiteAlpha40,
                fontFamily: FONTS.body,
                fontStyle: "italic",
              }}
            >
              🎉 Celebrating excellence in the region
            </div>
          </div>
        )}

        {/* 60 Million Population */}
        {currentPhase === "population" && (
          <StatCounter value={60} suffix="M" prefix="~" label="Population" delay={270} />
        )}

        {/* Country highlights */}
        {currentPhase === "KSA" && (
          <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
            <GCCMap highlightedCountry="KSA" delay={390} />
            <CountryCard
              name="Saudi Arabia"
              flag="🇸🇦"
              population="35.3M people"
              business="54% of business"
              delay={420}
            />
          </div>
        )}

        {currentPhase === "UAE" && (
          <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
            <GCCMap highlightedCountry="UAE" delay={540} />
            <CountryCard
              name="UAE"
              flag="🇦🇪"
              population="10.5M people"
              business="22% of business"
              delay={570}
            />
          </div>
        )}

        {currentPhase === "KWT" && (
          <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
            <GCCMap highlightedCountry="KWT" delay={690} />
            <CountryCard
              name="Kuwait"
              flag="🇰🇼"
              population="4.9M people"
              business="13% of business"
              delay={720}
            />
          </div>
        )}

        {currentPhase === "OMN" && (
          <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
            <GCCMap highlightedCountry="OMN" delay={810} />
            <CountryCard
              name="Oman"
              flag="🇴🇲"
              population="5.0M people"
              business="6% of business"
              delay={840}
            />
          </div>
        )}

        {currentPhase === "BHR" && (
          <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
            <GCCMap highlightedCountry="BHR" delay={930} />
            <CountryCard
              name="Bahrain"
              flag="🇧🇭"
              population="1.6M people"
              business="3% of business"
              delay={960}
            />
          </div>
        )}

        {currentPhase === "QAT" && (
          <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
            <GCCMap highlightedCountry="QAT" delay={1050} />
            <CountryCard
              name="Qatar"
              flag="🇶🇦"
              population="2.7M people"
              business="2% of business"
              delay={1080}
            />
          </div>
        )}

        {/* 24 Million Consumers */}
        {currentPhase === "consumers" && (
          <StatCounter value={24} suffix="M" label="Consumers" delay={1170} size="large" />
        )}

        {/* Consumer breakdown */}
        {currentPhase === "breakdown" && (
          <div style={{ width: "100%", maxWidth: 1000, textAlign: "center" }}>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: FONTS.heading,
                marginBottom: 50,
              }}
            >
              Consumer Demographics
            </div>
            <ConsumerBar
              segments={[
                { label: "Locals (55%)", percentage: 55, color: COLORS.henkelRed },
                { label: "Expat Arabs (22%)", percentage: 22, color: "#C09553" },
                { label: "Expat Asians (20%)", percentage: 20, color: "#4A90D9" },
                { label: "Expat West (3%)", percentage: 3, color: "#50C878" },
              ]}
              delay={1260}
            />
          </div>
        )}

        {/* Quick facts */}
        {currentPhase === "expats" && (
          <QuickFact
            icon="🌍"
            text="88% expats in UAE & Qatar"
            delay={1500}
          />
        )}

        {currentPhase === "social" && (
          <QuickFact
            icon="📱"
            text="Top 10 globally for social media use"
            delay={1620}
          />
        )}

        {/* Closing statement */}
        {currentPhase === "closing" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                gap: 30,
                justifyContent: "center",
                marginBottom: 30,
              }}
            >
              {["🇸🇦", "🇦🇪", "🇰🇼", "🇴🇲", "🇧🇭", "🇶🇦"].map((flag, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: 60,
                    opacity: spring({
                      frame: Math.max(0, frame - 1740 - index * 5),
                      fps,
                      config: SPRING_CONFIGS.bouncy,
                    }),
                  }}
                >
                  {flag}
                </div>
              ))}
            </div>

            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: COLORS.white,
                fontFamily: FONTS.heading,
                opacity: spring({
                  frame: Math.max(0, frame - 1780),
                  fps,
                  config: SPRING_CONFIGS.smooth,
                }),
              }}
            >
              6 Countries. <span style={{ color: COLORS.henkelRed }}>1 Market.</span>
            </div>

            <div
              style={{
                fontSize: 36,
                fontWeight: 400,
                color: COLORS.whiteAlpha60,
                fontFamily: FONTS.heading,
                marginTop: 20,
                fontStyle: "italic",
                opacity: spring({
                  frame: Math.max(0, frame - 1820),
                  fps,
                  config: SPRING_CONFIGS.smooth,
                }),
              }}
            >
              Endless Opportunity.
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
