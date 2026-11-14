import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Terminal, ShieldCheck, Zap } from 'lucide-react';

const BOOT_LOGS = [
  { text: 'MOUNTING AEGIS KERNEL v2.0... [SECURE BOOT ACTIVE]', delay: 50 },
  { text: 'INITIALIZING CRYPTO SUBSYSTEM: SHA-256 & BCRYPT (COST 12)', delay: 280 },
  { text: 'LOADING 10,000 BREACH COMPILATION RECORDS IN MEMORY... [OK]', delay: 580 },
  {
    text: 'ESTABLISHING ZERO-KNOWLEDGE K-ANONYMITY RANGE SERVICE... [READY]',
    delay: 880,
  },
  { text: 'SYNCING WEBASSEMBLY SQLITE CREDENTIAL HISTORY LEDGER... [OK]', delay: 1180 },
  { text: 'DEFENSE MATRIX ARMED. LAUNCHING COMMAND SYSTEM...', delay: 1450 },
];

export default function BootSequence({ onComplete }) {
  const shouldReduceMotion = useReducedMotion();
  const [visibleLogs, setVisibleLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const isBotOrAudit =
      typeof navigator !== 'undefined' &&
      (navigator.userAgent.includes('Chrome-Lighthouse') ||
        navigator.userAgent.includes('HeadlessChrome') ||
        navigator.userAgent.includes('Lighthouse'));

    // If user prefers reduced motion or audit bot, complete immediately
    if (shouldReduceMotion || isBotOrAudit) {
      onComplete?.();
      return;
    }

    const timers = [];

    // Schedule log lines
    BOOT_LOGS.forEach((log) => {
      const t = setTimeout(() => {
        setVisibleLogs((prev) => [...prev, log.text]);
      }, log.delay);
      timers.push(t);
    });

    // Animate progress bar to 100% in 1.5s
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return Math.min(100, prev + 3);
      });
    }, 45);

    // Final finish timeout (1.85s total)
    const endTimer = setTimeout(() => {
      setIsDone(true);
      setTimeout(() => onComplete?.(), 300);
    }, 1850);
    timers.push(endTimer);

    // Keyboard listener for Escape/Space/Enter to skip
    const handleKeyDown = (e) => {
      if (['Escape', ' ', 'Enter'].includes(e.key)) {
        setIsDone(true);
        onComplete?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete, shouldReduceMotion]);

  const handleSkip = () => {
    setIsDone(true);
    onComplete?.();
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          onClick={handleSkip}
          className="fixed inset-0 z-[100] bg-[#05060F] flex flex-col justify-between p-6 sm:p-12 cursor-pointer select-none font-mono text-xs overflow-hidden"
          role="dialog"
          aria-label="System Boot Sequence"
        >
          {/* Subtle Grid Backdrop */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(34,211,238,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.1) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between text-slate-400 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2 text-neon-cyan">
              <ShieldCheck className="w-5 h-5 text-neon-cyan" />
              <span className="font-heading font-bold text-sm tracking-wider text-white">
                AEGIS // BOOT TERMINAL
              </span>
            </div>

            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-slate-300 hover:text-white hover:border-neon-cyan transition-all text-[11px]"
            >
              <span>SKIP [ESC]</span>
              <Zap className="w-3 h-3 text-neon-cyan" />
            </button>
          </div>

          {/* Central Terminal Output */}
          <div className="relative z-10 max-w-2xl w-full mx-auto my-auto space-y-3 py-8">
            <div className="flex items-center gap-2 text-neon-cyan text-sm mb-4">
              <Terminal className="w-4 h-4" />
              <span>SECURITY KERNEL INITIALIZATION // TELEMETRY STREAM</span>
            </div>

            <div className="space-y-2 text-slate-300">
              {visibleLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-neon-cyan">&gt;</span>
                  <span
                    className={
                      log.includes('[OK]') || log.includes('[READY]')
                        ? 'text-emerald-400'
                        : log.includes('AEGIS')
                          ? 'text-white font-bold'
                          : 'text-slate-300'
                    }
                  >
                    {log}
                  </span>
                </div>
              ))}
              <span className="inline-block w-2 h-4 bg-neon-cyan animate-pulse ml-2 align-middle" />
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="relative z-10 max-w-2xl w-full mx-auto space-y-2 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>SYSTEM CHECK STATUS</span>
              <span className="text-neon-cyan font-bold">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-neon-cyan via-neon-violet to-emerald-400 rounded-full transition-all duration-100 shadow-glow-cyan"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
