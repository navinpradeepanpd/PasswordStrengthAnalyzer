import React from 'react';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Database,
  ArrowUp,
  Terminal,
  Sparkles,
} from 'lucide-react';

export default function Footer({ onReplayBoot }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/10 bg-[#05060F]/95 backdrop-blur-xl mt-24 text-slate-400 font-mono text-xs z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="p-2 rounded-xl bg-cyber-surface border border-neon-cyan/40 text-neon-cyan shadow-glow-cyan">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-base tracking-wider">
                AEGIS // DEFENSE OS v2.0
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md font-sans">
              An interactive, cryptographic password evaluation platform and security
              laboratory designed for an internship engineering submission. Demonstrates
              Shannon entropy calculation, spatial walk detection, zero-knowledge
              k-anonymity, and salted Bcrypt history storage.
            </p>

            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>KERNEL: ACTIVE // NODE: WIN32-X64 // PORT 5173 / 5000</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-slate-200 font-bold">
              Command Modules
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => scrollTo('hero')}
                  className="hover:text-neon-cyan transition-colors"
                >
                  &rarr; 01 // Mission Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('analyzer')}
                  className="hover:text-neon-cyan transition-colors"
                >
                  &rarr; 02 // Password Analyzer
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-neon-cyan transition-colors"
                >
                  &rarr; 03 // Cryptography Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('crypto-specs')}
                  className="hover:text-neon-cyan transition-colors"
                >
                  &rarr; 04 // Design System Specs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Cryptographic Guarantees */}
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-slate-200 font-bold">
              Security Contracts
            </div>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                <span>Zero Plaintext Persistence</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-3.5 h-3.5 text-neon-violet shrink-0" />
                <span>Bcrypt Cost 12 (4,096 Rounds)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero-Knowledge k-Anonymity</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                <span>128-Bit CSPRNG Random Salt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>&copy; 2026 Aegis Cryptographic Defense Laboratory. MIT License.</div>

          <div className="flex items-center gap-4">
            {onReplayBoot && (
              <button
                onClick={onReplayBoot}
                className="flex items-center gap-1.5 hover:text-neon-cyan transition-colors text-slate-400"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Replay Boot Sequence</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-cyber-surface border border-white/10 hover:border-neon-cyan hover:text-neon-cyan transition-all text-slate-300"
              aria-label="Back to Top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
