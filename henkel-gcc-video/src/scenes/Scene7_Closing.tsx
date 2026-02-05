import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY } from '../config/brand';
import { S7 } from '../config/timing';
import { NATIONALITY_PINS, SCENE7A_TEXT, SCENE7B_TEXT } from '../config/data';
import { fadeIn, scaleIn, slideUpIn } from '../config/animation';
import { WorldMap } from '../components/WorldMap';
import { TextGlow } from '../components/TextGlow';

export const Scene7_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isWorldMapPhase = frame < S7.brandCloseStart;
  const isBrandClose = frame >= S7.brandCloseStart;

  // ─── Phase 7A: World Map ───
  const worldMapOpacity = isWorldMapPhase
    ? fadeIn(frame, S7.worldMapStart, 20) *
      (frame >= S7.worldMapEnd - 20 ? interpolate(frame, [S7.worldMapEnd - 20, S7.worldMapEnd], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1)
    : 0;

  // ─── Phase 7B: Brand Close ───
  // Fade to white
  const whiteOverlay = frame >= S7.fadeToWhiteStart
    ? interpolate(frame, [S7.fadeToWhiteStart, S7.fadeToWhiteEnd], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <AbsoluteFill>
      {/* ── Phase 7A: World Map ── */}
      {isWorldMapPhase && (
        <AbsoluteFill
          style={{
            opacity: worldMapOpacity,
          }}
        >
          <Img
            src={staticFile('backgrounds/bg-dark-premium.png')}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* World map with pins */}
          <WorldMap
            pins={NATIONALITY_PINS}
            pinStartFrame={S7.pinCascadeStart}
            pinStagger={S7.pinStagger}
            arcStartFrame={S7.arcDrawStart}
            arcDuration={S7.arcDrawDuration}
            textAppearFrame={S7.mapTextAppear}
          />

          {/* "17 Nationalities. One Team." text */}
          {frame >= S7.mapTextAppear && (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                top: '80%',
                display: 'flex',
                justifyContent: 'center',
                opacity: fadeIn(frame, S7.mapTextAppear, 20),
                transform: `translateY(${slideUpIn(frame, fps, S7.mapTextAppear, 20)}px)`,
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '12px 40px',
                  borderRadius: 4,
                }}
              >
                <TextGlow
                  text={SCENE7A_TEXT}
                  fontSize={TYPOGRAPHY.worldMapText.fontSize}
                  fontWeight={TYPOGRAPHY.worldMapText.fontWeight}
                  color={COLORS.white}
                  glowColor="rgba(255, 255, 255, 0.15)"
                />
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ── Phase 7B: Brand Close ── */}
      {isBrandClose && (
        <AbsoluteFill>
          <Img
            src={staticFile('backgrounds/bg-red-texture.png')}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Closing text */}
          {frame >= S7.closingTextAppear && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: fadeIn(frame, S7.closingTextAppear, 20),
                transform: `scale(${scaleIn(frame, fps, S7.closingTextAppear, 0.9)})`,
              }}
            >
              <TextGlow
                text={SCENE7B_TEXT}
                fontSize={TYPOGRAPHY.hero.fontSize}
                fontWeight={TYPOGRAPHY.hero.fontWeight}
                color={COLORS.white}
                glowColor="rgba(255, 255, 255, 0.15)"
              />
            </div>
          )}

          {/* Fade to white overlay */}
          <AbsoluteFill
            style={{
              backgroundColor: COLORS.white,
              opacity: whiteOverlay,
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
