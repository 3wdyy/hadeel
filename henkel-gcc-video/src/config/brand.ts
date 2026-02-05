// ═══════════════════════════════════════════
// BRAND CONFIGURATION — Henkel GCC HCB Team
// ═══════════════════════════════════════════

export const COLORS = {
  henkelRed: '#E1000F',
  white: '#FFFFFF',
  darkGray: '#333333',
  black: '#000000',
  warmGrayBg: '#F5F0EB',
  sandHighlight: '#E8DCC8',
  darkSpotlight: '#1A1A1A',
  lightText: '#CCCCCC',
  softRed: '#FF6B6B',
  warmGold: '#D4A853',
  // Map-specific
  countryInactive: '#D8D8D8',
  countryBorder: '#BBBBBB',
  gulfWater: '#E2E8ED',
  // Grid background
  lightGray: '#F2F2F2',
} as const;

export const FONT_FAMILY = 'Inter, system-ui, -apple-system, sans-serif';

export const TYPOGRAPHY = {
  hero: {
    fontSize: 80,
    fontWeight: 700,
    letterSpacing: -1,
    lineHeight: 1.1,
  },
  headline: {
    fontSize: 72,
    fontWeight: 700,
    letterSpacing: -0.5,
    lineHeight: 1.15,
  },
  subheadline: {
    fontSize: 56,
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  sectionTitle: {
    fontSize: 64,
    fontWeight: 700,
    letterSpacing: -0.5,
    lineHeight: 1.15,
  },
  statLarge: {
    fontSize: 64,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.0,
  },
  statLabel: {
    fontSize: 24,
    fontWeight: 400,
    letterSpacing: 0.5,
    lineHeight: 1.4,
  },
  cardName: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 0.3,
    lineHeight: 1.3,
  },
  cardRole: {
    fontSize: 16,
    fontWeight: 400,
    letterSpacing: 0.2,
    lineHeight: 1.3,
  },
  cardNationality: {
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: 0.3,
    lineHeight: 1.3,
  },
  irinaName: {
    fontSize: 44,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.2,
  },
  irinaRole: {
    fontSize: 28,
    fontWeight: 400,
    letterSpacing: 0.3,
    lineHeight: 1.3,
  },
  irinaFlag: {
    fontSize: 22,
    fontWeight: 400,
    letterSpacing: 0.3,
    lineHeight: 1.3,
  },
  contextLine: {
    fontSize: 36,
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: 1.3,
  },
  cultureLabel: {
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: 1,
    lineHeight: 1.2,
  },
  mapCardCountry: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 0.3,
    lineHeight: 1.2,
  },
  mapCardStat: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 0,
    lineHeight: 1.0,
  },
  statsBar: {
    fontSize: 22,
    fontWeight: 600,
    letterSpacing: 1,
    lineHeight: 1.0,
  },
  worldMapText: {
    fontSize: 40,
    fontWeight: 700,
    letterSpacing: 0.5,
    lineHeight: 1.2,
  },
} as const;

export const SPACING = {
  unit: 8,
  pagePadding: 80,
  cardGap: 16,
  cardPadding: 16,
  cardRadius: 12,
  photoRadius: '50%',
} as const;

export const LOGO = {
  placement: { right: 48, bottom: 40 },
  maxHeight: 40,
  opacity: 0.85,
  // Visible from Scene 3 (frame 600) through Scene 6 (frame 3510)
  startFrame: 600,
  endFrame: 3510,
} as const;
