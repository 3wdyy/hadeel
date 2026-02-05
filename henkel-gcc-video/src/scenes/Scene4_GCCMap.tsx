import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONT_FAMILY, TYPOGRAPHY } from '../config/brand';
import { S4, SCENES } from '../config/timing';
import { SUMMARY_OVERLAY_1, SUMMARY_OVERLAY_2 } from '../config/data';
import { fadeIn, fadeOut, scaleIn, makeSpring, counterAnimate } from '../config/animation';
import { GCCMap, GCC_PATHS } from '../components/GCCMap';
import { MapInfoCard } from '../components/MapInfoCard';
import { CounterNumber } from '../components/CounterNumber';

// Card positions for each country (pixel positions relative to map container)
const CARD_POSITIONS: Record<string, { x: number; y: number }> = {
  KSA: { x: 760, y: 280 },
  UAE: { x: 830, y: 180 },
  KWT: { x: 260, y: 20 },
  OMN: { x: 870, y: 340 },
  BHR: { x: 240, y: 100 },
  QAT: { x: 780, y: 80 },
};

export const Scene4_GCCMap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Determine which countries are activated and showing pins
  const activatedCountries: string[] = [];
  const showPins: string[] = [];

  for (const country of S4.countries) {
    if (frame >= country.start) {
      activatedCountries.push(country.code);
    }
    if (frame >= country.pinDrop) {
      showPins.push(country.code);
    }
  }

  // Map container animation
  const mapScale = frame < S4.mapAppearEnd
    ? scaleIn(frame, fps, S4.mapAppearStart, 0.95, 'slowReveal')
    : 1;
  const mapFadeIn = fadeIn(frame, S4.mapAppearStart, 15);

  // Phase 4D: Map dims
  const mapDimOpacity = frame >= S4.mapDimStart
    ? interpolate(frame, [S4.mapDimStart, S4.mapDimStart + 20], [1, 0.3], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // Should we show country info cards?
  const showCountryCards = frame < 1500; // Cards disappear before overlays

  // Phase 4C: Summary overlays
  const showOverlay1 = frame >= S4.overlay1Start && frame < S4.overlay2Start;
  const showOverlay2 = frame >= S4.overlay2Start && frame < S4.mapDimStart;

  // Overlay transition
  const overlay1Opacity = showOverlay1
    ? fadeIn(frame, S4.overlay1Start, 15) *
      (frame >= S4.overlay2Start - 15 ? fadeOut(frame, S4.overlay2Start - 15, 15) : 1)
    : 0;

  const overlay2Opacity = showOverlay2
    ? fadeIn(frame, S4.overlay2Start, 15) *
      (frame >= S4.mapDimStart - 15 ? fadeOut(frame, S4.mapDimStart - 15, 15) : 1)
    : 0;

  // Phase 4D: Consumer mindset lines
  const isConsumerPhase = frame >= S4.mapDimStart;

  return (
    <AbsoluteFill>
      {/* Background — warm gray CSS fallback */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, #F5F0EB 0%, #EDE5DA 70%, #E5DAD0 100%)`,
        }}
      />
      {/* Subtle white overlay to soften */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />

      {/* Map Container */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -55%) scale(${mapScale})`,
          opacity: mapFadeIn * mapDimOpacity,
        }}
      >
        <GCCMap
          activatedCountries={activatedCountries}
          showPins={showPins}
        />

        {/* Country Info Cards */}
        {showCountryCards && S4.countries.map((country) => {
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

      {/* ── Phase 4C: Summary Stats Overlay 1 ── */}
      {overlay1Opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 120,
            opacity: overlay1Opacity,
          }}
        >
          {SUMMARY_OVERLAY_1.map((stat, i) => {
            const stagger = i * 9;
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <CounterNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  startFrame={1575 + stagger}
                  duration={45}
                  fontSize={TYPOGRAPHY.statLarge.fontSize}
                  color={COLORS.white}
                />
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: TYPOGRAPHY.statLabel.fontSize,
                    fontWeight: TYPOGRAPHY.statLabel.fontWeight,
                    color: COLORS.lightText,
                    letterSpacing: TYPOGRAPHY.statLabel.letterSpacing,
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Phase 4C: Summary Stats Overlay 2 ── */}
      {overlay2Opacity > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 80,
            opacity: overlay2Opacity,
          }}
        >
          {SUMMARY_OVERLAY_2.map((stat, i) => {
            const stagger = i * 8;
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <CounterNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  startFrame={1725 + stagger}
                  duration={40}
                  fontSize={TYPOGRAPHY.statLarge.fontSize * 0.85}
                  color={COLORS.white}
                />
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: TYPOGRAPHY.statLabel.fontSize,
                    fontWeight: TYPOGRAPHY.statLabel.fontWeight,
                    color: COLORS.lightText,
                    letterSpacing: TYPOGRAPHY.statLabel.letterSpacing,
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Phase 4D: Consumer Mindset Lines ── */}
      {isConsumerPhase && S4.consumerLines.map((line, i) => {
        if (frame < line.start || frame >= line.end + 15) return null;

        const opacity =
          fadeIn(frame, line.start, 15) *
          (frame >= line.end - 15 ? fadeOut(frame, line.end - 15, 15) : 1);

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '100%',
              top: '50%',
              display: 'flex',
              justifyContent: 'center',
              transform: 'translateY(-50%)',
              opacity,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: TYPOGRAPHY.contextLine.fontSize,
                fontWeight: TYPOGRAPHY.contextLine.fontWeight,
                color: COLORS.darkGray,
                letterSpacing: TYPOGRAPHY.contextLine.letterSpacing,
              }}
            >
              {line.text}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
