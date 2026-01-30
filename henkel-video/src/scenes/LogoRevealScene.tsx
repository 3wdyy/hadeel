import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { LightStreak, Flash } from "../components/Effects";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

// Individual letter with 3D assembly animation
const AssemblingLetter: React.FC<{
  letter: string;
  index: number;
  totalLetters: number;
  delay: number;
}> = ({ letter, index, totalLetters, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  // Each letter comes from a different direction
  const angle = (index / totalLetters) * Math.PI * 2;
  const startX = Math.cos(angle) * 200;
  const startY = Math.sin(angle) * 200;
  const startRotation = (index - totalLetters / 2) * 30;
  const startScale = 0.3;

  const x = interpolate(progress, [0, 1], [startX, 0]);
  const y = interpolate(progress, [0, 1], [startY, 0]);
  const rotation = interpolate(progress, [0, 1], [startRotation, 0]);
  const scale = interpolate(progress, [0, 0.8, 1], [startScale, 1.1, 1]);
  const blur = interpolate(progress, [0, 0.7, 1], [15, 2, 0]);

  // Glow pulse after assembly
  const glowPulse = progress > 0.9 ? 0.5 + Math.sin((frame - delay) * 0.1) * 0.3 : 0;

  return (
    <span
      style={{
        display: "inline-block",
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
        opacity: progress,
        filter: `blur(${blur}px) drop-shadow(0 0 ${20 + glowPulse * 30}px ${COLORS.henkelRed}${Math.floor(glowPulse * 100).toString(16).padStart(2, '0')})`,
        textShadow: glowPulse > 0 ? `0 0 ${30 * glowPulse}px ${COLORS.henkelRed}` : "none",
      }}
    >
      {letter}
    </span>
  );
};

export const LogoRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const henkelLetters = "HENKEL".split("");

  // GCC reveal timing
  const gccDelay = 50;
  const gccProgress = spring({
    frame: Math.max(0, frame - gccDelay),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Subtitle reveal
  const subtitleDelay = 75;
  const subtitleProgress = spring({
    frame: Math.max(0, frame - subtitleDelay),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Pulsing glow intensity
  const glowIntensity = 0.4 + Math.sin(frame * 0.08) * 0.2;

  // Light streak timing
  const lightStreakFrame = 35;

  return (
    <AbsoluteFill>
      <Background variant="henkel" intensity={1.3} />

      {/* Light streak effect */}
      <LightStreak trigger={lightStreakFrame} duration={50} color={COLORS.henkelRedLight} />

      {/* Flash on logo assembly */}
      <Flash trigger={40} color={COLORS.henkelRed} duration={8} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* HENKEL Logo - Letter assembly */}
        <div
          style={{
            position: "relative",
            marginBottom: 30,
          }}
        >
          {/* Background glow */}
          <div
            style={{
              position: "absolute",
              inset: -80,
              background: `radial-gradient(ellipse, ${COLORS.henkelRed}${Math.floor(glowIntensity * 60).toString(16).padStart(2, '0')} 0%, transparent 60%)`,
              filter: "blur(50px)",
            }}
          />

          {/* Main logo text */}
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: COLORS.white,
              fontFamily: FONTS.heading,
              letterSpacing: "-0.02em",
              position: "relative",
              display: "flex",
            }}
          >
            {henkelLetters.map((letter, index) => (
              <AssemblingLetter
                key={index}
                letter={letter}
                index={index}
                totalLetters={henkelLetters.length}
                delay={5 + index * 5}
              />
            ))}
          </div>
        </div>

        {/* GCC - Scale up with glow */}
        <div
          style={{
            position: "relative",
          }}
        >
          {/* GCC glow */}
          <div
            style={{
              position: "absolute",
              inset: -30,
              background: `radial-gradient(ellipse, ${COLORS.henkelRed}40 0%, transparent 70%)`,
              filter: "blur(20px)",
              opacity: gccProgress,
            }}
          />

          <div
            style={{
              fontSize: 110,
              fontWeight: 800,
              color: COLORS.henkelRed,
              fontFamily: FONTS.heading,
              letterSpacing: "0.35em",
              opacity: gccProgress,
              transform: `
                scale(${interpolate(gccProgress, [0, 0.7, 1], [0.5, 1.05, 1])})
                translateY(${interpolate(gccProgress, [0, 1], [30, 0])}px)
              `,
              textShadow: `
                0 0 30px ${COLORS.henkelRed}80,
                0 0 60px ${COLORS.henkelRed}40,
                0 4px 20px rgba(0,0,0,0.5)
              `,
              position: "relative",
            }}
          >
            GCC
          </div>
        </div>

        {/* Subtitle with elegant underline */}
        <div
          style={{
            marginTop: 40,
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 400,
              color: COLORS.whiteAlpha60,
              fontFamily: FONTS.heading,
              textTransform: "uppercase",
              letterSpacing: "0.4em",
              opacity: subtitleProgress,
              transform: `translateY(${interpolate(subtitleProgress, [0, 1], [15, 0])}px)`,
            }}
          >
            Welcome to the Team
          </div>

          {/* Animated underline */}
          <div
            style={{
              position: "absolute",
              bottom: -15,
              left: "50%",
              height: 2,
              background: `linear-gradient(90deg, transparent, ${COLORS.henkelRed}, transparent)`,
              width: `${interpolate(subtitleProgress, [0, 1], [0, 100])}%`,
              transform: "translateX(-50%)",
              boxShadow: `0 0 10px ${COLORS.henkelRed}`,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
