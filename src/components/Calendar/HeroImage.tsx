/**
 * HeroImage Component - Calendar poster section with premium glassmorphic overlay
 */

'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getImageForMonth, getMonthTheme } from '@utils/imageUtils';

interface HeroImageProps {
  currentMonth: Date;
  isDarkTheme?: boolean;
}

export const HeroImage: React.FC<HeroImageProps> = ({
  currentMonth,
  isDarkTheme = false,
}) => {
  const [prevImageUrl, setPrevImageUrl] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const imageData = useMemo(() => {
    return getImageForMonth(currentMonth.getMonth());
  }, [currentMonth]);

  const monthTheme = useMemo(() => {
    return getMonthTheme(currentMonth.getMonth());
  }, [currentMonth]);

  const monthName = useMemo(() => {
    return format(currentMonth, 'MMMM');
  }, [currentMonth]);

  const year = useMemo(() => {
    return format(currentMonth, 'yyyy');
  }, [currentMonth]);

  // Crossfade when image changes
  useEffect(() => {
    if (prevImageUrl && prevImageUrl !== imageData.url) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPrevImageUrl(imageData.url);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setPrevImageUrl(imageData.url);
    }
  }, [imageData.url]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl group">
      {/* Previous Image (for crossfade) */}
      {isTransitioning && prevImageUrl && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${prevImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Current Background Image */}
      <div
        className={`absolute inset-0 z-[1] ${isTransitioning ? 'animate-bg-crossfade' : ''}`}
        style={{
          backgroundImage: `url(${imageData.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 8s ease-out',
        }}
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.7) 100%
          )`,
        }}
      />

      {/* Accent color overlay */}
      <div
        className="absolute inset-0 z-[3] opacity-20"
        style={{
          background: `linear-gradient(135deg, ${imageData.colors.primary}88 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center">
        {/* Glassmorphic content card */}
        <div
          className="text-center px-8 py-6 rounded-2xl"
          style={{
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Month Name */}
          <h1
            className="premium-heading text-4xl md:text-6xl font-bold text-white drop-shadow-lg tracking-wide"
            style={{
              textShadow: `0 2px 20px ${imageData.colors.primary}80`,
            }}
          >
            {monthName}
          </h1>

          {/* Year */}
          <p
            className="font-body text-lg md:text-xl text-white/80 mt-2 font-light tracking-[0.2em] uppercase"
          >
            {year}
          </p>

          {/* Decorative line */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <div
              className="h-[1px] w-12"
              style={{
                background: `linear-gradient(to right, transparent, ${imageData.colors.accent}80, transparent)`,
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-gentle-pulse"
              style={{ backgroundColor: imageData.colors.accent }}
            />
            <div
              className="h-[1px] w-12"
              style={{
                background: `linear-gradient(to right, transparent, ${imageData.colors.accent}80, transparent)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Corner decorative elements */}
      <div
        className="absolute top-4 left-4 z-[5] w-8 h-8 border-t border-l opacity-30"
        style={{ borderColor: imageData.colors.accent }}
      />
      <div
        className="absolute bottom-4 right-4 z-[5] w-8 h-8 border-b border-r opacity-30"
        style={{ borderColor: imageData.colors.accent }}
      />
    </div>
  );
};

HeroImage.displayName = 'HeroImage';
