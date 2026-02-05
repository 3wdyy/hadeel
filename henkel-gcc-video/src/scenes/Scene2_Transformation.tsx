import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, staticFile, interpolate } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY } from '../config/brand';
import { S2, SCENES } from '../config/timing';
import { SCENE2 } from '../config/data';
import { fadeIn, fadeOut, scaleIn, kenBurns } from '../config/animation';
import { GradientOverlay } from '../components/GradientOverlay';

export const Scene2_Transformation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── Desert Phase (360-480) ───
  const isDesertPhase = frame < S2.wipeStart;
  const isSkylinePhase = frame >= S2.wipeEnd;
  const isWiping = frame >= S2.wipeStart && frame < S2.wipeEnd;

  // Desert ken burns: zoom out (1.05 to 1.0)
  const desertKB = kenBurns(frame, S2.desertStart, S2.wipeStart - S2.desertStart, 'zoom_out');

  // Skyline ken burns: gentle zoom in
  const skylineKB = kenBurns(frame, S2.skylineStart, S2.end - S2.skylineStart, 'zoom_in');

  // Wipe transition: Desert slides left, skyline from right
  const wipeProgress = interpolate(
    frame,
    [S2.wipeStart, S2.wipeEnd],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const desertTranslateX = isWiping ? -wipeProgress * 100 : (isSkylinePhase ? -100 : 0);
  const skylineTranslateX = isWiping ? (1 - wipeProgress) * 100 : (isSkylinePhase ? 0 : 100);

  return (
    <AbsoluteFill>
      {/* ── Desert Image ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${desertTranslateX}%)`,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('backgrounds/desert-1950s.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${desertKB.scale}) translate(${desertKB.translateX}px, ${desertKB.translateY}px)`,
          }}
        />
        <GradientOverlay direction="bottom" opacity={0.4} />
      </div>

      {/* ── Skyline Image ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${skylineTranslateX}%)`,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('backgrounds/skyline-modern.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${skylineKB.scale}) translate(${skylineKB.translateX}px, ${skylineKB.translateY}px)`,
          }}
        />
        <GradientOverlay direction="bottom" opacity={0.5} />
      </div>

      {/* ── 1950s Label ── */}
      {frame >= S2.yearLeftAppear && frame < S2.yearLeftDisappear && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 80,
            opacity: fadeIn(frame, S2.yearLeftAppear, 15) *
              (frame >= S2.yearLeftDisappear - 15 ? fadeOut(frame, S2.yearLeftDisappear - 15, 15) : 1),
          }}
        >
          <div style={{ position: 'absolute', top: 2, left: 2, opacity: 0.5 }}>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.contextLine.fontSize,
                fontWeight: TYPOGRAPHY.contextLine.fontWeight,
                color: 'rgba(0,0,0,0.8)',
              }}
            >
              {SCENE2.leftLabel}
            </span>
          </div>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: TYPOGRAPHY.contextLine.fontSize,
              fontWeight: TYPOGRAPHY.contextLine.fontWeight,
              color: COLORS.white,
              position: 'relative',
            }}
          >
            {SCENE2.leftLabel}
          </span>
        </div>
      )}

      {/* ── 2020s Label ── */}
      {frame >= S2.yearRightAppear && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 80,
            opacity: fadeIn(frame, S2.yearRightAppear, 15),
          }}
        >
          <div style={{ position: 'absolute', top: 2, left: 2, opacity: 0.5 }}>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.contextLine.fontSize,
                fontWeight: TYPOGRAPHY.contextLine.fontWeight,
                color: 'rgba(0,0,0,0.8)',
              }}
            >
              {SCENE2.rightLabel}
            </span>
          </div>
          <span
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: TYPOGRAPHY.contextLine.fontSize,
              fontWeight: TYPOGRAPHY.contextLine.fontWeight,
              color: COLORS.white,
              position: 'relative',
            }}
          >
            {SCENE2.rightLabel}
          </span>
        </div>
      )}

      {/* ── Transformation Text ── */}
      {frame >= S2.transformTextAppear && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            top: '45%',
            display: 'flex',
            justifyContent: 'center',
            opacity: fadeIn(frame, S2.transformTextAppear, 15),
            transform: `scale(${scaleIn(frame, fps, S2.transformTextAppear, 0.9, 'gentle')})`,
          }}
        >
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 2, left: 2, opacity: 0.6 }}>
              <span
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: TYPOGRAPHY.contextLine.fontSize,
                  fontWeight: TYPOGRAPHY.contextLine.fontWeight,
                  color: 'rgba(0,0,0,0.8)',
                }}
              >
                {SCENE2.centerText}
              </span>
            </div>
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.contextLine.fontSize,
                fontWeight: TYPOGRAPHY.contextLine.fontWeight,
                color: COLORS.white,
                position: 'relative',
              }}
            >
              {SCENE2.centerText}
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
