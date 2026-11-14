import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Database, ShieldAlert, Lock } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowBadge from '../ui/GlowBadge';

const CONCEPTS = [
  {
    tag: 'CONCEPT // 01',
    category: 'INFORMATION THEORY',
    title: 'Shannon Information Entropy (H)',
    icon: Sparkles,
    accent: 'cyan',
    colorHex: '#22D3EE',
    formula: 'H = -Σ p_i log₂(p_i)  |  Search Space S = N^L (2^H bits)',
    summary:
      'Rather than relying on superficial checklist rules, true cryptographic strength is governed by Shannon Entropy: the mathematical measure of unpredictability and combinatorial search space.',
    details: [
      {
        label: 'Length Trumps Complexity',
        text: 'A 20-character passphrase of 4 common words yields 65+ bits of entropy (2⁶⁵ combinations), outperforming a frustrating 8-character symbol soup (45 bits) by a factor of 1,000,000×.',
      },
      {
        label: 'Pattern Penalties',
        text: 'Human typing habits (keyboard walks like qwerty, sequences like 12345, and leetspeak) drastically reduce the effective search space from theoretical maximums.',
      },
    ],
    metric: {
      leftLabel: '8-Char Complex (P@$$w0rd)',
      leftVal: '42.1 bits',
      rightLabel: '4-Word Diceware (correct-horse...)',
      rightVal: '74.5 bits',
      verdict: '+32.4 bits (4.3B× stronger)',
    },
  },
  {
    tag: 'CONCEPT // 02',
    category: 'ADAPTIVE KEY DERIVATION',
    title: 'Slow Adaptive Hashing (Bcrypt vs MD5/SHA)',
    icon: Cpu,
    accent: 'violet',
    colorHex: '#8B5CF6',
    formula: 'Bcrypt Cost Factor: 2^cost iterations (Cost 12 = 4,096 cycles)',
    summary:
      'General hash functions like MD5 and SHA-256 were designed for maximum performance (checksums), making them catastrophically dangerous for passwords when attacked by modern GPUs.',
    details: [
      {
        label: 'Hardware Acceleration Threat',
        text: 'A standard consumer GPU cluster computes over 100 Billion SHA-256 hashes per second, turning 8-character passwords into minutes of crack time.',
      },
      {
        label: 'Bcrypt Slowing Factor',
        text: 'Bcrypt is intentionally slow and memory-intensive (Blowfish key expansion). At cost factor 12, each hash requires 4,096 cryptographic cycles, throttling GPU rigs to ~10,000 guesses/sec.',
      },
    ],
    metric: {
      leftLabel: 'SHA-256 GPU Throughput',
      leftVal: '100,000,000,000 / sec',
      rightLabel: 'Bcrypt Cost 12 Throughput',
      rightVal: '~10,000 / sec',
      verdict: '10,000,000× slower for attackers',
    },
  },
  {
    tag: 'CONCEPT // 03',
    category: 'ONE-WAY PRE-IMAGE DEFENSE',
    title: 'Cryptographic 128-Bit Salting',
    icon: Database,
    accent: 'cyan',
    colorHex: '#22D3EE',
    formula: 'Stored Hash: $2b$12$[128-bit Random Salt][Derived Hash]',
    summary:
      'A salt is a 16-byte (128-bit) cryptographically random value appended to each password before key derivation. It renders precomputed rainbow tables completely obsolete.',
    details: [
      {
        label: 'Eliminates Rainbow Tables',
        text: 'Precomputing hashes for common passwords requires astronomical storage if salted: attackers would have to generate unique rainbow tables for all 2¹²⁸ (3.4 × 10³⁸) possible salts.',
      },
      {
        label: 'Prevents Password Correlation',
        text: 'Two users with identical passwords receive totally distinct stored hashes in SQLite, preventing attackers from detecting shared credentials across a company.',
      },
    ],
    metric: {
      leftLabel: 'Unsalted Rainbow Table',
      leftVal: 'Instant O(1) Lookup',
      rightLabel: '128-Bit Salted Database',
      rightVal: 'O(N) Full Exhaustion',
      verdict: 'Precomputation neutralized',
    },
  },
  {
    tag: 'CONCEPT // 04',
    category: 'THREAT MODELING',
    title: 'Brute-Force vs Dictionary & Rule Attacks',
    icon: ShieldAlert,
    accent: 'magenta',
    colorHex: '#F43F5E',
    formula: 'Dictionary + Rule Mappings: O(W · R) vs Combinatorial O(N^L)',
    summary:
      'Pure brute force explores all combinations (N^L). However, over 95% of breaches are cracked using targeted dictionary attacks paired with automated mutation rules.',
    details: [
      {
        label: 'Rule-Based Mutations',
        text: 'Tools like Hashcat apply automated rule engines to leaked lists (RockYou): capitalizing the first character, substituting leetspeak (@ for a, 3 for e), and appending current years.',
      },
      {
        label: 'Defense Strategy',
        text: 'A password like "Password2024!" takes milliseconds to crack with rules, despite satisfying naive uppercase/lowercase/digit/symbol checklists.',
      },
    ],
    metric: {
      leftLabel: 'Combinatorial Search (N^L)',
      leftVal: '2.8 × 10¹⁴ guesses',
      rightLabel: 'Rule Mutation (RockYou+Rules)',
      rightVal: '< 50,000 guesses',
      verdict: 'Checklist rules create false confidence',
    },
  },
  {
    tag: 'CONCEPT // 05',
    category: 'ZERO-KNOWLEDGE PRIVACY',
    title: 'Zero-Knowledge k-Anonymity Breach Verification',
    icon: Lock,
    accent: 'emerald',
    colorHex: '#10B981',
    formula: 'k-Anonymity: SHA-1(P) = Prefix[5] (Wire) + Suffix[35] (Local RAM)',
    summary:
      'How to verify if a password exists in billions of leaked records without sending the password to a server? Through mathematical k-anonymity partitioning.',
    details: [
      {
        label: '5-Character Prefix Bucket',
        text: 'The browser computes SHA-1 locally. It sends only the first 5 hexadecimal characters (16⁵ = 1,048,576 candidate buckets) to the API proxy.',
      },
      {
        label: 'Local Browser Verification',
        text: 'The server returns ~500 hash suffixes in that bucket. The browser matches the remaining 35 characters inside client RAM. Neither our server nor HaveIBeenPwned ever sees the password.',
      },
    ],
    metric: {
      leftLabel: 'Data Transmitted Over Wire',
      leftVal: '5 hex chars (20 bits)',
      rightLabel: 'Matches in Bucket (k)',
      rightVal: '~500 records',
      verdict: 'Zero plaintext or full hash leaked',
    },
  },
];

export default function ConceptCards() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CONCEPTS.map((concept, index) => {
          const isFullWidth = index === CONCEPTS.length - 1; // Last card spans full width on 2-col grid

          return (
            <motion.div
              key={concept.tag}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={isFullWidth ? 'lg:col-span-2' : ''}
            >
              <GlassCard
                variant={
                  concept.accent === 'magenta'
                    ? 'magenta'
                    : concept.accent === 'violet'
                      ? 'violet'
                      : 'cyan'
                }
                className="h-full flex flex-col justify-between space-y-4"
              >
                {/* Header */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GlowBadge
                        variant={
                          concept.accent === 'emerald'
                            ? 'success'
                            : concept.accent === 'magenta'
                              ? 'danger'
                              : concept.accent
                        }
                        size="sm"
                      >
                        {concept.category}
                      </GlowBadge>
                      <span className="text-[10px] font-mono text-slate-400">
                        {concept.tag}
                      </span>
                    </div>

                    <div
                      className="p-2 rounded-lg bg-cyber-surface border border-white/10"
                      style={{ color: concept.colorHex }}
                    >
                      <concept.icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-heading font-bold text-white text-lg">
                    {concept.title}
                  </h3>

                  <div className="p-2.5 rounded-lg bg-[#05060F]/80 border border-white/10 font-mono text-xs text-slate-300">
                    <span className="text-slate-500 mr-2">$</span>
                    <span style={{ color: concept.colorHex }}>{concept.formula}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {concept.summary}
                </p>

                {/* Key Insights List */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  {concept.details.map((item, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: concept.colorHex }}
                        />
                        {item.label}:
                      </span>
                      <p className="text-slate-400 pl-3 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Quantitative Metric Bar */}
                <div className="pt-3 border-t border-white/5 bg-cyber-surface/40 -mx-6 -mb-6 p-4 rounded-b-2xl">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>{concept.metric.leftLabel}</span>
                    <span>{concept.metric.rightLabel}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-white mb-2">
                    <span className="text-slate-300">{concept.metric.leftVal}</span>
                    <span style={{ color: concept.colorHex }}>
                      {concept.metric.rightVal}
                    </span>
                  </div>
                  <div className="text-right text-[11px] font-mono font-semibold text-emerald-400">
                    &bull; {concept.metric.verdict}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
