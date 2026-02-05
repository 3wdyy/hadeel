import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS } from '../config/brand';
import { pulseRing } from '../config/animation';

const GCC_PATHS: Record<string, { path: string; center: [number, number]; labelOffset: [number, number] }> = {
  KSA: {
    path: 'M 280 120 L 340 80 L 420 60 L 480 80 L 520 120 L 540 180 L 560 260 L 540 340 L 500 400 L 460 440 L 400 460 L 340 440 L 300 400 L 260 380 L 220 340 L 200 280 L 220 200 L 260 160 Z',
    center: [380, 260],
    labelOffset: [100, 0],
  },
  UAE: {
    path: 'M 540 180 L 580 160 L 620 170 L 640 200 L 620 230 L 580 240 L 560 260 L 540 220 Z',
    center: [585, 200],
    labelOffset: [80, -20],
  },
  KWT: {
    path: 'M 420 60 L 445 45 L 470 50 L 480 70 L 480 80 L 460 85 L 440 78 L 420 72 Z',
    center: [450, 65],
    labelOffset: [-100, -10],
  },
  OMN: {
    path: 'M 560 260 L 580 240 L 620 230 L 650 260 L 660 310 L 640 370 L 600 420 L 560 440 L 540 400 L 540 340 Z',
    center: [600, 330],
    labelOffset: [80, 0],
  },
  BHR: {
    path: 'M 465 105 L 472 100 L 479 105 L 479 118 L 472 123 L 465 118 Z',
    center: [472, 112],
    labelOffset: [-90, 0],
  },
  QAT: {
    path: 'M 490 100 L 500 90 L 510 95 L 512 115 L 505 125 L 495 120 Z',
    center: [502, 108],
    labelOffset: [70, -10],
  },
};

// Non-self-intersecting gulf water path
const GULF_PATH = 'M 420 60 L 445 45 L 470 50 L 480 70 L 490 80 L 510 85 L 520 100 L 530 120 L 540 150 L 550 170 L 560 180 L 540 220 L 520 180 L 510 150 L 500 130 L 490 115 L 480 100 L 470 85 L 460 75 L 440 68 Z';

interface GCCMapProps {
  activatedCountries: string[];
  showPins: string[];
  mapOpacity?: number;
}

export const GCCMap: React.FC<GCCMapProps> = ({
  activatedCountries,
  showPins,
  mapOpacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <svg
      viewBox="140 0 580 500"
      width="1100"
      height="700"
      style={{ opacity: mapOpacity }}
    >
      <defs>
        <filter id="countryGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values="0 0 0 0 0.88  0 0 0 0 0  0 0 0 0 0.06  0 0 0 0.5 0"
            result="redGlow" />
          <feMerge>
            <feMergeNode in="redGlow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="pinGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>

        <linearGradient id="activeCountryFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E1000F" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF2D3B" stopOpacity="0.15" />
        </linearGradient>

        <radialGradient id="gulfWater" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={COLORS.tealAccent} stopOpacity="0.2" />
          <stop offset="100%" stopColor={COLORS.tealAccent} stopOpacity="0.05" />
        </radialGradient>

        <pattern id="gridDots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="0.5" fill="rgba(148, 163, 184, 0.15)" />
        </pattern>
      </defs>

      {/* Background dot grid */}
      <rect x="140" y="0" width="580" height="500" fill="url(#gridDots)" />

      {/* Gulf water */}
      <path
        d={GULF_PATH}
        fill="url(#gulfWater)"
        stroke={COLORS.tealAccent}
        strokeWidth={0.5}
        strokeOpacity={0.15}
      />

      {/* Country paths */}
      {Object.entries(GCC_PATHS).map(([code, data]) => {
        const isActive = activatedCountries.includes(code);
        return (
          <g key={code}>
            <path
              d={data.path}
              fill={isActive ? 'url(#activeCountryFill)' : COLORS.countryInactive}
              stroke={isActive ? COLORS.countryActiveBorder : COLORS.countryBorder}
              strokeWidth={isActive ? 1.5 : 0.5}
              filter={isActive ? 'url(#countryGlow)' : undefined}
            />
          </g>
        );
      })}

      {/* Pulsing pin markers */}
      {showPins.map((code) => {
        const data = GCC_PATHS[code];
        if (!data) return null;
        const [cx, cy] = data.center;

        const pulse1 = pulseRing(frame, 0, 60, 8, 28);
        const pulse2 = pulseRing(frame, -30, 60, 8, 28);

        return (
          <g key={`pin-${code}`}>
            <circle cx={cx} cy={cy} r={pulse1.radius}
              fill="none" stroke={COLORS.radiantRed} strokeWidth={1.5}
              opacity={pulse1.opacity * 0.7} />
            <circle cx={cx} cy={cy} r={pulse2.radius}
              fill="none" stroke={COLORS.radiantRed} strokeWidth={1}
              opacity={pulse2.opacity * 0.4} />
            <circle cx={cx} cy={cy} r={8} fill={COLORS.radiantRed} filter="url(#pinGlow)" opacity={0.5} />
            <circle cx={cx} cy={cy} r={6} fill={COLORS.henkelRed} />
            <circle cx={cx - 1.5} cy={cy - 1.5} r={2} fill="rgba(255,255,255,0.35)" />
          </g>
        );
      })}
    </svg>
  );
};

export { GCC_PATHS };
