import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  KeyRound,
  Search,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Binary,
  Database,
} from 'lucide-react';
import GlowBadge from '../ui/GlowBadge';

const PIPELINE_STAGES = [
  {
    id: 'input',
    num: '01',
    title: 'Client Input',
    subtitle: 'Zero-Leakage Capture',
    icon: KeyRound,
    accent: 'cyan',
    colorHex: '#22D3EE',
    borderClass: 'border-cyan-400/40',
    bgClass: 'bg-cyan-500/10',
    summary:
      'Password enters client memory exclusively. Never logged, cached to disk, or sent across the network as plaintext.',
    techDetails: [
      'HTML5 Password DOM element with obscured memory buffer',
      'Instantaneous 150ms debounced event dispatch',
      'Pure browser client boundary (NIST SP 800-63B)',
    ],
  },
  {
    id: 'analysis',
    num: '02',
    title: 'Heuristic Engine',
    subtitle: 'Shannon Entropy & Walks',
    icon: Search,
    accent: 'violet',
    colorHex: '#8B5CF6',
    borderClass: 'border-violet-400/40',
    bgClass: 'bg-violet-500/10',
    summary:
      'Statistical information entropy analysis H = -Σ p_i log₂(p_i), combined with spatial keyboard walk matrices and pattern penalties.',
    techDetails: [
      'Calculates effective bit space L · log₂(N)',
      'Detects QWERTY/Dvorak walks & sequential runs',
      'Leetspeak normalization + 10,000 common breach lookup',
    ],
  },
  {
    id: 'hash',
    num: '03',
    title: 'Adaptive Hashing',
    subtitle: 'Bcrypt + 128-bit Salt',
    icon: Cpu,
    accent: 'cyan',
    colorHex: '#22D3EE',
    borderClass: 'border-cyan-400/40',
    bgClass: 'bg-cyan-500/10',
    summary:
      'One-way key derivation with 16 bytes of cryptographically random salt and 4,096 computation rounds (cost factor 12).',
    techDetails: [
      'Salt generated via CSPRNG (crypto.getRandomValues)',
      'Exponential iteration cost: 2¹² = 4,096 cycles',
      'High memory-hardness neutralizes ASIC and GPU clusters',
    ],
  },
  {
    id: 'compare',
    num: '04',
    title: 'Verification',
    subtitle: 'k-Anonymity & History',
    icon: Database,
    accent: 'violet',
    colorHex: '#8B5CF6',
    borderClass: 'border-violet-400/40',
    bgClass: 'bg-violet-500/10',
    summary:
      'SHA-1 truncated 5-character prefix queries 1B+ compromised accounts; SQLite checks against user salted history.',
    techDetails: [
      'Zero-knowledge k-anonymity: 5 hex chars sent, 35 matched locally',
      'Prevents password reuse across user previous 10 cycles',
      'Zero plaintext transmission over HTTP/TLS',
    ],
  },
  {
    id: 'result',
    num: '05',
    title: 'Security Verdict',
    subtitle: 'Telemetry & Defense',
    icon: ShieldCheck,
    accent: 'emerald',
    colorHex: '#10B981',
    borderClass: 'border-emerald-400/40',
    bgClass: 'bg-emerald-500/10',
    summary:
      'Synthesized cryptographic verdict: 0-100 score, cracking duration across 3 threat tiers, and actionable hardening recommendations.',
    techDetails: [
      '3 crack time models: Online, GPU cluster, Bcrypt slow',
      'Dynamic visual HUD updates with SVG gauge and sparks',
      'Diceware and high-entropy alternative recommendations',
    ],
  },
];

export default function PipelineDiagram() {
  const [activeStage, setActiveStage] = useState(PIPELINE_STAGES[0]);

  return (
    <div className="space-y-6">
      {/* Interactive SVG Flow Diagram */}
      <div className="relative overflow-hidden rounded-2xl glass-surface border border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
              Interactive Cryptographic Dataflow Pipeline
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Click any node to inspect cryptographic mechanics
          </span>
        </div>

        {/* SVG Pipeline Canvas */}
        <div className="relative w-full overflow-x-auto pb-4">
          <svg
            viewBox="0 0 1000 160"
            className="w-full min-w-[760px] h-auto drop-shadow-[0_0_15px_rgba(34,211,238,0.15)]"
          >
            <defs>
              <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
              </linearGradient>

              {/* Glowing filter for nodes */}
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting Base Line */}
            <path
              d="M 100 80 L 900 80"
              stroke="#1e293b"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Glowing Animated Dash Pulse Line */}
            <path
              d="M 100 80 L 900 80"
              stroke="url(#pipeGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="12 16"
              className="animate-[dash_12s_linear_infinite]"
            />

            {/* Flow Nodes */}
            {PIPELINE_STAGES.map((stage, i) => {
              const cx = 100 + i * 200;
              const cy = 80;
              const isSelected = activeStage.id === stage.id;

              return (
                <g
                  key={stage.id}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setActiveStage(stage)}
                >
                  {/* Outer pulse wave if selected */}
                  {isSelected && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="42"
                      fill="none"
                      stroke={stage.colorHex}
                      strokeWidth="1.5"
                      opacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer Halo Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 36 : 30}
                    fill="#05060F"
                    stroke={stage.colorHex}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={isSelected ? 'url(#neonGlow)' : undefined}
                    className="transition-all duration-300"
                  />

                  {/* Inner Accent Ring */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="22"
                    fill={isSelected ? `${stage.colorHex}22` : '#0B0F1E'}
                    stroke={isSelected ? stage.colorHex : '#334155'}
                    strokeWidth="1"
                  />

                  {/* Step Number Tag inside node */}
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fill={isSelected ? stage.colorHex : '#94A3B8'}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="11"
                    fontWeight="bold"
                  >
                    {stage.num}
                  </text>

                  {/* Top Label */}
                  <text
                    x={cx}
                    y="28"
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : '#CBD5E1'}
                    fontFamily="Space Grotesk, sans-serif"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    {stage.title}
                  </text>

                  {/* Bottom Subtitle */}
                  <text
                    x={cx}
                    y="136"
                    textAnchor="middle"
                    fill={isSelected ? stage.colorHex : '#64748B'}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="10"
                    fontWeight="medium"
                  >
                    {stage.subtitle}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Stage Detail Panel */}
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 p-5 rounded-xl bg-cyber-surface/90 border border-white/10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${activeStage.bgClass} border ${activeStage.borderClass}`}
              >
                <activeStage.icon
                  className="w-5 h-5"
                  style={{ color: activeStage.colorHex }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    STAGE {activeStage.num}
                  </span>
                  <span className="text-xs font-mono text-slate-500">{'//'}</span>
                  <h3 className="font-heading font-bold text-white text-base">
                    {activeStage.title}: {activeStage.subtitle}
                  </h3>
                </div>
              </div>
            </div>

            <GlowBadge
              variant={activeStage.accent === 'emerald' ? 'success' : activeStage.accent}
              size="sm"
            >
              ACTIVE STAGE INSPECTOR
            </GlowBadge>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {activeStage.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeStage.techDetails.map((detail, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-lg bg-cyber-surface-raised/40 border border-white/5 text-xs text-slate-300"
              >
                <CheckCircle2
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: activeStage.colorHex }}
                />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
