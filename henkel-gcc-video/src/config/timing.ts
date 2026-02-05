// ═══════════════════════════════════════════
// TIMING CONFIGURATION — All frame numbers
// ═══════════════════════════════════════════

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  totalFrames: 4500,
  totalDurationSeconds: 150,
} as const;

// ─── Scene boundaries ───
export const SCENES = {
  scene1: { start: 0, end: 360 },
  scene2: { start: 360, end: 570 },
  scene3: { start: 570, end: 660 },
  scene4: { start: 660, end: 2010 },
  scene5: { start: 2010, end: 2850 },
  scene6: { start: 2850, end: 3510 },
  scene7: { start: 3510, end: 4500 },
} as const;

// ─── Scene 1: Cold Open ───
export const S1 = {
  line1Appear: 30,
  line1Reposition: 120,
  line2Appear: 120,
  line2Reposition: 210,
  line3Appear: 210,
  redScreenCut: 270,
  redScreenEnd: 360,
} as const;

// ─── Scene 2: Transformation Bridge ───
export const S2 = {
  desertStart: 360,
  yearLeftAppear: 375,
  wipeStart: 480,
  wipeEnd: 510,
  yearLeftDisappear: 500,
  yearRightAppear: 500,
  skylineStart: 510,
  transformTextAppear: 520,
  end: 570,
} as const;

// ─── Scene 3: Title ───
export const S3 = {
  titleAppear: 580,
  underlineStart: 590,
  logoAppear: 600,
} as const;

// ─── Scene 4: GCC Map ───
export const S4 = {
  mapAppearStart: 660,
  mapAppearEnd: 750,

  countries: [
    { name: 'Saudi Arabia', code: 'KSA', flag: '🇸🇦', sob: 54, start: 750, pinDrop: 765, cardAppear: 780, duration: 150 },
    { name: 'UAE', code: 'UAE', flag: '🇦🇪', sob: 22, start: 900, pinDrop: 915, cardAppear: 930, duration: 120 },
    { name: 'Kuwait', code: 'KWT', flag: '🇰🇼', sob: 13, start: 1020, pinDrop: 1035, cardAppear: 1050, duration: 120 },
    { name: 'Oman', code: 'OMN', flag: '🇴🇲', sob: 6, start: 1140, pinDrop: 1155, cardAppear: 1170, duration: 90 },
    { name: 'Bahrain', code: 'BHR', flag: '🇧🇭', sob: 3, start: 1260, pinDrop: 1275, cardAppear: 1290, duration: 90 },
    { name: 'Qatar', code: 'QAT', flag: '🇶🇦', sob: 2, start: 1380, pinDrop: 1395, cardAppear: 1410, duration: 90 },
  ],

  cardsHideStart: 1470,
  cardsHideDuration: 30,

  overlay1Start: 1560,
  overlay1End: 1710,
  overlay2Start: 1710,
  overlay2End: 1800,

  consumerLines: [
    { text: 'Half the world\'s oil reserves.', start: 1810, end: 1880 },
    { text: 'Family-centric. Influencer-driven.', start: 1885, end: 1945 },
    { text: 'World\'s highest smartphone penetration.', start: 1950, end: 2010 },
  ],
  mapDimStart: 1800,
} as const;

// ─── Scene 5: Team Culture ───
export const S5 = {
  diversityStart: 2010,
  diversityLines: [
    { text: '17 Nationalities.', appear: 2025, emphasis: false },
    { text: '10 Languages.', appear: 2055, emphasis: false },
    { text: '3 Generations.', appear: 2085, emphasis: false },
    { text: 'One Team.', appear: 2115, emphasis: true },
  ],
  diversityEnd: 2190,

  montageStart: 2190,
  rounds: [
    { label: 'We Celebrate', start: 2190, end: 2370 },
    { label: 'We Explore', start: 2370, end: 2550 },
    { label: 'We Connect', start: 2550, end: 2730 },
  ],
  montageEnd: 2730,

  excomTitleStart: 2730,
  excomTitleAppear: 2775,
  fadeToBlackStart: 2820,
  fadeToBlackEnd: 2850,
} as const;

// ─── Scene 6: ExCom Reveal ───
export const S6 = {
  irinaStart: 2850,
  irinaPhotoAppear: 2865,
  irinaNameAppear: 2895,
  irinaRoleAppear: 2910,
  irinaNatAppear: 2925,
  irinaEnd: 3000,

  gridStart: 3000,
  irinaMorphDuration: 25,
  cascadeStart: 3040,
  cascadeStagger: 15,
  gridHoldEnd: 3300,

  statsBarAppear: 3315,
  statsBarEnd: 3450,
  holdEnd: 3510,
} as const;

// ─── Scene 7: Closing ───
export const S7 = {
  worldMapStart: 3510,
  pinCascadeStart: 3545,
  pinStagger: 9,
  arcDrawStart: 3720,
  arcDrawDuration: 40,
  mapTextAppear: 3780,
  worldMapEnd: 3960,

  brandCloseStart: 3960,
  closingTextAppear: 3975,
  fadeToWhiteStart: 4200,
  fadeToWhiteEnd: 4500,
} as const;

// ─── Audio events ───
export const AUDIO = {
  musicFadeInEnd: 30,
  whooshFrames: [270, 480, 3960],
  clickFrames: [765, 915, 1035, 1155, 1275, 1395],
  musicFadeOutStart: 4200,
  musicFadeOutEnd: 4500,
} as const;
