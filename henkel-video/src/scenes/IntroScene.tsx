import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { SplitText, SplitWords } from "../components/SplitText";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

// Enhanced 3D Flag component
const Flag3D: React.FC<{
  flag: string;
  delay: number;
  index: number;
}> = ({ flag, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  // Entry animation
  const entryProgress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  // Continuous subtle float
  const floatY = Math.sin((frame + index * 20) * 0.04) * 8;
  const floatRotate = Math.sin((frame + index * 30) * 0.03) * 3;

  // 3D rotation on entry
  const rotateY = interpolate(entryProgress, [0, 1], [-90, 0]);
  const rotateZ = interpolate(entryProgress, [0, 0.5, 1], [-20, 5, 0]);

  // Scale with overshoot
  const scale = interpolate(entryProgress, [0, 0.7, 1], [0, 1.15, 1]);

  return (
    <div
      style={{
        fontSize: 100,
        display: "inline-block",
        margin: "0 15px",
        perspective: "1000px",
      }}
    >
      <div
        style={{
          transform: `
            translateY(${interpolate(entryProgress, [0, 1], [60, 0]) + floatY}px)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ + floatRotate}deg)
            scale(${scale})
          `,
          opacity: entryProgress,
          filter: `
            drop-shadow(0 10px 20px rgba(0,0,0,0.4))
            drop-shadow(0 0 30px ${COLORS.henkelRed}30)
          `,
          transformStyle: "preserve-3d",
        }}
      >
        {flag}
      </div>
    </div>
  );
};

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flags = ["🇷🇺", "🇪🇬", "🇫🇷", "🇱🇰", "🇩🇪"];

  // "It's complicated" reveal with dramatic timing
  const complicatedDelay = 130;
  const complicatedProgress = spring({
    frame: Math.max(0, frame - complicatedDelay),
    fps,
    config: SPRING_CONFIGS.dramatic,
  });

  // Blur to sharp effect
  const complicatedBlur = interpolate(
    complicatedProgress,
    [0, 0.5, 1],
    [20, 5, 0]
  );

  return (
    <AbsoluteFill>
      <Background variant="gradient" intensity={1.2} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 100,
        }}
      >
        {/* Opening Question - Letter by letter with blur */}
        <div style={{ marginBottom: 15 }}>
          <SplitText
            text="When people ask"
            delay={10}
            staggerDelay={2}
            fontSize={52}
            fontWeight={300}
            color={COLORS.whiteAlpha60}
            animation="blur"
          />
        </div>

        {/* Main question - Word by word */}
        <div style={{ marginBottom: 70 }}>
          <SplitWords
            text="where we're from..."
            delay={40}
            staggerDelay={10}
            fontSize={80}
            fontWeight={700}
            color={COLORS.white}
            style={{ textShadow: `0 0 40px ${COLORS.henkelRed}40` }}
          />
        </div>

        {/* 3D Flags */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 70,
            height: 130,
          }}
        >
          {flags.map((flag, index) => (
            <Flag3D
              key={index}
              flag={flag}
              delay={65 + index * 10}
              index={index}
            />
          ))}
        </div>

        {/* "It's complicated" - Dramatic reveal */}
        <div
          style={{
            position: "relative",
          }}
        >
          {/* Glow behind text */}
          <div
            style={{
              position: "absolute",
              inset: -40,
              background: `radial-gradient(ellipse, ${COLORS.henkelRed}30 0%, transparent 70%)`,
              opacity: complicatedProgress,
              filter: "blur(30px)",
            }}
          />

          <div
            style={{
              fontSize: 42,
              fontWeight: 500,
              color: COLORS.henkelRed,
              fontFamily: FONTS.heading,
              fontStyle: "italic",
              opacity: complicatedProgress,
              transform: `
                scale(${interpolate(complicatedProgress, [0, 0.5, 1], [0.8, 1.05, 1])})
                translateY(${interpolate(complicatedProgress, [0, 1], [20, 0])}px)
              `,
              filter: `blur(${complicatedBlur}px)`,
              textShadow: `
                0 0 20px ${COLORS.henkelRed}80,
                0 0 40px ${COLORS.henkelRed}40,
                0 0 60px ${COLORS.henkelRed}20
              `,
              position: "relative",
            }}
          >
            ...it's complicated.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
