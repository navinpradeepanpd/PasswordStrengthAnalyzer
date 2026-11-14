import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

/**
 * CriteriaChecklist Component
 * Renders criteria list where items animate from ✗ to ✓ with a spark pop effect.
 *
 * @param {Object} props
 * @param {Object} props.analysis - Output from analyzePassword()
 * @param {boolean} props.isBreached - Output from checkPwnedPassword()
 * @param {boolean} props.isBreachLoading - Breach check in progress
 */
export default function CriteriaChecklist({
  analysis,
  isBreached = false,
  isBreachLoading = false,
}) {
  const { length, characterClasses, patterns } = analysis;

  const criteria = [
    {
      id: 'length',
      label: 'Length (12+ characters recommended)',
      passed: length.length >= 12,
      detail: `${length.length} chars`,
    },
    {
      id: 'upper',
      label: 'Uppercase letter (A-Z)',
      passed: characterClasses.upper,
    },
    {
      id: 'lower',
      label: 'Lowercase letter (a-z)',
      passed: characterClasses.lower,
    },
    {
      id: 'number',
      label: 'Numeric digit (0-9)',
      passed: characterClasses.digit,
    },
    {
      id: 'symbol',
      label: 'Special symbol or Unicode',
      passed: characterClasses.symbol || characterClasses.unicode,
    },
    {
      id: 'not-common',
      label: 'Not a common leaked password',
      passed: length.length > 0 && !patterns.isCommonPassword,
    },
    {
      id: 'no-patterns',
      label: 'No keyboard walks, runs, or dates',
      passed:
        length.length > 0 &&
        !patterns.hasKeyboardWalk &&
        !patterns.hasSequence &&
        !patterns.hasRepeatedChars &&
        !patterns.hasYearOrDate &&
        !patterns.hasLeetspeak,
    },
    {
      id: 'not-breached',
      label: 'Zero-knowledge breach check (k-anonymity)',
      passed: length.length > 0 && !isBreached && !isBreachLoading,
      loading: isBreachLoading,
    },
  ];

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
        <span>SECURITY CRITERIA AUDIT</span>
        <span>
          {criteria.filter((c) => c.passed).length} / {criteria.length} PASSED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {criteria.map((item) => {
          return (
            <div
              key={item.id}
              className={`relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                item.passed
                  ? 'bg-emerald-500/5 border-emerald-500/25 text-slate-200'
                  : 'bg-cyber-surface/40 border-white/5 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Animated Icon Container */}
                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    item.passed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-white/5 text-slate-500 border border-white/10'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {item.passed ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cross"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <X className="w-3 h-3 text-slate-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <span className="text-xs font-sans truncate">{item.label}</span>
              </div>

              {/* Spark Icon when passing */}
              {item.passed && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.3, 1], opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="text-emerald-400 shrink-0 ml-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
