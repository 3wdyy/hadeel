import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface TeamMemberCardProps {
  name: string;
  title: string;
  country: string;
  flag: string;
  delay?: number;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  title,
  country,
  flag,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  const cardSpring = spring({
    frame: adjustedFrame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  const flagSpring = spring({
    frame: Math.max(0, adjustedFrame - 10),
    fps,
    config: { damping: 8, stiffness: 150, mass: 0.5 },
  });

  const textSpring = spring({
    frame: Math.max(0, adjustedFrame - 15),
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 40,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 24,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.2)",
        transform: `scale(${interpolate(cardSpring, [0, 1], [0.8, 1])}) translateY(${interpolate(cardSpring, [0, 1], [50, 0])}px)`,
        opacity: cardSpring,
        minWidth: 300,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}
    >
      {/* Avatar Placeholder */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #E2001A, #FF4444)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          transform: `scale(${interpolate(cardSpring, [0, 1], [0, 1])})`,
          boxShadow: "0 10px 30px rgba(226,0,26,0.4)",
        }}
      >
        <span style={{ fontSize: 48, fontWeight: 700, color: "#FFFFFF" }}>
          {name.charAt(0)}
        </span>
      </div>

      {/* Flag */}
      <div
        style={{
          fontSize: 60,
          marginBottom: 15,
          transform: `scale(${interpolate(flagSpring, [0, 1], [0, 1])}) rotate(${interpolate(flagSpring, [0, 0.5, 1], [0, -10, 0])}deg)`,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
        }}
      >
        {flag}
      </div>

      {/* Name */}
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#FFFFFF",
          fontFamily: "'Montserrat', sans-serif",
          marginBottom: 8,
          opacity: textSpring,
          transform: `translateY(${interpolate(textSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        {name}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 500,
          color: "rgba(255,255,255,0.7)",
          fontFamily: "'Montserrat', sans-serif",
          marginBottom: 8,
          opacity: textSpring,
          transform: `translateY(${interpolate(textSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        {title}
      </div>

      {/* Country */}
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#E2001A",
          fontFamily: "'Montserrat', sans-serif",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          opacity: textSpring,
          transform: `translateY(${interpolate(textSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        {country}
      </div>
    </div>
  );
};
