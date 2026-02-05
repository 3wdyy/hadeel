import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  // Audio,
  // staticFile,
} from 'remotion';
import { SCENES, VIDEO } from './config/timing';
import { Scene1_ColdOpen } from './scenes/Scene1_ColdOpen';
import { Scene2_Transformation } from './scenes/Scene2_Transformation';
import { Scene3_Title } from './scenes/Scene3_Title';
import { Scene4_GCCMap } from './scenes/Scene4_GCCMap';
import { Scene5_TeamCulture } from './scenes/Scene5_TeamCulture';
import { Scene6_ExComReveal } from './scenes/Scene6_ExComReveal';
import { Scene7_Closing } from './scenes/Scene7_Closing';
import { HenkelLogo } from './components/HenkelLogo';

// Crossfade duration in frames
const CROSS = 15;
const CROSS_LONG = 20;

export const Video: React.FC = () => {
  const frame = useCurrentFrame();

  // ─── Transition opacity calculations ───

  // Scene 1 → 2 crossfade (frames 345-360)
  const s1Opacity = frame >= 345
    ? interpolate(frame, [345, 360], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  const s2Opacity = (() => {
    // Fade in from scene 1
    const fadeInOp = frame >= 345
      ? interpolate(frame, [345, 360], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 0;
    // Fade out to scene 3
    const fadeOutOp = frame >= 555
      ? interpolate(frame, [555, 570], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;
    return fadeInOp * fadeOutOp;
  })();

  // Scene 3 opacity
  const s3Opacity = (() => {
    const fadeIn = frame >= 555
      ? interpolate(frame, [555, 570], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 0;
    const fadeOut = frame >= 645
      ? interpolate(frame, [645, 660], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;
    return fadeIn * fadeOut;
  })();

  // Scene 4 opacity
  const s4Opacity = (() => {
    const fadeIn = frame >= 645
      ? interpolate(frame, [645, 660], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 0;
    const fadeOut = frame >= 1990
      ? interpolate(frame, [1990, 2010], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;
    return fadeIn * fadeOut;
  })();

  // Scene 5 opacity (it handles its own internal transitions)
  const s5Opacity = (() => {
    const fadeIn = frame >= 1990
      ? interpolate(frame, [1990, 2010], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 0;
    // Scene 5 internally fades to black at end
    return fadeIn;
  })();

  // Scene 6 opacity (fades in from scene 5's black)
  const s6Opacity = (() => {
    const fadeIn = frame >= 2840
      ? interpolate(frame, [2840, 2850], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 0;
    const fadeOut = frame >= 3490
      ? interpolate(frame, [3490, 3510], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;
    return fadeIn * fadeOut;
  })();

  // Scene 7 opacity
  const s7Opacity = frame >= 3490
    ? interpolate(frame, [3490, 3510], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* ═══ Scene 1: Cold Open (0-360) ═══ */}
      {frame < 375 && (
        <AbsoluteFill style={{ opacity: s1Opacity }}>
          <Scene1_ColdOpen />
        </AbsoluteFill>
      )}

      {/* ═══ Scene 2: Transformation Bridge (360-570) ═══ */}
      {frame >= 340 && frame < 585 && (
        <AbsoluteFill style={{ opacity: s2Opacity }}>
          <Scene2_Transformation />
        </AbsoluteFill>
      )}

      {/* ═══ Scene 3: Title Card (570-660) ═══ */}
      {frame >= 550 && frame < 675 && (
        <AbsoluteFill style={{ opacity: s3Opacity }}>
          <Scene3_Title />
        </AbsoluteFill>
      )}

      {/* ═══ Scene 4: GCC Map (660-2010) ═══ */}
      {frame >= 640 && frame < 2025 && (
        <AbsoluteFill style={{ opacity: s4Opacity }}>
          <Scene4_GCCMap />
        </AbsoluteFill>
      )}

      {/* ═══ Scene 5: Team Culture (2010-2850) ═══ */}
      {frame >= 1985 && frame < 2860 && (
        <AbsoluteFill style={{ opacity: s5Opacity }}>
          <Scene5_TeamCulture />
        </AbsoluteFill>
      )}

      {/* ═══ Scene 6: ExCom Reveal (2850-3510) ═══ */}
      {frame >= 2835 && frame < 3525 && (
        <AbsoluteFill style={{ opacity: s6Opacity }}>
          <Scene6_ExComReveal />
        </AbsoluteFill>
      )}

      {/* ═══ Scene 7: Closing (3510-4500) ═══ */}
      {frame >= 3485 && (
        <AbsoluteFill style={{ opacity: s7Opacity }}>
          <Scene7_Closing />
        </AbsoluteFill>
      )}

      {/* ═══ Henkel Logo Overlay (frames 600-3510) ═══ */}
      <HenkelLogo />

      {/* ═══ Audio Layers ═══ */}
      {/*
        Uncomment when audio files are available:

        <Audio
          src={staticFile('audio/music-khaliji.mp3')}
          volume={(f) => {
            if (f < 30) return interpolate(f, [0, 30], [0, 0.8], { extrapolateRight: 'clamp' });
            if (f < 4200) return 0.8;
            return interpolate(f, [4200, 4500], [0.8, 0], { extrapolateRight: 'clamp' });
          }}
        />

        <Sequence from={270}><Audio src={staticFile('audio/sfx-whoosh.mp3')} volume={0.4} /></Sequence>
        <Sequence from={480}><Audio src={staticFile('audio/sfx-whoosh.mp3')} volume={0.4} /></Sequence>
        <Sequence from={3960}><Audio src={staticFile('audio/sfx-whoosh.mp3')} volume={0.4} /></Sequence>

        {[765, 915, 1035, 1155, 1275, 1395].map((f) => (
          <Sequence key={f} from={f}><Audio src={staticFile('audio/sfx-click.mp3')} volume={0.3} /></Sequence>
        ))}
      */}
    </AbsoluteFill>
  );
};
