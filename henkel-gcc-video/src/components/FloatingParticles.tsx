import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { COLORS } from '../config/brand';
import { twinkle } from '../config/animation';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  maxOpacity?: number;
  startFrame?: number;
  duration?: number;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 30,
  color = COLORS.warmGold,
  maxOpacity = 0.5,
  startFrame = 0,
  duration = 300,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const seed = 42;
    const rng = (i: number) => {
      const x = Math.sin(seed + i * 127.1) * 43758.5453;
      return x - Math.floor(x);
    };

    return Array.from({ length: count }, (_, i) => ({
      x: rng(i * 3) * 100,
      baseSize: 2 + rng(i * 3 + 1) * 8,
      delayFrames: Math.floor(rng(i * 3 + 2) * duration * 0.7),
      lifeDuration: 90 + Math.floor(rng(i * 5) * 80),
      driftAmplitude: 8 + rng(i * 7) * 15,
      travelY: 120 + rng(i * 11) * 150,
      glowSize: 3 + rng(i * 13) * 4,
    }));
  }, [count, duration]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => {
        const particleFrame = frame - startFrame - p.delayFrames;
        const loopedFrame = particleFrame >= 0
          ? particleFrame % (p.lifeDuration + 30)
          : -1;

        if (loopedFrame < 0) return null;

        const baseOpacity = interpolate(
          loopedFrame,
          [0, p.lifeDuration * 0.15, p.lifeDuration * 0.75, p.lifeDuration],
          [0, maxOpacity, maxOpacity, 0],
          { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' },
        );

        const opacity = baseOpacity * twinkle(frame, i);

        const translateY = interpolate(
          loopedFrame,
          [0, p.lifeDuration],
          [0, -p.travelY],
          { extrapolateRight: 'clamp' },
        );

        const translateX = Math.sin(loopedFrame * 0.04) * p.driftAmplitude;
        const renderSize = p.baseSize * p.glowSize;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              bottom: '5%',
              width: renderSize,
              height: renderSize,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
              opacity,
              transform: `translate(${translateX}px, ${translateY}px)`,
              filter: `blur(${p.baseSize * 0.2}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
