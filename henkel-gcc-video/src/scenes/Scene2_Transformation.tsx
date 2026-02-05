import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, staticFile, interpolate } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY } from '../config/brand';
import { S2 } from '../config/timing';
import { SCENE2 } from '../config/data';
import { fadeIn, fadeOut, scaleIn, kenBurns } from '../config/animation';
import { GradientOverlay } from '../components/GradientOverlay';

export const Scene2_Transformation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isDesertPhase = frame < S2.wipeStart;
  const isSkylinePhase = frame >= S2.wipeEnd;
  const isWiping = frame >= S2.wipeStart && frame < S2.wipeEnd;

  const desertKB = kenBurns(frame, S2.desertStart, S2.wipeStart - S2.desertStart, 'zoom_out');
  const skylineKB = kenBurns(frame, S2.skylineStart, S2.end - S2.skylineStart, 'zoom_in');

  const wipeProgress = interpolate(
    frame, [S2.wipeStart, S2.wipeEnd], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const desertTranslateX = isWiping ? -wipeProgress * 100 : (isSkylinePhase ? -100 : 0);
  const skylineTranslateX = isWiping ? (1 - wipeProgress) * 100 : (isSkylinePhase ? 0 : 100);

  // Transformation text fade out
  const textFadeOut = frame >= S2.end - 20
    ? fadeOut(frame, S2.end - 20, 20)
    : 1;

  return (
    <AbsoluteFill>
      {/* Desert Image */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${desertTranslateX}%)`, overflow: 'hidden' }}>
        <Img
          src={staticFile('backgrounds/desert-1950s.png')}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: `scale(${desertKB.scale}) translate(${desertKB.translateX}px, ${desertKB.translateY}px)`,
          }}
        />
        <GradientOverlay direction="bottom" opacity={0.5} />
      </div>

      {/* Wipe edge glow */}
      {isWiping && (
        <div style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${wipeProgress * 100 - 1}%`,
          width: 4,
          background: 'linear-gradient(to bottom, transparent, rgba(225,0,15,0.8), transparent)',
          boxShadow: '0 0 20px rgba(225,0,15,0.5), 0 0 40px rgba(225,0,15,0.25)',
          zIndex: 5,
        }} />
      )}

      {/* Skyline Image */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${skylineTranslateX}%)`, overflow: 'hidden' }}>
        <Img
          src={staticFile('backgrounds/skyline-modern.png')}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: `scale(${skylineKB.scale}) translate(${skylineKB.translateX}px, ${skylineKB.translateY}px)`,
          }}
        />
        <GradientOverlay direction="bottom" opacity={0.5} />
      </div>

      {/* 1950s Label */}
      {frame >= S2.yearLeftAppear && frame < S2.yearLeftDisappear && (
        <div style={{
          position: 'absolute', bottom: 80, left: 80,
          opacity: fadeIn(frame, S2.yearLeftAppear, 15) *
            (frame >= S2.yearLeftDisappear - 15 ? fadeOut(frame, S2.yearLeftDisappear - 15, 15) : 1),
        }}>
          <span style={{
            fontFamily: FONT_FAMILY,
            fontSize: TYPOGRAPHY.contextLine.fontSize,
            fontWeight: TYPOGRAPHY.contextLine.fontWeight,
            color: COLORS.iceWhite,
            textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.3)',
          }}>
            {SCENE2.leftLabel}
          </span>
        </div>
      )}

      {/* 2020s Label */}
      {frame >= S2.yearRightAppear && (
        <div style={{
          position: 'absolute', bottom: 80, right: 80,
          opacity: fadeIn(frame, S2.yearRightAppear, 15) * textFadeOut,
        }}>
          <span style={{
            fontFamily: FONT_FAMILY,
            fontSize: TYPOGRAPHY.contextLine.fontSize,
            fontWeight: TYPOGRAPHY.contextLine.fontWeight,
            color: COLORS.iceWhite,
            textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.3)',
          }}>
            {SCENE2.rightLabel}
          </span>
        </div>
      )}

      {/* Transformation Text */}
      {frame >= S2.transformTextAppear && (
        <div style={{
          position: 'absolute', width: '100%', top: '45%',
          display: 'flex', justifyContent: 'center',
          opacity: fadeIn(frame, S2.transformTextAppear, 15) * textFadeOut,
          transform: `scale(${scaleIn(frame, fps, S2.transformTextAppear, 0.9, 'gentle')})`,
        }}>
          <span style={{
            fontFamily: FONT_FAMILY,
            fontSize: TYPOGRAPHY.contextLine.fontSize,
            fontWeight: 700,
            color: COLORS.iceWhite,
            textShadow: '0 2px 12px rgba(0,0,0,0.7), 0 0 30px rgba(0,0,0,0.4)',
            letterSpacing: 1,
          }}>
            {SCENE2.centerText}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
