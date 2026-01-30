import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../config";
import { Particles, FloatingDots } from "./Particles";
import { Vignette, FilmGrain, GlowOrb } from "./Effects";

interface BackgroundProps {
  variant?: "dark" | "gradient" | "henkel" | "stats" | "dramatic" | "warm";
  showParticles?: boolean;
  showVignette?: boolean;
  showGrain?: boolean;
  intensity?: number;
}

export const Background: React.FC<BackgroundProps> = ({
  variant = "dark",
  showParticles = true,
  showVignette = true,
  showGrain = true,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();

  // Subtle animated gradient rotation
  const gradientAngle = interpolate(frame, [0, 1800], [135, 180]);
  const gradientShift = Math.sin(frame * 0.01) * 5;

  const backgrounds: Record<string, React.CSSProperties> = {
    dark: {
      background: `
        radial-gradient(ellipse at 20% 20%, ${COLORS.darkBgAccent}40 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, ${COLORS.henkelRed}10 0%, transparent 50%),
        linear-gradient(${gradientAngle}deg, ${COLORS.darkBg} 0%, ${COLORS.darkBgAlt} 50%, ${COLORS.darkBg} 100%)
      `,
    },
    gradient: {
      background: `
        radial-gradient(ellipse at ${50 + gradientShift}% 30%, ${COLORS.darkBgAccent}60 0%, transparent 50%),
        radial-gradient(ellipse at ${50 - gradientShift}% 70%, ${COLORS.henkelRed}15 0%, transparent 50%),
        linear-gradient(${gradientAngle}deg, ${COLORS.darkBg} 0%, #0D0D1A 30%, #12121F 50%, #0D0D1A 70%, ${COLORS.darkBg} 100%)
      `,
    },
    henkel: {
      background: `
        radial-gradient(ellipse at 50% 40%, ${COLORS.henkelRed}20 0%, transparent 60%),
        radial-gradient(ellipse at 30% 70%, ${COLORS.henkelRedDark}10 0%, transparent 40%),
        radial-gradient(ellipse at 70% 30%, ${COLORS.henkelRedLight}08 0%, transparent 40%),
        linear-gradient(180deg, ${COLORS.darkBg} 0%, #0F0508 50%, ${COLORS.darkBg} 100%)
      `,
    },
    stats: {
      background: `
        radial-gradient(ellipse at 50% 100%, ${COLORS.henkelRed}15 0%, transparent 50%),
        linear-gradient(180deg, ${COLORS.darkBg} 0%, #08080C 30%, #0A0A12 100%)
      `,
    },
    dramatic: {
      background: `
        radial-gradient(ellipse at 50% 50%, ${COLORS.henkelRed}25 0%, transparent 40%),
        radial-gradient(ellipse at 50% 50%, ${COLORS.black} 0%, transparent 80%),
        linear-gradient(180deg, #050505 0%, ${COLORS.darkBg} 50%, #050505 100%)
      `,
    },
    warm: {
      background: `
        radial-gradient(ellipse at 50% 30%, ${COLORS.gold}10 0%, transparent 50%),
        radial-gradient(ellipse at 50% 70%, ${COLORS.henkelRed}15 0%, transparent 50%),
        linear-gradient(180deg, ${COLORS.darkBg} 0%, #0F0A08 50%, ${COLORS.darkBg} 100%)
      `,
    },
  };

  return (
    <AbsoluteFill style={backgrounds[variant]}>
      {/* Animated grid overlay - perspective floor */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${COLORS.henkelRed}06 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.henkelRed}06 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 0.5 * intensity,
          transform: `perspective(1000px) rotateX(60deg) translateY(-50%)`,
          transformOrigin: "center bottom",
          maskImage: "linear-gradient(to top, black 0%, transparent 60%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 60%)",
        }}
      />

      {/* Horizontal scan lines for that premium feel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            ${COLORS.black}15 2px,
            ${COLORS.black}15 4px
          )`,
          opacity: 0.3 * intensity,
          pointerEvents: "none",
        }}
      />

      {/* Ambient glow orbs */}
      <GlowOrb x="20%" y="30%" size={400} color={COLORS.henkelRed} />
      <GlowOrb x="80%" y="70%" size={300} color={COLORS.darkBgAccent} />

      {/* Particles */}
      {showParticles && (
        <>
          <Particles
            count={30}
            color={COLORS.henkelRed}
            minSize={1}
            maxSize={3}
            speed={0.5}
            direction="up"
          />
          <FloatingDots color={COLORS.whiteAlpha10} count={20} />
        </>
      )}

      {/* Vignette */}
      {showVignette && <Vignette intensity={0.6 * intensity} />}

      {/* Film grain */}
      {showGrain && <FilmGrain opacity={0.03 * intensity} />}

      {/* Top and bottom gradient fades */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(to bottom, ${COLORS.darkBg}, transparent)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: `linear-gradient(to top, ${COLORS.darkBg}, transparent)`,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
