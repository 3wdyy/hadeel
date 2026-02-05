import React from 'react';
import { useCurrentFrame, staticFile, interpolate, Img } from 'remotion';
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
const CELL_RADIUS = 12;

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
          border: '1px solid rgba(225, 0, 15, 0.15)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Img
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
      <div
        style={{
          position: 'relative',
          width: GRID_WIDTH,
          height: GRID_HEIGHT,
        }}
      >
        {prevRound && crossProgress < 1 && prevRound.photos.map((p, i) =>
          renderCell(p, i, currentRoundIdx - 1, 1 - crossProgress)
        )}
        {currentRound.photos.map((p, i) =>
          renderCell(p, i, currentRoundIdx, currentRoundIdx === 0 ? fadeIn(frame, currentRound.start, 20) : crossProgress)
        )}
      </div>

      {/* Label bar - glassmorphic pill */}
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
            background: COLORS.glassBg,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            padding: '10px 36px',
            borderRadius: 24,
            border: `1px solid rgba(225, 0, 15, 0.25)`,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          }}
        >
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 28,
              fontWeight: 600,
              color: COLORS.iceWhite,
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {currentRound.label}
          </span>
        </div>
      </div>
    </div>
  );
};
