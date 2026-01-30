import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, random } from "remotion";
import { COLORS } from "../config";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  delay: number;
}

interface ParticlesProps {
  count?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  direction?: "up" | "down" | "random";
  seed?: string;
}

export const Particles: React.FC<ParticlesProps> = ({
  count = 50,
  color = COLORS.henkelRed,
  minSize = 2,
  maxSize = 6,
  speed = 1,
  direction = "up",
  seed = "particles",
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: random(`${seed}-x-${i}`) * 100,
      y: random(`${seed}-y-${i}`) * 100,
      size: minSize + random(`${seed}-size-${i}`) * (maxSize - minSize),
      speed: 0.5 + random(`${seed}-speed-${i}`) * speed,
      opacity: 0.3 + random(`${seed}-opacity-${i}`) * 0.7,
      delay: random(`${seed}-delay-${i}`) * 60,
    }));
  }, [count, minSize, maxSize, speed, seed]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((particle) => {
        const adjustedFrame = Math.max(0, frame - particle.delay);
        let yOffset = 0;

        if (direction === "up") {
          yOffset = -(adjustedFrame * particle.speed * 0.5) % 120;
        } else if (direction === "down") {
          yOffset = (adjustedFrame * particle.speed * 0.5) % 120;
        } else {
          yOffset = Math.sin(adjustedFrame * 0.02 * particle.speed) * 20;
        }

        const xDrift = Math.sin(adjustedFrame * 0.01 + particle.id) * 10;
        const pulse = 0.8 + Math.sin(adjustedFrame * 0.05 + particle.id) * 0.2;

        const fadeIn = interpolate(adjustedFrame, [0, 30], [0, 1], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: particle.opacity * pulse * fadeIn,
              transform: `translate(${xDrift}px, ${yOffset}px)`,
              boxShadow: `0 0 ${particle.size * 2}px ${color}`,
              filter: "blur(0.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Floating dots that create depth
export const FloatingDots: React.FC<{ color?: string; count?: number }> = ({
  color = COLORS.whiteAlpha20,
  count = 30,
}) => {
  const frame = useCurrentFrame();

  const dots = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: random(`dot-x-${i}`) * 100,
      y: random(`dot-y-${i}`) * 100,
      size: 1 + random(`dot-size-${i}`) * 3,
      phase: random(`dot-phase-${i}`) * Math.PI * 2,
    }));
  }, [count]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {dots.map((dot) => {
        const float = Math.sin(frame * 0.02 + dot.phase) * 15;
        const opacity = 0.3 + Math.sin(frame * 0.03 + dot.phase) * 0.3;

        return (
          <div
            key={dot.id}
            style={{
              position: "absolute",
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity,
              transform: `translateY(${float}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
