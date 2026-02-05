import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, interpolate } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY, SPACING } from '../config/brand';
import { S6 } from '../config/timing';
import { EXCOM_ROSTER, SCENE6D_TEXT } from '../config/data';
import { fadeIn, scaleIn, slideUpIn, makeSpring } from '../config/animation';
import { FloatingParticles } from '../components/FloatingParticles';
import { ExComCard } from '../components/ExComCard';

const irina = EXCOM_ROSTER[0];
const teamMembers = EXCOM_ROSTER.filter(m => !m.spotlight);

export const Scene6_ExComReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isSpotlightPhase = frame < S6.gridStart;
  const isGridPhase = frame >= S6.gridStart;
  const isStatsBarPhase = frame >= S6.statsBarAppear;

  // ─── Background transition: dark to light ───
  const bgTransition = isGridPhase
    ? interpolate(frame, [S6.gridStart, S6.gridStart + 20], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // ─── Phase 6B: Irina Spotlight ───
  const irinaPhotoScale = scaleIn(frame, fps, S6.irinaPhotoAppear, 0.7, 'gentle');
  const irinaPhotoOpacity = fadeIn(frame, S6.irinaPhotoAppear, 20);

  // ─── Phase 6C: Irina morph to grid position ───
  const morphProgress = isGridPhase
    ? interpolate(
        makeSpring(frame, fps, S6.gridStart, 'gentle'),
        [0, 1], [0, 1]
      )
    : 0;

  // Spotlight Irina dimensions
  const spotlightPhotoSize = 220;
  const gridPhotoSize = 56;
  const irinaPhotoSize = interpolate(morphProgress, [0, 1], [spotlightPhotoSize, gridPhotoSize]);

  // Grid layout constants
  const gridWidth = 780;
  const gridHeight = 720;
  const cardWidth = 248;
  const cardHeight = 170;
  const gap = SPACING.cardGap;

  // Calculate grid card positions
  const getCardPosition = (row: number, col: number) => {
    const gridLeft = (1920 - gridWidth) / 2;
    const gridTop = (1080 - gridHeight) / 2;
    const x = gridLeft + (col - 1) * (cardWidth + gap);
    const y = gridTop + (row - 1) * (cardHeight + gap);
    return { x, y };
  };

  // ─── Phase 6D: Stats bar ───
  const statsBarTranslateY = isStatsBarPhase
    ? slideUpIn(frame, fps, S6.statsBarAppear, 60, 'gentle')
    : 60;
  const statsBarOpacity = isStatsBarPhase ? fadeIn(frame, S6.statsBarAppear, 15) : 0;

  return (
    <AbsoluteFill>
      {/* ── Background ── */}
      <AbsoluteFill
        style={{
          background: interpolate(bgTransition, [0, 1], [0, 1]) > 0.5
            ? COLORS.lightGray
            : 'transparent',
        }}
      />

      {/* Dark premium background (for spotlight) */}
      {bgTransition < 1 && (
        <AbsoluteFill
          style={{
            background: 'radial-gradient(ellipse at center, #2A2A2A 0%, #1A1A1A 50%, #0D0D0D 100%)',
            opacity: 1 - bgTransition,
          }}
        >
          <FloatingParticles
            count={9}
            color={COLORS.warmGold}
            maxOpacity={0.25}
            startFrame={S6.irinaStart}
            duration={S6.irinaEnd - S6.irinaStart}
          />
        </AbsoluteFill>
      )}

      {/* Light gray background for grid */}
      {bgTransition > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.lightGray,
            opacity: bgTransition,
          }}
        />
      )}

      {/* ── Irina Spotlight (morphs into grid position) ── */}
      {!isGridPhase && frame >= S6.irinaPhotoAppear && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            top: '35%',
            transform: 'translateY(-50%)',
          }}
        >
          {/* Photo circle */}
          <div
            style={{
              width: spotlightPhotoSize,
              height: spotlightPhotoSize,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid rgba(225, 0, 15, 0.6)',
              opacity: irinaPhotoOpacity,
              transform: `scale(${irinaPhotoScale})`,
            }}
          >
            <img
              src={staticFile(irina.headshot)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Name */}
          {frame >= S6.irinaNameAppear && (
            <div
              style={{
                marginTop: 30,
                opacity: fadeIn(frame, S6.irinaNameAppear, 15),
                transform: `translateY(${slideUpIn(frame, fps, S6.irinaNameAppear, 20)}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: TYPOGRAPHY.irinaName.fontSize,
                  fontWeight: TYPOGRAPHY.irinaName.fontWeight,
                  color: COLORS.white,
                }}
              >
                {irina.name}
              </span>
            </div>
          )}

          {/* Role */}
          {frame >= S6.irinaRoleAppear && (
            <div
              style={{
                marginTop: 8,
                opacity: fadeIn(frame, S6.irinaRoleAppear, 15),
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: TYPOGRAPHY.irinaRole.fontSize,
                  fontWeight: TYPOGRAPHY.irinaRole.fontWeight,
                  color: COLORS.lightText,
                }}
              >
                {irina.role}
              </span>
            </div>
          )}

          {/* Nationality */}
          {frame >= S6.irinaNatAppear && (
            <div
              style={{
                marginTop: 8,
                opacity: fadeIn(frame, S6.irinaNatAppear, 15),
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: TYPOGRAPHY.irinaFlag.fontSize,
                  fontWeight: TYPOGRAPHY.irinaFlag.fontWeight,
                  color: COLORS.lightText,
                }}
              >
                {irina.flag} {irina.nationality}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Team Grid (Phase 6C) ── */}
      {isGridPhase && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: gridWidth,
            height: gridHeight,
          }}
        >
          {/* Irina's card at grid position */}
          <div
            style={{
              position: 'absolute',
              ...(() => {
                const pos = getCardPosition(irina.gridRow, irina.gridCol);
                const gridLeft = (1920 - gridWidth) / 2;
                const gridTop = (1080 - gridHeight) / 2;
                return { left: pos.x - gridLeft, top: pos.y - gridTop };
              })(),
            }}
          >
            <ExComCard
              member={irina}
              appearFrame={S6.gridStart}
              width={cardWidth}
              height={cardHeight}
            />
          </div>

          {/* Remaining 11 team members */}
          {teamMembers.map((member) => {
            const appearFrame = S6.cascadeStart + (member.revealOrder - 1) * S6.cascadeStagger;
            const pos = getCardPosition(member.gridRow, member.gridCol);
            const gridLeft = (1920 - gridWidth) / 2;
            const gridTop = (1080 - gridHeight) / 2;

            return (
              <div
                key={member.name}
                style={{
                  position: 'absolute',
                  left: pos.x - gridLeft,
                  top: pos.y - gridTop,
                }}
              >
                <ExComCard
                  member={member}
                  appearFrame={appearFrame}
                  width={cardWidth}
                  height={cardHeight}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Phase 6D: Cross Functional Team bar ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          height: 56,
          backgroundColor: 'rgba(51,51,51,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: statsBarOpacity,
          transform: `translateY(${statsBarTranslateY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: TYPOGRAPHY.statsBar.fontSize,
            fontWeight: TYPOGRAPHY.statsBar.fontWeight,
            color: COLORS.white,
            textTransform: 'uppercase',
            letterSpacing: TYPOGRAPHY.statsBar.letterSpacing,
          }}
        >
          {SCENE6D_TEXT}
        </span>
      </div>
    </AbsoluteFill>
  );
};
