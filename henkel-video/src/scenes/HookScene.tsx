import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { FONTS, COLORS, FLAG_COLORS, SPRING_CONFIGS } from "../config";

// Henkel Logo - White oval with "Henkel" text
const HenkelLogo: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: progress,
        transform: `scale(${interpolate(progress, [0, 1], [0.8, 1])})`,
      }}
    >
      <div
        style={{
          width: 200,
          height: 110,
          border: `4px solid ${COLORS.white}`,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "transparent",
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: COLORS.white,
            fontFamily: FONTS.heading,
            letterSpacing: "-0.02em",
          }}
        >
          Henkel
        </span>
      </div>
    </div>
  );
};

// Flag component with horizontal stripes
const Flag: React.FC<{
  colors: { stripe1: string; stripe2: string; stripe3: string };
  delay: number;
  index: number;
}> = ({ colors, delay, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  return (
    <div
      style={{
        width: 120,
        height: 80,
        borderRadius: 8,
        overflow: "hidden",
        opacity: progress,
        transform: `
          translateY(${interpolate(progress, [0, 1], [50, 0])}px)
          scale(${interpolate(progress, [0, 0.8, 1], [0.5, 1.1, 1])})
        `,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ height: "33.33%", background: colors.stripe1 }} />
      <div style={{ height: "33.33%", background: colors.stripe2 }} />
      <div style={{ height: "33.34%", background: colors.stripe3 }} />
    </div>
  );
};

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ACT 1: THE HOOK (0:00 - 0:40 = 1200 frames)
  // Timing breakdown:
  // 0-90 (0:00-0:03): Henkel logo fades in
  // 90-180 (0:03-0:06): "When people ask where we're from..."
  // 180-270 (0:06-0:09): 5 flags fly in
  // 270-360 (0:09-0:12): All flags + "...it's complicated."
  // 360-420 (0:12-0:14): Black pause
  // 420-540 (0:14-0:18): HENKEL GCC reveal
  // 540-1200 (0:18-0:40): "A Country of Countries" subtitle

  const flags = [
    { colors: FLAG_COLORS.russia, label: "Russia" },
    { colors: FLAG_COLORS.egypt, label: "Egypt" },
    { colors: FLAG_COLORS.france, label: "France" },
    { colors: FLAG_COLORS.sriLanka, label: "Sri Lanka" },
    { colors: FLAG_COLORS.germany, label: "Germany" },
  ];

  // Animation progress values
  const logoProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const text1Progress = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const complicatedProgress = spring({
    frame: Math.max(0, frame - 270),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const henkelGccProgress = spring({
    frame: Math.max(0, frame - 420),
    fps,
    config: SPRING_CONFIGS.dramatic,
  });

  const subtitleProgress = spring({
    frame: Math.max(0, frame - 540),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Phase detection
  const phase1_logo = frame < 90;
  const phase2_question = frame >= 90 && frame < 180;
  const phase3_flags = frame >= 180 && frame < 360;
  const phase4_pause = frame >= 360 && frame < 420;
  const phase5_henkelGcc = frame >= 420;

  // Background color transitions
  const bgIsRed = frame >= 420;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgIsRed ? COLORS.henkelRed : COLORS.black,
      }}
    >
      {/* Phase 1: Henkel Logo (0:00-0:03) */}
      {phase1_logo && (
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HenkelLogo delay={0} />
        </AbsoluteFill>
      )}

      {/* Phase 2: "When people ask..." (0:03-0:06) */}
      {phase2_question && (
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontStyle: "italic",
              color: COLORS.white,
              fontFamily: FONTS.heading,
              textAlign: "center",
              opacity: text1Progress,
              transform: `translateY(${interpolate(text1Progress, [0, 1], [20, 0])}px)`,
            }}
          >
            "When people ask where we're from..."
          </div>
        </AbsoluteFill>
      )}

      {/* Phase 3: Flags fly in + "...it's complicated" (0:06-0:12) */}
      {phase3_flags && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 40,
          }}
        >
          {/* Flags row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 25,
            }}
          >
            {flags.map((flag, index) => (
              <Flag
                key={index}
                colors={flag.colors}
                delay={180 + index * 12}
                index={index}
              />
            ))}
          </div>

          {/* "...it's complicated." text (appears at 270) */}
          {frame >= 270 && (
            <div
              style={{
                fontSize: 48,
                fontStyle: "italic",
                color: COLORS.white,
                fontFamily: FONTS.heading,
                opacity: complicatedProgress,
                transform: `translateY(${interpolate(complicatedProgress, [0, 1], [20, 0])}px)`,
              }}
            >
              "...it's complicated."
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* Phase 4: Black pause (0:12-0:14) */}
      {phase4_pause && (
        <AbsoluteFill
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Just black screen - beat for effect */}
        </AbsoluteFill>
      )}

      {/* Phase 5: HENKEL GCC + subtitle (0:14-0:40) */}
      {phase5_henkelGcc && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 30,
          }}
        >
          {/* HENKEL GCC */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: COLORS.white,
              fontFamily: FONTS.heading,
              letterSpacing: "0.05em",
              opacity: henkelGccProgress,
              transform: `scale(${interpolate(henkelGccProgress, [0, 0.5, 1], [0.5, 1.1, 1])})`,
            }}
          >
            HENKEL GCC
          </div>

          {/* "A Country of Countries" subtitle */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              color: COLORS.white,
              fontFamily: FONTS.heading,
              fontStyle: "italic",
              opacity: subtitleProgress,
              transform: `translateY(${interpolate(subtitleProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            A Country of Countries
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
