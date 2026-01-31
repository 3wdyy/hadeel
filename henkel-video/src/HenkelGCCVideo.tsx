import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { HookScene } from "./scenes/HookScene";
import { GCCRegionIntroScene } from "./scenes/GCCRegionIntroScene";
import { PlotTwistScene } from "./scenes/PlotTwistScene";
import { TeamMemberProfileScene, TeamMemberData } from "./scenes/TeamMemberProfileScene";
import { ClosingScene } from "./scenes/ClosingScene";
import { COLORS } from "./config";

// 10-minute video timing (in frames at 30fps)
// Total: 18000 frames = 600 seconds = 10 minutes

const SCENES = {
  // Act 1: The Hook - 0:00 to 0:40 (40 sec)
  hook: { start: 0, duration: 1200 },

  // Act 2: GCC Region Intro - 0:40 to 2:30 (110 sec)
  gccIntro: { start: 1200, duration: 3300 },

  // Act 3: The Plot Twist - 2:30 to 3:15 (45 sec)
  plotTwist: { start: 4500, duration: 1350 },

  // Act 4: Meet the Team - 3:15 to 8:45 (~55 sec each, 6 people = 330 sec total)
  team: {
    irina: { start: 5850, duration: 1650 },      // 55 sec
    mohamed: { start: 7500, duration: 1650 },    // 55 sec
    nicolas: { start: 9150, duration: 1650 },    // 55 sec
    jude: { start: 10800, duration: 1650 },      // 55 sec
    hany: { start: 12450, duration: 1650 },      // 55 sec
    wael: { start: 14100, duration: 1650 },      // 55 sec
  },

  // Act 5: Closing - 8:45 to 10:00 (75 sec)
  closing: { start: 15750, duration: 2250 },
};

// Team member data
const TEAM_MEMBERS: Record<string, TeamMemberData> = {
  irina: {
    name: "IRINA",
    title: "General Manager",
    country: "Russia",
    flag: "🇷🇺",
    yearsAtHenkel: 20,
    previousRoles: [
      "Regional Sales Manager - Samara",
      "Head of Key Accounts Department",
      "Sales Director - Russia",
      "GM GCC (since Sept 2021)",
    ],
    funFacts: [
      "Mother of 3",
      "Born in Russia",
      "Learning French",
    ],
    hobby: "Fitness, Yoga & Cycling",
    hobbyIcon: "🧘",
  },
  mohamed: {
    name: "MOHAMED (TONSY)",
    title: "Business Lead",
    country: "Egypt",
    countrySecondary: "Germany",
    flag: "🇪🇬",
    flagSecondary: "🇩🇪",
    yearsAtHenkel: 12,
    previousRoles: [
      "Key Account Manager - MENA",
      "Trade Marketing Lead - Egypt",
      "Sales Representative - Cairo",
    ],
    funFacts: [
      "Dual Egyptian-German heritage",
      "Passionate about football",
      "Expert in Arabic coffee making",
    ],
    hobby: "Football",
    hobbyIcon: "⚽",
  },
  nicolas: {
    name: "NICOLAS",
    title: "Operations Director",
    country: "France",
    flag: "🇫🇷",
    yearsAtHenkel: 10,
    previousRoles: [
      "Supply Chain Manager - Europe",
      "Logistics Coordinator - France",
      "Operations Analyst - Paris",
    ],
    funFacts: [
      "Cycling enthusiast",
      "Amateur chef specializing in French cuisine",
      "Fluent in French, English, and Arabic",
    ],
    hobby: "Cycling",
    hobbyIcon: "🚴",
    landmark: "Eiffel Tower",
  },
  jude: {
    name: "JUDE",
    title: "Finance Manager",
    country: "Sri Lanka",
    flag: "🇱🇰",
    yearsAtHenkel: 8,
    previousRoles: [
      "Financial Analyst - Asia Pacific",
      "Accounting Lead - Sri Lanka",
      "Junior Accountant - Colombo",
    ],
    funFacts: [
      "Cricket fan and occasional player",
      "Tea connoisseur",
      "Yoga practitioner for 10+ years",
    ],
    hobby: "Cricket",
    hobbyIcon: "🏏",
  },
  hany: {
    name: "HANY",
    title: "Marketing Lead",
    country: "Egypt",
    flag: "🇪🇬",
    yearsAtHenkel: 9,
    previousRoles: [
      "Digital Marketing Manager - MENA",
      "Brand Specialist - Egypt",
      "Marketing Coordinator - Cairo",
    ],
    funFacts: [
      "Social media expert with 50K+ followers",
      "History buff, especially ancient Egypt",
      "Loves Egyptian street food",
    ],
    hobby: "Photography",
    hobbyIcon: "📷",
    landmark: "Pyramids",
  },
  wael: {
    name: "WAEL",
    title: "Sales Director",
    country: "Egypt",
    flag: "🇪🇬",
    yearsAtHenkel: 11,
    previousRoles: [
      "Regional Sales Manager - Gulf",
      "Key Account Executive - UAE",
      "Sales Representative - Egypt",
    ],
    funFacts: [
      "Third generation in sales",
      "Can negotiate in 5 languages",
      "Known for his legendary customer relationships",
    ],
    hobby: "Scuba Diving",
    hobbyIcon: "🤿",
    isEgyptAgain: true,
  },
};

// Crossfade transition component
const CrossfadeTransition: React.FC<{
  children: React.ReactNode;
  duration: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}> = ({ children, duration, fadeInDuration = 20, fadeOutDuration = 20 }) => {
  const frame = useCurrentFrame();

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

  return (
    <AbsoluteFill style={{ opacity: Math.min(fadeIn, fadeOut) }}>
      {children}
    </AbsoluteFill>
  );
};

export const HenkelGCCVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.darkBg }}>
      {/* ============================================ */}
      {/* ACT 1: THE HOOK (0:00 - 0:40) */}
      {/* ============================================ */}
      <Sequence from={SCENES.hook.start} durationInFrames={SCENES.hook.duration}>
        <CrossfadeTransition
          duration={SCENES.hook.duration}
          fadeInDuration={1}
          fadeOutDuration={30}
        >
          <HookScene />
        </CrossfadeTransition>
      </Sequence>

      {/* ============================================ */}
      {/* ACT 2: GCC REGION INTRO (0:40 - 2:30) */}
      {/* ============================================ */}
      <Sequence from={SCENES.gccIntro.start} durationInFrames={SCENES.gccIntro.duration}>
        <CrossfadeTransition
          duration={SCENES.gccIntro.duration}
          fadeInDuration={30}
          fadeOutDuration={30}
        >
          <GCCRegionIntroScene />
        </CrossfadeTransition>
      </Sequence>

      {/* ============================================ */}
      {/* ACT 3: THE PLOT TWIST (2:30 - 3:15) */}
      {/* ============================================ */}
      <Sequence from={SCENES.plotTwist.start} durationInFrames={SCENES.plotTwist.duration}>
        <CrossfadeTransition
          duration={SCENES.plotTwist.duration}
          fadeInDuration={15}
          fadeOutDuration={30}
        >
          <PlotTwistScene />
        </CrossfadeTransition>
      </Sequence>

      {/* ============================================ */}
      {/* ACT 4: MEET THE TEAM (3:15 - 8:45) */}
      {/* ~55 seconds per person */}
      {/* ============================================ */}

      {/* IRINA - General Manager 🇷🇺 */}
      <Sequence from={SCENES.team.irina.start} durationInFrames={SCENES.team.irina.duration}>
        <CrossfadeTransition
          duration={SCENES.team.irina.duration}
          fadeInDuration={25}
          fadeOutDuration={25}
        >
          <TeamMemberProfileScene member={TEAM_MEMBERS.irina} />
        </CrossfadeTransition>
      </Sequence>

      {/* MOHAMED (TONSY) 🇪🇬🇩🇪 */}
      <Sequence from={SCENES.team.mohamed.start} durationInFrames={SCENES.team.mohamed.duration}>
        <CrossfadeTransition
          duration={SCENES.team.mohamed.duration}
          fadeInDuration={25}
          fadeOutDuration={25}
        >
          <TeamMemberProfileScene member={TEAM_MEMBERS.mohamed} />
        </CrossfadeTransition>
      </Sequence>

      {/* NICOLAS 🇫🇷 */}
      <Sequence from={SCENES.team.nicolas.start} durationInFrames={SCENES.team.nicolas.duration}>
        <CrossfadeTransition
          duration={SCENES.team.nicolas.duration}
          fadeInDuration={25}
          fadeOutDuration={25}
        >
          <TeamMemberProfileScene member={TEAM_MEMBERS.nicolas} />
        </CrossfadeTransition>
      </Sequence>

      {/* JUDE 🇱🇰 */}
      <Sequence from={SCENES.team.jude.start} durationInFrames={SCENES.team.jude.duration}>
        <CrossfadeTransition
          duration={SCENES.team.jude.duration}
          fadeInDuration={25}
          fadeOutDuration={25}
        >
          <TeamMemberProfileScene member={TEAM_MEMBERS.jude} />
        </CrossfadeTransition>
      </Sequence>

      {/* HANY 🇪🇬 */}
      <Sequence from={SCENES.team.hany.start} durationInFrames={SCENES.team.hany.duration}>
        <CrossfadeTransition
          duration={SCENES.team.hany.duration}
          fadeInDuration={25}
          fadeOutDuration={25}
        >
          <TeamMemberProfileScene member={TEAM_MEMBERS.hany} />
        </CrossfadeTransition>
      </Sequence>

      {/* WAEL 🇪🇬 (Egypt again!) */}
      <Sequence from={SCENES.team.wael.start} durationInFrames={SCENES.team.wael.duration}>
        <CrossfadeTransition
          duration={SCENES.team.wael.duration}
          fadeInDuration={25}
          fadeOutDuration={25}
        >
          <TeamMemberProfileScene member={TEAM_MEMBERS.wael} />
        </CrossfadeTransition>
      </Sequence>

      {/* ============================================ */}
      {/* ACT 5: CLOSING (8:45 - 10:00) */}
      {/* ============================================ */}
      <Sequence from={SCENES.closing.start} durationInFrames={SCENES.closing.duration}>
        <CrossfadeTransition
          duration={SCENES.closing.duration}
          fadeInDuration={25}
          fadeOutDuration={0}
        >
          <ClosingScene />
        </CrossfadeTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
