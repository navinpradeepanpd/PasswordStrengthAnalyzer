import React from 'react';
import { motion } from 'framer-motion';

/**
 * Circular Animated SVG Strength Gauge
 * Smoothly fills from 0% to 100%, changes color and drop-shadow glow by score,
 * and exhibits a pulse animation when reaching "Excellent" tier.
 *
 * @param {Object} props
 * @param {number} props.score - Score from 0 to 100
 * @param {string} props.label - Strength label ('Very Weak', 'Weak', 'Fair', 'Strong', 'Excellent')
 * @param {number} [props.size=170] - Diameter in pixels
 */
export default function CircularGauge({ score = 0, label = 'Very Weak', size = 170 }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset =
    circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const isExcellent = score >= 85;

  // Determine color and glow token
  const getTheme = () => {
    if (score >= 85) {
      return {
        color: '#22D3EE',
        textColor: 'text-neon-cyan',
        glow: 'drop-shadow(0 0 14px rgba(34, 211, 238, 0.7))',
        bg: 'rgba(34, 211, 238, 0.08)',
      };
    }
    if (score >= 70) {
      return {
        color: '#10B981',
        textColor: 'text-emerald-400',
        glow: 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.6))',
        bg: 'rgba(16, 185, 129, 0.06)',
      };
    }
    if (score >= 50) {
      return {
        color: '#EAB308',
        textColor: 'text-amber-400',
        glow: 'drop-shadow(0 0 12px rgba(234, 179, 8, 0.6))',
        bg: 'rgba(234, 179, 8, 0.06)',
      };
    }
    if (score >= 25) {
      return {
        color: '#F97316',
        textColor: 'text-orange-400',
        glow: 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.6))',
        bg: 'rgba(249, 115, 22, 0.06)',
      };
    }
    return {
      color: '#EF4444',
      textColor: 'text-rose-500',
      glow: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.6))',
      bg: 'rgba(239, 68, 68, 0.06)',
    };
  };

  const theme = getTheme();

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      {/* Background Pulse Aura when Excellent */}
      {isExcellent && (
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-neon-cyan/20 blur-xl pointer-events-none"
        />
      )}

      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <filter id={`gauge-glow-${score}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Animated Progress Ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          fill="none"
          style={{ filter: theme.glow }}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: progressOffset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>

      {/* Centered Score & Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
          STRENGTH
        </span>
        <motion.span
          key={score}
          initial={{ scale: 0.9, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-3xl font-heading font-extrabold tracking-tight ${theme.textColor}`}
        >
          {score}
        </motion.span>
        <span
          className={`text-xs font-mono font-semibold uppercase tracking-wider ${theme.textColor}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
