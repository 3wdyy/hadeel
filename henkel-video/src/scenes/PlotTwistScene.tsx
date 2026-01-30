import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { Shockwave, Flash } from "../components/Effects";
import { SplitWords } from "../components/SplitText";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

export const PlotTwistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const butDelay = 0;
  const questionDelay = 25;
  const zeroDelay = 70;
  const textDelay = 110;

  // Progress springs
  const butProgress = spring({
    frame: Math.max(0, frame - butDelay),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const questionProgress = spring({
    frame: Math.max(0, frame - questionDelay),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const zeroProgress = spring({
    frame: Math.max(0, frame - zeroDelay),
    fps,
    config: SPRING_CONFIGS.dramatic,
  });

  const textProgress = spring({
    frame: Math.max(0, frame - textDelay),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Screen shake after zero appears
  const shakeIntensity = frame > zeroDelay && frame < zeroDelay + 20 ?
    Math.sin((frame - zeroDelay) * 3) * interpolate(frame - zeroDelay, [0, 20], [15, 0]) : 0;
  const shakeY = frame > zeroDelay && frame < zeroDelay + 20 ?
    Math.cos((frame - zeroDelay) * 4) * interpolate(frame - zeroDelay, [0, 20], [10, 0]) : 0;

  // Zero specific animations
  const zeroScale = interpolate(zeroProgress, [0, 0.3, 0.6, 1], [3, 0.9, 1.1, 1]);
  const zeroRotation = interpolate(zeroProgress, [0, 0.3, 1], [-10, 5, 0]);
  const zeroBlur = interpolate(zeroProgress, [0, 0.3, 0.6, 1], [30, 0, 0, 0]);

  // Dramatic glow
  const glowPulse = zeroProgress > 0.5 ? 0.5 + Math.sin((frame - zeroDelay) * 0.15) * 0.5 : 0;

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${shakeIntensity}px, ${shakeY}px)`,
      }}
    >
      <Background variant="dramatic" intensity={1.5} />

      {/* Shockwave effect */}
      <Shockwave trigger={zeroDelay + 5} duration={40} color={COLORS.henkelRed} />

      {/* Flash on zero impact */}
      <Flash trigger={zeroDelay + 2} color={COLORS.henkelRed} duration={6} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
        }}
      >
        {/* "But..." - Dramatic pause feel */}
        <div
          style={{
            marginBottom: 25,
            opacity: butProgress,
            transform: `translateY(${interpolate(butProgress, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 300,
              color: COLORS.whiteAlpha60,
              fontFamily: FONTS.heading,
              fontStyle: "italic",
              letterSpacing: "0.1em",
            }}
          >
            But...
          </span>
        </div>

        {/* Question */}
        <div style={{ marginBottom: 60 }}>
          <SplitWords
            text="How many of us are actually from here?"
            delay={questionDelay}
            staggerDelay={5}
            fontSize={46}
            fontWeight={500}
            color={COLORS.white}
            style={{ maxWidth: 950, textAlign: "center", lineHeight: 1.3 }}
          />
        </div>

        {/* Giant ZERO - The dramatic reveal */}
        <div
          style={{
            position: "relative",
            marginBottom: 30,
          }}
        >
          {/* Multiple glow layers */}
          <div
            style={{
              position: "absolute",
              inset: -150,
              background: `radial-gradient(circle, ${COLORS.henkelRed}${Math.floor(glowPulse * 80).toString(16).padStart(2, '0')} 0%, transparent 50%)`,
              filter: "blur(60px)",
              opacity: zeroProgress,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: -80,
              background: `radial-gradient(circle, ${COLORS.henkelRedLight}40 0%, transparent 60%)`,
              filter: "blur(30px)",
              opacity: zeroProgress * glowPulse,
            }}
          />

          {/* The ZERO */}
          <div
            style={{
              fontSize: 420,
              fontWeight: 900,
              color: COLORS.henkelRed,
              fontFamily: FONTS.heading,
              lineHeight: 0.85,
              opacity: zeroProgress,
              transform: `
                scale(${zeroScale})
                rotate(${zeroRotation}deg)
              `,
              filter: `blur(${zeroBlur}px)`,
              textShadow: `
                0 0 60px ${COLORS.henkelRed},
                0 0 120px ${COLORS.henkelRed}80,
                0 0 180px ${COLORS.henkelRed}40,
                0 10px 40px rgba(0,0,0,0.8)
              `,
              position: "relative",
            }}
          >
            0
          </div>
        </div>

        {/* "Zero. None. Not a single one." - Staggered reveal */}
        <div
          style={{
            display: "flex",
            gap: 40,
            opacity: textProgress,
            transform: `translateY(${interpolate(textProgress, [0, 1], [30, 0])}px)`,
          }}
        >
          {["Zero.", "None.", "Not a single one."].map((text, index) => {
            const wordProgress = spring({
              frame: Math.max(0, frame - textDelay - index * 10),
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            return (
              <span
                key={index}
                style={{
                  fontSize: 32,
                  fontWeight: index === 2 ? 600 : 400,
                  color: index === 2 ? COLORS.whiteAlpha80 : COLORS.whiteAlpha60,
                  fontFamily: FONTS.heading,
                  opacity: wordProgress,
                  transform: `translateY(${interpolate(wordProgress, [0, 1], [15, 0])}px)`,
                }}
              >
                {text}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
