import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { SplitWords } from "../components/SplitText";
import { Flash, LightStreak, CircularReveal } from "../components/Effects";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

// World map with all pins
const WorldMapWithConnections: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Line connection animation (starts after map appears)
  const lineProgress = spring({
    frame: Math.max(0, adjustedFrame - 60),
    fps,
    config: { damping: 30, stiffness: 40, mass: 1 },
  });

  const countries = [
    { flag: "🇷🇺", name: "Russia", x: 70, y: 25 },
    { flag: "🇪🇬", name: "Egypt", x: 55, y: 55 },
    { flag: "🇫🇷", name: "France", x: 48, y: 35 },
    { flag: "🇱🇰", name: "Sri Lanka", x: 75, y: 65 },
    { flag: "🇩🇪", name: "Germany", x: 52, y: 32 },
  ];

  const gccCenter = { x: 60, y: 50 };

  return (
    <div
      style={{
        position: "relative",
        width: 900,
        height: 500,
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.9, 1])})`,
      }}
    >
      {/* Map background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: COLORS.darkBgAlt,
          borderRadius: 30,
          border: `1px solid ${COLORS.whiteAlpha10}`,
          overflow: "hidden",
        }}
      >
        {/* Grid effect */}
        <svg viewBox="0 0 900 500" style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 25} x2="900" y2={i * 25} stroke={COLORS.white} strokeWidth="1" />
          ))}
          {Array.from({ length: 36 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 25} y1="0" x2={i * 25} y2="500" stroke={COLORS.white} strokeWidth="1" />
          ))}
        </svg>
      </div>

      {/* Connection lines */}
      <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
        {countries.map((country, index) => {
          const lineLength = lineProgress * 100;
          const dx = gccCenter.x - country.x;
          const dy = gccCenter.y - country.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const endX = country.x + (dx / length) * Math.min(lineLength, length);
          const endY = country.y + (dy / length) * Math.min(lineLength, length);

          return (
            <line
              key={index}
              x1={`${country.x}%`}
              y1={`${country.y}%`}
              x2={`${endX}%`}
              y2={`${endY}%`}
              stroke={COLORS.henkelRed}
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity={lineProgress * 0.8}
            />
          );
        })}
      </svg>

      {/* Country pins */}
      {countries.map((country, index) => {
        const pinProgress = spring({
          frame: Math.max(0, adjustedFrame - 20 - index * 10),
          fps,
          config: SPRING_CONFIGS.bouncy,
        });

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${country.x}%`,
              top: `${country.y}%`,
              transform: `translate(-50%, -50%) scale(${interpolate(pinProgress, [0, 0.8, 1], [0, 1.2, 1])})`,
              opacity: pinProgress,
            }}
          >
            <div style={{ fontSize: 40, filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.5))" }}>
              {country.flag}
            </div>
          </div>
        );
      })}

      {/* GCC center */}
      <div
        style={{
          position: "absolute",
          left: `${gccCenter.x}%`,
          top: `${gccCenter.y}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.henkelRed} 0%, ${COLORS.henkelRedDark} 100%)`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: `0 0 30px ${COLORS.henkelRed}80, 0 0 60px ${COLORS.henkelRed}40`,
            opacity: lineProgress,
            transform: `scale(${interpolate(lineProgress, [0, 0.5, 1], [0.5, 1.1, 1])})`,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: FONTS.heading,
            }}
          >
            GCC
          </span>
        </div>
      </div>
    </div>
  );
};

// Team grid
const TeamGrid: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const members = [
    { name: "IRINA", flag: "🇷🇺" },
    { name: "MOHAMED", flag: "🇪🇬" },
    { name: "NICOLAS", flag: "🇫🇷" },
    { name: "JUDE", flag: "🇱🇰" },
    { name: "HANY", flag: "🇪🇬" },
    { name: "WAEL", flag: "🇪🇬" },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 30,
        flexWrap: "wrap",
        maxWidth: 800,
      }}
    >
      {members.map((member, index) => {
        const progress = spring({
          frame: Math.max(0, adjustedFrame - index * 8),
          fps,
          config: SPRING_CONFIGS.bouncy,
        });

        return (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "20px 30px",
              background: COLORS.darkBgAlt,
              borderRadius: 15,
              border: `1px solid ${COLORS.whiteAlpha10}`,
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px) scale(${interpolate(progress, [0, 0.8, 1], [0.8, 1.05, 1])})`,
            }}
          >
            <div style={{ fontSize: 50 }}>{member.flag}</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: FONTS.heading,
              }}
            >
              {member.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Building stats
const BuildingStats: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const stats = [
    { value: 5, label: "Countries" },
    { value: 6, label: "People" },
    { value: 1, label: "GCC Team" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: 80,
        justifyContent: "center",
      }}
    >
      {stats.map((stat, index) => {
        const progress = spring({
          frame: Math.max(0, adjustedFrame - index * 30),
          fps,
          config: SPRING_CONFIGS.bouncy,
        });

        return (
          <div
            key={index}
            style={{
              textAlign: "center",
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
            }}
          >
            <div
              style={{
                fontSize: 100,
                fontWeight: 900,
                color: index === 2 ? COLORS.henkelRed : COLORS.white,
                fontFamily: FONTS.heading,
                textShadow: index === 2 ? `0 0 40px ${COLORS.henkelRed}80` : "none",
              }}
            >
              {Math.round(interpolate(progress, [0, 1], [0, stat.value]))}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: COLORS.whiteAlpha60,
                fontFamily: FONTS.accent,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene duration: 75 seconds = 2250 frames
  // Sub-scene timing:
  // 0-240: World map with pins (8 sec)
  // 240-450: Animated connections (7 sec)
  // 450-630: Team grid (6 sec)
  // 630-900: Building stats (9 sec - 3 sec each)
  // 900-1050: "Different roots. One mission." (5 sec)
  // 1050-1170: Elevate MENAT (4 sec)
  // 1170-1320: Henkel logo (5 sec)
  // 1320-1410: Hold + fade (3 sec)

  const currentPhase =
    frame < 450 ? "map" :
    frame < 630 ? "team" :
    frame < 900 ? "stats" :
    frame < 1050 ? "tagline" :
    frame < 1170 ? "elevate" :
    "logo";

  // Animation progress values
  const taglineProgress = spring({
    frame: Math.max(0, frame - 900),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const missionProgress = spring({
    frame: Math.max(0, frame - 960),
    fps,
    config: SPRING_CONFIGS.dramatic,
  });

  const elevateProgress = spring({
    frame: Math.max(0, frame - 1050),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const menatProgress = spring({
    frame: Math.max(0, frame - 1080),
    fps,
    config: { damping: 8, stiffness: 40, mass: 1.5 },
  });

  const logoProgress = spring({
    frame: Math.max(0, frame - 1170),
    fps,
    config: SPRING_CONFIGS.slow,
  });

  // Heartbeat glow
  const heartbeat = frame > 1100 ?
    0.4 + Math.sin((frame - 1100) * 0.15) * 0.3 +
    Math.sin((frame - 1100) * 0.08) * 0.2 : 0;

  return (
    <AbsoluteFill>
      <Background variant="henkel" intensity={1.3} />

      <Flash trigger={630} color={COLORS.henkelRed} duration={5} />
      <Flash trigger={1080} color={COLORS.henkelRed} duration={10} />
      <LightStreak trigger={450} duration={40} color={COLORS.henkelRedLight} />
      <CircularReveal trigger={1080} duration={40} color={COLORS.henkelRed} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
        }}
      >
        {/* Phase 1: World map with connections */}
        {currentPhase === "map" && <WorldMapWithConnections delay={0} />}

        {/* Phase 2: Team grid */}
        {currentPhase === "team" && <TeamGrid delay={450} />}

        {/* Phase 3: Building stats */}
        {currentPhase === "stats" && <BuildingStats delay={630} />}

        {/* Phase 4: Tagline */}
        {currentPhase === "tagline" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 600,
                color: COLORS.white,
                fontFamily: FONTS.heading,
                marginBottom: 20,
                opacity: taglineProgress,
                transform: `translateY(${interpolate(taglineProgress, [0, 1], [30, 0])}px)`,
              }}
            >
              Different roots.
            </div>

            <div
              style={{
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: -40,
                  background: `radial-gradient(ellipse, ${COLORS.henkelRed}40 0%, transparent 70%)`,
                  opacity: missionProgress,
                  filter: "blur(25px)",
                }}
              />

              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: COLORS.henkelRed,
                  fontFamily: FONTS.heading,
                  opacity: missionProgress,
                  transform: `scale(${interpolate(missionProgress, [0, 0.5, 1], [0.9, 1.05, 1])})`,
                  textShadow: `
                    0 0 40px ${COLORS.henkelRed}80,
                    0 0 80px ${COLORS.henkelRed}40
                  `,
                  position: "relative",
                }}
              >
                One mission.
              </div>
            </div>
          </div>
        )}

        {/* Phase 5: Elevate MENAT */}
        {currentPhase === "elevate" && (
          <div
            style={{
              position: "relative",
              textAlign: "center",
            }}
          >
            {/* Massive glow */}
            <div
              style={{
                position: "absolute",
                inset: -200,
                background: `radial-gradient(ellipse, ${COLORS.henkelRed}${Math.floor(heartbeat * 80).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
                filter: "blur(100px)",
                opacity: menatProgress,
              }}
            />

            <div
              style={{
                fontSize: 36,
                fontWeight: 400,
                color: COLORS.whiteAlpha80,
                fontFamily: FONTS.heading,
                textTransform: "uppercase",
                letterSpacing: "0.6em",
                marginBottom: 20,
                opacity: elevateProgress,
                transform: `translateY(${interpolate(elevateProgress, [0, 1], [20, 0])}px)`,
                position: "relative",
              }}
            >
              Elevate
            </div>

            <div
              style={{
                fontSize: 140,
                fontWeight: 900,
                color: COLORS.white,
                fontFamily: FONTS.heading,
                letterSpacing: "0.1em",
                opacity: menatProgress,
                transform: `scale(${interpolate(menatProgress, [0, 0.3, 0.6, 1], [2, 0.95, 1.02, 1])})`,
                filter: `blur(${interpolate(menatProgress, [0, 0.5, 1], [20, 2, 0])}px)`,
                textShadow: `
                  0 0 ${80 + heartbeat * 60}px ${COLORS.henkelRed},
                  0 0 ${160 + heartbeat * 100}px ${COLORS.henkelRed}80,
                  0 0 ${240 + heartbeat * 140}px ${COLORS.henkelRed}40
                `,
                position: "relative",
              }}
            >
              MENAT
            </div>
          </div>
        )}

        {/* Phase 6: Henkel Logo */}
        {currentPhase === "logo" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
              opacity: logoProgress,
              transform: `scale(${interpolate(logoProgress, [0, 1], [0.9, 1])})`,
            }}
          >
            {/* Henkel oval logo */}
            <div
              style={{
                width: 250,
                height: 140,
                border: `5px solid ${COLORS.henkelRed}`,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: `0 0 40px ${COLORS.henkelRed}60, 0 0 80px ${COLORS.henkelRed}30`,
              }}
            >
              <span
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  color: COLORS.henkelRed,
                  fontFamily: FONTS.heading,
                  letterSpacing: "-0.02em",
                }}
              >
                Henkel
              </span>
            </div>

            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: COLORS.whiteAlpha60,
                fontFamily: FONTS.heading,
                letterSpacing: "0.4em",
                textTransform: "uppercase",
              }}
            >
              GCC
            </div>
          </div>
        )}
      </AbsoluteFill>

      {/* Final fade */}
      {frame > 1350 && (
        <AbsoluteFill
          style={{
            background: COLORS.darkBg,
            opacity: interpolate(frame, [1350, 1410], [0, 1], { extrapolateRight: "clamp" }),
          }}
        />
      )}
    </AbsoluteFill>
  );
};
