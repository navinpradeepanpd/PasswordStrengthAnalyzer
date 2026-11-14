import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Sliders,
  ShieldCheck,
  KeyRound,
  FileText,
} from 'lucide-react';
import {
  getStrongerAlternatives,
  generateRandomPassword,
  generatePassphrase,
} from '../../lib/suggest';
import { analyzePassword } from '../../lib/analyzer';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import GlowBadge from '../ui/GlowBadge';

const GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?~0123456789ABCDEF';

export default function SuggestionsPanel({ currentPassword = '', onSelectPassword }) {
  // Generator configuration states
  const [genLength, setGenLength] = useState(18);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [genMode, setGenMode] = useState('token'); // 'token' or 'passphrase'
  const [passphraseWordCount, setPassphraseWordCount] = useState(4);

  // Active custom generated password
  const [customPassword, setCustomPassword] = useState('');
  const [displayPassword, setDisplayPassword] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);

  // Copied toast state
  const [copiedId, setCopiedId] = useState(null);

  // Suggestions based on current user password
  const [suggestions, setSuggestions] = useState([]);

  // Refresh suggestions when current password changes
  useEffect(() => {
    const list = getStrongerAlternatives(currentPassword, {
      length: genLength,
      uppercase: useUpper,
      lowercase: useLower,
      numbers: useNumbers,
      symbols: useSymbols,
    });
    // Filter down to the 3 best smart alternatives for the top card slots
    setSuggestions(list.slice(0, 3));
  }, [currentPassword, genLength, useUpper, useLower, useNumbers, useSymbols]);

  // Slot-machine scramble effect
  const scrambleText = useCallback((targetText) => {
    setIsScrambling(true);
    let iteration = 0;
    const maxIterations = 14;

    const interval = setInterval(() => {
      setDisplayPassword(() => {
        return targetText
          .split('')
          .map((char, index) => {
            if (index < (iteration / maxIterations) * targetText.length) {
              return char;
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');
      });

      iteration++;
      if (iteration > maxIterations) {
        clearInterval(interval);
        setDisplayPassword(targetText);
        setIsScrambling(false);
      }
    }, 28);
  }, []);

  // Generate new custom password
  const handleRegenerate = useCallback(() => {
    let next = '';
    if (genMode === 'passphrase') {
      next = generatePassphrase({
        wordCount: passphraseWordCount,
        separator: '-',
        includeNumber: true,
      });
    } else {
      next = generateRandomPassword({
        length: genLength,
        uppercase: useUpper,
        lowercase: useLower,
        numbers: useNumbers,
        symbols: useSymbols,
      });
    }
    setCustomPassword(next);
    scrambleText(next);
  }, [
    genMode,
    passphraseWordCount,
    genLength,
    useUpper,
    useLower,
    useNumbers,
    useSymbols,
    scrambleText,
  ]);

  // Initial generation
  useEffect(() => {
    handleRegenerate();
  }, [handleRegenerate]);

  // Analyze custom password
  const customAnalysis = useMemo(() => {
    return analyzePassword(customPassword);
  }, [customPassword]);

  const handleCopy = (id, text) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getBadgeVariant = (score) => {
    if (score >= 85) return 'cyan';
    if (score >= 70) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  return (
    <section
      className="space-y-6 w-full max-w-6xl mx-auto"
      aria-labelledby="suggestions-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div>
          <h2
            id="suggestions-heading"
            className="text-xl sm:text-2xl font-heading font-bold text-white flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-neon-cyan" />
            <span>Stronger Alternatives &amp; Generator</span>
          </h2>
          <p className="text-xs text-slate-400">
            Intelligent mutations preserving your base phrase, alongside cryptographic
            tokens
          </p>
        </div>

        <GlowBadge
          variant="cyan"
          size="sm"
          icon={<ShieldCheck className="w-3.5 h-3.5" />}
        >
          CRYPTO.GETRANDOMVALUES VERIFIED
        </GlowBadge>
      </div>

      {/* A. Three Staggered Suggestion Cards */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
          <span>Intelligent Enhancements (Based on your input)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {suggestions.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                className="h-full"
              >
                <GlassCard
                  variant="default"
                  interactive
                  className="h-full flex flex-col justify-between p-5 space-y-4 hover:border-neon-cyan/40"
                >
                  {/* Top Badge & Score Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      {item.type}
                    </span>
                    <GlowBadge variant={getBadgeVariant(item.score)} size="sm">
                      {item.score}/100 {item.label}
                    </GlowBadge>
                  </div>

                  {/* Password Display Box */}
                  <div className="p-3 rounded-xl bg-[#05060F]/80 border border-white/10 font-mono text-sm text-neon-cyan font-bold break-all select-all shadow-inner">
                    {item.password}
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    {/* Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.password)}
                      className="p-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 text-xs font-mono"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Use This Button */}
                    <NeonButton
                      variant="cyan"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      className="flex-1"
                      onClick={() => onSelectPassword?.(item.password)}
                    >
                      Use this
                    </NeonButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* B. Full Cryptographic Generator Panel with Slot-Machine Scramble */}
      <GlassCard variant="cyan" showCorners className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neon-cyan/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan shadow-glow-cyan">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-white">
                Cryptographic Token &amp; Passphrase Generator
              </h3>
              <p className="text-xs text-slate-300">
                Generate high-entropy strings powered by window.crypto.getRandomValues
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#05060F]/80 border border-white/10">
            <button
              type="button"
              onClick={() => setGenMode('token')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                genMode === 'token'
                  ? 'bg-neon-cyan text-cyber-bg font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Random Token
            </button>
            <button
              type="button"
              onClick={() => setGenMode('passphrase')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                genMode === 'passphrase'
                  ? 'bg-neon-cyan text-cyber-bg font-bold shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Diceware Passphrase
            </button>
          </div>
        </div>

        {/* Live Slot-Machine Scramble Display Screen */}
        <div className="p-5 rounded-2xl bg-[#05060F]/90 border border-neon-cyan/30 shadow-inner space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              GENERATED CREDENTIAL
            </span>
            <GlowBadge variant={getBadgeVariant(customAnalysis.score)} size="sm">
              {customAnalysis.score}/100 {customAnalysis.label} &bull;{' '}
              {customAnalysis.entropy.effectiveBits} BITS
            </GlowBadge>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div
              className={`font-mono text-lg sm:text-2xl font-bold tracking-wider break-all select-all transition-colors ${
                isScrambling ? 'text-neon-cyan/70' : 'text-white'
              }`}
            >
              {displayPassword || customPassword}
            </div>
          </div>

          {/* Quick Actions for Generated Password */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="text-xs font-mono text-slate-400">
              GPU Crack Estimate:{' '}
              <span className="text-emerald-400 font-semibold">
                {customAnalysis.crackTime.offlineFastHash.formatted}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <NeonButton
                variant="outline"
                size="sm"
                leftIcon={
                  copiedId === 'custom' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )
                }
                onClick={() => handleCopy('custom', customPassword)}
              >
                {copiedId === 'custom' ? 'Copied!' : 'Copy'}
              </NeonButton>

              <NeonButton
                variant="cyan"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => onSelectPassword?.(customPassword)}
              >
                Use this
              </NeonButton>

              <NeonButton
                variant="violet"
                size="sm"
                leftIcon={
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isScrambling ? 'animate-spin' : ''}`}
                  />
                }
                onClick={handleRegenerate}
              >
                Regenerate
              </NeonButton>
            </div>
          </div>
        </div>

        {/* Generator Controls (Sliders & Toggles) */}
        {genMode === 'token' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Length Slider (8 to 64) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">
                  TOKEN LENGTH: {genLength} CHARACTERS
                </span>
                <span className="text-neon-cyan font-bold">{genLength}</span>
              </div>
              <input
                id="token-length-slider"
                aria-label="Token length in characters"
                type="range"
                min="8"
                max="64"
                value={genLength}
                onChange={(e) => setGenLength(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-cyber-surface-raised rounded-lg appearance-none cursor-pointer accent-neon-cyan"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>8 chars</span>
                <span>24 chars</span>
                <span>48 chars</span>
                <span>64 chars</span>
              </div>
            </div>

            {/* Character Type Toggles */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-300">
                CHARACTER TYPES INCLUDED
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'A-Z', state: useUpper, set: setUseUpper, desc: 'Upper' },
                  { label: 'a-z', state: useLower, set: setUseLower, desc: 'Lower' },
                  { label: '0-9', state: useNumbers, set: setUseNumbers, desc: 'Digits' },
                  {
                    label: '!@#$',
                    state: useSymbols,
                    set: setUseSymbols,
                    desc: 'Symbols',
                  },
                ].map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => t.set(!t.state)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      t.state
                        ? 'bg-neon-cyan/15 border-neon-cyan/40 text-neon-cyan shadow-sm'
                        : 'bg-[#05060F]/60 border-white/5 text-slate-500 hover:border-white/10'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold">{t.label}</div>
                    <div className="text-[10px] text-slate-400">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">
                PASSPHRASE WORD COUNT: {passphraseWordCount} WORDS
              </span>
              <span className="text-neon-cyan font-bold">{passphraseWordCount}</span>
            </div>
            <input
              id="passphrase-words-slider"
              aria-label="Passphrase word count"
              type="range"
              min="3"
              max="6"
              value={passphraseWordCount}
              onChange={(e) => setPassphraseWordCount(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-cyber-surface-raised rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>3 words (Moderate)</span>
              <span>4 words (Strong)</span>
              <span>5 words (Fortress)</span>
              <span>6 words (Astronomical)</span>
            </div>
          </div>
        )}
      </GlassCard>
    </section>
  );
}
