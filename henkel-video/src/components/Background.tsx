import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

interface BackgroundProps {
  variant?: "dark" | "gradient" | "henkel" | "stats";
}

export const Background: React.FC<BackgroundProps> = ({
  variant = "dark",
}) => {
  const frame = useCurrentFrame();

  const gradientAngle = interpolate(frame, [0, 900], [0, 360]);

  const backgrounds: Record<string, React.CSSProperties> = {
    dark: {
      background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #0A0A0A 100%)",
    },
    gradient: {
      background: `linear-gradient(${gradientAngle}deg, #0A0A0A 0%, #1A1A2E 25%, #16213E 50%, #1A1A2E 75%, #0A0A0A 100%)`,
    },
    henkel: {
      background: "linear-gradient(135deg, #0A0A0A 0%, #1A0A0A 50%, #0A0A0A 100%)",
    },
    stats: {
      background: "linear-gradient(180deg, #0A0A0A 0%, #0F1923 100%)",
    },
  };

  return (
    <AbsoluteFill style={backgrounds[variant]}>
      {/* Subtle animated grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(226,0,26,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(226,0,26,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.5,
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, rgba(226,0,26,0.08) 0%, transparent 70%)`,
        }}
      />

      {/* Corner accents */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 400,
          height: 400,
          background: "radial-gradient(circle at 100% 0%, rgba(226,0,26,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 400,
          height: 400,
          background: "radial-gradient(circle at 0% 100%, rgba(226,0,26,0.1) 0%, transparent 70%)",
        }}
      />
    </AbsoluteFill>
  );
};
