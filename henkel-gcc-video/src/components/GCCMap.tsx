import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { makeSpring } from '../config/animation';
import { COLORS } from '../config/brand';

// Simplified SVG paths for GCC countries (Arabian Peninsula)
// These are approximate but recognizable outlines
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

// Water path for Persian Gulf
const GULF_PATH = 'M 420 60 L 445 45 L 470 50 L 480 70 L 490 80 L 510 85 L 520 100 L 530 120 L 540 150 L 550 170 L 560 180 L 580 160 L 590 150 L 540 180 L 520 120 L 500 100 L 480 80 Z';

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
      {/* Gulf water */}
      <path
        d={GULF_PATH}
        fill={COLORS.gulfWater}
        stroke="none"
        opacity={0.3}
      />

      {/* Country paths */}
      {Object.entries(GCC_PATHS).map(([code, data]) => {
        const isActive = activatedCountries.includes(code);
        return (
          <path
            key={code}
            d={data.path}
            fill={isActive ? COLORS.sandHighlight : COLORS.countryInactive}
            stroke={COLORS.countryBorder}
            strokeWidth={1}
            style={{
              transition: 'none', // All animation via Remotion
            }}
          />
        );
      })}

      {/* Red pin markers */}
      {showPins.map((code) => {
        const data = GCC_PATHS[code];
        if (!data) return null;
        const [cx, cy] = data.center;
        return (
          <g key={`pin-${code}`}>
            {/* Pin shadow */}
            <ellipse cx={cx} cy={cy + 8} rx={6} ry={3} fill="rgba(0,0,0,0.2)" />
            {/* Pin body */}
            <circle cx={cx} cy={cy - 6} r={10} fill={COLORS.henkelRed} />
            <circle cx={cx} cy={cy - 6} r={14} fill="rgba(225,0,15,0.2)" />
            {/* Pin point */}
            <polygon
              points={`${cx - 5},${cy - 2} ${cx + 5},${cy - 2} ${cx},${cy + 6}`}
              fill={COLORS.henkelRed}
            />
            {/* Inner highlight */}
            <circle cx={cx - 2} cy={cy - 8} r={3} fill="rgba(255,255,255,0.3)" />
          </g>
        );
      })}
    </svg>
  );
};

export { GCC_PATHS };
