import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, staticFile, interpolate, Img } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY, SPACING, GRADIENTS, SHADOWS } from '../config/brand';
import { S6 } from '../config/timing';
import { EXCOM_ROSTER, SCENE6D_TEXT } from '../config/data';
import { fadeIn, scaleIn, slideUpIn, makeSpring, driftingOrb } from '../config/animation';
import { FloatingParticles } from '../components/FloatingParticles';
import { ExComCard } from '../components/ExComCard';

const irina = EXCOM_ROSTER[0];
const teamMembers = EXCOM_ROSTER.filter(m => !m.spotlight);

export const Scene6_ExComReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isGridPhase = frame >= S6.gridStart;
  const isStatsBarPhase = frame >= S6.statsBarAppear;

  // Background animated orb
  const orb = driftingOrb(frame, 0.005, 10, 40, 50);

  // ─── Spotlight → Grid crossfade ───
  const transitionProgress = isGridPhase
    ? interpolate(
        makeSpring(frame, fps, S6.gridStart, 'cinematic'),
        [0, 1], [0, 1],
      )
    : 0;

  // ─── Irina Spotlight ───
  const irinaPhotoScale = scaleIn(frame, fps, S6.irinaPhotoAppear, 0.7, 'gentle');
  const irinaPhotoOpacity = fadeIn(frame, S6.irinaPhotoAppear, 20);

  // Grid layout
  const gridWidth = 780;
  const gridHeight = 720;
  const cardWidth = 248;
  const cardHeight = 170;
  const gap = SPACING.cardGap;

  const getCardPosition = (row: number, col: number) => {
    const gridLeft = (1920 - gridWidth) / 2;
    const gridTop = (1080 - gridHeight) / 2;
    return {
      x: gridLeft + (col - 1) * (cardWidth + gap),
      y: gridTop + (row - 1) * (cardHeight + gap),
    };
  };

  const gridContainerLeft = (1920 - gridWidth) / 2;
  const gridContainerTop = (1080 - gridHeight) / 2;

  // ─── Stats bar ───
  const statsBarTranslateY = isStatsBarPhase
    ? slideUpIn(frame, fps, S6.statsBarAppear, 60, 'gentle')
    : 60;
  const statsBarOpacity = isStatsBarPhase ? fadeIn(frame, S6.statsBarAppear, 15) : 0;

  return (
    <AbsoluteFill>
      {/* ── Dark cinematic background ── */}
      <AbsoluteFill style={{
        background: [
          `radial-gradient(ellipse at ${orb.x}% ${orb.y}%, rgba(225, 0, 15, 0.04) 0%, transparent 50%)`,
          GRADIENTS.cinematicWarm,
        ].join(', '),
      }} />

      {/* Dark premium texture */}
      <Img
        src={staticFile('backgrounds/bg-dark-premium.png')}
        style={{
          position: 'absolute', width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.3,
        }}
      />

      <FloatingParticles
        count={15}
        color={COLORS.warmGold}
        maxOpacity={0.2}
        startFrame={S6.irinaStart}
        duration={S6.holdEnd - S6.irinaStart}
      />

      <AbsoluteFill style={{ background: GRADIENTS.vignette, pointerEvents: 'none' }} />

      {/* ── Irina Spotlight (crossfades out) ── */}
      {frame >= S6.irinaPhotoAppear && transitionProgress < 1 && (
        <div style={{
          position: 'absolute', width: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          top: '35%', transform: 'translateY(-50%)',
          opacity: 1 - transitionProgress,
        }}>
          {/* Photo circle */}
          <div style={{
            width: 220, height: 220,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid rgba(225, 0, 15, 0.5)',
            opacity: irinaPhotoOpacity,
            transform: `scale(${irinaPhotoScale})`,
            boxShadow: SHADOWS.redGlow,
          }}>
            <Img
              src={staticFile(irina.headshot)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Name */}
          {frame >= S6.irinaNameAppear && (
            <div style={{
              marginTop: 30,
              opacity: fadeIn(frame, S6.irinaNameAppear, 15),
              transform: `translateY(${slideUpIn(frame, fps, S6.irinaNameAppear, 20)}px)`,
            }}>
              <span style={{
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.irinaName.fontSize,
                fontWeight: TYPOGRAPHY.irinaName.fontWeight,
                color: COLORS.iceWhite,
                textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              }}>
                {irina.name}
              </span>
            </div>
          )}

          {/* Role */}
          {frame >= S6.irinaRoleAppear && (
            <div style={{ marginTop: 8, opacity: fadeIn(frame, S6.irinaRoleAppear, 15) }}>
              <span style={{
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.irinaRole.fontSize,
                fontWeight: TYPOGRAPHY.irinaRole.fontWeight,
                color: COLORS.coolSilver,
              }}>
                {irina.role}
              </span>
            </div>
          )}

          {/* Nationality */}
          {frame >= S6.irinaNatAppear && (
            <div style={{ marginTop: 8, opacity: fadeIn(frame, S6.irinaNatAppear, 15) }}>
              <span style={{
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.irinaFlag.fontSize,
                fontWeight: TYPOGRAPHY.irinaFlag.fontWeight,
                color: COLORS.mutedText,
              }}>
                {irina.flag} {irina.nationality}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ── Team Grid (crossfades in) ── */}
      {isGridPhase && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: gridWidth, height: gridHeight,
          opacity: transitionProgress,
        }}>
          {/* Irina's card */}
          <div style={{
            position: 'absolute',
            left: getCardPosition(irina.gridRow, irina.gridCol).x - gridContainerLeft,
            top: getCardPosition(irina.gridRow, irina.gridCol).y - gridContainerTop,
          }}>
            <ExComCard member={irina} appearFrame={S6.gridStart} width={cardWidth} height={cardHeight} />
          </div>

          {/* Team cascade */}
          {teamMembers.map((member) => {
            const appearFrame = S6.cascadeStart + (member.revealOrder - 1) * S6.cascadeStagger;
            const pos = getCardPosition(member.gridRow, member.gridCol);
            return (
              <div key={member.name} style={{
                position: 'absolute',
                left: pos.x - gridContainerLeft,
                top: pos.y - gridContainerTop,
              }}>
                <ExComCard member={member} appearFrame={appearFrame} width={cardWidth} height={cardHeight} />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Stats bar (glassmorphic) ── */}
      <div style={{
        position: 'absolute', bottom: 24, left: 0, right: 0, height: 56,
        background: COLORS.glassBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: `1px solid ${COLORS.glassBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: statsBarOpacity,
        transform: `translateY(${statsBarTranslateY}px)`,
      }}>
        <span style={{
          fontFamily: FONT_FAMILY,
          fontSize: TYPOGRAPHY.statsBar.fontSize,
          fontWeight: TYPOGRAPHY.statsBar.fontWeight,
          color: COLORS.iceWhite,
          textTransform: 'uppercase',
          letterSpacing: TYPOGRAPHY.statsBar.letterSpacing,
        }}>
          {SCENE6D_TEXT}
        </span>
      </div>
    </AbsoluteFill>
  );
};
