import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  History,
  Info,
  User,
  Database,
  Lock,
  Flame,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import NeonButton from '../ui/NeonButton';
import GlowBadge from '../ui/GlowBadge';

/**
 * Password History Guard Component
 * Tests password reuse against the last 10 salted bcrypt hashes stored in SQLite.
 * Plaintext passwords are never logged or stored.
 *
 * @param {Object} props
 * @param {string} props.currentPassword - Current active password from the main analyzer input
 */
export default function PasswordHistoryGuard({ currentPassword = '' }) {
  const [username, setUsername] = useState('intern@aegis.dev');
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [saveResult, setSaveResult] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Check reuse against backend
  const handleCheckReuse = async () => {
    if (!currentPassword) {
      setCheckResult({
        error:
          'Please enter a password in the analyzer above before testing history reuse.',
      });
      return;
    }
    if (!username.trim()) {
      setCheckResult({ error: 'Please enter a username.' });
      return;
    }

    setIsChecking(true);
    setCheckResult(null);

    try {
      const response = await fetch('/api/check-reuse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: currentPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setCheckResult({
          error: data.error || data.details?.[0] || 'Verification failed',
        });
      } else {
        setCheckResult(data);
      }
    } catch {
      setCheckResult({
        error:
          'Backend API unreachable. Ensure dev server is running on http://localhost:5000',
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Save current password hash to history
  const handleSavePassword = async () => {
    if (!currentPassword) {
      setSaveResult({ error: 'Please enter a password in the analyzer above to save.' });
      return;
    }
    if (!username.trim()) {
      setSaveResult({ error: 'Please enter a username.' });
      return;
    }

    setIsSaving(true);
    setSaveResult(null);

    try {
      const response = await fetch('/api/save-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: currentPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setSaveResult({ error: data.error || data.details?.[0] || 'Save failed' });
      } else {
        setSaveResult(data);
        // Clear previous check result
        setCheckResult(null);
      }
    } catch {
      setSaveResult({
        error:
          'Backend API unreachable. Ensure dev server is running on http://localhost:5000',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      className="space-y-4 w-full max-w-6xl mx-auto"
      aria-labelledby="history-guard-heading"
    >
      <GlassCard variant="default" showCorners className="space-y-6">
        {/* Header with Title and Tooltip Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-neon-violet/10 border border-neon-violet/30 text-neon-violet shadow-glow-violet">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3
                id="history-guard-heading"
                className="text-base sm:text-lg font-heading font-bold text-white flex items-center gap-2"
              >
                <span>Password History Guard</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-neon-violet/15 text-violet-300 border border-neon-violet/30">
                  SQLite + Bcrypt
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Enforces password freshness policy by checking against the last 10 stored
                bcrypt hashes
              </p>
            </div>
          </div>

          {/* Cryptographic Privacy Info Tooltip Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 transition-all cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-neon-cyan" />
              <span>Cryptographic Storage FAQ</span>
            </button>

            {/* Floating Tooltip Box */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-10 z-50 w-72 sm:w-96 max-w-[calc(100vw-2rem)] p-4 rounded-2xl bg-[#0B0F1E] border border-neon-cyan/40 shadow-glow-cyan text-xs space-y-2 text-slate-300 backdrop-blur-xl"
                >
                  <div className="font-heading font-bold text-sm text-neon-cyan flex items-center gap-1.5">
                    <Lock className="w-4 h-4" />
                    <span>Why Only Salted Hashes Are Stored</span>
                  </div>
                  <p className="leading-relaxed">
                    Plaintext passwords are{' '}
                    <span className="text-white font-semibold">never</span> written to
                    disk or server memory.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>
                      <strong className="text-slate-200">Bcrypt Cost Factor 12</strong>:
                      Requires exponential CPU iterations per check, rendering brute-force
                      attacks computationally unfeasible.
                    </li>
                    <li>
                      <strong className="text-slate-200">Cryptographic Salting</strong>:
                      Generates 128 bits of random salt per password, completely defeating
                      precomputed rainbow table attacks.
                    </li>
                    <li>
                      <strong className="text-slate-200">10-Password Pruning</strong>:
                      SQLite database strictly maintains only the last 10 hashes per user
                      account.
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Username Input */}
          <div className="sm:col-span-5 space-y-1.5">
            <label
              htmlFor="history-username"
              className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-neon-violet" />
              User Identity / Account
            </label>
            <input
              id="history-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. intern@aegis.dev"
              className="w-full bg-[#05060F]/90 text-white font-mono text-sm px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-neon-violet focus:outline-none focus:ring-2 focus:ring-neon-violet/20 transition-all shadow-inner"
            />
          </div>

          {/* Action Buttons */}
          <div className="sm:col-span-7 flex flex-wrap items-center gap-2.5">
            <NeonButton
              variant="violet"
              size="md"
              isLoading={isChecking}
              leftIcon={<History className="w-4 h-4" />}
              onClick={handleCheckReuse}
              className="flex-1 min-w-[190px]"
            >
              {isChecking ? 'Verifying Hashes...' : 'Check Against Old Passwords'}
            </NeonButton>

            <NeonButton
              variant="outline"
              size="md"
              isLoading={isSaving}
              leftIcon={<Database className="w-4 h-4 text-emerald-400" />}
              onClick={handleSavePassword}
              className="shrink-0"
            >
              {isSaving ? 'Hashing...' : 'Save to History'}
            </NeonButton>
          </div>
        </div>

        {/* Dynamic Verification Result Banner */}
        <AnimatePresence mode="wait">
          {checkResult && (
            <motion.div
              key="check-result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {checkResult.error ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-2.5 text-xs text-amber-300">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{checkResult.error}</span>
                </div>
              ) : checkResult.reused ? (
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/35 flex items-start gap-3 text-rose-300 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                  <Flame className="w-5 h-5 shrink-0 text-neon-magenta mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="font-heading font-bold text-sm text-white">
                      REUSED PASSWORD DETECTED
                    </div>
                    <p className="leading-relaxed">
                      {checkResult.message} Password reuse weakens account boundaries
                      against credential stuffing attacks. Please choose a fresh
                      credential.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="font-heading font-bold text-sm text-white">
                      PASSWORD FRESHNESS CONFIRMED
                    </div>
                    <p className="leading-relaxed">
                      {checkResult.message} (Checked against {checkResult.countChecked}{' '}
                      salted bcrypt records in SQLite).
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {saveResult && (
            <motion.div
              key="save-result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {saveResult.error ? (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2.5 text-xs text-rose-300">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{saveResult.error}</span>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-neon-cyan/30 flex items-center justify-between gap-3 text-xs text-cyan-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-neon-cyan shrink-0" />
                    <span>{saveResult.message}</span>
                  </div>
                  <GlowBadge variant="cyan" size="sm">
                    {saveResult.historyCount}/10 STORED
                  </GlowBadge>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </section>
  );
}
