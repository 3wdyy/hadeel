import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { pinDrop, strokeDraw, pulseRing } from '../config/animation';
import { COLORS } from '../config/brand';
import type { NationalityPin } from '../config/data';
import { GCC_CENTER } from '../config/data';
import { WORLD_LAND_PATH, WORLD_GCC_PATHS, WORLD_PROJECTION } from '../data/world-geo';

// NaturalEarth1 projection matching d3-geo's implementation
function projectPoint(lat: number, lng: number): [number, number] {
  const { scale, translate } = WORLD_PROJECTION;
  const lngRad = (lng * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const lat2 = latRad * latRad;
  const lat4 = lat2 * lat2;
  const x = lngRad * (0.8707 - 0.131979 * lat2 + lat4 * (-0.013791 + lat4 * (0.003971 * lat2 - 0.001529 * lat4)));
  const y = latRad * (1.007226 + lat2 * (0.015085 + lat4 * (-0.044475 + 0.028874 * lat2 - 0.005916 * lat4)));
  return [x * scale + translate[0], -y * scale + translate[1]];
}

interface WorldMapProps {
  pins: NationalityPin[];
  pinStartFrame: number;
  pinStagger: number;
  arcStartFrame: number;
  arcDuration: number;
  textAppearFrame: number;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  pins,
  pinStartFrame,
  pinStagger,
  arcStartFrame,
  arcDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapWidth = 900;
  const mapHeight = 460;

  const [gccX, gccY] = projectPoint(GCC_CENTER.lat, GCC_CENTER.lng);

  const getArcPath = (x1: number, y1: number, x2: number, y2: number): string => {
    const midX = (x1 + x2) / 2;
    const midY = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.15;
    return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
  };

  return (
    <svg
      viewBox={`0 0 ${mapWidth} ${mapHeight}`}
      width={mapWidth * 1.8}
      height={mapHeight * 1.8}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -55%)',
      }}
    >
      <defs>
        <filter id="worldPinGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
        <radialGradient id="gccCenterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.warmGold} stopOpacity="0.5" />
          <stop offset="100%" stopColor={COLORS.warmGold} stopOpacity="0" />
        </radialGradient>
        <pattern id="worldGridDots" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
          <circle cx="12.5" cy="12.5" r="0.4" fill="rgba(148, 163, 184, 0.12)" />
        </pattern>
      </defs>

      {/* Background dot grid */}
      <rect width={mapWidth} height={mapHeight} fill="url(#worldGridDots)" />

      {/* Real world land mass */}
      <path
        d={WORLD_LAND_PATH}
        fill={COLORS.elevatedSurface}
        stroke="rgba(148, 163, 184, 0.12)"
        strokeWidth={0.5}
      />

      {/* GCC region highlight */}
      {WORLD_GCC_PATHS.map((path, i) => (
        <path
          key={`gcc-${i}`}
          d={path}
          fill="rgba(225, 0, 15, 0.15)"
          stroke="rgba(225, 0, 15, 0.3)"
          strokeWidth={0.8}
        />
      ))}

      {/* Connection arcs */}
      {pins.map((pin, i) => {
        const [px, py] = projectPoint(pin.lat, pin.lng);
        const arcPath = getArcPath(px, py, gccX, gccY);

        const dx = gccX - px;
        const dy = gccY - py;
        const estimatedLength = Math.sqrt(dx * dx + dy * dy) * 1.5;

        const draw = strokeDraw(frame, arcStartFrame, arcDuration, estimatedLength);

        if (frame < arcStartFrame) return null;

        // Traveling dot position
        const travelProgress = interpolate(
          frame,
          [arcStartFrame, arcStartFrame + arcDuration],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
        );
        const dotX = px + (gccX - px) * travelProgress;
        const dotY = py + (gccY - py) * travelProgress - Math.sin(travelProgress * Math.PI) * Math.abs(dx) * 0.15;

        return (
          <g key={`arc-${i}`}>
            <path
              d={arcPath}
              fill="none"
              stroke={COLORS.henkelRed}
              strokeWidth={1.5}
              opacity={0.25}
              strokeDasharray={draw.strokeDasharray}
              strokeDashoffset={draw.strokeDashoffset}
            />
            {/* Traveling dot */}
            {travelProgress > 0 && travelProgress < 1 && (
              <circle cx={dotX} cy={dotY} r={2.5} fill={COLORS.radiantRed} opacity={0.8} />
            )}
          </g>
        );
      })}

      {/* Nationality pins */}
      {pins.map((pin, i) => {
        const pinFrame = pinStartFrame + i * pinStagger;
        const [px, py] = projectPoint(pin.lat, pin.lng);

        if (frame < pinFrame) return null;

        const anim = pinDrop(frame, fps, pinFrame);
        const pulse = pulseRing(frame, pinFrame, 60, 5, 18);

        return (
          <g key={`pin-${i}`} transform={`translate(${px}, ${py})`}>
            {/* Pulse ring */}
            <circle cx={0} cy={anim.translateY}
              r={pulse.radius} fill="none" stroke={COLORS.radiantRed}
              strokeWidth={1} opacity={anim.opacity * pulse.opacity * 0.5} />
            {/* Glow */}
            <circle cx={0} cy={anim.translateY} r={6}
              fill={COLORS.radiantRed} filter="url(#worldPinGlow)"
              opacity={anim.opacity * 0.4} />
            {/* Core dot */}
            <circle cx={0} cy={anim.translateY} r={4}
              fill={COLORS.henkelRed} opacity={anim.opacity}
              transform={`scale(${anim.scale})`} />
            {/* Highlight */}
            <circle cx={-1} cy={anim.translateY - 1} r={1.5}
              fill="rgba(255,255,255,0.3)" opacity={anim.opacity} />
          </g>
        );
      })}

      {/* GCC center with glow */}
      <circle cx={gccX} cy={gccY} r={15} fill="url(#gccCenterGlow)" />
      <circle cx={gccX} cy={gccY} r={4} fill={COLORS.warmGold} opacity={0.8} />
    </svg>
  );
};
