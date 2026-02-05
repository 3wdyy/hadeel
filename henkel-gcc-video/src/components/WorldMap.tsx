import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { pinDrop, strokeDraw, fadeIn } from '../config/animation';
import { COLORS } from '../config/brand';
import type { NationalityPin } from '../config/data';
import { GCC_CENTER } from '../config/data';

// Simplified world map SVG paths (major continents outlines)
// Using Equirectangular-like projection for simplicity
function latLngToXY(lat: number, lng: number, width: number, height: number): [number, number] {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

// Simplified continent outlines for visual effect
const CONTINENT_PATHS = [
  // North America (simplified)
  'M 80 120 L 130 100 L 180 80 L 220 90 L 240 120 L 230 160 L 200 200 L 170 230 L 150 250 L 120 240 L 100 200 L 80 170 Z',
  // South America (simplified)
  'M 200 280 L 230 260 L 250 280 L 260 320 L 250 370 L 230 400 L 210 420 L 190 400 L 185 350 L 190 310 Z',
  // Europe (simplified)
  'M 440 80 L 470 70 L 510 75 L 530 90 L 540 110 L 520 130 L 490 135 L 460 130 L 440 115 L 435 95 Z',
  // Africa (simplified)
  'M 440 150 L 470 140 L 510 150 L 530 180 L 540 220 L 530 280 L 510 320 L 480 340 L 460 330 L 440 290 L 430 240 L 430 190 Z',
  // Asia (simplified)
  'M 530 60 L 600 50 L 680 60 L 740 80 L 780 100 L 800 130 L 790 160 L 760 180 L 720 190 L 680 180 L 640 170 L 600 160 L 560 150 L 540 130 L 530 100 Z',
  // Middle East (highlighted area)
  'M 530 130 L 560 120 L 580 130 L 590 150 L 580 170 L 560 175 L 540 170 L 530 155 Z',
  // India/South Asia
  'M 620 160 L 650 150 L 670 170 L 660 210 L 640 230 L 620 220 L 615 190 Z',
  // Southeast Asia
  'M 700 170 L 740 160 L 770 180 L 780 210 L 760 230 L 730 220 L 710 200 Z',
  // Australia
  'M 740 300 L 790 290 L 820 310 L 820 340 L 800 360 L 760 350 L 740 330 Z',
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
  textAppearFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mapWidth = 900;
  const mapHeight = 450;

  const [gccX, gccY] = latLngToXY(GCC_CENTER.lat, GCC_CENTER.lng, mapWidth, mapHeight);

  // Generate arc path between two points
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
      {/* Continent outlines */}
      {CONTINENT_PATHS.map((path, i) => (
        <path
          key={i}
          d={path}
          fill="#3A3A3A"
          stroke="#555555"
          strokeWidth={0.5}
        />
      ))}

      {/* Connection arcs */}
      {pins.map((pin, i) => {
        const [px, py] = latLngToXY(pin.lat, pin.lng, mapWidth, mapHeight);
        const arcPath = getArcPath(px, py, gccX, gccY);

        // Estimate path length
        const dx = gccX - px;
        const dy = gccY - py;
        const estimatedLength = Math.sqrt(dx * dx + dy * dy) * 1.5;

        const draw = strokeDraw(frame, arcStartFrame, arcDuration, estimatedLength);

        if (frame < arcStartFrame) return null;

        return (
          <path
            key={`arc-${i}`}
            d={arcPath}
            fill="none"
            stroke={COLORS.henkelRed}
            strokeWidth={1}
            opacity={0.3}
            strokeDasharray={draw.strokeDasharray}
            strokeDashoffset={draw.strokeDashoffset}
          />
        );
      })}

      {/* Nationality pins */}
      {pins.map((pin, i) => {
        const pinFrame = pinStartFrame + i * pinStagger;
        const [px, py] = latLngToXY(pin.lat, pin.lng, mapWidth, mapHeight);

        if (frame < pinFrame) return null;

        const anim = pinDrop(frame, fps, pinFrame);

        return (
          <g
            key={`pin-${i}`}
            style={{
              opacity: anim.opacity,
              transform: `translate(${px}px, ${py + anim.translateY}px) scale(${anim.scale})`,
              transformOrigin: `${px}px ${py}px`,
            }}
          >
            {/* Outer glow */}
            <circle cx={0} cy={0} r={7} fill="rgba(225,0,15,0.3)" />
            {/* Main dot */}
            <circle cx={0} cy={0} r={5} fill={COLORS.henkelRed} />
            {/* Inner highlight */}
            <circle cx={-1} cy={-1} r={2} fill="rgba(255,255,255,0.3)" />
          </g>
        );
      })}

      {/* GCC center indicator */}
      <circle cx={gccX} cy={gccY} r={3} fill={COLORS.warmGold} opacity={0.6} />
    </svg>
  );
};
