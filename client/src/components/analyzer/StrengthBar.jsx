import React from 'react';
import { motion } from 'framer-motion';

/**
 * Segmented Linear Strength Bar
 * 5 discrete tiers that illuminate and glow based on the password's strength score.
 *
 * @param {Object} props
 * @param {number} props.score - Overall score 0-100
 * @param {string} props.label - Strength label
 * @param {number} props.entropyBits - Effective entropy bits
 */
export default function StrengthBar({ score = 0, label = 'Very Weak', entropyBits = 0 }) {
  // Determine active segment index (0 to 4)
  let activeIndex = -1;
  if (score > 0) {
    if (score >= 85) activeIndex = 4;
    else if (score >= 70) activeIndex = 3;
    else if (score >= 50) activeIndex = 2;
    else if (score >= 25) activeIndex = 1;
    else activeIndex = 0;
  }

  const tiers = [
    {
      name: 'Critical',
      color: 'bg-strength-red',
      glow: 'shadow-[0_0_12px_rgba(239,68,68,0.6)]',
    },
    {
      name: 'Weak',
      color: 'bg-strength-orange',
      glow: 'shadow-[0_0_12px_rgba(249,115,22,0.6)]',
    },
    {
      name: 'Fair',
      color: 'bg-strength-yellow',
      glow: 'shadow-[0_0_12px_rgba(234,179,8,0.6)]',
    },
    {
      name: 'Strong',
      color: 'bg-strength-green',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.6)]',
    },
    { name: 'Excellent', color: 'bg-neon-cyan', glow: 'shadow-glow-cyan' },
  ];

  const currentTier = tiers[Math.max(0, activeIndex)];

  return (
    <div className="space-y-1.5 w-full">
      {/* Top Labels */}
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400 flex items-center gap-1.5">
          <span>RATING:</span>
          <span className="text-white font-semibold uppercase">
            {score > 0 ? label : 'ENTER PASSWORD'}
          </span>
        </span>
        <span className="text-slate-400">
          <span className="text-neon-cyan font-bold">{entropyBits}</span> BITS ENTROPY
        </span>
      </div>

      {/* 5-Segment Bar */}
      <div className="flex items-center gap-1.5 h-2.5 w-full bg-[#05060F]/60 p-0.5 rounded-full border border-white/5">
        {tiers.map((tier, idx) => {
          const isActive = idx <= activeIndex && score > 0;
          return (
            <div
              key={tier.name}
              className="relative flex-1 h-full rounded-full overflow-hidden bg-white/5 transition-all duration-300"
            >
              {isActive && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className={`h-full w-full rounded-full ${currentTier.color} ${
                    idx === activeIndex ? currentTier.glow : ''
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
