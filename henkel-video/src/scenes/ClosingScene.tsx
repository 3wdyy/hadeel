import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { SplitText, SplitWords } from "../components/SplitText";
import { Flash, LightStreak, CircularReveal } from "../components/Effects";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

// Converging flag with trail effect
const ConvergingFlag: React.FC<{
  flag: string;
  index: number;
  total: number;
  delay: number;
}> = ({ flag, index, total, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 15, stiffness: 60, mass: 1.2 },
  });

  // Calculate starting position - flags come from different directions
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const distance = 500;
  const startX = Math.cos(angle) * distance;
  const startY = Math.sin(angle) * distance;

  // Final position forms a horizontal row
  const finalX = (index - (total - 1) / 2) * 80;
  const finalY = 0;

  const x = interpolate(progress, [0, 1], [startX, finalX]);
  const y = interpolate(progress, [0, 1], [startY, finalY]);

  // Rotation and scale
  const rotation = interpolate(progress, [0, 0.7, 1], [360 + index * 30, -10, 0]);
  const scale = interpolate(progress, [0, 0.6, 0.9, 1], [0.3, 1.2, 0.95, 1]);

  // Trail effect - fading copies behind
  const trailCount = 5;

  return (
    <>
      {/* Motion trails */}
      {Array.from({ length: trailCount }).map((_, trailIndex) => {
        const trailProgress = Math.max(0, progress - trailIndex * 0.08);
        const trailX = interpolate(trailProgress, [0, 1], [startX, finalX]);
        const trailY = interpolate(trailProgress, [0, 1], [startY, finalY]);

        return (
          <div
            key={trailIndex}
            style={{
              position: "absolute",
              fontSize: 50,
              transform: `translate(${trailX}px, ${trailY}px) scale(${scale * 0.9})`,
              opacity: (progress < 0.8 ? 0.15 : 0) * (1 - trailIndex / trailCount),
              filter: `blur(${3 + trailIndex * 2}px)`,
            }}
          >
            {flag}
          </div>
        );
      })}

      {/* Main flag */}
      <div
        style={{
          position: "absolute",
          fontSize: 50,
          transform: `
            translate(${x}px, ${y}px)
            rotate(${rotation}deg)
            scale(${scale})
          `,
          opacity: progress,
          filter: `drop-shadow(0 5px 15px rgba(0,0,0,0.5))`,
        }}
      >
        {flag}
      </div>
    </>
  );
};

// Stat convergence element
const ConvergingStat: React.FC<{
  value: number;
  label: string;
  index: number;
  delay: number;
}> = ({ value, label, index, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Position based on index
  const xOffset = (index - 1) * 180;

  // Counter animation
  const displayValue = Math.round(interpolate(progress, [0, 0.7, 1], [0, value * 1.2, value]));

  return (
    <div
      style={{
        textAlign: "center",
        opacity: progress,
        transform: `
          translateY(${interpolate(progress, [0, 1], [40, 0])}px)
          translateX(${xOffset}px)
          scale(${interpolate(progress, [0, 0.8, 1], [0.8, 1.05, 1])})
        `,
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: COLORS.white,
          fontFamily: FONTS.heading,
          textShadow: `0 0 30px ${COLORS.henkelRed}60`,
          lineHeight: 1,
        }}
      >
        {displayValue}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: COLORS.whiteAlpha60,
          fontFamily: FONTS.accent,
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          marginTop: 8,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flags = ["🇷🇺", "🇪🇬", "🇫🇷", "🇱🇰", "🇩🇪"];

  // Phase timings
  const statsDelay = 0;
  const flagsDelay = 40;
  const messageDelay = 100;
  const missionDelay = 140;
  const elevateDelay = 180;
  const menatDelay = 210;
  const logoDelay = 250;

  // Animation progress values
  const messageProgress = spring({
    frame: Math.max(0, frame - messageDelay),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const missionProgress = spring({
    frame: Math.max(0, frame - missionDelay),
    fps,
    config: SPRING_CONFIGS.dramatic,
  });

  const elevateProgress = spring({
    frame: Math.max(0, frame - elevateDelay),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const menatProgress = spring({
    frame: Math.max(0, frame - menatDelay),
    fps,
    config: { damping: 8, stiffness: 40, mass: 1.5 },
  });

  const logoProgress = spring({
    frame: Math.max(0, frame - logoDelay),
    fps,
    config: SPRING_CONFIGS.slow,
  });

  // Pulsing heartbeat glow for finale
  const heartbeat = frame > menatDelay + 30 ?
    0.4 + Math.sin((frame - menatDelay) * 0.15) * 0.3 +
    Math.sin((frame - menatDelay) * 0.08) * 0.2 : 0;

  // MENAT letter spacing animation
  const letterSpacing = interpolate(menatProgress, [0, 0.5, 1], [0.5, 0.15, 0.12]);

  // Subtle screen pulse on MENAT reveal
  const screenPulse = frame > menatDelay && frame < menatDelay + 15 ?
    1 + Math.sin((frame - menatDelay) * 0.5) * 0.01 : 1;

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${screenPulse})`,
      }}
    >
      <Background variant="henkel" intensity={1.4} />

      {/* Light streak at flag convergence */}
      <LightStreak trigger={flagsDelay + 30} duration={50} color={COLORS.henkelRedLight} />

      {/* Flash on MENAT reveal */}
      <Flash trigger={menatDelay + 5} color={COLORS.henkelRed} duration={10} />

      {/* Circular reveal on MENAT */}
      <CircularReveal trigger={menatDelay} duration={40} color={COLORS.henkelRed} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 60,
        }}
      >
        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 40,
            position: "relative",
          }}
        >
          <ConvergingStat value={5} label="Countries" index={0} delay={statsDelay} />
          <ConvergingStat value={6} label="People" index={1} delay={statsDelay + 10} />
          <ConvergingStat value={1} label="GCC Team" index={2} delay={statsDelay + 20} />
        </div>

        {/* Converging Flags */}
        <div
          style={{
            position: "relative",
            height: 80,
            width: 500,
            marginBottom: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {flags.map((flag, index) => (
            <ConvergingFlag
              key={index}
              flag={flag}
              index={index}
              total={flags.length}
              delay={flagsDelay + index * 5}
            />
          ))}
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
              opacity: messageProgress,
              transform: `translateY(${interpolate(messageProgress, [0, 1], [30, 0])}px)`,
            }}
          >
            <SplitWords
              text="Different roots."
              delay={messageDelay}
              staggerDelay={8}
              fontSize={48}
              fontWeight={500}
              color={COLORS.white}
            />
          </div>

          <div
            style={{
              marginTop: 10,
              position: "relative",
            }}
          >
            {/* Glow behind "One mission" */}
            <div
              style={{
                position: "absolute",
                inset: -30,
                background: `radial-gradient(ellipse, ${COLORS.henkelRed}40 0%, transparent 70%)`,
                opacity: missionProgress,
                filter: "blur(20px)",
              }}
            />

            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: COLORS.henkelRed,
                fontFamily: FONTS.heading,
                opacity: missionProgress,
                transform: `
                  translateY(${interpolate(missionProgress, [0, 1], [30, 0])}px)
                  scale(${interpolate(missionProgress, [0, 0.5, 1], [0.9, 1.05, 1])})
                `,
                textShadow: `
                  0 0 30px ${COLORS.henkelRed}80,
                  0 0 60px ${COLORS.henkelRed}40
                `,
                position: "relative",
              }}
            >
              One mission.
            </div>
          </div>
        </div>

        {/* ELEVATE MENAT - Epic finale */}
        <div
          style={{
            position: "relative",
            textAlign: "center",
          }}
        >
          {/* Massive background glow */}
          <div
            style={{
              position: "absolute",
              inset: -150,
              background: `radial-gradient(ellipse, ${COLORS.henkelRed}${Math.floor(heartbeat * 80).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
              filter: "blur(80px)",
              opacity: menatProgress,
            }}
          />

          {/* Secondary glow ring */}
          <div
            style={{
              position: "absolute",
              inset: -100,
              background: `radial-gradient(circle, transparent 30%, ${COLORS.henkelRed}${Math.floor(heartbeat * 40).toString(16).padStart(2, '0')} 50%, transparent 70%)`,
              filter: "blur(40px)",
              opacity: menatProgress,
            }}
          />

          {/* ELEVATE */}
          <div
            style={{
              fontSize: 32,
              fontWeight: 400,
              color: COLORS.whiteAlpha80,
              fontFamily: FONTS.heading,
              textTransform: "uppercase",
              letterSpacing: "0.6em",
              marginBottom: 15,
              opacity: elevateProgress,
              transform: `translateY(${interpolate(elevateProgress, [0, 1], [20, 0])}px)`,
              position: "relative",
            }}
          >
            Elevate
          </div>

          {/* MENAT - The hero moment */}
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: FONTS.heading,
              letterSpacing: `${letterSpacing}em`,
              opacity: menatProgress,
              transform: `
                scale(${interpolate(menatProgress, [0, 0.3, 0.6, 1], [2, 0.95, 1.02, 1])})
                translateY(${interpolate(menatProgress, [0, 1], [40, 0])}px)
              `,
              filter: `blur(${interpolate(menatProgress, [0, 0.5, 1], [20, 2, 0])}px)`,
              textShadow: `
                0 0 ${60 + heartbeat * 40}px ${COLORS.henkelRed},
                0 0 ${120 + heartbeat * 60}px ${COLORS.henkelRed}80,
                0 0 ${180 + heartbeat * 80}px ${COLORS.henkelRed}40,
                0 10px 60px rgba(0,0,0,0.8)
              `,
              position: "relative",
            }}
          >
            MENAT
          </div>
        </div>

        {/* Henkel GCC footer */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Animated line above */}
          <div
            style={{
              width: `${interpolate(logoProgress, [0, 1], [0, 200])}px`,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${COLORS.whiteAlpha40}, transparent)`,
            }}
          />

          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: COLORS.whiteAlpha40,
              fontFamily: FONTS.heading,
              letterSpacing: "0.4em",
              opacity: logoProgress,
              transform: `translateY(${interpolate(logoProgress, [0, 1], [15, 0])}px)`,
            }}
          >
            HENKEL GCC
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
