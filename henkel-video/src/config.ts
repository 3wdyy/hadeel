// Font configuration - using system fonts (network-restricted environment)
// Using Segoe UI as specified in the storyboard

export const FONTS = {
  heading: "'Segoe UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'Segoe UI', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
  accent: "'Segoe UI Semibold', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
};

// Brand colors - Henkel official
export const COLORS = {
  // Primary Henkel Red
  henkelRed: "#E1000F",
  henkelRedLight: "#FF2020",
  henkelRedDark: "#B8000C",
  henkelRedGlow: "rgba(225, 0, 15, 0.6)",

  // Neutrals
  white: "#FFFFFF",
  black: "#000000",
  darkGray: "#333333",
  lightGray: "#888888",

  // White alpha variants
  whiteAlpha80: "rgba(255, 255, 255, 0.8)",
  whiteAlpha60: "rgba(255, 255, 255, 0.6)",
  whiteAlpha40: "rgba(255, 255, 255, 0.4)",
  whiteAlpha20: "rgba(255, 255, 255, 0.2)",
  whiteAlpha10: "rgba(255, 255, 255, 0.1)",

  // Background colors
  darkBg: "#000000",
  darkBgAlt: "#111111",
  darkBgAccent: "#1A1A1A",
};

// Flag colors - exact specifications
export const FLAG_COLORS = {
  russia: {
    stripe1: "#FFFFFF",  // White
    stripe2: "#0039A6",  // Blue
    stripe3: "#D52B1E",  // Red
  },
  egypt: {
    stripe1: "#CE1126",  // Red
    stripe2: "#FFFFFF",  // White
    stripe3: "#000000",  // Black
  },
  france: {
    stripe1: "#002395",  // Blue
    stripe2: "#FFFFFF",  // White
    stripe3: "#ED2939",  // Red
  },
  sriLanka: {
    stripe1: "#8D153A",  // Maroon
    stripe2: "#FF7F00",  // Orange
    stripe3: "#006A4E",  // Green
  },
  germany: {
    stripe1: "#000000",  // Black
    stripe2: "#DD0000",  // Red
    stripe3: "#FFCC00",  // Gold
  },
};

// Animation presets - as per guidelines
export const SPRING_CONFIGS = {
  // For dramatic number reveals
  dramatic: { damping: 12, stiffness: 80, mass: 0.8 },
  // For bouncy reveals
  bouncy: { damping: 12, stiffness: 100, mass: 0.6 },
  // For smooth fades
  smooth: { damping: 20, stiffness: 100, mass: 0.8 },
  // For quick snappy animations
  snappy: { damping: 15, stiffness: 200, mass: 0.5 },
  // For slow reveals
  slow: { damping: 30, stiffness: 60, mass: 1 },
};

// Standard durations in frames (at 30fps)
export const DURATIONS = {
  quickCut: 15,      // 0.5 sec
  shortHold: 30,     // 1 sec
  mediumHold: 90,    // 3 sec
  longHold: 120,     // 4 sec
  readingTime: 180,  // 6 sec
  profileCard: 240,  // 8 sec
};

// Stagger delays for sequential animations
export const STAGGER = {
  fast: 8,
  medium: 12,
  slow: 15,
};

// Easing functions
export const EASINGS = {
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};
