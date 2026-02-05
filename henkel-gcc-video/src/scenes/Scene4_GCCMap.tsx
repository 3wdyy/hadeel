import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY, GRADIENTS, SHADOWS } from '../config/brand';
import { S4 } from '../config/timing';
import { SUMMARY_OVERLAY_1, SUMMARY_OVERLAY_2 } from '../config/data';
import { fadeIn, fadeOut, scaleIn, driftingOrb } from '../config/animation';
import { GCCMap } from '../components/GCCMap';
import { MapInfoCard } from '../components/MapInfoCard';
import { CounterNumber } from '../components/CounterNumber';

// Card positions matched to real geodata centroids
const CARD_POSITIONS: Record<string, { x: number; y: number }> = {
  KSA: { x: 580, y: 360 },
  UAE: { x: 890, y: 290 },
  KWT: { x: 360, y: 80 },
  OMN: { x: 950, y: 450 },
  BHR: { x: 470, y: 250 },
  QAT: { x: 780, y: 210 },
};

export const Scene4_GCCMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const activatedCountries: string[] = [];
  const showPins: string[] = [];

  for (const country of S4.countries) {
    if (frame >= country.start) activatedCountries.push(country.code);
    if (frame >= country.pinDrop) showPins.push(country.code);
  }

  const mapScale = frame < S4.mapAppearEnd
    ? scaleIn(frame, fps, S4.mapAppearStart, 0.95, 'slowReveal')
    : 1;
  const mapFadeIn = fadeIn(frame, S4.mapAppearStart, 15);

  const mapDimOpacity = frame >= S4.mapDimStart
    ? interpolate(frame, [S4.mapDimStart, S4.mapDimStart + 20], [1, 0.2], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      })
    : 1;

  // Summary overlays
  const showOverlay1 = frame >= S4.overlay1Start && frame < S4.overlay2Start;
  const showOverlay2 = frame >= S4.overlay2Start && frame < S4.mapDimStart;

  const overlay1Opacity = showOverlay1
    ? fadeIn(frame, S4.overlay1Start, 15) *
      (frame >= S4.overlay2Start - 15 ? fadeOut(frame, S4.overlay2Start - 15, 15) : 1)
    : 0;

  const overlay2Opacity = showOverlay2
    ? fadeIn(frame, S4.overlay2Start, 15) *
      (frame >= S4.mapDimStart - 15 ? fadeOut(frame, S4.mapDimStart - 15, 15) : 1)
    : 0;

  const isConsumerPhase = frame >= S4.mapDimStart;

  // Animated background orbs
  const orb = driftingOrb(frame, 0.005, 10, 55, 45);

  return (
    <AbsoluteFill>
      {/* Dark cinematic background */}
      <AbsoluteFill style={{
        background: [
          `radial-gradient(ellipse at ${orb.x}% ${orb.y}%, rgba(225, 0, 15, 0.05) 0%, transparent 60%)`,
          GRADIENTS.mapBackground,
        ].join(', '),
      }} />
      <AbsoluteFill style={{ background: GRADIENTS.vignette, pointerEvents: 'none' }} />

      {/* Map Container */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -55%) scale(${mapScale})`,
        opacity: mapFadeIn * mapDimOpacity,
      }}>
        <GCCMap activatedCountries={activatedCountries} showPins={showPins} />

        {/* Country Info Cards */}
        {S4.countries.map((country) => {
          const pos = CARD_POSITIONS[country.code];
          if (!pos || frame < country.cardAppear) return null;
          return (
            <MapInfoCard
              key={country.code}
              flag={country.flag}
              country={country.name}
              sobPercent={country.sob}
              appearFrame={country.cardAppear}
              counterStartFrame={country.cardAppear + 5}
              x={pos.x}
              y={pos.y}
            />
          );
        })}
      </div>

      {/* Summary Stats Overlay 1 */}
      {overlay1Opacity > 0 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 130,
          background: `linear-gradient(135deg, ${COLORS.glassBg} 0%, rgba(10, 14, 23, 0.85) 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: `1px solid ${COLORS.glassBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 120,
          opacity: overlay1Opacity,
        }}>
          {SUMMARY_OVERLAY_1.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <CounterNumber
                target={stat.value}
                suffix={stat.suffix}
                startFrame={S4.overlay1Start + 15 + i * 9}
                duration={45}
                fontSize={TYPOGRAPHY.statLarge.fontSize}
                color={COLORS.iceWhite}
              />
              <div style={{
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.statLabel.fontSize,
                fontWeight: TYPOGRAPHY.statLabel.fontWeight,
                color: COLORS.coolSilver,
                letterSpacing: TYPOGRAPHY.statLabel.letterSpacing,
                marginTop: 4,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats Overlay 2 */}
      {overlay2Opacity > 0 && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 130,
          background: `linear-gradient(135deg, ${COLORS.glassBg} 0%, rgba(10, 14, 23, 0.85) 100%)`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: `1px solid ${COLORS.glassBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 80,
          opacity: overlay2Opacity,
        }}>
          {SUMMARY_OVERLAY_2.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <CounterNumber
                target={stat.value}
                suffix={stat.suffix}
                startFrame={S4.overlay2Start + 15 + i * 8}
                duration={40}
                fontSize={TYPOGRAPHY.statLarge.fontSize * 0.85}
                color={COLORS.iceWhite}
              />
              <div style={{
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.statLabel.fontSize,
                fontWeight: TYPOGRAPHY.statLabel.fontWeight,
                color: COLORS.coolSilver,
                letterSpacing: TYPOGRAPHY.statLabel.letterSpacing,
                marginTop: 4,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Consumer Mindset Lines */}
      {isConsumerPhase && S4.consumerLines.map((line, i) => {
        if (frame < line.start || frame >= line.end + 15) return null;

        const opacity =
          fadeIn(frame, line.start, 15) *
          (frame >= line.end - 15 ? fadeOut(frame, line.end - 15, 15) : 1);

        return (
          <div key={i} style={{
            position: 'absolute', width: '100%', top: '50%',
            display: 'flex', justifyContent: 'center',
            transform: 'translateY(-50%)',
            opacity,
          }}>
            <span style={{
              fontFamily: FONT_FAMILY,
              fontSize: TYPOGRAPHY.contextLine.fontSize,
              fontWeight: TYPOGRAPHY.contextLine.fontWeight,
              color: COLORS.iceWhite,
              letterSpacing: TYPOGRAPHY.contextLine.letterSpacing,
              textShadow: '0 0 30px rgba(255,255,255,0.1)',
            }}>
              {line.text}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
