import React, { useState, useEffect, useRef } from 'react';
import { Hash, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import GlowBadge from '../ui/GlowBadge';

const HEX_CHARS = '0123456789abcdef';

async function computeSha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function LiveSha256Hasher() {
  const [inputText, setInputText] = useState('crypto-demo-2025');
  const [displayChars, setDisplayChars] = useState(Array(64).fill('0'));
  const [scramblingIndices, setScramblingIndices] = useState(new Set());
  const [copied, setCopied] = useState(false);
  const [bitsFlippedCount, setBitsFlippedCount] = useState(0);

  const prevHashRef = useRef('');
  const scrambleIntervals = useRef([]);

  useEffect(() => {
    let isCancelled = false;

    computeSha256(inputText).then((targetHash) => {
      if (isCancelled) return;

      const prev = prevHashRef.current;
      prevHashRef.current = targetHash;

      // Clear existing scramble intervals
      scrambleIntervals.current.forEach((id) => clearInterval(id));
      scrambleIntervals.current = [];

      const changed = new Set();
      let diffChars = 0;

      for (let i = 0; i < 64; i++) {
        if (!prev || prev[i] !== targetHash[i]) {
          changed.add(i);
          diffChars++;
        }
      }

      setBitsFlippedCount(diffChars * 4); // Approximate bit flips (hex char = 4 bits)
      setScramblingIndices(changed);

      // Start matrix scrambling for changed indices
      if (changed.size > 0) {
        const tempChars = [...(prev ? prev.split('') : targetHash.split(''))];

        const interval = setInterval(() => {
          changed.forEach((idx) => {
            tempChars[idx] = HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          });
          setDisplayChars([...tempChars]);
        }, 35);

        scrambleIntervals.current.push(interval);

        // Gradually lock in characters over 200-300ms
        const timer = setTimeout(() => {
          clearInterval(interval);
          setDisplayChars(targetHash.split(''));
          setScramblingIndices(new Set());
        }, 220);

        scrambleIntervals.current.push(timer);
      } else {
        setDisplayChars(targetHash.split(''));
        setScramblingIndices(new Set());
      }
    });

    return () => {
      isCancelled = true;
      scrambleIntervals.current.forEach((id) => clearInterval(id));
      scrambleIntervals.current = [];
    };
  }, [inputText]);

  const handleCopy = () => {
    const fullHash = displayChars.join('');
    navigator.clipboard?.writeText(fullHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const samplePresets = [
    { label: 'admin', value: 'admin' },
    { label: 'admin! (1 char diff)', value: 'admin!' },
    { label: 'Tr0ub4dor&3', value: 'Tr0ub4dor&3' },
    { label: 'correct-horse-battery', value: 'correct-horse-battery' },
  ];

  return (
    <div className="p-6 rounded-2xl glass-surface border border-neon-cyan/25 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-base">
              Live SHA-256 Matrix Hasher & Avalanche Visualizer
            </h3>
            <p className="text-xs text-slate-400">
              Type anything to watch the 256-bit hash mutate with zero-latency matrix
              scramble
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GlowBadge variant="cyan" pulseDot size="sm">
            CRYPTO.SUBTLE: 256 BITS
          </GlowBadge>
        </div>
      </div>

      {/* Input Field & Preset Buttons */}
      <div className="space-y-3">
        <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
          Input Pre-Image (Plaintext)
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type any password or phrase..."
            className="w-full px-4 py-3 rounded-xl bg-[#05060F]/90 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
            {inputText.length} chars
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-slate-400">
          <span className="text-slate-400">Try Avalanche:</span>
          {samplePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setInputText(preset.value)}
              className="px-2.5 py-1 rounded-lg bg-cyber-surface border border-white/10 hover:border-neon-cyan/40 hover:text-neon-cyan transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 64-character Matrix Hash Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            DIGEST OUTPUT (64 HEXADECIMAL CHARACTERS)
          </span>
          <span className="text-emerald-400 font-bold">
            ~{bitsFlippedCount} bits shifted
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#03040A] border border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.08)]">
          <div className="font-mono text-sm md:text-base tracking-wider break-all leading-relaxed select-all">
            {displayChars.map((ch, idx) => {
              const isScrambling = scramblingIndices.has(idx);
              return (
                <span
                  key={idx}
                  className={`inline-block transition-colors duration-150 ${
                    isScrambling
                      ? 'text-emerald-300 bg-emerald-500/20 font-bold shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                      : idx % 2 === 0
                        ? 'text-cyan-300'
                        : 'text-emerald-400'
                  }`}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info & Copy Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs font-mono text-slate-400 border-t border-white/5">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-neon-cyan shrink-0" />
          <span>
            <strong>Avalanche Effect:</strong> Flipping a single letter or character
            alters over 50% of the resultant bits unpredictably.
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyber-surface border border-white/15 text-white hover:border-neon-cyan text-xs font-mono transition-all shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Hash Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy 64-Hex</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
