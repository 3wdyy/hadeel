import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY, GRADIENTS } from '../config/brand';
import { S7 } from '../config/timing';
import { NATIONALITY_PINS, SCENE7A_TEXT, SCENE7B_TEXT } from '../config/data';
import { fadeIn, fadeOut, scaleIn, slideUpIn, driftingOrb } from '../config/animation';
import { WorldMap } from '../components/WorldMap';
import { TextGlow } from '../components/TextGlow';
import { FloatingParticles } from '../components/FloatingParticles';

export const Scene7_Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isWorldMapPhase = frame < S7.brandCloseStart;
  const isBrandClose = frame >= S7.brandCloseStart;

  // ─── Phase 7A: World Map ───
  const worldMapOpacity = isWorldMapPhase
    ? fadeIn(frame, S7.worldMapStart, 20) *
      (frame >= S7.worldMapEnd - 20 ? fadeOut(frame, S7.worldMapEnd - 20, 20) : 1)
    : 0;

  // ─── Phase 7B: Brand Close ───
  const whiteOverlay = frame >= S7.fadeToWhiteStart
    ? interpolate(frame, [S7.fadeToWhiteStart, S7.fadeToWhiteEnd], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const orb = driftingOrb(frame, 0.004, 15, 50, 50);

  return (
    <AbsoluteFill>
      {/* ── Phase 7A: World Map ── */}
      {isWorldMapPhase && (
        <AbsoluteFill style={{ opacity: worldMapOpacity }}>
          <AbsoluteFill style={{ background: GRADIENTS.cinematicWarm }} />
          <Img
            src={staticFile('backgrounds/bg-dark-premium.png')}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }}
          />
          <AbsoluteFill style={{ background: GRADIENTS.vignette, pointerEvents: 'none' }} />

          <WorldMap
            pins={NATIONALITY_PINS}
            pinStartFrame={S7.pinCascadeStart}
            pinStagger={S7.pinStagger}
            arcStartFrame={S7.arcDrawStart}
            arcDuration={S7.arcDrawDuration}
            textAppearFrame={S7.mapTextAppear}
          />

          {/* "18 Nationalities. One Team." */}
          {frame >= S7.mapTextAppear && (
            <div style={{
              position: 'absolute', width: '100%', top: '80%',
              display: 'flex', justifyContent: 'center',
              opacity: fadeIn(frame, S7.mapTextAppear, 20),
              transform: `translateY(${slideUpIn(frame, fps, S7.mapTextAppear, 20)}px)`,
            }}>
              <div style={{
                background: COLORS.glassBg,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '14px 48px',
                borderRadius: 8,
                border: `1px solid ${COLORS.glassBorder}`,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
              }}>
                <TextGlow
                  text={SCENE7A_TEXT}
                  fontSize={TYPOGRAPHY.worldMapText.fontSize}
                  fontWeight={TYPOGRAPHY.worldMapText.fontWeight}
                  color={COLORS.iceWhite}
                  glowColor="rgba(255, 255, 255, 0.2)"
                  glowIntensity={1.2}
                />
              </div>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ── Phase 7B: Brand Close ── */}
      {isBrandClose && (
        <AbsoluteFill>
          <AbsoluteFill style={{ background: GRADIENTS.brandRed }} />
          <Img
            src={staticFile('backgrounds/bg-red-texture.png')}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
          />

          <AbsoluteFill style={{
            background: `radial-gradient(ellipse at ${orb.x}% ${orb.y}%, rgba(255, 255, 255, 0.06) 0%, transparent 50%)`,
            pointerEvents: 'none',
          }} />

          <AbsoluteFill style={{ background: GRADIENTS.vignette, pointerEvents: 'none' }} />

          <FloatingParticles
            count={20}
            color="rgba(255, 255, 255, 0.5)"
            maxOpacity={0.25}
            startFrame={S7.brandCloseStart}
            duration={S7.fadeToWhiteEnd - S7.brandCloseStart}
          />

          {/* Closing text */}
          {frame >= S7.closingTextAppear && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: fadeIn(frame, S7.closingTextAppear, 20),
              transform: `scale(${scaleIn(frame, fps, S7.closingTextAppear, 0.9, 'cinematic')})`,
            }}>
              <TextGlow
                text={SCENE7B_TEXT}
                fontSize={TYPOGRAPHY.hero.fontSize}
                fontWeight={TYPOGRAPHY.hero.fontWeight}
                color={COLORS.iceWhite}
                glowColor="rgba(255, 255, 255, 0.3)"
                glowIntensity={2}
              />
            </div>
          )}

          <AbsoluteFill style={{ backgroundColor: COLORS.white, opacity: whiteOverlay }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
