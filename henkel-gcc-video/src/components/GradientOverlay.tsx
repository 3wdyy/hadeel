import React from 'react';

interface GradientOverlayProps {
  direction?: 'bottom' | 'top';
  opacity?: number;
}

export const GradientOverlay: React.FC<GradientOverlayProps> = ({
  direction = 'bottom',
  opacity = 0.6,
}) => {
  const gradient = direction === 'bottom'
    ? `linear-gradient(to top, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,${opacity * 0.3}) 40%, transparent 100%)`
    : `linear-gradient(to bottom, rgba(0,0,0,${opacity}) 0%, rgba(0,0,0,${opacity * 0.3}) 40%, transparent 100%)`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: gradient,
        pointerEvents: 'none',
      }}
    />
  );
};
