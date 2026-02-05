import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY, GRADIENTS } from '../config/brand';
import { S5 } from '../config/timing';
import { CULTURE_ROUNDS } from '../config/data';
import { fadeIn, fadeOut, slideUpIn, scaleIn, scalePulse, driftingOrb } from '../config/animation';
import { FloatingParticles } from '../components/FloatingParticles';
import { TextGlow } from '../components/TextGlow';
import { PhotoGrid } from '../components/PhotoGrid';

export const Scene5_TeamCulture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDiversityPhase = frame >= S5.diversityStart && frame < S5.diversityEnd;
  const isMontagePhase = frame >= S5.montageStart && frame < S5.montageEnd;
  const isExcomTitlePhase = frame >= S5.excomTitleStart;

  // ─── Phase 5A: Diversity Statement ───
  const diversityOpacity = isDiversityPhase
    ? fadeIn(frame, S5.diversityStart, 15) *
      (frame >= S5.diversityEnd - 20 ? fadeOut(frame, S5.diversityEnd - 20, 20) : 1)
    : 0;

  // ─── Phase 5B: Culture Montage ───
  const montageOpacity = isMontagePhase
    ? fadeIn(frame, S5.montageStart, 20) *
      (frame >= S5.montageEnd - 15 ? fadeOut(frame, S5.montageEnd - 15, 15) : 1)
    : 0;

  const photoRounds = S5.rounds.map((round, i) => ({
    label: round.label,
    photos: CULTURE_ROUNDS[i].photos,
    start: round.start,
    end: round.end,
  }));

  // ─── Phase 5C: ExCom Title ───
  const excomTitleOpacity = isExcomTitlePhase
    ? fadeIn(frame, S5.excomTitleAppear, 12) *
      (frame >= S5.fadeToBlackStart ? fadeOut(frame, S5.fadeToBlackStart, 15) : 1)
    : 0;

  const blackOverlay = frame >= S5.fadeToBlackStart
    ? interpolate(frame, [S5.fadeToBlackStart, S5.fadeToBlackEnd], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Animated background orb
  const orb = driftingOrb(frame, 0.006, 12, 50, 50);

  return (
    <AbsoluteFill>
      {/* ── Phase 5A: Diversity on Brand Red ── */}
      {isDiversityPhase && (
        <AbsoluteFill style={{ opacity: diversityOpacity }}>
          <AbsoluteFill style={{ background: GRADIENTS.brandRed }} />
          <Img
            src={staticFile('backgrounds/bg-red-texture.png')}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
          />

          {/* Animated radial highlight */}
          <AbsoluteFill style={{
            background: `radial-gradient(ellipse at ${orb.x}% ${orb.y}%, rgba(255, 255, 255, 0.06) 0%, transparent 50%)`,
            pointerEvents: 'none',
          }} />

          <AbsoluteFill style={{ background: GRADIENTS.vignette, pointerEvents: 'none' }} />

          <FloatingParticles
            count={20}
            color="rgba(255, 255, 255, 0.5)"
            maxOpacity={0.3}
            startFrame={S5.diversityStart}
            duration={S5.diversityEnd - S5.diversityStart}
          />

          {/* Text stack */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16,
          }}>
            {S5.diversityLines.map((line, i) => {
              if (frame < line.appear) return null;

              const opacity = fadeIn(frame, line.appear, 12);
              const translateY = slideUpIn(frame, fps, line.appear, 40);
              const isEmphasis = line.emphasis;
              const fontSize = isEmphasis ? 68 : TYPOGRAPHY.subheadline.fontSize;
              const fontWeight = isEmphasis ? 700 : TYPOGRAPHY.subheadline.fontWeight;

              const pulse = isEmphasis && frame >= 2140
                ? scalePulse(frame, 2140, 20, 1.05)
                : 1;

              if (isEmphasis) {
                return (
                  <div key={i} style={{
                    opacity,
                    transform: `translateY(${translateY}px) scale(${pulse})`,
                    marginTop: 8,
                  }}>
                    <TextGlow
                      text={line.text}
                      fontSize={fontSize}
                      fontWeight={fontWeight}
                      color={COLORS.iceWhite}
                      glowColor="rgba(255, 255, 255, 0.4)"
                      glowIntensity={2}
                    />
                  </div>
                );
              }

              return (
                <div key={i} style={{
                  opacity,
                  transform: `translateY(${translateY}px)`,
                }}>
                  <span style={{
                    fontFamily: FONT_FAMILY,
                    fontSize,
                    fontWeight,
                    color: COLORS.iceWhite,
                    letterSpacing: TYPOGRAPHY.subheadline.letterSpacing,
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  }}>
                    {line.text}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Phase 5B: Culture Montage on Dark ── */}
      {isMontagePhase && (
        <AbsoluteFill style={{ opacity: montageOpacity }}>
          <AbsoluteFill style={{ background: GRADIENTS.cinematic }} />
          <AbsoluteFill style={{ background: GRADIENTS.vignette, pointerEvents: 'none' }} />
          <PhotoGrid rounds={photoRounds} />
        </AbsoluteFill>
      )}

      {/* ── Phase 5C: ExCom Title on Dark ── */}
      {isExcomTitlePhase && (
        <AbsoluteFill style={{ background: GRADIENTS.titleCard }}>
          <AbsoluteFill style={{ background: GRADIENTS.vignette, pointerEvents: 'none' }} />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: excomTitleOpacity,
            transform: `scale(${scaleIn(frame, fps, S5.excomTitleAppear, 0.85, 'cinematic')})`,
          }}>
            <span style={{
              fontFamily: FONT_FAMILY,
              fontSize: TYPOGRAPHY.sectionTitle.fontSize,
              fontWeight: TYPOGRAPHY.sectionTitle.fontWeight,
              background: `linear-gradient(135deg, ${COLORS.henkelRed} 0%, ${COLORS.radiantRed} 50%, ${COLORS.henkelRed} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(225, 0, 15, 0.25))',
              letterSpacing: TYPOGRAPHY.sectionTitle.letterSpacing,
            }}>
              GCC ExCom
            </span>
          </div>

          <AbsoluteFill style={{ backgroundColor: COLORS.black, opacity: blackOverlay }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
