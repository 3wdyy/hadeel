import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { Shockwave, Flash } from "../components/Effects";
import { SplitWords } from "../components/SplitText";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

// Screen shake hook
const useScreenShake = (trigger: number, duration: number, intensity: number) => {
  const frame = useCurrentFrame();
  const adjustedFrame = frame - trigger;

  if (adjustedFrame < 0 || adjustedFrame > duration) {
    return { x: 0, y: 0 };
  }

  const decay = 1 - adjustedFrame / duration;
  const shake = intensity * decay;

  return {
    x: Math.sin(adjustedFrame * 1.5) * shake,
    y: Math.cos(adjustedFrame * 2) * shake * 0.7,
  };
};

// Animated question mark
const AnimatedQuestionMark: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const bounce = Math.sin(adjustedFrame * 0.15) * 10;

  return (
    <div
      style={{
        fontSize: 150,
        opacity: progress,
        transform: `
          translateY(${interpolate(progress, [0, 1], [50, 0]) + bounce}px)
          rotate(${Math.sin(adjustedFrame * 0.1) * 5}deg)
        `,
        filter: `drop-shadow(0 0 30px ${COLORS.henkelRed})`,
      }}
    >
      ❓
    </div>
  );
};

// The dramatic zero
const DramaticZero: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const progress = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 6, stiffness: 40, mass: 2 },
  });

  const glowPulse = progress > 0.8 ? 0.6 + Math.sin((adjustedFrame) * 0.15) * 0.4 : 0;

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {/* Multiple glow layers */}
      <div
        style={{
          position: "absolute",
          inset: -100,
          background: `radial-gradient(ellipse, ${COLORS.henkelRed}${Math.floor(glowPulse * 80).toString(16).padStart(2, '0')} 0%, transparent 50%)`,
          filter: "blur(60px)",
        }}
      />

      <div
        style={{
          fontSize: 350,
          fontWeight: 900,
          color: COLORS.henkelRed,
          fontFamily: FONTS.heading,
          opacity: progress,
          transform: `scale(${interpolate(progress, [0, 0.3, 0.6, 1], [3, 0.9, 1.05, 1])})`,
          filter: `blur(${interpolate(progress, [0, 0.5, 1], [30, 5, 0])}px)`,
          textShadow: `
            0 0 ${60 + glowPulse * 60}px ${COLORS.henkelRed},
            0 0 ${120 + glowPulse * 80}px ${COLORS.henkelRed}80,
            0 0 ${200 + glowPulse * 100}px ${COLORS.henkelRed}40
          `,
          position: "relative",
        }}
      >
        0
      </div>
    </div>
  );
};

export const PlotTwistScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene duration: 45 seconds = 1350 frames
  // Sub-scene timing:
  // 0-90: "But here's the thing..." (3 sec)
  // 90-240: Question with animated mark (5 sec)
  // 240-330: Big "0" drops (3 sec)
  // 330-480: "Zero. None. Not a single one." (5 sec)
  // 480-540: Pause (2 sec)
  // 540-720: Flags animate in (6 sec)
  // 720-870: "A Country of Countries" (5 sec)
  // 870-960: "Meet the team..." (3 sec)

  const currentPhase =
    frame < 90 ? "buildup" :
    frame < 240 ? "question" :
    frame < 330 ? "zero" :
    frame < 480 ? "explanation" :
    frame < 540 ? "pause" :
    frame < 720 ? "flags" :
    frame < 870 ? "tagline" :
    "transition";

  // Screen shake on zero reveal
  const shake = useScreenShake(240, 30, 15);

  // Text animations
  const buildupProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const questionProgress = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  const explanationProgress = spring({
    frame: Math.max(0, frame - 330),
    fps,
    config: SPRING_CONFIGS.bouncy,
  });

  const taglineProgress = spring({
    frame: Math.max(0, frame - 720),
    fps,
    config: SPRING_CONFIGS.dramatic,
  });

  const transitionProgress = spring({
    frame: Math.max(0, frame - 870),
    fps,
    config: SPRING_CONFIGS.smooth,
  });

  // Flags for the reveal
  const flags = ["🇷🇺", "🇪🇬", "🇫🇷", "🇱🇰", "🇩🇪"];

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${shake.x}px, ${shake.y}px)`,
      }}
    >
      <Background variant="dramatic" intensity={1.2} />

      {/* Flash and shockwave on zero */}
      <Flash trigger={240} color={COLORS.henkelRed} duration={10} />
      <Shockwave trigger={250} color={COLORS.henkelRed} />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        {/* Phase 1: Buildup */}
        {currentPhase === "buildup" && (
          <div
            style={{
              fontSize: 56,
              fontWeight: 500,
              color: COLORS.white,
              fontFamily: FONTS.heading,
              opacity: buildupProgress,
              transform: `translateY(${interpolate(buildupProgress, [0, 1], [30, 0])}px)`,
            }}
          >
            But here's the thing...
          </div>
        )}

        {/* Phase 2: Question */}
        {currentPhase === "question" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 48,
                fontWeight: 600,
                color: COLORS.white,
                fontFamily: FONTS.heading,
                marginBottom: 40,
                opacity: questionProgress,
                transform: `translateY(${interpolate(questionProgress, [0, 1], [20, 0])}px)`,
              }}
            >
              How many of us are actually from here?
            </div>
            <AnimatedQuestionMark delay={120} />
          </div>
        )}

        {/* Phase 3: Zero */}
        {currentPhase === "zero" && <DramaticZero delay={240} />}

        {/* Phase 4: Explanation */}
        {currentPhase === "explanation" && (
          <div
            style={{
              textAlign: "center",
              opacity: explanationProgress,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: COLORS.white,
                fontFamily: FONTS.heading,
                transform: `translateY(${interpolate(explanationProgress, [0, 1], [30, 0])}px)`,
              }}
            >
              Zero. None. Not a single one.
            </div>
            <div
              style={{
                fontSize: 80,
                marginTop: 20,
                opacity: spring({
                  frame: Math.max(0, frame - 380),
                  fps,
                  config: SPRING_CONFIGS.bouncy,
                }),
              }}
            >
              😄
            </div>
          </div>
        )}

        {/* Phase 5: Pause - subtle pulse */}
        {currentPhase === "pause" && (
          <div
            style={{
              width: 80,
              height: 4,
              background: COLORS.henkelRed,
              borderRadius: 2,
              opacity: 0.5 + Math.sin((frame - 480) * 0.2) * 0.3,
            }}
          />
        )}

        {/* Phase 6: Flags */}
        {currentPhase === "flags" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                marginBottom: 50,
              }}
            >
              {flags.map((flag, index) => {
                const flagProgress = spring({
                  frame: Math.max(0, frame - 540 - index * 15),
                  fps,
                  config: SPRING_CONFIGS.bouncy,
                });

                return (
                  <div
                    key={index}
                    style={{
                      fontSize: 100,
                      opacity: flagProgress,
                      transform: `
                        translateY(${interpolate(flagProgress, [0, 1], [100, 0])}px)
                        rotate(${interpolate(flagProgress, [0, 0.5, 1], [-30, 5, 0])}deg)
                        scale(${interpolate(flagProgress, [0, 0.7, 1], [0.3, 1.1, 1])})
                      `,
                      filter: `drop-shadow(0 10px 30px rgba(0,0,0,0.4))`,
                    }}
                  >
                    {flag}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                fontSize: 48,
                fontWeight: 500,
                color: COLORS.whiteAlpha80,
                fontFamily: FONTS.heading,
                opacity: spring({
                  frame: Math.max(0, frame - 640),
                  fps,
                  config: SPRING_CONFIGS.smooth,
                }),
              }}
            >
              We come from everywhere else.
            </div>
          </div>
        )}

        {/* Phase 7: Tagline */}
        {currentPhase === "tagline" && (
          <div
            style={{
              position: "relative",
              textAlign: "center",
            }}
          >
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                inset: -80,
                background: `radial-gradient(ellipse, ${COLORS.henkelRed}30 0%, transparent 70%)`,
                filter: "blur(40px)",
                opacity: taglineProgress,
              }}
            />

            <div
              style={{
                fontSize: 90,
                fontWeight: 900,
                color: COLORS.white,
                fontFamily: FONTS.heading,
                opacity: taglineProgress,
                transform: `scale(${interpolate(taglineProgress, [0, 0.5, 1], [0.8, 1.05, 1])})`,
                textShadow: `
                  0 0 40px ${COLORS.henkelRed}80,
                  0 0 80px ${COLORS.henkelRed}40,
                  0 5px 30px rgba(0,0,0,0.5)
                `,
                position: "relative",
              }}
            >
              A Country of <span style={{ color: COLORS.henkelRed }}>Countries</span>
            </div>
          </div>
        )}

        {/* Phase 8: Transition */}
        {currentPhase === "transition" && (
          <div
            style={{
              fontSize: 48,
              fontWeight: 500,
              color: COLORS.whiteAlpha60,
              fontFamily: FONTS.heading,
              fontStyle: "italic",
              opacity: transitionProgress,
              transform: `translateY(${interpolate(transitionProgress, [0, 1], [20, 0])}px)`,
            }}
          >
            Meet the team...
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
