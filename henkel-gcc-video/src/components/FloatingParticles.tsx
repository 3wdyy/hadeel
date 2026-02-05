import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from '../config/brand';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  maxOpacity?: number;
  startFrame?: number;
  duration?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 15,
  color = COLORS.warmGold,
  maxOpacity = 0.4,
  startFrame = 0,
  duration = 300,
}) => {
  const frame = useCurrentFrame();

  // Generate stable random particle configs
  const particles = useMemo(() => {
    const seed = 42;
    const rng = (i: number) => {
      const x = Math.sin(seed + i * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };

    return Array.from({ length: count }, (_, i) => ({
      x: rng(i * 3) * 100,             // % from left
      size: 3 + rng(i * 3 + 1) * 3,    // 3-6px
      delayFrames: Math.floor(rng(i * 3 + 2) * duration * 0.7),
      lifeDuration: 90 + Math.floor(rng(i * 5) * 60), // 90-150 frames
      driftAmplitude: 5 + rng(i * 7) * 10,
      travelY: 100 + rng(i * 11) * 100,  // 100-200px travel
    }));
  }, [count, duration]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const particleFrame = frame - startFrame - p.delayFrames;
        // Loop particles
        const loopedFrame = particleFrame >= 0
          ? particleFrame % (p.lifeDuration + 30)
          : -1;

        if (loopedFrame < 0) return null;

        const opacity = interpolate(
          loopedFrame,
          [0, p.lifeDuration * 0.2, p.lifeDuration * 0.8, p.lifeDuration],
          [0, maxOpacity, maxOpacity, 0],
          { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' },
        );

        const translateY = interpolate(
          loopedFrame,
          [0, p.lifeDuration],
          [0, -p.travelY],
          { extrapolateRight: 'clamp' },
        );

        const translateX = Math.sin(loopedFrame * 0.05) * p.driftAmplitude;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              bottom: '10%',
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: color,
              opacity,
              transform: `translate(${translateX}px, ${translateY}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
