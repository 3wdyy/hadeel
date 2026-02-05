import React from 'react';
import { useCurrentFrame, staticFile, interpolate } from 'remotion';
import { kenBurns, fadeIn } from '../config/animation';
import type { KenBurnsType } from '../config/animation';
import { FONT_FAMILY, COLORS } from '../config/brand';

interface PhotoGridRound {
  label: string;
  photos: string[];
  start: number;
  end: number;
}

interface PhotoGridProps {
  rounds: PhotoGridRound[];
  kenBurnsTypes?: KenBurnsType[][];
}

const GRID_WIDTH = 900;
const GRID_HEIGHT = 675;
const CELL_GAP = 12;
const CELL_WIDTH = (GRID_WIDTH - CELL_GAP) / 2;
const CELL_HEIGHT = (GRID_HEIGHT - CELL_GAP) / 2;
const CELL_RADIUS = 8;

const DEFAULT_KB_TYPES: KenBurnsType[][] = [
  ['zoom_in', 'zoom_out', 'pan_right', 'zoom_in'],
  ['zoom_in', 'zoom_out', 'pan_left', 'zoom_in'],
  ['zoom_out', 'zoom_in', 'pan_right', 'zoom_in'],
];

export const PhotoGrid: React.FC<PhotoGridProps> = ({
  rounds,
  kenBurnsTypes = DEFAULT_KB_TYPES,
}) => {
  const frame = useCurrentFrame();

  // Find current and previous round
  let currentRoundIdx = -1;
  for (let i = rounds.length - 1; i >= 0; i--) {
    if (frame >= rounds[i].start) {
      currentRoundIdx = i;
      break;
    }
  }

  if (currentRoundIdx < 0) return null;

  const currentRound = rounds[currentRoundIdx];
  const prevRound = currentRoundIdx > 0 ? rounds[currentRoundIdx - 1] : null;

  // Crossfade duration
  const crossDur = 20;
  const crossProgress = interpolate(
    frame,
    [currentRound.start, currentRound.start + crossDur],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const positions = [
    { top: 0, left: 0 },
    { top: 0, left: CELL_WIDTH + CELL_GAP },
    { top: CELL_HEIGHT + CELL_GAP, left: 0 },
    { top: CELL_HEIGHT + CELL_GAP, left: CELL_WIDTH + CELL_GAP },
  ];

  const renderCell = (photoPath: string, idx: number, roundIdx: number, opacity: number) => {
    const kbTypes = kenBurnsTypes[roundIdx] || DEFAULT_KB_TYPES[0];
    const roundData = rounds[roundIdx];
    const kb = kenBurns(frame, roundData.start, roundData.end - roundData.start, kbTypes[idx]);
    const pos = positions[idx];

    return (
      <div
        key={`${roundIdx}-${idx}`}
        style={{
          position: 'absolute',
          top: pos.top,
          left: pos.left,
          width: CELL_WIDTH,
          height: CELL_HEIGHT,
          overflow: 'hidden',
          borderRadius: CELL_RADIUS,
          opacity,
        }}
      >
        <img
          src={staticFile(photoPath)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${kb.scale}) translate(${kb.translateX}px, ${kb.translateY}px)`,
          }}
        />
      </div>
    );
  };

  // Label
  const labelOpacity = fadeIn(frame, currentRound.start + 5, 15);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -52%)',
      }}
    >
      {/* Grid container */}
      <div
        style={{
          position: 'relative',
          width: GRID_WIDTH,
          height: GRID_HEIGHT,
        }}
      >
        {/* Previous round fading out */}
        {prevRound && crossProgress < 1 && prevRound.photos.map((p, i) =>
          renderCell(p, i, currentRoundIdx - 1, 1 - crossProgress)
        )}

        {/* Current round fading in */}
        {currentRound.photos.map((p, i) =>
          renderCell(p, i, currentRoundIdx, currentRoundIdx === 0 ? fadeIn(frame, currentRound.start, 20) : crossProgress)
        )}
      </div>

      {/* Label bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 40,
          opacity: labelOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(225, 0, 15, 0.85)',
            padding: '8px 32px',
            borderRadius: 20,
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 28,
              fontWeight: 600,
              color: COLORS.white,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {currentRound.label}
          </span>
        </div>
      </div>
    </div>
  );
};
