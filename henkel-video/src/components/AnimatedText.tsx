import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface AnimatedTextProps {
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  style?: React.CSSProperties;
  animationType?: "fade" | "spring" | "typewriter" | "scale" | "slideUp";
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  fontSize = 64,
  color = "#FFFFFF",
  fontWeight = 700,
  style = {},
  animationType = "spring",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  let opacity = 1;
  let transform = "none";

  switch (animationType) {
    case "fade":
      opacity = interpolate(adjustedFrame, [0, 20], [0, 1], {
        extrapolateRight: "clamp",
      });
      break;

    case "spring":
      const springVal = spring({
        frame: adjustedFrame,
        fps,
        config: { damping: 12, stiffness: 100, mass: 0.5 },
      });
      opacity = springVal;
      transform = `translateY(${interpolate(springVal, [0, 1], [30, 0])}px)`;
      break;

    case "scale":
      const scaleSpring = spring({
        frame: adjustedFrame,
        fps,
        config: { damping: 10, stiffness: 80, mass: 0.8 },
      });
      opacity = scaleSpring;
      transform = `scale(${interpolate(scaleSpring, [0, 1], [0.5, 1])})`;
      break;

    case "slideUp":
      const slideSpring = spring({
        frame: adjustedFrame,
        fps,
        config: { damping: 15, stiffness: 120 },
      });
      opacity = slideSpring;
      transform = `translateY(${interpolate(slideSpring, [0, 1], [80, 0])}px)`;
      break;

    case "typewriter":
      const charsToShow = Math.floor(
        interpolate(adjustedFrame, [0, text.length * 2], [0, text.length], {
          extrapolateRight: "clamp",
        })
      );
      return (
        <div
          style={{
            fontSize,
            fontWeight,
            color,
            fontFamily: "'Montserrat', sans-serif",
            ...style,
          }}
        >
          {text.slice(0, charsToShow)}
          <span style={{ opacity: frame % 20 < 10 ? 1 : 0 }}>|</span>
        </div>
      );
  }

  return (
    <div
      style={{
        fontSize,
        fontWeight,
        color,
        opacity,
        transform,
        fontFamily: "'Montserrat', sans-serif",
        ...style,
      }}
    >
      {text}
    </div>
  );
};
