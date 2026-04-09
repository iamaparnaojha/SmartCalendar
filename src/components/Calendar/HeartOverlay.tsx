/**
 * HeartOverlay Component - Full-screen heart celebration animation
 */

'use client';

import React, { useEffect, useState } from 'react';

interface HeartOverlayProps {
  isVisible: boolean;
  onFinished: () => void;
}

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  rotation: number;
}

export const HeartOverlay: React.FC<HeartOverlayProps> = ({ isVisible, onFinished }) => {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Create a burst of hearts
      const newHearts: Heart[] = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage
        y: 110 + Math.random() * 20, // start below screen
        size: 15 + Math.random() * 40,
        opacity: 0.5 + Math.random() * 0.5,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 2,
        rotation: Math.random() * 360,
      }));
      setHearts(newHearts);

      // Cleanup after duration
      const timeout = setTimeout(() => {
        onFinished();
        setHearts([]);
      }, 7000);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, onFinished]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity);
          }
          90% {
            opacity: var(--opacity);
          }
          100% {
            transform: translateY(-130vh) rotate(var(--rotation));
            opacity: 0;
          }
        }
        .heart {
          position: absolute;
          animation: floatUp linear forwards;
          color: #ff4d6d;
          filter: drop-shadow(0 0 10px rgba(255, 77, 109, 0.4));
        }
      `}</style>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            ['--opacity' as any]: heart.opacity,
            ['--rotation' as any]: `${heart.rotation}deg`,
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};
