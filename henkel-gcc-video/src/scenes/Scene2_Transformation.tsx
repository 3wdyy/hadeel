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

  const sceneStart = SCENES.scene2.start;
  const localFrame = frame; // Already in absolute frame context

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

  // Text shadow helper
  const textShadowStyle: React.CSSProperties = {
    position: 'relative',
  };

  return (
    <AbsoluteFill>
      {/* ── Desert Image (or fallback gradient) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${desertTranslateX}%)`,
          overflow: 'hidden',
        }}
      >
        {/* CSS fallback for desert-1950s.png */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #D4A853 0%, #C4944A 30%, #A67B3D 60%, #8B6330 100%)',
            transform: `scale(${desertKB.scale}) translate(${desertKB.translateX}px, ${desertKB.translateY}px)`,
          }}
        >
          {/* Atmospheric elements for desert fallback */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 70% 80%, rgba(255,200,100,0.3) 0%, transparent 60%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '30%',
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, transparent 10%, rgba(139,99,48,0.4) 30%, rgba(139,99,48,0.4) 70%, transparent 90%)',
            }}
          />
        </div>
        <GradientOverlay direction="bottom" opacity={0.4} />
      </div>

      {/* ── Skyline Image (or fallback gradient) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${skylineTranslateX}%)`,
          overflow: 'hidden',
        }}
      >
        {/* CSS fallback for skyline-modern.png */}
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #0A1628 0%, #1A2744 30%, #2A3F6A 60%, #1E3058 80%, #0D1B35 100%)',
            transform: `scale(${skylineKB.scale}) translate(${skylineKB.translateX}px, ${skylineKB.translateY}px)`,
          }}
        >
          {/* City lights simulation */}
          <div
            style={{
              position: 'absolute',
              bottom: '25%',
              left: '20%',
              right: '20%',
              height: '40%',
              background: 'linear-gradient(0deg, rgba(212,168,83,0.15) 0%, transparent 80%)',
            }}
          />
          {/* Skyline silhouette shapes */}
          {[15, 25, 35, 42, 50, 58, 65, 72, 80].map((left, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: '25%',
                left: `${left}%`,
                width: `${3 + (i % 3) * 2}%`,
                height: `${15 + (i * 7) % 25}%`,
                background: `linear-gradient(0deg, rgba(30,48,88,0.9) 0%, rgba(42,63,106,0.7) 100%)`,
                borderRadius: '2px 2px 0 0',
              }}
            />
          ))}
          {/* Warm gold horizon glow */}
          <div
            style={{
              position: 'absolute',
              bottom: '20%',
              left: 0,
              right: 0,
              height: '15%',
              background: 'linear-gradient(0deg, rgba(212,168,83,0.2) 0%, transparent 100%)',
            }}
          />
        </div>
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
          {/* Text shadow */}
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
            {/* Shadow */}
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
