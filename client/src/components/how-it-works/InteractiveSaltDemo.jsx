import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, Sparkles, Check, Copy } from 'lucide-react';
import GlowBadge from '../ui/GlowBadge';
import NeonButton from '../ui/NeonButton';

// Base64-like alphabet for bcrypt representation (Radix-64)
const BCRYPT_RADIX64 = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRandomSaltRadix64(length = 22) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => BCRYPT_RADIX64[b % BCRYPT_RADIX64.length])
    .join('');
}

async function deriveSimulatedBcryptHash(password, salt) {
  // Use crypto.subtle to create an actual cryptographic derivation from (password + salt)
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(salt),
      iterations: 2048,
      hash: 'SHA-256',
    },
    keyMaterial,
    248 // 31 bytes
  );

  const byteArray = Array.from(new Uint8Array(derivedBits));
  const hashString = byteArray
    .map((b) => BCRYPT_RADIX64[b % BCRYPT_RADIX64.length])
    .join('')
    .slice(0, 31);

  return {
    prefix: '$2b$12$',
    salt,
    hash: hashString,
  };
}

export default function InteractiveSaltDemo() {
  const [password, setPassword] = useState('FortressPassphrase#99');
  const [entries, setEntries] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateSalts = async (pwd) => {
    setIsRefreshing(true);
    const salts = [
      generateRandomSaltRadix64(22),
      generateRandomSaltRadix64(22),
      generateRandomSaltRadix64(22),
    ];

    const results = await Promise.all(
      salts.map((salt) => deriveSimulatedBcryptHash(pwd || 'sample', salt))
    );

    setEntries(results);
    setTimeout(() => setIsRefreshing(false), 250);
  };

  useEffect(() => {
    generateSalts(password);
  }, [password]);

  const handleCopyHash = (entry, idx) => {
    const full = `${entry.prefix}${entry.salt}${entry.hash}`;
    navigator.clipboard?.writeText(full);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  return (
    <div className="p-6 rounded-2xl glass-surface border border-neon-violet/25 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neon-violet/10 border border-neon-violet/30 text-neon-violet">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-white text-base">
              Interactive 128-Bit Salting & Rainbow-Table Neutralizer
            </h3>
            <p className="text-xs text-slate-400">
              See how the same password generates 3 radically distinct, unpredictable
              Bcrypt hashes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <GlowBadge variant="violet" pulseDot size="sm">
            SALT: 128-BIT CSPRNG
          </GlowBadge>
        </div>
      </div>

      {/* Password Input & Re-roll Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type any password..."
            className="w-full px-4 py-2.5 rounded-xl bg-[#05060F]/90 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-neon-violet focus:ring-1 focus:ring-neon-violet transition-all"
          />
        </div>

        <NeonButton
          variant="violet"
          size="sm"
          onClick={() => generateSalts(password)}
          leftIcon={
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          }
        >
          Re-Roll Salts
        </NeonButton>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-mono flex-wrap p-2.5 rounded-lg bg-cyber-surface/60 border border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
          <span className="text-slate-400">Prefix ($2b$12$)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-neon-violet" />
          <span className="text-neon-violet font-semibold">128-bit Salt (22 chars)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-neon-cyan" />
          <span className="text-neon-cyan font-semibold">Derived Hash (31 chars)</span>
        </div>
      </div>

      {/* 3 Hash Outputs */}
      <div className="space-y-3">
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#03040A] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 group hover:border-neon-violet/40 transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400">
                USER #{idx + 1}
              </span>
              <div className="font-mono text-xs sm:text-sm tracking-wide break-all">
                <span className="text-slate-400 font-semibold">{entry.prefix}</span>
                <span className="text-violet-400 bg-violet-500/10 px-1 py-0.5 rounded border border-violet-500/20 font-bold">
                  {entry.salt}
                </span>
                <span className="text-cyan-300 ml-1">{entry.hash}</span>
              </div>
            </div>

            <button
              onClick={() => handleCopyHash(entry, idx)}
              className="self-end md:self-auto px-2.5 py-1 rounded bg-cyber-surface border border-white/10 hover:border-neon-violet text-[11px] font-mono text-slate-300 hover:text-white transition-all shrink-0 flex items-center gap-1"
            >
              {copiedIndex === idx ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Security Mechanics Explanation Box */}
      <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-violet-300 font-semibold">
          <Sparkles className="w-4 h-4 text-neon-violet" />
          <span>Why Salting Defeats Attackers:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
          <li>
            <strong>Neutralizes Precomputed Rainbow Tables:</strong> Because a random
            128-bit salt is selected for every record ($2^{128} \approx 3.4 \times 10^{38}
            $ possible salts), an attacker cannot precompute lookup tables for common
            passwords.
          </li>
          <li>
            <strong>Prevents Cross-Account Password Correlation:</strong> If two users
            choose the identical password (`Password123!`), their stored hashes look
            completely different, preventing attackers from detecting password sharing.
          </li>
        </ul>
      </div>
    </div>
  );
}
