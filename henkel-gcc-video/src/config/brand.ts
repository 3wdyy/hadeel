// ═══════════════════════════════════════════
// BRAND CONFIGURATION — Henkel GCC HCB Team
// Cinematic dark-mode design system
// ═══════════════════════════════════════════

export const COLORS = {
  // ─── Dark Foundation ───
  deepBlack: '#0A0E17',
  richCharcoal: '#111827',
  navyDepth: '#0F172A',
  elevatedSurface: '#1E293B',
  cardSurface: '#1A2332',

  // ─── Brand Red ───
  henkelRed: '#E1000F',
  radiantRed: '#FF2D3B',
  deepRed: '#9B0007',
  redGlow: 'rgba(225, 0, 15, 0.35)',

  // ─── Accents ───
  warmGold: '#F59E0B',
  softGold: '#FCD34D',
  tealAccent: '#06B6D4',
  tealGlow: 'rgba(6, 182, 212, 0.15)',

  // ─── Text ───
  iceWhite: '#F1F5F9',
  coolSilver: '#94A3B8',
  mutedText: '#64748B',

  // ─── Map ───
  countryInactive: '#1E293B',
  countryActive: '#2D1A1E',
  countryBorder: 'rgba(148, 163, 184, 0.15)',
  countryActiveBorder: 'rgba(225, 0, 15, 0.4)',
  gulfWater: '#06B6D4',

  // ─── Utility ───
  white: '#FFFFFF',
  black: '#000000',
  glassBg: 'rgba(15, 23, 42, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassHighlight: 'rgba(255, 255, 255, 0.05)',
} as const;

// ─── Gradient Presets ───
export const GRADIENTS = {
  cinematic: `radial-gradient(ellipse at 50% 60%, ${COLORS.richCharcoal} 0%, ${COLORS.deepBlack} 100%)`,
  cinematicWarm: [
    `radial-gradient(ellipse at 20% 30%, rgba(225, 0, 15, 0.08) 0%, transparent 50%)`,
    `radial-gradient(ellipse at 80% 70%, rgba(6, 182, 212, 0.04) 0%, transparent 50%)`,
    `linear-gradient(145deg, ${COLORS.deepBlack} 0%, ${COLORS.richCharcoal} 50%, ${COLORS.navyDepth} 100%)`,
  ].join(', '),
  mapBackground: [
    `radial-gradient(ellipse at 55% 45%, rgba(225, 0, 15, 0.06) 0%, transparent 60%)`,
    `linear-gradient(135deg, ${COLORS.deepBlack} 0%, ${COLORS.richCharcoal} 40%, ${COLORS.navyDepth} 100%)`,
  ].join(', '),
  brandRed: `radial-gradient(ellipse at center, #FF2D3B 0%, ${COLORS.henkelRed} 40%, ${COLORS.deepRed} 100%)`,
  titleCard: `radial-gradient(ellipse at 50% 50%, ${COLORS.elevatedSurface} 0%, ${COLORS.richCharcoal} 50%, ${COLORS.deepBlack} 100%)`,
  vignette: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)',
} as const;

// ─── Shadow Presets ───
export const SHADOWS = {
  card: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)',
  glow: (color: string) => `0 0 20px ${color}, 0 0 40px ${color}`,
  textGlow: (color: string) => `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`,
  redGlow: `0 0 20px rgba(225, 0, 15, 0.3), 0 0 40px rgba(225, 0, 15, 0.15)`,
  innerLight: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
} as const;

export const FONT_FAMILY = 'Inter, "Segoe UI", system-ui, -apple-system, sans-serif';

export const TYPOGRAPHY = {
  hero: {
    fontSize: 84,
    fontWeight: 700,
    letterSpacing: -1.5,
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
    fontSize: 22,
    fontWeight: 400,
    letterSpacing: 0.5,
    lineHeight: 1.4,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: 0.3,
    lineHeight: 1.3,
  },
  cardRole: {
    fontSize: 15,
    fontWeight: 400,
    letterSpacing: 0.2,
    lineHeight: 1.3,
  },
  cardNationality: {
    fontSize: 13,
    fontWeight: 400,
    letterSpacing: 0.3,
    lineHeight: 1.3,
  },
  irinaName: {
    fontSize: 48,
    fontWeight: 700,
    letterSpacing: -0.3,
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
    fontSize: 38,
    fontWeight: 500,
    letterSpacing: 0.5,
    lineHeight: 1.3,
  },
  cultureLabel: {
    fontSize: 28,
    fontWeight: 600,
    letterSpacing: 2,
    lineHeight: 1.2,
  },
  mapCardCountry: {
    fontSize: 18,
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
    letterSpacing: 2,
    lineHeight: 1.0,
  },
  worldMapText: {
    fontSize: 42,
    fontWeight: 700,
    letterSpacing: 1,
    lineHeight: 1.2,
  },
} as const;

export const SPACING = {
  unit: 8,
  pagePadding: 80,
  cardGap: 16,
  cardPadding: 16,
  cardRadius: 16,
  photoRadius: '50%',
} as const;

export const LOGO = {
  placement: { right: 48, bottom: 40 },
  maxHeight: 40,
  opacity: 0.85,
  startFrame: 600,
  endFrame: 4200,
} as const;
