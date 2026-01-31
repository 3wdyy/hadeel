import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { Flash, LightStreak } from "../components/Effects";
import { SplitText } from "../components/SplitText";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

export interface TeamMemberData {
  name: string;
  title: string;
  country: string;
  countrySecondary?: string; // For Mohamed who has two countries
  flag: string;
  flagSecondary?: string;
  yearsAtHenkel: number;
  previousRoles: string[];
  funFacts: string[];
  hobby: string;
  hobbyIcon: string;
  landmark?: string; // e.g., "Eiffel Tower", "Pyramids"
  isEgyptAgain?: boolean; // For Wael
}

// World map with pin drop animation
const WorldMapPin: React.FC<{
  country: string;
  countrySecondary?: string;
  flag: string;
  flagSecondary?: string;
  delay: number;
  isEgyptAgain?: boolean;
}> = ({ country, countrySecondary, flag, flagSecondary, delay, isEgyptAgain }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Pin drop animation
  const pinDrop = spring({
    frame: Math.max(0, adjustedFrame - 15),
    fps,
    config: { damping: 8, stiffness: 150, mass: 0.6 },
  });

  // Second country animation (for Mohamed)
  const secondCountryProgress = countrySecondary ? spring({
    frame: Math.max(0, adjustedFrame - 60),
    fps,
    config: SPRING_CONFIGS.bouncy,
  }) : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 30,
        opacity: progress,
      }}
    >
      {/* Egypt Again message */}
      {isEgyptAgain && (
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: COLORS.henkelRed,
            fontFamily: FONTS.heading,
            marginBottom: 20,
            opacity: spring({
              frame: Math.max(0, adjustedFrame - 10),
              fps,
              config: SPRING_CONFIGS.bouncy,
            }),
          }}
        >
          Another one from Egypt! 😄
        </div>
      )}

      {/* World map simplified representation */}
      <div
        style={{
          position: "relative",
          width: 500,
          height: 300,
          background: `linear-gradient(180deg, ${COLORS.darkBgAlt} 0%, ${COLORS.darkBg} 100%)`,
          borderRadius: 20,
          border: `1px solid ${COLORS.whiteAlpha10}`,
          overflow: "hidden",
          transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
        }}
      >
        {/* Grid lines for map effect */}
        <svg
          viewBox="0 0 500 300"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 30}
              x2="500"
              y2={i * 30}
              stroke={COLORS.white}
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 35}
              y1="0"
              x2={i * 35}
              y2="300"
              stroke={COLORS.white}
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Primary country pin */}
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: `translate(-50%, -50%) translateY(${interpolate(pinDrop, [0, 0.5, 1], [-100, 10, 0])}px)`,
            opacity: pinDrop,
          }}
        >
          <div style={{ fontSize: 80, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.4))" }}>
            {flag}
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: 20,
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: FONTS.heading,
              whiteSpace: "nowrap",
              textShadow: "0 2px 10px rgba(0,0,0,0.8)",
            }}
          >
            {country}
          </div>
        </div>

        {/* Secondary country pin (for Mohamed) */}
        {countrySecondary && flagSecondary && (
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "70%",
              transform: `translate(-50%, -50%) translateY(${interpolate(secondCountryProgress, [0, 0.5, 1], [-100, 10, 0])}px)`,
              opacity: secondCountryProgress,
            }}
          >
            <div style={{ fontSize: 60, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.4))" }}>
              {flagSecondary}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -35,
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: FONTS.heading,
                whiteSpace: "nowrap",
                textShadow: "0 2px 10px rgba(0,0,0,0.8)",
              }}
            >
              {countrySecondary}
            </div>
          </div>
        )}

        {/* Connection line for dual countries */}
        {countrySecondary && (
          <svg
            viewBox="0 0 500 300"
            style={{
              position: "absolute",
              inset: 0,
              opacity: secondCountryProgress * 0.6,
            }}
          >
            <line
              x1="250"
              y1="120"
              x2="350"
              y2="120"
              stroke={COLORS.henkelRed}
              strokeWidth="3"
              strokeDasharray="10,5"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

// Profile card component
const ProfileCard: React.FC<{
  name: string;
  title: string;
  flag: string;
  delay: number;
}> = ({ name, title, flag, delay }) => {
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
        padding: "40px 60px",
        background: `linear-gradient(135deg, ${COLORS.darkBgAlt} 0%, ${COLORS.darkBg} 100%)`,
        borderRadius: 25,
        border: `2px solid ${COLORS.henkelRed}40`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${COLORS.henkelRed}20`,
        opacity: progress,
        transform: `translateX(${interpolate(progress, [0, 1], [-80, 0])}px) scale(${interpolate(progress, [0, 0.8, 1], [0.9, 1.02, 1])})`,
      }}
    >
      <div style={{ fontSize: 90, filter: "drop-shadow(0 5px 15px rgba(0,0,0,0.3))" }}>
        {flag}
      </div>
      <div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: COLORS.white,
            fontFamily: FONTS.heading,
            marginBottom: 10,
            textShadow: `0 0 20px ${COLORS.henkelRed}40`,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: COLORS.henkelRed,
            fontFamily: FONTS.accent,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

// Journey section
const HenkelJourney: React.FC<{
  years: number;
  previousRoles: string[];
  delay: number;
}> = ({ years, previousRoles, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
      }}
    >
      {/* Years counter */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 15 }}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: COLORS.henkelRed,
            fontFamily: FONTS.heading,
          }}
        >
          {Math.round(interpolate(progress, [0, 1], [0, years]))}
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: COLORS.whiteAlpha60,
            fontFamily: FONTS.heading,
          }}
        >
          years at Henkel
        </div>
      </div>

      {/* Previous roles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {previousRoles.map((role, index) => {
          const roleProgress = spring({
            frame: Math.max(0, adjustedFrame - 20 - index * 8),
            fps,
            config: SPRING_CONFIGS.snappy,
          });

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                opacity: roleProgress,
                transform: `translateX(${interpolate(roleProgress, [0, 1], [30, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: COLORS.henkelRed,
                }}
              />
              <div
                style={{
                  fontSize: 22,
                  color: COLORS.whiteAlpha80,
                  fontFamily: FONTS.body,
                }}
              >
                {role}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Fun facts section
const FunFacts: React.FC<{
  facts: string[];
  delay: number;
}> = ({ facts, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        opacity: progress,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.henkelRed,
          fontFamily: FONTS.heading,
          marginBottom: 10,
        }}
      >
        Fun Facts
      </div>

      {facts.map((fact, index) => {
        const factProgress = spring({
          frame: Math.max(0, adjustedFrame - 10 - index * 12),
          fps,
          config: SPRING_CONFIGS.bouncy,
        });

        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "15px 25px",
              background: COLORS.darkBgAlt,
              borderRadius: 12,
              border: `1px solid ${COLORS.whiteAlpha10}`,
              opacity: factProgress,
              transform: `translateY(${interpolate(factProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            <div style={{ fontSize: 28 }}>✨</div>
            <div
              style={{
                fontSize: 22,
                color: COLORS.white,
                fontFamily: FONTS.body,
              }}
            >
              {fact}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Hobby section
const HobbySection: React.FC<{
  hobby: string;
  icon: string;
  delay: number;
}> = ({ hobby, icon, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const iconBounce = Math.sin(adjustedFrame * 0.1) * 5;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "30px 50px",
        background: `linear-gradient(135deg, ${COLORS.henkelRed}20 0%, ${COLORS.darkBgAlt} 100%)`,
        borderRadius: 20,
        border: `1px solid ${COLORS.henkelRed}40`,
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 0.8, 1], [0.8, 1.05, 1])})`,
      }}
    >
      <div
        style={{
          fontSize: 80,
          transform: `translateY(${iconBounce}px)`,
          filter: "drop-shadow(0 5px 15px rgba(0,0,0,0.3))",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: COLORS.whiteAlpha60,
            fontFamily: FONTS.accent,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: 8,
          }}
        >
          Hobby
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONTS.heading,
          }}
        >
          {hobby}
        </div>
      </div>
    </div>
  );
};

export const TeamMemberProfileScene: React.FC<{ member: TeamMemberData }> = ({ member }) => {
  const frame = useCurrentFrame();

  // Scene duration: ~55 seconds = 1650 frames
  // Sub-scene timing:
  // 0-180: Map zoom with pin drop (6 sec)
  // 180-330: Profile card (5 sec)
  // 330-780: Henkel journey (15 sec)
  // 780-1140: Fun facts (12 sec)
  // 1140-1440: Hobby (10 sec)

  const currentPhase =
    frame < 180 ? "map" :
    frame < 330 ? "profile" :
    frame < 780 ? "journey" :
    frame < 1140 ? "facts" :
    "hobby";

  return (
    <AbsoluteFill>
      <Background variant="warm" intensity={1.0} />

      <Flash trigger={180} color={COLORS.henkelRed} duration={5} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        {currentPhase === "map" && (
          <WorldMapPin
            country={member.country}
            countrySecondary={member.countrySecondary}
            flag={member.flag}
            flagSecondary={member.flagSecondary}
            delay={0}
            isEgyptAgain={member.isEgyptAgain}
          />
        )}

        {currentPhase === "profile" && (
          <ProfileCard
            name={member.name}
            title={member.title}
            flag={member.flag}
            delay={180}
          />
        )}

        {currentPhase === "journey" && (
          <HenkelJourney
            years={member.yearsAtHenkel}
            previousRoles={member.previousRoles}
            delay={330}
          />
        )}

        {currentPhase === "facts" && (
          <FunFacts
            facts={member.funFacts}
            delay={780}
          />
        )}

        {currentPhase === "hobby" && (
          <HobbySection
            hobby={member.hobby}
            icon={member.hobbyIcon}
            delay={1140}
          />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
