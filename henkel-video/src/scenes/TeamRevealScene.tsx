import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { SplitText } from "../components/SplitText";
import { Flash } from "../components/Effects";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

const teamMembers = [
  { name: "IRINA", title: "General Manager", country: "Russia", flag: "🇷🇺", accent: "#E2001A" },
  { name: "MOHAMED", title: "Business Lead", country: "Egypt & Germany", flag: "🇪🇬", accent: "#C09553" },
  { name: "NICOLAS", title: "Operations Director", country: "France", flag: "🇫🇷", accent: "#0055A4" },
  { name: "JUDE", title: "Finance Manager", country: "Sri Lanka", flag: "🇱🇰", accent: "#8D153A" },
  { name: "HANY", title: "Marketing Lead", country: "Egypt", flag: "🇪🇬", accent: "#C09553" },
  { name: "WAEL", title: "Sales Director", country: "Egypt", flag: "🇪🇬", accent: "#C09553" },
];

// Premium team member card with holographic effect
const PremiumTeamCard: React.FC<{
  name: string;
  title: string;
  country: string;
  flag: string;
  accent: string;
  delay: number;
  index: number;
}> = ({ name, title, country, flag, accent, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  // Card entry animation
  const cardProgress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.9 },
  });

  // Content reveal (staggered inside card)
  const contentProgress = spring({
    frame: Math.max(0, adjustedFrame - 8),
    fps,
    config: SPRING_CONFIGS.snappy,
  });

  // 3D rotation on entry - cards flip in from different angles based on position
  const row = Math.floor(index / 3);
  const col = index % 3;
  const startRotateY = col === 0 ? -60 : col === 2 ? 60 : 0;
  const startRotateX = row === 0 ? -30 : 30;

  const rotateY = interpolate(cardProgress, [0, 1], [startRotateY, 0]);
  const rotateX = interpolate(cardProgress, [0, 1], [startRotateX, 0]);
  const translateZ = interpolate(cardProgress, [0, 0.5, 1], [-200, 50, 0]);
  const scale = interpolate(cardProgress, [0, 0.7, 1], [0.6, 1.05, 1]);

  // Holographic shimmer effect - sweeps across the card
  const shimmerPosition = ((frame + index * 30) % 200) - 100;
  const shimmerOpacity = cardProgress > 0.8 ? 0.15 + Math.sin((frame + index * 20) * 0.08) * 0.1 : 0;

  // Glow pulse
  const glowIntensity = cardProgress > 0.9 ? 0.4 + Math.sin((frame + index * 15) * 0.1) * 0.2 : 0;

  // Subtle float after entry
  const floatY = cardProgress > 0.95 ? Math.sin((frame + index * 25) * 0.03) * 3 : 0;

  return (
    <div
      style={{
        perspective: "1200px",
        perspectiveOrigin: "center center",
      }}
    >
      <div
        style={{
          background: `linear-gradient(145deg, ${COLORS.darkBgAlt} 0%, ${COLORS.darkBg} 50%, ${COLORS.darkBgAccent}30 100%)`,
          borderRadius: 20,
          padding: 28,
          position: "relative",
          overflow: "hidden",
          transform: `
            translateY(${interpolate(cardProgress, [0, 1], [80, 0]) + floatY}px)
            translateZ(${translateZ}px)
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
            scale(${scale})
          `,
          transformStyle: "preserve-3d",
          opacity: cardProgress,
          border: `1px solid ${COLORS.whiteAlpha10}`,
          boxShadow: `
            0 20px 60px rgba(0,0,0,0.5),
            0 0 ${40 * glowIntensity}px ${accent}${Math.floor(glowIntensity * 60).toString(16).padStart(2, '0')},
            inset 0 1px 0 ${COLORS.whiteAlpha10}
          `,
        }}
      >
        {/* Holographic shimmer overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              105deg,
              transparent 0%,
              transparent ${45 + shimmerPosition * 0.3}%,
              ${COLORS.white}${Math.floor(shimmerOpacity * 255).toString(16).padStart(2, '0')} ${50 + shimmerPosition * 0.3}%,
              transparent ${55 + shimmerPosition * 0.3}%,
              transparent 100%
            )`,
            pointerEvents: "none",
          }}
        />

        {/* Rainbow refraction effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(
              ${120 + shimmerPosition}deg,
              ${COLORS.henkelRed}08 0%,
              ${accent}08 25%,
              #00ff8808 50%,
              #0088ff08 75%,
              ${COLORS.henkelRed}08 100%
            )`,
            opacity: shimmerOpacity * 3,
            pointerEvents: "none",
          }}
        />

        {/* Accent line on left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "20%",
            bottom: "20%",
            width: 4,
            background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
            opacity: contentProgress,
            boxShadow: `0 0 15px ${accent}`,
          }}
        />

        {/* Flag - large and floating */}
        <div
          style={{
            fontSize: 64,
            marginBottom: 15,
            opacity: contentProgress,
            transform: `
              translateY(${interpolate(contentProgress, [0, 1], [20, 0])}px)
              scale(${interpolate(contentProgress, [0, 0.5, 1], [0.5, 1.1, 1])})
            `,
            filter: `drop-shadow(0 4px 10px rgba(0,0,0,0.4))`,
            textAlign: "center",
          }}
        >
          {flag}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: COLORS.white,
            fontFamily: FONTS.heading,
            letterSpacing: "0.05em",
            marginBottom: 8,
            opacity: contentProgress,
            transform: `translateX(${interpolate(contentProgress, [0, 1], [-20, 0])}px)`,
            textShadow: `0 0 20px ${accent}40`,
            textAlign: "center",
          }}
        >
          {name}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: accent,
            fontFamily: FONTS.accent,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 12,
            opacity: contentProgress,
            transform: `translateX(${interpolate(contentProgress, [0, 1], [20, 0])}px)`,
            textAlign: "center",
          }}
        >
          {title}
        </div>

        {/* Country with subtle divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: contentProgress * 0.7,
          }}
        >
          <div
            style={{
              width: 20,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${COLORS.whiteAlpha40})`,
            }}
          />
          <div
            style={{
              fontSize: 13,
              color: COLORS.whiteAlpha60,
              fontFamily: FONTS.body,
              fontStyle: "italic",
            }}
          >
            {country}
          </div>
          <div
            style={{
              width: 20,
              height: 1,
              background: `linear-gradient(90deg, ${COLORS.whiteAlpha40}, transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const TeamRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animations
  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const subtitleProgress = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // "THE TEAM" glow effect
  const teamGlow = 0.5 + Math.sin(frame * 0.1) * 0.3;

  return (
    <AbsoluteFill>
      <Background variant="warm" intensity={1.2} />

      {/* Flash on title reveal */}
      <Flash trigger={15} color={COLORS.henkelRed} duration={6} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 50,
        }}
      >
        {/* Title Section */}
        <div style={{ textAlign: "center", marginBottom: 35 }}>
          {/* Subtle pre-title */}
          <div
            style={{
              marginBottom: 8,
            }}
          >
            <SplitText
              text="We come from everywhere else"
              delay={0}
              staggerDelay={1}
              fontSize={24}
              fontWeight={400}
              color={COLORS.whiteAlpha60}
              animation="fadeUp"
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.35em",
              }}
            />
          </div>

          {/* Main title with animated "THE TEAM" */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 20,
              opacity: subtitleProgress,
              transform: `translateY(${interpolate(subtitleProgress, [0, 1], [30, 0])}px)`,
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 600,
                color: COLORS.white,
                fontFamily: FONTS.heading,
              }}
            >
              Meet
            </span>
            <span
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: COLORS.henkelRed,
                fontFamily: FONTS.heading,
                letterSpacing: "0.05em",
                textShadow: `
                  0 0 ${30 * teamGlow}px ${COLORS.henkelRed},
                  0 0 ${60 * teamGlow}px ${COLORS.henkelRed}60,
                  0 4px 20px rgba(0,0,0,0.5)
                `,
              }}
            >
              THE TEAM
            </span>
          </div>

          {/* Animated underline */}
          <div
            style={{
              margin: "15px auto 0",
              height: 3,
              background: `linear-gradient(90deg, transparent, ${COLORS.henkelRed}, transparent)`,
              width: `${interpolate(subtitleProgress, [0, 1], [0, 400])}px`,
              boxShadow: `0 0 15px ${COLORS.henkelRed}`,
            }}
          />
        </div>

        {/* Team Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 25,
            flex: 1,
            alignContent: "center",
            padding: "0 30px",
          }}
        >
          {teamMembers.map((member, index) => (
            <PremiumTeamCard
              key={member.name}
              name={member.name}
              title={member.title}
              country={member.country}
              flag={member.flag}
              accent={member.accent}
              delay={35 + index * 12}
              index={index}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
