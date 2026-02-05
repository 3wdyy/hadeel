import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS } from '../config/brand';
import { pulseRing } from '../config/animation';
import { GCC_REAL_PATHS, CONTEXT_PATHS } from '../data/gcc-geo';

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

  return (
    <svg
      viewBox="0 0 750 540"
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
          <stop offset="0%" stopColor="#E1000F" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FF2D3B" stopOpacity="0.18" />
        </linearGradient>

        <pattern id="gridDots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="0.5" fill="rgba(148, 163, 184, 0.15)" />
        </pattern>
      </defs>

      {/* Background dot grid */}
      <rect x="0" y="0" width="750" height="540" fill="url(#gridDots)" />

      {/* Context countries (Iraq, Iran, Yemen, Jordan) - subtle */}
      {Object.entries(CONTEXT_PATHS).map(([code, path]) => (
        <path
          key={`ctx-${code}`}
          d={path}
          fill={COLORS.elevatedSurface}
          stroke="rgba(148, 163, 184, 0.08)"
          strokeWidth={0.5}
          opacity={0.4}
        />
      ))}

      {/* GCC country shapes */}
      {Object.entries(GCC_REAL_PATHS).map(([code, data]) => {
        const isActive = activatedCountries.includes(code);
        return (
          <path
            key={code}
            d={data.path}
            fill={isActive ? 'url(#activeCountryFill)' : COLORS.countryInactive}
            stroke={isActive ? COLORS.countryActiveBorder : COLORS.countryBorder}
            strokeWidth={isActive ? 1.5 : 0.5}
            filter={isActive ? 'url(#countryGlow)' : undefined}
          />
        );
      })}

      {/* Pulsing pin markers */}
      {showPins.map((code) => {
        const data = GCC_REAL_PATHS[code];
        if (!data) return null;
        const [cx, cy] = data.center;

        const pulse1 = pulseRing(frame, 0, 60, 6, 22);
        const pulse2 = pulseRing(frame, -30, 60, 6, 22);

        return (
          <g key={`pin-${code}`}>
            <circle cx={cx} cy={cy} r={pulse1.radius}
              fill="none" stroke={COLORS.radiantRed} strokeWidth={1.5}
              opacity={pulse1.opacity * 0.7} />
            <circle cx={cx} cy={cy} r={pulse2.radius}
              fill="none" stroke={COLORS.radiantRed} strokeWidth={1}
              opacity={pulse2.opacity * 0.4} />
            <circle cx={cx} cy={cy} r={6} fill={COLORS.radiantRed} filter="url(#pinGlow)" opacity={0.5} />
            <circle cx={cx} cy={cy} r={4.5} fill={COLORS.henkelRed} />
            <circle cx={cx - 1} cy={cy - 1} r={1.5} fill="rgba(255,255,255,0.35)" />
          </g>
        );
      })}
    </svg>
  );
};

export { GCC_REAL_PATHS as GCC_PATHS };
