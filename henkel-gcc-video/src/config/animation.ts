// ═══════════════════════════════════════════
// ANIMATION SYSTEM — Springs, easing, utilities
// ═══════════════════════════════════════════

import { spring, interpolate, Easing } from 'remotion';

// ─── Spring Presets ───
export const SPRING_PRESETS = {
  snappy: { damping: 15, mass: 0.4, stiffness: 200, overshootClamping: false },
  gentle: { damping: 14, mass: 0.6, stiffness: 120, overshootClamping: false },
  bouncy: { damping: 8, mass: 0.8, stiffness: 150, overshootClamping: false },
  slowReveal: { damping: 20, mass: 1.0, stiffness: 80, overshootClamping: true },
} as const;

type SpringPreset = keyof typeof SPRING_PRESETS;

// ─── Spring helper ───
export function makeSpring(
  frame: number,
  fps: number,
  startFrame: number,
  preset: SpringPreset = 'snappy',
) {
  const config = SPRING_PRESETS[preset];
  return spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: config.damping,
      mass: config.mass,
      stiffness: config.stiffness,
      overshootClamping: config.overshootClamping,
    },
  });
}

// ─── Fade in ───
export function fadeIn(frame: number, startFrame: number, duration: number = 15) {
  return interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

// ─── Fade out ───
export function fadeOut(frame: number, startFrame: number, duration: number = 15) {
  return interpolate(frame, [startFrame, startFrame + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

// ─── Slide up with spring ───
export function slideUpIn(
  frame: number,
  fps: number,
  startFrame: number,
  distance: number = 40,
  preset: SpringPreset = 'snappy',
) {
  const s = makeSpring(frame, fps, startFrame, preset);
  return interpolate(s, [0, 1], [distance, 0]);
}

// ─── Scale in ───
export function scaleIn(
  frame: number,
  fps: number,
  startFrame: number,
  from: number = 0.85,
  preset: SpringPreset = 'snappy',
) {
  const s = makeSpring(frame, fps, startFrame, preset);
  return interpolate(s, [0, 1], [from, 1]);
}

// ─── Scale pulse (1.0 → peak → 1.0) ───
export function scalePulse(
  frame: number,
  startFrame: number,
  duration: number = 20,
  peak: number = 1.05,
) {
  const mid = startFrame + duration / 2;
  if (frame < startFrame) return 1;
  if (frame < mid) {
    return interpolate(frame, [startFrame, mid], [1, peak], { extrapolateRight: 'clamp' });
  }
  return interpolate(frame, [mid, startFrame + duration], [peak, 1], { extrapolateRight: 'clamp' });
}

// ─── Counter animate (0 → target with easeOut) ───
export function counterAnimate(
  frame: number,
  startFrame: number,
  target: number,
  duration: number = 45,
) {
  if (frame < startFrame) return 0;
  return interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, target],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  );
}

// ─── Ken Burns variations ───
export type KenBurnsType = 'zoom_in' | 'zoom_out' | 'pan_right' | 'pan_left';

export function kenBurns(
  frame: number,
  startFrame: number,
  duration: number,
  type: KenBurnsType = 'zoom_in',
): { scale: number; translateX: number; translateY: number } {
  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  switch (type) {
    case 'zoom_in':
      return { scale: 1 + progress * 0.08, translateX: 0, translateY: 0 };
    case 'zoom_out':
      return { scale: 1.08 - progress * 0.08, translateX: 0, translateY: 0 };
    case 'pan_right':
      return { scale: 1.02, translateX: progress * 15, translateY: 0 };
    case 'pan_left':
      return { scale: 1.02, translateX: -progress * 15, translateY: 0 };
  }
}

// ─── Pin drop animation ───
export function pinDrop(
  frame: number,
  fps: number,
  startFrame: number,
) {
  const s = makeSpring(frame, fps, startFrame, 'bouncy');
  const opacity = fadeIn(frame, startFrame, 5);
  const translateY = interpolate(s, [0, 1], [-60, 0]);
  const scale = interpolate(s, [0, 1], [1.3, 1.0]);
  return { opacity, translateY, scale };
}

// ─── Stroke draw for SVG paths ───
export function strokeDraw(
  frame: number,
  startFrame: number,
  duration: number = 40,
  pathLength: number = 1000,
) {
  const offset = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [pathLength, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    },
  );
  return { strokeDasharray: pathLength, strokeDashoffset: offset };
}
