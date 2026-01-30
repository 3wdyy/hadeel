import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { LogoRevealScene } from "./scenes/LogoRevealScene";
import { StatsScene } from "./scenes/StatsScene";
import { CountriesScene } from "./scenes/CountriesScene";
import { PlotTwistScene } from "./scenes/PlotTwistScene";
import { TeamRevealScene } from "./scenes/TeamRevealScene";
import { ClosingScene } from "./scenes/ClosingScene";

// Scene timing configuration (in frames at 30fps)
const SCENES = {
  intro: { start: 0, duration: 180 },           // 0-6s: Opening with flags
  logoReveal: { start: 165, duration: 120 },    // 5.5-9.5s: Henkel GCC reveal
  stats: { start: 270, duration: 150 },         // 9-14s: 44 years, 60M, 6 countries
  countries: { start: 405, duration: 180 },     // 13.5-19.5s: Country breakdown
  plotTwist: { start: 570, duration: 180 },     // 19-25s: "Zero" reveal
  teamReveal: { start: 735, duration: 270 },    // 24.5-33.5s: Team members
  closing: { start: 990, duration: 260 },       // 33-42s: Closing message
};

// Crossfade transition component
const CrossfadeTransition: React.FC<{
  children: React.ReactNode;
  duration: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}> = ({ children, duration, fadeInDuration = 15, fadeOutDuration = 15 }) => {
  const frame = useCurrentFrame();

  // Ensure minimum duration of 1 to avoid [0,0] range
  const safeInDuration = Math.max(1, fadeInDuration);
  const safeOutDuration = Math.max(1, fadeOutDuration);

  const fadeIn = interpolate(frame, [0, safeInDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [duration - safeOutDuration, duration],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

// Final fade component
const FinalFade: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0A0A",
        opacity,
      }}
    />
  );
};

export const HenkelGCCVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A" }}>
      {/* Scene 1: Intro with flags */}
      <Sequence from={SCENES.intro.start} durationInFrames={SCENES.intro.duration}>
        <CrossfadeTransition
          duration={SCENES.intro.duration}
          fadeInDuration={1}
          fadeOutDuration={15}
        >
          <IntroScene />
        </CrossfadeTransition>
      </Sequence>

      {/* Scene 2: Logo Reveal */}
      <Sequence from={SCENES.logoReveal.start} durationInFrames={SCENES.logoReveal.duration}>
        <CrossfadeTransition duration={SCENES.logoReveal.duration}>
          <LogoRevealScene />
        </CrossfadeTransition>
      </Sequence>

      {/* Scene 3: Stats */}
      <Sequence from={SCENES.stats.start} durationInFrames={SCENES.stats.duration}>
        <CrossfadeTransition duration={SCENES.stats.duration}>
          <StatsScene />
        </CrossfadeTransition>
      </Sequence>

      {/* Scene 4: Countries Breakdown */}
      <Sequence from={SCENES.countries.start} durationInFrames={SCENES.countries.duration}>
        <CrossfadeTransition duration={SCENES.countries.duration}>
          <CountriesScene />
        </CrossfadeTransition>
      </Sequence>

      {/* Scene 5: Plot Twist - Zero */}
      <Sequence from={SCENES.plotTwist.start} durationInFrames={SCENES.plotTwist.duration}>
        <CrossfadeTransition duration={SCENES.plotTwist.duration}>
          <PlotTwistScene />
        </CrossfadeTransition>
      </Sequence>

      {/* Scene 6: Team Reveal */}
      <Sequence from={SCENES.teamReveal.start} durationInFrames={SCENES.teamReveal.duration}>
        <CrossfadeTransition duration={SCENES.teamReveal.duration}>
          <TeamRevealScene />
        </CrossfadeTransition>
      </Sequence>

      {/* Scene 7: Closing */}
      <Sequence from={SCENES.closing.start} durationInFrames={SCENES.closing.duration}>
        <CrossfadeTransition
          duration={SCENES.closing.duration}
          fadeOutDuration={30}
        >
          <ClosingScene />
        </CrossfadeTransition>
      </Sequence>

      {/* Final fade to black */}
      <Sequence from={2220} durationInFrames={30}>
        <FinalFade />
      </Sequence>
    </AbsoluteFill>
  );
};
