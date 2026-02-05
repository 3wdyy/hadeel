import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from '@vnedyalk0v/react19-simple-maps';
import { pinDrop } from '../config/animation';
import { COLORS } from '../config/brand';
import type { NationalityPin } from '../config/data';
import { GCC_CENTER } from '../config/data';
import { useTopoJson } from '../hooks/useTopoJson';

const gccCoords: [number, number] = [GCC_CENTER.lng, GCC_CENTER.lat];

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
  const topoData = useTopoJson();

  // Arc stroke-draw progress (all arcs animate together)
  const arcProgress = frame >= arcStartFrame
    ? interpolate(frame, [arcStartFrame, arcStartFrame + arcDuration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const arcPathLength = 1000;

  if (!topoData) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -55%)',
        width: 1620,
        height: 810,
      }}
    >
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: 147,
          center: [0, 0] as any,
        }}
        width={800}
        height={400}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Country geometries */}
        <Geographies geography={topoData}>
          {({ geographies }: { geographies: any[] }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey || geo.id}
                geography={geo}
                fill="#3A3A3A"
                stroke="#555555"
                strokeWidth={0.3}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {/* Connection arcs (geodesic great-circle lines) */}
        {frame >= arcStartFrame &&
          pins.map((pin, i) => (
            <Line
              key={`arc-${i}`}
              from={[pin.lng, pin.lat] as any}
              to={gccCoords as any}
              stroke={COLORS.henkelRed}
              strokeWidth={1}
              strokeLinecap="round"
              strokeDasharray={arcPathLength}
              strokeDashoffset={arcPathLength * (1 - arcProgress)}
              opacity={0.35}
            />
          ))}

        {/* Nationality pins */}
        {pins.map((pin, i) => {
          const pinFrame = pinStartFrame + i * pinStagger;
          if (frame < pinFrame) return null;

          const anim = pinDrop(frame, fps, pinFrame);

          return (
            <Marker key={`pin-${i}`} coordinates={[pin.lng, pin.lat] as any}>
              <g
                style={{
                  opacity: anim.opacity,
                  transform: `translateY(${anim.translateY}px) scale(${anim.scale})`,
                  transformBox: 'fill-box' as any,
                  transformOrigin: 'center center',
                }}
              >
                <circle cx={0} cy={0} r={4} fill="rgba(225,0,15,0.3)" />
                <circle cx={0} cy={0} r={2.5} fill={COLORS.henkelRed} />
                <circle cx={-0.5} cy={-0.5} r={1} fill="rgba(255,255,255,0.3)" />
              </g>
            </Marker>
          );
        })}

        {/* GCC center indicator */}
        <Marker coordinates={gccCoords as any}>
          <circle cx={0} cy={0} r={3} fill={COLORS.warmGold} opacity={0.6} />
        </Marker>
      </ComposableMap>
    </div>
  );
};
