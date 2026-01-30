import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { COLORS, SPRING_CONFIGS } from "../config";

// Shockwave ripple effect
interface ShockwaveProps {
  trigger: number; // Frame to trigger
  color?: string;
  duration?: number;
}

export const Shockwave: React.FC<ShockwaveProps> = ({
  trigger,
  color = COLORS.henkelRed,
  duration = 30,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - trigger;

  if (adjustedFrame < 0 || adjustedFrame > duration) return null;

  const progress = interpolate(adjustedFrame, [0, duration], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [0, 3]);
  const opacity = interpolate(progress, [0, 0.3, 1], [0.8, 0.4, 0]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          transform: `scale(${scale})`,
          opacity,
          boxShadow: `0 0 60px ${color}, inset 0 0 60px ${color}`,
        }}
      />
    </AbsoluteFill>
  );
};

// Screen flash effect
interface FlashProps {
  trigger: number;
  color?: string;
  duration?: number;
}

export const Flash: React.FC<FlashProps> = ({
  trigger,
  color = COLORS.white,
  duration = 10,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - trigger;

  if (adjustedFrame < 0 || adjustedFrame > duration) return null;

  const opacity = interpolate(adjustedFrame, [0, 3, duration], [0.9, 0.6, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: color,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// Vignette overlay
export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.7 }) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${intensity}) 100%)`,
        pointerEvents: "none",
      }}
    />
  );
};

// Film grain noise overlay
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => {
  const frame = useCurrentFrame();

  // Create pseudo-random noise pattern that changes each frame
  const seed = frame % 100;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        opacity,
        pointerEvents: "none",
        mixBlendMode: "overlay",
      }}
    />
  );
};

// Lens flare / light streak
interface LightStreakProps {
  trigger: number;
  duration?: number;
  angle?: number;
  color?: string;
}

export const LightStreak: React.FC<LightStreakProps> = ({
  trigger,
  duration = 40,
  angle = -30,
  color = COLORS.henkelRedLight,
}) => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - trigger;

  if (adjustedFrame < 0 || adjustedFrame > duration) return null;

  const progress = interpolate(adjustedFrame, [0, duration], [0, 1]);
  const xPos = interpolate(progress, [0, 1], [-100, 200]);
  const opacity = interpolate(progress, [0, 0.2, 0.8, 1], [0, 0.8, 0.8, 0]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${xPos}%`,
          width: "200%",
          height: 4,
          background: `linear-gradient(90deg, transparent, ${color}, ${COLORS.white}, ${color}, transparent)`,
          transform: `translateY(-50%) rotate(${angle}deg)`,
          opacity,
          filter: "blur(2px)",
          boxShadow: `0 0 40px ${color}, 0 0 80px ${color}`,
        }}
      />
    </AbsoluteFill>
  );
};

// Glowing orb
interface GlowOrbProps {
  x?: string;
  y?: string;
  size?: number;
  color?: string;
  pulse?: boolean;
}

export const GlowOrb: React.FC<GlowOrbProps> = ({
  x = "50%",
  y = "50%",
  size = 300,
  color = COLORS.henkelRed,
  pulse = true,
}) => {
  const frame = useCurrentFrame();

  const scale = pulse ? 1 + Math.sin(frame * 0.05) * 0.1 : 1;
  const opacity = pulse ? 0.3 + Math.sin(frame * 0.03) * 0.1 : 0.3;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scale(${scale})`,
        background: `radial-gradient(circle, ${color}40 0%, ${color}20 30%, transparent 70%)`,
        filter: `blur(${size * 0.1}px)`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// Screen shake effect (returns transform string)
export const useScreenShake = (
  trigger: number,
  duration: number = 15,
  intensity: number = 10
): string => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - trigger;

  if (adjustedFrame < 0 || adjustedFrame > duration) return "none";

  const decay = interpolate(adjustedFrame, [0, duration], [1, 0]);
  const shakeX = Math.sin(adjustedFrame * 3) * intensity * decay;
  const shakeY = Math.cos(adjustedFrame * 4) * intensity * decay;
  const rotation = Math.sin(adjustedFrame * 5) * 0.5 * decay;

  return `translate(${shakeX}px, ${shakeY}px) rotate(${rotation}deg)`;
};

// Circular reveal mask
interface CircularRevealProps {
  children: React.ReactNode;
  trigger: number;
  duration?: number;
  originX?: string;
  originY?: string;
}

export const CircularReveal: React.FC<CircularRevealProps> = ({
  children,
  trigger,
  duration = 30,
  originX = "50%",
  originY = "50%",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const adjustedFrame = Math.max(0, frame - trigger);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const radius = interpolate(progress, [0, 1], [0, 150]);

  return (
    <div
      style={{
        clipPath: `circle(${radius}% at ${originX} ${originY})`,
      }}
    >
      {children}
    </div>
  );
};
