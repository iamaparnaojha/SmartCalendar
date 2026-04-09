/**
 * CelebrationOverlay Component - Full-screen celebration animations
 * Supports "hearts" (favorites) and "reminders" (confetti/glow)
 */

'use client';

import React, { useEffect, useState, useMemo } from 'react';

export type CelebrationType = 'hearts' | 'reminder' | 'success';

interface CelebrationOverlayProps {
  isVisible: boolean;
  type: CelebrationType;
  onFinished: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  rotation: number;
  color: string;
  emoji: string;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ 
  isVisible, 
  type,
  onFinished 
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const config = useMemo(() => {
    switch (type) {
      case 'hearts':
        return {
          count: 60,
          emojis: ['❤️', '💖', '💝', '💕'],
          colors: ['#ff4d6d'],
          duration: 7000,
          animation: 'floatUp'
        };
      case 'reminder':
        return {
          count: 80,
          emojis: ['🔔', '✨', '🌟', '💫'],
          colors: ['#fbbf24', '#f59e0b', '#fff'],
          duration: 5000,
          animation: 'burst'
        };
      case 'success':
      default:
        return {
          count: 50,
          emojis: ['✅', '✨', '🎉'],
          colors: ['#10b981', '#34d399'],
          duration: 4000,
          animation: 'burst'
        };
    }
  }, [type]);

  useEffect(() => {
    if (isVisible) {
      const newParticles: Particle[] = Array.from({ length: config.count }).map((_, i) => ({
        id: i,
        x: config.animation === 'floatUp' ? Math.random() * 100 : 50, // start from middle for burst
        y: config.animation === 'floatUp' ? 110 + Math.random() * 20 : 50,
        size: 15 + Math.random() * 40,
        opacity: 0.5 + Math.random() * 0.5,
        duration: 2 + Math.random() * 4,
        delay: Math.random() * 1.5,
        rotation: Math.random() * 360,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        emoji: config.emojis[Math.floor(Math.random() * config.emojis.length)],
      }));
      setParticles(newParticles);

      const timeout = setTimeout(() => {
        onFinished();
        setParticles([]);
      }, config.duration);

      return () => clearTimeout(timeout);
    }
  }, [isVisible, config, onFinished]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: var(--opacity); }
          90% { opacity: var(--opacity); }
          100% {
            transform: translateY(-130vh) rotate(var(--rotation));
            opacity: 0;
          }
        }
        
        @keyframes burst {
          0% {
            transform: translate(0, 0) scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rotation));
            opacity: 0;
          }
        }

        .particle {
          position: absolute;
          animation: var(--animation) ease-out forwards;
          filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
        }

        .glow-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.15), transparent 70%);
          animation: glowPulse 2s ease-in-out infinite;
          opacity: 0;
          z-index: -1;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
      
      {type === 'reminder' && <div className="glow-overlay" />}

      {particles.map((p) => {
        // Calculate random target for burst
        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 60; // vh/vw
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        return (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              fontSize: `${p.size}px`,
              color: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ['--tx' as any]: `${tx}vw`,
              ['--ty' as any]: `${ty}vh`,
              ['--opacity' as any]: p.opacity,
              ['--rotation' as any]: `${p.rotation}deg`,
              ['--animation' as any]: config.animation,
            }}
          >
            {p.emoji}
          </div>
        );
      })}
    </div>
  );
};
