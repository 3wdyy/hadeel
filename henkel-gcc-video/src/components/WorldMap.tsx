import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { pinDrop, strokeDraw, fadeIn, pulseRing } from '../config/animation';
import { COLORS } from '../config/brand';
import type { NationalityPin } from '../config/data';
import { GCC_CENTER } from '../config/data';

function latLngToXY(lat: number, lng: number, width: number, height: number): [number, number] {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

// Improved continent outlines
const CONTINENT_PATHS = [
  // North America
  'M 60 100 L 90 80 L 130 70 L 170 65 L 210 75 L 240 95 L 250 120 L 240 155 L 215 185 L 190 210 L 170 235 L 155 250 L 140 245 L 120 230 L 105 210 L 90 185 L 75 155 L 65 130 Z',
  // South America
  'M 195 275 L 220 260 L 245 270 L 255 295 L 260 330 L 255 365 L 245 395 L 230 415 L 215 425 L 200 415 L 195 385 L 190 350 L 188 315 Z',
  // Europe
  'M 430 65 L 455 55 L 485 60 L 515 65 L 535 80 L 540 100 L 530 120 L 510 130 L 485 135 L 460 130 L 440 115 L 435 90 Z',
  // Africa
  'M 435 150 L 465 140 L 500 145 L 530 160 L 545 190 L 550 230 L 545 275 L 530 310 L 510 335 L 485 345 L 465 340 L 445 315 L 435 280 L 430 240 L 430 200 Z',
  // Asia
  'M 535 55 L 580 45 L 640 50 L 700 60 L 750 80 L 790 100 L 800 130 L 795 160 L 770 180 L 730 190 L 690 185 L 650 175 L 610 165 L 575 155 L 550 140 L 540 115 L 535 85 Z',
  // Middle East (highlighted)
  'M 530 120 L 555 112 L 575 120 L 585 140 L 580 165 L 560 172 L 542 168 L 532 150 Z',
  // South Asia
  'M 618 155 L 645 148 L 668 165 L 660 200 L 645 225 L 625 215 L 618 190 Z',
  // Southeast Asia
  'M 700 168 L 735 158 L 765 175 L 775 205 L 760 225 L 730 218 L 710 198 Z',
  // Australia
  'M 740 298 L 785 288 L 815 305 L 818 335 L 800 355 L 760 348 L 742 328 Z',
];

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
  const mapHeight = 450;

  const [gccX, gccY] = latLngToXY(GCC_CENTER.lat, GCC_CENTER.lng, mapWidth, mapHeight);

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

      {/* Continent outlines */}
      {CONTINENT_PATHS.map((path, i) => {
        const isMiddleEast = i === 5;
        return (
          <path
            key={i}
            d={path}
            fill={isMiddleEast ? 'rgba(225, 0, 15, 0.12)' : COLORS.elevatedSurface}
            stroke={isMiddleEast ? 'rgba(225, 0, 15, 0.3)' : 'rgba(148, 163, 184, 0.12)'}
            strokeWidth={isMiddleEast ? 1 : 0.5}
          />
        );
      })}

      {/* Connection arcs */}
      {pins.map((pin, i) => {
        const [px, py] = latLngToXY(pin.lat, pin.lng, mapWidth, mapHeight);
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
        const [px, py] = latLngToXY(pin.lat, pin.lng, mapWidth, mapHeight);

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
