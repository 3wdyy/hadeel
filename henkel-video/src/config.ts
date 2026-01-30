// Font configuration - using system fonts (network-restricted environment)
// For production, consider bundling fonts locally or using @remotion/google-fonts when network is available

// Font stacks optimized for cross-platform rendering
export const FONTS = {
  heading: "'Montserrat', 'Segoe UI', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'Inter', 'Segoe UI', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
  accent: "'Space Grotesk', 'SF Mono', 'Consolas', monospace",
};

// Brand colors
export const COLORS = {
  henkelRed: "#E2001A",
  henkelRedLight: "#FF2D3B",
  henkelRedDark: "#B80015",
  henkelRedGlow: "rgba(226, 0, 26, 0.6)",

  white: "#FFFFFF",
  whiteAlpha80: "rgba(255, 255, 255, 0.8)",
  whiteAlpha60: "rgba(255, 255, 255, 0.6)",
  whiteAlpha40: "rgba(255, 255, 255, 0.4)",
  whiteAlpha20: "rgba(255, 255, 255, 0.2)",
  whiteAlpha10: "rgba(255, 255, 255, 0.1)",

  black: "#000000",
  darkBg: "#0A0A0A",
  darkBgAlt: "#0F0F14",
  darkBgAccent: "#1A1A2E",

  gold: "#FFD700",
  goldGlow: "rgba(255, 215, 0, 0.4)",
};

// Animation presets
export const SPRING_CONFIGS = {
  snappy: { damping: 15, stiffness: 200, mass: 0.5 },
  smooth: { damping: 20, stiffness: 100, mass: 0.8 },
  bouncy: { damping: 8, stiffness: 150, mass: 0.6 },
  slow: { damping: 30, stiffness: 60, mass: 1 },
  dramatic: { damping: 6, stiffness: 40, mass: 1.5 },
};

// Easing functions for interpolate
export const EASINGS = {
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};
