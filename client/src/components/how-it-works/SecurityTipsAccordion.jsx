import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ShieldCheck,
  Key,
  Smartphone,
  AlertTriangle,
  Layers,
  Lock,
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const SECURITY_TIPS = [
  {
    id: 'passphrase',
    title: '1. Prioritize Passphrase Length Over Complexity Gimmicks',
    subtitle: 'NIST SP 800-63B Recommendation',
    icon: Key,
    accent: 'cyan',
    summary:
      'Length is exponential; character complexity is linear. A 5-word Diceware passphrase provides superior entropy and effortless memorability.',
    content:
      'Replacing "a" with "@" or "o" with "0" in an 8-character word does not fool password-cracking software: modern rule engines (like Hashcat best64 rules) test all leetspeak permutations instantaneously. In contrast, concatenating 4 to 5 random dictionary words (e.g., "radiant-orbit-velvet-falcon") provides 65 to 80 bits of true mathematical entropy, requiring billions of years to exhaust.',
    actionable:
      'Aim for a minimum of 16 characters for critical master passwords, or 4+ random words separated by hyphens.',
  },
  {
    id: 'reuse',
    title: '2. Enforce Strict Zero-Reuse Across Digital Identities',
    subtitle: 'Eliminating Automated Credential Stuffing',
    icon: AlertTriangle,
    accent: 'magenta',
    summary:
      'When an obscure service suffers a data breach, botnets spray your credentials across banking, email, and social services within minutes.',
    content:
      'Credential stuffing represents over 80% of unauthorized account takeovers. Automated bots take publicly leaked "combo lists" (email:password dumps) and systematically attempt authentication against thousands of top endpoints. If you reuse your password, a breach on an unvetted forum immediately compromises your primary accounts.',
    actionable:
      'Every online service must have a completely distinct, unlinked password. Never reuse a password even once.',
  },
  {
    id: 'manager',
    title: '3. Deploy an End-to-End Encrypted Password Manager',
    subtitle: 'High-Entropy Cryptographic Automation',
    icon: Layers,
    accent: 'violet',
    summary:
      'Human memory cannot securely store dozens of 20-character random strings. Let cryptographic vaults handle generation and storage.',
    content:
      'Modern open-source or audited zero-knowledge password managers (e.g., Bitwarden, 1Password, KeePassXC) encrypt your credentials locally on your device with AES-256 and PBKDF2/Argon2id. The server hosting the vault only ever sees encrypted ciphertext. By using a password manager, you only ever need to memorize a single high-entropy master passphrase.',
    actionable:
      'Configure auto-generated 20-character random passwords with uppercase, lowercase, numbers, and symbols for all websites.',
  },
  {
    id: 'mfa',
    title: '4. Mandate Phishing-Resistant Multi-Factor Authentication',
    subtitle: 'Defense-in-Depth Beyond Passwords',
    icon: Smartphone,
    accent: 'cyan',
    summary:
      'Even if an attacker obtains your plaintext password through a breach or keylogger, hardware-backed 2FA stops authentication in its tracks.',
    content:
      'Not all MFA is created equal. SMS and voice-call verification are vulnerable to SIM-swapping and cellular interception. App-based Time-Based One-Time Passwords (TOTP apps like Aegis, Google Authenticator) provide strong defense. For maximum security, hardware security keys (FIDO2 / WebAuthn / YubiKey) are cryptographically bound to the browser origin, completely defeating adversary-in-the-middle phishing attacks.',
    actionable:
      'Enable TOTP or FIDO2 security keys on your primary email, banking, and password manager accounts immediately.',
  },
  {
    id: 'patterns',
    title: '5. Neutralize Predictable Date & Keyboard Walk Patterns',
    subtitle: 'Defeating Spatial & Chronological Dictionary Attacks',
    icon: Lock,
    accent: 'violet',
    summary:
      'Years (1990-2025) and keyboard walks (qwerty, asdf, !@#$) are top targets prioritized in brute-force dictionary permutations.',
    content:
      'Adversaries do not guess randomly; they prioritize statistical human habits. A password like "Winter2024!" satisfies standard legacy complexity rules (uppercase, lowercase, number, symbol), yet cracking tools discover it in under 0.05 seconds because "Season + Year + !" is one of the highest-frequency rules tested by attack scripts.',
    actionable:
      'Avoid any association with your birth year, graduation year, pet names, or physical keyboard key adjacency.',
  },
];

export default function SecurityTipsAccordion() {
  const [openId, setOpenId] = useState('passphrase');

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {SECURITY_TIPS.map((tip) => {
        const isOpen = openId === tip.id;

        return (
          <GlassCard
            key={tip.id}
            variant={isOpen ? (tip.accent === 'magenta' ? 'magenta' : 'cyan') : 'default'}
            className="overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggle(tip.id)}
              className="w-full text-left flex items-start sm:items-center justify-between gap-4 py-1"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                <div
                  className={`p-2.5 rounded-xl border shrink-0 ${
                    isOpen
                      ? tip.accent === 'magenta'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                      : 'bg-cyber-surface border-white/10 text-slate-400'
                  }`}
                >
                  <tip.icon className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm sm:text-base font-heading font-bold text-white">
                      {tip.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                      {tip.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">{tip.summary}</p>
                </div>
              </div>

              <div
                className={`p-2 rounded-lg bg-cyber-surface border border-white/10 text-slate-400 transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180 text-neon-cyan border-neon-cyan/40' : ''
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* Expandable Accordion Body */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-white/10 space-y-3 text-xs leading-relaxed text-slate-300">
                    <p>{tip.content}</p>
                    <div className="p-3 rounded-xl bg-[#05060F]/80 border border-neon-cyan/20 flex items-start gap-2 text-cyan-300 font-mono text-[11px]">
                      <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-neon-cyan" />
                      <span>
                        <strong className="text-white">Actionable Rule:</strong>{' '}
                        {tip.actionable}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        );
      })}
    </div>
  );
}
