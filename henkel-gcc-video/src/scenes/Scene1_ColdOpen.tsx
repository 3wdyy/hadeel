import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY } from '../config/brand';
import { S1 } from '../config/timing';
import { SCENE1_LINES } from '../config/data';
import { fadeIn, scaleIn, slideUpIn, makeSpring } from '../config/animation';
import { FloatingParticles } from '../components/FloatingParticles';
import { TextGlow } from '../components/TextGlow';

export const Scene1_ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isRedScreen = frame >= S1.redScreenCut;

  // ─── Black Phase Background ───
  const blackPhaseOpacity = isRedScreen ? 0 : 1;

  // ─── Red Phase Background ───
  // CSS fallback for bg-red-texture.png
  const redBg = `radial-gradient(ellipse at center, #E8202F 0%, ${COLORS.henkelRed} 50%, #C1000D 100%)`;

  // ─── Line positions: they shift upward as new lines appear ───
  const line1BaseY = 40; // % from top
  const line2BaseY = 50;

  // Line 1 shift: moves up when line2 appears, then again when line3 appears
  const line1ShiftForLine2 = frame >= S1.line1Reposition
    ? interpolate(
        makeSpring(frame, fps, S1.line1Reposition, 'snappy'),
        [0, 1], [0, -60]
      )
    : 0;

  const line1ShiftForLine3 = frame >= S1.line2Reposition
    ? interpolate(
        makeSpring(frame, fps, S1.line2Reposition, 'snappy'),
        [0, 1], [0, -50]
      )
    : 0;

  // Line 2 shift when line3 appears
  const line2ShiftForLine3 = frame >= S1.line2Reposition
    ? interpolate(
        makeSpring(frame, fps, S1.line2Reposition, 'snappy'),
        [0, 1], [0, -50]
      )
    : 0;

  return (
    <AbsoluteFill>
      {/* ── Black Background Phase ── */}
      {!isRedScreen && (
        <AbsoluteFill
          style={{
            backgroundColor: COLORS.black,
            opacity: blackPhaseOpacity,
          }}
        >
          {/* Floating particles on black */}
          <FloatingParticles
            count={10}
            color={COLORS.warmGold}
            maxOpacity={0.3}
            startFrame={0}
            duration={270}
          />

          {/* Line 1: 25% of the Middle East. */}
          {frame >= S1.line1Appear && (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                top: `${line1BaseY}%`,
                display: 'flex',
                justifyContent: 'center',
                opacity: fadeIn(frame, S1.line1Appear, 15),
                transform: `translateY(${line1ShiftForLine2 + line1ShiftForLine3}px) scale(${scaleIn(frame, fps, S1.line1Appear, 0.95)})`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: TYPOGRAPHY.headline.fontSize,
                  fontWeight: TYPOGRAPHY.headline.fontWeight,
                  color: COLORS.white,
                  letterSpacing: TYPOGRAPHY.headline.letterSpacing,
                }}
              >
                {SCENE1_LINES.line1}
              </span>
            </div>
          )}

          {/* Line 2: >40% Gross Profit. >18% EBIT. */}
          {frame >= S1.line2Appear && (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                top: `${line2BaseY}%`,
                display: 'flex',
                justifyContent: 'center',
                opacity: fadeIn(frame, S1.line2Appear, 15),
                transform: `translateY(${slideUpIn(frame, fps, S1.line2Appear, 40) + line2ShiftForLine3}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: TYPOGRAPHY.headline.fontSize,
                  fontWeight: TYPOGRAPHY.headline.fontWeight,
                  color: COLORS.white,
                  letterSpacing: TYPOGRAPHY.headline.letterSpacing,
                }}
              >
                {SCENE1_LINES.line2}
              </span>
            </div>
          )}

          {/* Line 3: €1.7 Billion Market. */}
          {frame >= S1.line3Appear && (
            <div
              style={{
                position: 'absolute',
                width: '100%',
                top: '60%',
                display: 'flex',
                justifyContent: 'center',
                opacity: fadeIn(frame, S1.line3Appear, 15),
                transform: `translateY(${slideUpIn(frame, fps, S1.line3Appear, 40)}px)`,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: TYPOGRAPHY.headline.fontSize,
                  fontWeight: TYPOGRAPHY.headline.fontWeight,
                  color: COLORS.white,
                  letterSpacing: TYPOGRAPHY.headline.letterSpacing,
                }}
              >
                {SCENE1_LINES.line3}
              </span>
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* ── Red Screen Phase ── */}
      {isRedScreen && (
        <AbsoluteFill
          style={{
            background: redBg,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                transform: `scale(${scaleIn(frame, fps, S1.redScreenCut, 0.9)})`,
              }}
            >
              <TextGlow
                text={SCENE1_LINES.redScreen}
                fontSize={TYPOGRAPHY.subheadline.fontSize}
                fontWeight={TYPOGRAPHY.subheadline.fontWeight}
                color={COLORS.white}
                glowColor="rgba(255, 255, 255, 0.15)"
              />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
