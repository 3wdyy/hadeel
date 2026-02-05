import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { SCENES } from './config/timing';
import { COLORS } from './config/brand';
import { Scene1_ColdOpen } from './scenes/Scene1_ColdOpen';
import { Scene2_Transformation } from './scenes/Scene2_Transformation';
import { Scene3_Title } from './scenes/Scene3_Title';
import { Scene4_GCCMap } from './scenes/Scene4_GCCMap';
import { Scene5_TeamCulture } from './scenes/Scene5_TeamCulture';
import { Scene6_ExComReveal } from './scenes/Scene6_ExComReveal';
import { Scene7_Closing } from './scenes/Scene7_Closing';
import { HenkelLogo } from './components/HenkelLogo';

const CROSS = 15;

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const { scene1, scene2, scene3, scene4, scene5, scene6, scene7 } = SCENES;

  // ─── Transition opacity calculations ───

  // Scene 1 → 2
  const s1Opacity = frame >= scene1.end - CROSS
    ? interpolate(frame, [scene1.end - CROSS, scene1.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;

  // Scene 2
  const s2Opacity = (() => {
    const fi = frame >= scene1.end - CROSS
      ? interpolate(frame, [scene1.end - CROSS, scene1.end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 0;
    const fo = frame >= scene2.end - CROSS
      ? interpolate(frame, [scene2.end - CROSS, scene2.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;
    return fi * fo;
  })();

  // Scene 3
  const s3Opacity = (() => {
    const fi = frame >= scene2.end - CROSS
      ? interpolate(frame, [scene2.end - CROSS, scene2.end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 0;
    const fo = frame >= scene3.end - CROSS
      ? interpolate(frame, [scene3.end - CROSS, scene3.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;
    return fi * fo;
  })();

  // Scene 4
  const s4Opacity = (() => {
    const fi = frame >= scene3.end - CROSS
      ? interpolate(frame, [scene3.end - CROSS, scene3.end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 0;
    const fo = frame >= scene4.end - 20
      ? interpolate(frame, [scene4.end - 20, scene4.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;
    return fi * fo;
  })();

  // Scene 5 (handles its own internal fade to black)
  const s5Opacity = frame >= scene4.end - 20
    ? interpolate(frame, [scene4.end - 20, scene4.end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Scene 6 (fades in from scene 5's black)
  const s6Opacity = (() => {
    const fi = frame >= scene6.start - 10
      ? interpolate(frame, [scene6.start - 10, scene6.start], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 0;
    const fo = frame >= scene6.end - 20
      ? interpolate(frame, [scene6.end - 20, scene6.end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      : 1;
    return fi * fo;
  })();

  // Scene 7
  const s7Opacity = frame >= scene6.end - 20
    ? interpolate(frame, [scene6.end - 20, scene6.end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.deepBlack }}>
      {/* Scene 1: Cold Open */}
      {frame < scene1.end + CROSS && (
        <AbsoluteFill style={{ opacity: s1Opacity }}>
          <Scene1_ColdOpen />
        </AbsoluteFill>
      )}

      {/* Scene 2: Transformation Bridge */}
      {frame >= scene1.end - CROSS - 5 && frame < scene2.end + CROSS && (
        <AbsoluteFill style={{ opacity: s2Opacity }}>
          <Scene2_Transformation />
        </AbsoluteFill>
      )}

      {/* Scene 3: Title Card */}
      {frame >= scene2.end - CROSS - 5 && frame < scene3.end + CROSS && (
        <AbsoluteFill style={{ opacity: s3Opacity }}>
          <Scene3_Title />
        </AbsoluteFill>
      )}

      {/* Scene 4: GCC Map */}
      {frame >= scene3.end - CROSS - 5 && frame < scene4.end + 20 && (
        <AbsoluteFill style={{ opacity: s4Opacity }}>
          <Scene4_GCCMap />
        </AbsoluteFill>
      )}

      {/* Scene 5: Team Culture */}
      {frame >= scene4.end - 25 && frame < scene5.end + 10 && (
        <AbsoluteFill style={{ opacity: s5Opacity }}>
          <Scene5_TeamCulture />
        </AbsoluteFill>
      )}

      {/* Scene 6: ExCom Reveal */}
      {frame >= scene6.start - 15 && frame < scene6.end + 20 && (
        <AbsoluteFill style={{ opacity: s6Opacity }}>
          <Scene6_ExComReveal />
        </AbsoluteFill>
      )}

      {/* Scene 7: Closing */}
      {frame >= scene6.end - 25 && (
        <AbsoluteFill style={{ opacity: s7Opacity }}>
          <Scene7_Closing />
        </AbsoluteFill>
      )}

      {/* Henkel Logo Overlay */}
      <HenkelLogo />
    </AbsoluteFill>
  );
};
