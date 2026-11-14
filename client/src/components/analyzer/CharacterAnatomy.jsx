import React from 'react';
import { motion } from 'framer-motion';

/**
 * CharacterAnatomy Component
 * Displays typed characters as color-coded cryptographic tokens.
 *
 * @param {Object} props
 * @param {string} props.password - The raw password
 * @param {boolean} props.showPassword - Whether to reveal or mask with dots
 */
export default function CharacterAnatomy({ password = '', showPassword = true }) {
  if (!password) return null;

  const characters = Array.from(password);

  const getCharType = (char) => {
    if (/[\u0080-\u{10FFFF}]/u.test(char)) {
      return {
        label: 'Unicode',
        bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        dot: 'bg-rose-400',
      };
    }
    if (/[^a-zA-Z0-9\s]/.test(char)) {
      return {
        label: 'Symbol',
        bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-400',
      };
    }
    if (/[0-9]/.test(char)) {
      return {
        label: 'Digit',
        bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        dot: 'bg-amber-400',
      };
    }
    if (/[A-Z]/.test(char)) {
      return {
        label: 'Upper',
        bg: 'bg-neon-violet/15 text-violet-300 border-neon-violet/30',
        dot: 'bg-neon-violet',
      };
    }
    return {
      label: 'Lower',
      bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      dot: 'bg-neon-cyan',
    };
  };

  return (
    <div className="space-y-2 w-full pt-2">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span>CHARACTER ANATOMY ({characters.length} CODE POINTS)</span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-violet" /> Upper
          </span>
          <span className="flex items-center gap-1 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" /> Lower
          </span>
          <span className="flex items-center gap-1 text-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Digit
          </span>
          <span className="flex items-center gap-1 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Symbol
          </span>
        </div>
      </div>

      {/* Chips Container */}
      <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-[#05060F]/60 border border-white/5 max-h-36 overflow-y-auto">
        {characters.map((char, index) => {
          const type = getCharType(char);
          const displayChar = showPassword ? (char === ' ' ? '␣' : char) : '•';

          return (
            <motion.span
              key={`${index}-${char}`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              title={`Pos ${index + 1}: ${type.label}`}
              className={`inline-flex items-center justify-center min-w-[24px] h-7 px-1.5 rounded-lg border font-mono text-xs font-semibold select-none shadow-sm ${type.bg}`}
            >
              {displayChar}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
