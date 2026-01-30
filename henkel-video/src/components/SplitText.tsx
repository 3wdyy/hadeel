import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { FONTS, COLORS, SPRING_CONFIGS } from "../config";

interface SplitTextProps {
  text: string;
  delay?: number;
  staggerDelay?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  animation?: "fadeUp" | "fadeIn" | "scaleUp" | "blur" | "glitch" | "wave";
  style?: React.CSSProperties;
}

export const SplitText: React.FC<SplitTextProps> = ({
  text,
  delay = 0,
  staggerDelay = 2,
  fontSize = 64,
  fontWeight = 700,
  color = COLORS.white,
  animation = "fadeUp",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const letters = text.split("");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: FONTS.heading,
        fontSize,
        fontWeight,
        color,
        ...style,
      }}
    >
      {letters.map((letter, index) => {
        const letterDelay = delay + index * staggerDelay;
        const adjustedFrame = Math.max(0, frame - letterDelay);

        const progress = spring({
          frame: adjustedFrame,
          fps,
          config: SPRING_CONFIGS.snappy,
        });

        let letterStyle: React.CSSProperties = {};

        switch (animation) {
          case "fadeUp":
            letterStyle = {
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [40, 0])}px)`,
            };
            break;

          case "fadeIn":
            letterStyle = {
              opacity: progress,
            };
            break;

          case "scaleUp":
            letterStyle = {
              opacity: progress,
              transform: `scale(${interpolate(progress, [0, 1], [0, 1])})`,
            };
            break;

          case "blur":
            const blurAmount = interpolate(progress, [0, 1], [20, 0]);
            letterStyle = {
              opacity: progress,
              filter: `blur(${blurAmount}px)`,
              transform: `translateY(${interpolate(progress, [0, 1], [20, 0])}px)`,
            };
            break;

          case "glitch":
            const glitchOffset = adjustedFrame < 10 ? Math.sin(adjustedFrame * 5) * 5 : 0;
            letterStyle = {
              opacity: progress,
              transform: `translateX(${glitchOffset}px)`,
              textShadow: adjustedFrame < 10
                ? `${glitchOffset}px 0 ${COLORS.henkelRed}, ${-glitchOffset}px 0 cyan`
                : "none",
            };
            break;

          case "wave":
            const waveOffset = Math.sin((frame - letterDelay) * 0.1) * 10;
            letterStyle = {
              opacity: progress,
              transform: `translateY(${progress < 1 ? interpolate(progress, [0, 1], [30, 0]) : waveOffset}px)`,
            };
            break;
        }

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              ...letterStyle,
            }}
          >
            {letter === " " ? "\u00A0" : letter}
          </span>
        );
      })}
    </div>
  );
};

// Word by word animation
interface SplitWordsProps {
  text: string;
  delay?: number;
  staggerDelay?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  highlightWords?: string[];
  highlightColor?: string;
  style?: React.CSSProperties;
}

export const SplitWords: React.FC<SplitWordsProps> = ({
  text,
  delay = 0,
  staggerDelay = 8,
  fontSize = 48,
  fontWeight = 600,
  color = COLORS.white,
  highlightWords = [],
  highlightColor = COLORS.henkelRed,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.3em",
        fontFamily: FONTS.heading,
        fontSize,
        fontWeight,
        ...style,
      }}
    >
      {words.map((word, index) => {
        const wordDelay = delay + index * staggerDelay;
        const adjustedFrame = Math.max(0, frame - wordDelay);

        const progress = spring({
          frame: adjustedFrame,
          fps,
          config: SPRING_CONFIGS.smooth,
        });

        const isHighlighted = highlightWords.some(
          (hw) => word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              color: isHighlighted ? highlightColor : color,
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
              textShadow: isHighlighted ? `0 0 30px ${highlightColor}` : "none",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
