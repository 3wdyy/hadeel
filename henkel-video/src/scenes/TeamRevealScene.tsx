import React from "react";
import { AbsoluteFill, useCurrentFrame, spring, useVideoConfig, interpolate } from "remotion";
import { Background } from "../components/Background";
import { TeamMemberCard } from "../components/TeamMemberCard";

const teamMembers = [
  { name: "IRINA", title: "General Manager", country: "Russia", flag: "🇷🇺" },
  { name: "MOHAMED", title: "Business Lead", country: "Egypt & Germany", flag: "🇪🇬" },
  { name: "NICOLAS", title: "Operations Director", country: "France", flag: "🇫🇷" },
  { name: "JUDE", title: "Finance Manager", country: "Sri Lanka", flag: "🇱🇰" },
  { name: "HANY", title: "Marketing Lead", country: "Egypt", flag: "🇪🇬" },
  { name: "WAEL", title: "Sales Director", country: "Egypt", flag: "🇪🇬" },
];

export const TeamRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleReveal = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const subtitleReveal = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <AbsoluteFill>
      <Background variant="gradient" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          padding: 60,
        }}
      >
        {/* Title Section */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Montserrat', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
              marginBottom: 10,
              opacity: titleReveal,
            }}
          >
            We come from everywhere else
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#FFFFFF",
              fontFamily: "'Montserrat', sans-serif",
              opacity: subtitleReveal,
              transform: `translateY(${interpolate(subtitleReveal, [0, 1], [20, 0])}px)`,
            }}
          >
            Meet <span style={{ color: "#E2001A" }}>THE TEAM</span>
          </div>
        </div>

        {/* Team Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 30,
            flex: 1,
            alignContent: "center",
            padding: "0 40px",
          }}
        >
          {teamMembers.map((member, index) => (
            <TeamMemberCard
              key={member.name}
              name={member.name}
              title={member.title}
              country={member.country}
              flag={member.flag}
              delay={40 + index * 15}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
