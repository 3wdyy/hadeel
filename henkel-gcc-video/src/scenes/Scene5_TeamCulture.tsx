import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY } from '../config/brand';
import { S5, SCENES } from '../config/timing';
import { CULTURE_ROUNDS } from '../config/data';
import { fadeIn, fadeOut, slideUpIn, scaleIn, scalePulse } from '../config/animation';
import { FloatingParticles } from '../components/FloatingParticles';
import { TextGlow } from '../components/TextGlow';
import { PhotoGrid } from '../components/PhotoGrid';

export const Scene5_TeamCulture: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine which phase we're in
  const isDiversityPhase = frame >= S5.diversityStart && frame < S5.diversityEnd;
  const isMontagePhase = frame >= S5.montageStart && frame < S5.montageEnd;
  const isExcomTitlePhase = frame >= S5.excomTitleStart;

  // ─── Phase 5A: Diversity Statement ───
  const diversityOpacity = isDiversityPhase
    ? fadeIn(frame, S5.diversityStart, 15) *
      (frame >= S5.diversityEnd - 20 ? fadeOut(frame, S5.diversityEnd - 20, 20) : 1)
    : 0;

  // Calculate vertical stacking: lines appear bottom-up, pushing stack upward
  const visibleLines = S5.diversityLines.filter(l => frame >= l.appear);
  const stackCenterY = 50; // % from top
  const lineHeight = 70; // px between lines
  const totalHeight = visibleLines.length * lineHeight;
  const stackStartY = stackCenterY; // center-aligned

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

  // Fade to black overlay
  const blackOverlay = frame >= S5.fadeToBlackStart
    ? interpolate(frame, [S5.fadeToBlackStart, S5.fadeToBlackEnd], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  return (
    <AbsoluteFill>
      {/* ── Phase 5A Background: Red ── */}
      {isDiversityPhase && (
        <AbsoluteFill
          style={{
            opacity: diversityOpacity,
          }}
        >
          {/* Red texture background */}
          <Img
            src={staticFile('backgrounds/bg-red-texture.png')}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Floating particles */}
          <FloatingParticles
            count={13}
            color={COLORS.warmGold}
            maxOpacity={0.35}
            startFrame={S5.diversityStart}
            duration={S5.diversityEnd - S5.diversityStart}
          />

          {/* Text stack */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            {S5.diversityLines.map((line, i) => {
              if (frame < line.appear) return null;

              const opacity = fadeIn(frame, line.appear, 12);
              const translateY = slideUpIn(frame, fps, line.appear, 40);

              const isEmphasis = line.emphasis;
              const fontSize = isEmphasis ? 64 : TYPOGRAPHY.subheadline.fontSize;
              const fontWeight = isEmphasis ? 700 : TYPOGRAPHY.subheadline.fontWeight;

              // Scale pulse for "One Team."
              const pulse = isEmphasis && frame >= 2140
                ? scalePulse(frame, 2140, 20, 1.05)
                : 1;

              if (isEmphasis) {
                return (
                  <div
                    key={i}
                    style={{
                      opacity,
                      transform: `translateY(${translateY}px) scale(${pulse})`,
                    }}
                  >
                    <TextGlow
                      text={line.text}
                      fontSize={fontSize}
                      fontWeight={fontWeight}
                      color={COLORS.white}
                      glowColor="rgba(255, 255, 255, 0.15)"
                    />
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize,
                      fontWeight,
                      color: COLORS.white,
                      letterSpacing: TYPOGRAPHY.subheadline.letterSpacing,
                    }}
                  >
                    {line.text}
                  </span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Phase 5B Background: White + Photo Grid ── */}
      {isMontagePhase && (
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.white,
            opacity: montageOpacity,
          }}
        >
          <PhotoGrid rounds={photoRounds} />
        </AbsoluteFill>
      )}

      {/* ── Phase 5C: ExCom Title on White ── */}
      {isExcomTitlePhase && (
        <AbsoluteFill style={{ backgroundColor: COLORS.white }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: excomTitleOpacity,
              transform: `scale(${scaleIn(frame, fps, S5.excomTitleAppear, 0.85)})`,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.sectionTitle.fontSize,
                fontWeight: TYPOGRAPHY.sectionTitle.fontWeight,
                color: COLORS.henkelRed,
                letterSpacing: TYPOGRAPHY.sectionTitle.letterSpacing,
              }}
            >
              GCC ExCom
            </span>
          </div>

          {/* Fade to black overlay */}
          <AbsoluteFill style={{ backgroundColor: COLORS.black, opacity: blackOverlay }} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
