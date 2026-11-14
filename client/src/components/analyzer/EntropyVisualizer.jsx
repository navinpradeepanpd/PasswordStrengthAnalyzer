import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck } from 'lucide-react';

/**
 * EntropyVisualizer Component
 * Renders a live Shannon entropy spectrum bar with labeled threshold markers.
 *
 * @param {Object} props
 * @param {number} props.effectiveBits - Calculated effective entropy bits
 * @param {number} props.shannonPerSymbol - Shannon entropy per symbol (bits/char)
 * @param {number} props.idealBits - Ideal theoretical entropy bits
 */
export default function EntropyVisualizer({
  effectiveBits = 0,
  shannonPerSymbol = 0,
  idealBits = 0,
}) {
  const maxScaleBits = 100;
  const progressPercent = Math.min(
    100,
    Math.max(0, (effectiveBits / maxScaleBits) * 100)
  );

  const thresholds = [
    {
      label: 'Low',
      bits: 28,
      pos: (28 / maxScaleBits) * 100,
      color: 'text-strength-red',
    },
    {
      label: 'Moderate',
      bits: 60,
      pos: (60 / maxScaleBits) * 100,
      color: 'text-strength-yellow',
    },
    {
      label: 'Strong',
      bits: 85,
      pos: (85 / maxScaleBits) * 100,
      color: 'text-strength-green',
    },
    { label: 'Fortress', bits: 100, pos: 100, color: 'text-neon-cyan' },
  ];

  return (
    <div className="space-y-3 p-4 rounded-2xl bg-[#0B0F1E]/50 border border-white/5 backdrop-blur-md">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
          <Activity className="w-3.5 h-3.5 text-neon-cyan" />
          INFORMATION ENTROPY SPECTRUM
        </span>
        <span className="text-slate-400">
          SHANNON H: <span className="text-neon-cyan font-bold">{shannonPerSymbol}</span>{' '}
          BITS/SYMBOL
        </span>
      </div>

      {/* Spectrum Waveform / Progress Bar with Threshold Markers */}
      <div className="relative pt-5 pb-4">
        {/* Track Bar */}
        <div className="relative h-3 w-full bg-[#05060F] rounded-full overflow-hidden border border-white/10 p-0.5">
          {/* Active Gradient Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-strength-red via-strength-yellow to-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          />
        </div>

        {/* Threshold Markers */}
        {thresholds.slice(0, 3).map((t) => (
          <div
            key={t.label}
            className="absolute top-1 -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: `${t.pos}%` }}
          >
            <span className="text-[10px] font-mono font-medium text-slate-400">
              {t.bits}b
            </span>
            <div className="w-px h-3 bg-white/20 my-0.5" />
          </div>
        ))}
      </div>

      {/* Threshold Labels Row */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5">
        <span>&lt; 28b: Low</span>
        <span>28-59b: Moderate</span>
        <span>60-84b: Strong</span>
        <span className="text-neon-cyan font-semibold">85b+: Fortress</span>
      </div>

      {idealBits > effectiveBits && (
        <div className="text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>
            Pattern deductions reduced entropy from {idealBits} to {effectiveBits} bits.
          </span>
        </div>
      )}
    </div>
  );
}
