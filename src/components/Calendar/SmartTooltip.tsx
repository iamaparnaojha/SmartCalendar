/**
 * SmartTooltip Component
 * Glassmorphic tooltip for day cells showing note previews, holiday info, etc.
 */

'use client';

import React from 'react';

interface SmartTooltipProps {
  /** Lines of text to display */
  lines: { label?: string; text: string; emoji?: string }[];
  /** Whether the tooltip is visible */
  visible: boolean;
  /** Accent color for the tooltip's top border */
  accentColor?: string;
}

export const SmartTooltip: React.FC<SmartTooltipProps> = ({
  lines,
  visible,
  accentColor,
}) => {
  if (!visible || lines.length === 0) return null;

  return (
    <div className="smart-tooltip animate-tooltip-in">
      <div
        className="smart-tooltip-content"
        style={{
          borderTop: accentColor
            ? `2px solid ${accentColor}`
            : '2px solid rgba(255,255,255,0.15)',
        }}
      >
        {lines.map((line, i) => (
          <div key={i} className={`${i > 0 ? 'mt-1.5 pt-1.5 border-t border-white/5' : ''}`}>
            {line.label && (
              <p className="text-[10px] font-body uppercase tracking-wider text-white/40 mb-0.5">
                {line.label}
              </p>
            )}
            <p className="text-xs font-body text-white/90 leading-relaxed">
              {line.emoji && <span className="mr-1.5">{line.emoji}</span>}
              {line.text}
            </p>
          </div>
        ))}
      </div>
      <div className="smart-tooltip-arrow" />
    </div>
  );
};

SmartTooltip.displayName = 'SmartTooltip';
