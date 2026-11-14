import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Flame,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { analyzePassword, loadCommonPasswords } from '../../lib/analyzer';
import { checkPwnedPassword } from '../../lib/breachChecker';
import GlassCard from '../ui/GlassCard';
import GlowBadge from '../ui/GlowBadge';
import CircularGauge from './CircularGauge';
import StrengthBar from './StrengthBar';
import CriteriaChecklist from './CriteriaChecklist';
import CrackTimeCard from './CrackTimeCard';
import EntropyVisualizer from './EntropyVisualizer';
import CharacterAnatomy from './CharacterAnatomy';
import SuggestionsPanel from './SuggestionsPanel';
import PasswordHistoryGuard from './PasswordHistoryGuard';

export default function PasswordAnalyzer() {
  const [password, setPassword] = useState('');
  const [debouncedPassword, setDebouncedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [breachResult, setBreachResult] = useState({
    isBreached: false,
    breachCount: 0,
    error: null,
  });
  const [isBreachLoading, setIsBreachLoading] = useState(false);
  const [hasTriggeredConfetti, setHasTriggeredConfetti] = useState(false);
  const inputRef = useRef(null);

  // Preload top 10k common passwords into memory during idle time
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => loadCommonPasswords(), {
        timeout: 2500,
      });
      return () => window.cancelIdleCallback(id);
    } else {
      const t = setTimeout(() => loadCommonPasswords(), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  // 150ms Debounce for real-time evaluation
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPassword(password);
    }, 150);

    return () => clearTimeout(handler);
  }, [password]);

  // Synchronous analysis
  const analysis = useMemo(() => {
    return analyzePassword(debouncedPassword);
  }, [debouncedPassword]);

  // Asynchronous Zero-Knowledge k-Anonymity Breach Check
  useEffect(() => {
    if (!debouncedPassword || debouncedPassword.length < 4) {
      setBreachResult({ isBreached: false, breachCount: 0, error: null });
      setIsBreachLoading(false);
      return;
    }

    const abortController = new AbortController();
    setIsBreachLoading(true);

    checkPwnedPassword(debouncedPassword, abortController.signal).then((res) => {
      setBreachResult(res);
      setIsBreachLoading(false);
    });

    return () => abortController.abort();
  }, [debouncedPassword]);

  // Trigger celebration confetti when reaching "Excellent" tier
  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.65 },
      colors: ['#22D3EE', '#8B5CF6', '#10B981', '#38BDF8'],
      ticks: 200,
      gravity: 1.1,
    });
  }, []);

  useEffect(() => {
    if (analysis.score >= 85 && !hasTriggeredConfetti && password.length >= 12) {
      triggerConfetti();
      setHasTriggeredConfetti(true);
    } else if (analysis.score < 85) {
      setHasTriggeredConfetti(false);
    }
  }, [analysis.score, hasTriggeredConfetti, password.length, triggerConfetti]);

  // Critically weak or breached shake condition
  const isCriticallyWeak =
    password.length > 0 &&
    (analysis.score < 25 ||
      analysis.patterns.isCommonPassword ||
      breachResult.isBreached);

  return (
    <section
      className="space-y-8 w-full max-w-6xl mx-auto"
      aria-labelledby="analyzer-heading"
    >
      {/* Hidden ARIA Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {password
          ? `Password evaluated. Strength score: ${analysis.score} out of 100, rated ${analysis.label}. Estimated crack time: ${analysis.crackTime.onlineThrottled.formatted}.`
          : 'Password analyzer input cleared.'}
      </div>

      {/* Main Large Glass Card Container */}
      <motion.div
        animate={isCriticallyWeak ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <GlassCard
          variant={
            isCriticallyWeak ? 'magenta' : analysis.score >= 85 ? 'cyan' : 'default'
          }
          showCorners
          className={`space-y-6 transition-all duration-300 ${
            isCriticallyWeak
              ? 'border-rose-500/50 shadow-[0_0_35px_-4px_rgba(244,63,94,0.4)]'
              : analysis.score >= 85
                ? 'shadow-glow-cyan'
                : ''
          }`}
        >
          {/* Header Row: Title & Safe Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div>
              <h2
                id="analyzer-heading"
                className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2.5"
              >
                <Lock className="w-5 h-5 text-neon-cyan" />
                <span>Password Strength Engine</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-layered entropy quantification &amp; k-anonymity breach verification
              </p>
            </div>

            {/* Paste-Safe Guarantee Pill */}
            <div className="flex items-center gap-2">
              <GlowBadge
                variant="violet"
                size="sm"
                icon={<ShieldCheck className="w-3.5 h-3.5" />}
              >
                100% PASTE-SAFE &bull; NEVER STORED
              </GlowBadge>
            </div>
          </div>

          {/* Upper Section: Input + Circular Strength Gauge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Input & Linear Bar (Left Column) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="password-eval-input"
                  className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center justify-between"
                >
                  <span>ENTER CREDENTIAL TO EVALUATE</span>
                  <span className="text-slate-400 font-normal">
                    {password.length} characters
                  </span>
                </label>

                {/* Cyber Input Field with Show/Hide Toggle */}
                <div className="relative">
                  <input
                    ref={inputRef}
                    id="password-eval-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => loadCommonPasswords()}
                    placeholder="Type or paste password to analyze..."
                    autoComplete="off"
                    spellCheck="false"
                    aria-describedby="paste-safe-note"
                    className="w-full bg-[#05060F]/90 text-white font-mono text-base sm:text-lg px-4 py-3.5 pr-14 rounded-2xl border border-white/10 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 placeholder:text-slate-500 transition-all shadow-inner"
                  />

                  {/* Show/Hide Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-neon-cyan/30"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-neon-cyan" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Paste-Safe Context Note */}
                <p
                  id="paste-safe-note"
                  className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 pt-0.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Evaluated in memory. Plaintext never leaves your browser sandbox.
                </p>
              </div>

              {/* Segmented Strength Bar */}
              <StrengthBar
                score={analysis.score}
                label={analysis.label}
                entropyBits={analysis.entropy.effectiveBits}
              />

              {/* Character Anatomy Chips */}
              <CharacterAnatomy password={password} showPassword={showPassword} />
            </div>

            {/* Circular Gauge (Right Column) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center py-2 lg:py-0 lg:border-l lg:border-white/5">
              <CircularGauge score={analysis.score} label={analysis.label} size={180} />
            </div>
          </div>

          {/* Breach Alert Banner (when found in HIBP or Common Passwords) */}
          <AnimatePresence>
            {(breachResult.isBreached || analysis.patterns.isCommonPassword) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300">
                  <Flame className="w-5 h-5 shrink-0 text-neon-magenta mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="font-heading font-bold text-sm text-white">
                      CRITICAL COMPROMISE DETECTED
                    </div>
                    <p className="leading-relaxed">
                      {breachResult.isBreached ? (
                        <>
                          This exact password has appeared{' '}
                          <span className="font-mono font-bold text-neon-magenta">
                            {breachResult.breachCount.toLocaleString()} times
                          </span>{' '}
                          in publicly exposed data breaches. Threat actors possess this in
                          rainbow tables.
                        </>
                      ) : (
                        'This password is listed in top 10,000 common dictionary attack databases.'
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Middle Row: Criteria Checklist + Entropy Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            <div className="lg:col-span-7">
              <CriteriaChecklist
                analysis={analysis}
                isBreached={breachResult.isBreached}
                isBreachLoading={isBreachLoading}
              />
            </div>

            <div className="lg:col-span-5">
              <EntropyVisualizer
                effectiveBits={analysis.entropy.effectiveBits}
                shannonPerSymbol={analysis.entropy.shannon}
                idealBits={analysis.entropy.idealBits}
              />
            </div>
          </div>

          {/* Bottom Row: Time-to-Crack Projections */}
          <div className="pt-2 border-t border-white/5">
            <CrackTimeCard crackTime={analysis.crackTime} />
          </div>

          {/* Weaknesses and Suggestions Callout (if any) */}
          {password.length > 0 && analysis.weaknesses.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
              <div className="font-heading font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Identified Security Deficiencies</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                {analysis.weaknesses.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
              {analysis.suggestions.length > 0 && (
                <div className="pt-2 border-t border-amber-500/10 flex items-center gap-1.5 text-slate-400">
                  <Lightbulb className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                  <span>{analysis.suggestions[0]}</span>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Stronger Alternatives & Generator Section */}
      <SuggestionsPanel
        currentPassword={debouncedPassword}
        onSelectPassword={(newPw) => {
          setPassword(newPw);
          inputRef.current?.focus();
          window.scrollTo({
            top:
              (inputRef.current?.getBoundingClientRect().top || 0) + window.scrollY - 120,
            behavior: 'smooth',
          });
        }}
      />

      {/* Password History Guard (Backend SQLite + Bcrypt) */}
      <PasswordHistoryGuard currentPassword={debouncedPassword} />
    </section>
  );
}
