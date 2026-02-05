import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Img, staticFile } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY, GRADIENTS } from '../config/brand';
import { S1 } from '../config/timing';
import { SCENE1_LINES } from '../config/data';
import { fadeIn, fadeOut, scaleIn, slideUpIn, makeSpring, driftingOrb } from '../config/animation';
import { FloatingParticles } from '../components/FloatingParticles';
import { TextGlow } from '../components/TextGlow';

export const Scene1_ColdOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isRedScreen = frame >= S1.redScreenCut;

  // Animated gradient mesh background
  const orb1 = driftingOrb(frame, 0.006, 12, 25, 35);
  const orb2 = driftingOrb(frame, 0.008, 10, 75, 65);

  const animatedBg = [
    `radial-gradient(ellipse at ${orb1.x}% ${orb1.y}%, rgba(225, 0, 15, 0.06) 0%, transparent 50%)`,
    `radial-gradient(ellipse at ${orb2.x}% ${orb2.y}%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)`,
    GRADIENTS.cinematic,
  ].join(', ');

  // Line positions with spring repositioning
  const line1BaseY = 40;
  const line2BaseY = 50;

  const line1ShiftForLine2 = frame >= S1.line1Reposition
    ? interpolate(makeSpring(frame, fps, S1.line1Reposition, 'snappy'), [0, 1], [0, -60])
    : 0;

  const line1ShiftForLine3 = frame >= S1.line2Reposition
    ? interpolate(makeSpring(frame, fps, S1.line2Reposition, 'snappy'), [0, 1], [0, -50])
    : 0;

  const line2ShiftForLine3 = frame >= S1.line2Reposition
    ? interpolate(makeSpring(frame, fps, S1.line2Reposition, 'snappy'), [0, 1], [0, -50])
    : 0;

  // Fade out black phase before red screen
  const blackFadeOut = frame >= S1.redScreenCut - 10
    ? fadeOut(frame, S1.redScreenCut - 10, 10)
    : 1;

  // Red screen fade out at end
  const redFadeOut = frame >= S1.redScreenEnd - 20
    ? fadeOut(frame, S1.redScreenEnd - 20, 20)
    : 1;

  // Kinetic text helper: word-by-word reveal
  const renderKineticText = (text: string, startFrame: number) => {
    const words = text.split(' ');
    return (
      <span style={{ display: 'flex', gap: 14 }}>
        {words.map((word, i) => {
          const wordDelay = startFrame + i * 4;
          const wordOpacity = fadeIn(frame, wordDelay, 8);
          const wordY = slideUpIn(frame, fps, wordDelay, 20);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: wordOpacity,
                transform: `translateY(${wordY}px)`,
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.headline.fontSize,
                fontWeight: TYPOGRAPHY.headline.fontWeight,
                color: COLORS.iceWhite,
                letterSpacing: TYPOGRAPHY.headline.letterSpacing,
                textShadow: `0 0 30px rgba(255,255,255,0.1)`,
              }}
            >
              {word}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <AbsoluteFill>
      {/* Black Phase */}
      {!isRedScreen && (
        <AbsoluteFill
          style={{
            background: animatedBg,
            opacity: blackFadeOut,
          }}
        >
          {/* Vignette */}
          <AbsoluteFill style={{ background: GRADIENTS.vignette, pointerEvents: 'none' }} />

          {/* Floating particles */}
          <FloatingParticles
            count={35}
            color={COLORS.warmGold}
            maxOpacity={0.4}
            startFrame={0}
            duration={270}
          />

          {/* Thin decorative lines */}
          <div style={{
            position: 'absolute', top: '30%', left: '10%', right: '10%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
            opacity: fadeIn(frame, 20, 30),
          }} />
          <div style={{
            position: 'absolute', top: '70%', left: '15%', right: '15%', height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
            opacity: fadeIn(frame, 40, 30),
          }} />

          {/* Line 1 */}
          {frame >= S1.line1Appear && (
            <div style={{
              position: 'absolute', width: '100%', top: `${line1BaseY}%`,
              display: 'flex', justifyContent: 'center',
              transform: `translateY(${line1ShiftForLine2 + line1ShiftForLine3}px) scale(${scaleIn(frame, fps, S1.line1Appear, 0.95)})`,
            }}>
              {renderKineticText(SCENE1_LINES.line1, S1.line1Appear)}
            </div>
          )}

          {/* Line 2 */}
          {frame >= S1.line2Appear && (
            <div style={{
              position: 'absolute', width: '100%', top: `${line2BaseY}%`,
              display: 'flex', justifyContent: 'center',
              transform: `translateY(${slideUpIn(frame, fps, S1.line2Appear, 40) + line2ShiftForLine3}px)`,
            }}>
              {renderKineticText(SCENE1_LINES.line2, S1.line2Appear)}
            </div>
          )}

          {/* Line 3 */}
          {frame >= S1.line3Appear && (
            <div style={{
              position: 'absolute', width: '100%', top: '60%',
              display: 'flex', justifyContent: 'center',
              transform: `translateY(${slideUpIn(frame, fps, S1.line3Appear, 40)}px)`,
            }}>
              {renderKineticText(SCENE1_LINES.line3, S1.line3Appear)}
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* Red Screen Phase */}
      {isRedScreen && (
        <AbsoluteFill style={{ opacity: redFadeOut }}>
          {/* Red gradient fallback + texture */}
          <AbsoluteFill style={{ background: GRADIENTS.brandRed }} />
          <Img
            src={staticFile('backgrounds/bg-red-texture.png')}
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />

          <FloatingParticles
            count={20}
            color="rgba(255,255,255,0.5)"
            maxOpacity={0.3}
            startFrame={S1.redScreenCut}
            duration={90}
          />

          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              transform: `scale(${scaleIn(frame, fps, S1.redScreenCut, 0.85, 'cinematic')})`,
              opacity: fadeIn(frame, S1.redScreenCut, 15),
            }}>
              <TextGlow
                text={SCENE1_LINES.redScreen}
                fontSize={TYPOGRAPHY.subheadline.fontSize}
                fontWeight={TYPOGRAPHY.subheadline.fontWeight}
                color={COLORS.iceWhite}
                glowColor="rgba(255, 255, 255, 0.35)"
                glowIntensity={1.5}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
