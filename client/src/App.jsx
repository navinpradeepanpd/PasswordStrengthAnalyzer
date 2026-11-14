import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Terminal,
  KeyRound,
  Cpu,
  Lock,
  Check,
  Sparkles,
  Database,
  Flame,
  Binary,
  Radio,
} from 'lucide-react';
import {
  GlassCard,
  NeonButton,
  GlowBadge,
  SectionTitle,
  AnimatedCounter,
} from './components/ui';
import CyberBackground from './components/background/CyberBackground';
import HeroSection from './components/hero/HeroSection';
import PasswordAnalyzer from './components/analyzer/PasswordAnalyzer';
import HowItWorks from './components/how-it-works/HowItWorks';
import Navbar from './components/nav/Navbar';
import Footer from './components/footer/Footer';
import BootSequence from './components/intro/BootSequence';

export default function App() {
  const [showBootSequence, setShowBootSequence] = useState(() => {
    return !sessionStorage.getItem('aegis_boot_seen');
  });
  const entropyVal = 78.4;
  const crackYears = 3800000;
  const breachCount = 0;
  const [copiedColor, setCopiedColor] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [activeStrength, setActiveStrength] = useState(4); // 0 to 4

  const handleBootComplete = () => {
    sessionStorage.setItem('aegis_boot_seen', 'true');
    setShowBootSequence(false);
  };

  const handleReplayBoot = () => {
    setShowBootSequence(true);
  };

  const handleCopy = (hex) => {
    navigator.clipboard?.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  const strengthSteps = [
    {
      label: 'CRITICAL',
      color: 'bg-strength-red',
      textColor: 'text-strength-red',
      borderColor: 'border-strength-red/40',
      shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
      bits: 18.2,
      years: 0.0001,
      timeText: '0.003 seconds',
      sample: 'password123',
      desc: 'Found in 9.2M credential breaches. Vulnerable to instant rainbow table lookup.',
    },
    {
      label: 'WEAK',
      color: 'bg-strength-orange',
      textColor: 'text-strength-orange',
      borderColor: 'border-strength-orange/40',
      shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
      bits: 34.6,
      years: 0.02,
      timeText: '1.4 hours',
      sample: 'LondonSummer24',
      desc: 'Predictable dictionary root combined with title-case and numbers.',
    },
    {
      label: 'FAIR',
      color: 'bg-strength-yellow',
      textColor: 'text-strength-yellow',
      borderColor: 'border-strength-yellow/40',
      shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
      bits: 52.8,
      years: 120,
      timeText: '120 years',
      sample: 'Tr0ub4dor&3',
      desc: 'Mixed character pool with common leetspeak substitutions.',
    },
    {
      label: 'STRONG',
      color: 'bg-strength-green',
      textColor: 'text-strength-green',
      borderColor: 'border-strength-green/40',
      shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
      bits: 74.5,
      years: 840000,
      timeText: '840,000 years',
      sample: 'correct-horse-battery-staple',
      desc: 'High-entropy multi-word passphrase with exponential search space.',
    },
    {
      label: 'FORTRESS',
      color: 'bg-neon-cyan',
      textColor: 'text-neon-cyan',
      borderColor: 'border-neon-cyan/40',
      shadow: 'shadow-glow-cyan-lg',
      bits: 98.7,
      years: 2900000000,
      timeText: '2.9 billion years',
      sample: 'X9#kQ!7$zW2@vL8&mP',
      desc: 'Cryptographically pseudorandom character pool with maximum Shannon entropy.',
    },
  ];

  const currentStrength = strengthSteps[activeStrength];

  const scrollToAnalyzer = () => {
    const el = document.getElementById('analyzer');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#05060F] text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Page-Load Boot Sequence (Terminal Style, <2s, skippable) */}
      {showBootSequence && <BootSequence onComplete={handleBootComplete} />}

      {/* Global Animated Background: Canvas Particle Network + Perspective Grid + Cursor Glow */}
      <CyberBackground />

      {/* Sticky Glass Navbar with Scroll-Spy & Mobile Menu */}
      <Navbar onAnalyzeClick={scrollToAnalyzer} onHowItWorksClick={scrollToHowItWorks} />

      {/* Hero Section */}
      <HeroSection onAnalyzeClick={scrollToAnalyzer} />

      {/* Analyzer Anchor & Main Evaluation Platform */}
      <div id="analyzer" className="relative z-10 scroll-mt-20">
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 space-y-20">
          {/* Main Password Analyzer Section */}
          <PasswordAnalyzer />

          {/* Educational Cryptography Section: How It Works */}
          <HowItWorks />

          {/* SECTION 1: Palette & Glow Matrix */}
          <section id="crypto-specs" className="space-y-6">
            <SectionTitle
              tag="[ 01 // CHROMATIC MATRIX ]"
              title="Futuristic Cyber Palette"
              subtitle="Click any swatch to copy its hex token. Designed with high-contrast obsidian backdrops, electric neon accents, and a dedicated 5-tier password strength scale."
              icon={<Sparkles className="w-5 h-5" />}
              accent="cyan"
            />

            {/* Primary Swatches */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                {
                  name: 'Near Black',
                  hex: '#05060F',
                  role: 'Main Canvas BG',
                  border: 'border-white/10',
                },
                {
                  name: 'Surface Deep',
                  hex: '#0B0F1E',
                  role: 'Glass Baseline',
                  border: 'border-white/10',
                },
                {
                  name: 'Surface Subtle',
                  hex: '#0E1428',
                  role: 'Card Elevated',
                  border: 'border-white/10',
                },
                {
                  name: 'Surface Raised',
                  hex: '#131B34',
                  role: 'Hover Active',
                  border: 'border-white/10',
                },
                {
                  name: 'Neon Cyan',
                  hex: '#22D3EE',
                  role: 'Primary Accent',
                  glow: 'shadow-glow-cyan',
                },
                {
                  name: 'Electric Violet',
                  hex: '#8B5CF6',
                  role: 'Secondary Accent',
                  glow: 'shadow-glow-violet',
                },
                {
                  name: 'Magenta Danger',
                  hex: '#F43F5E',
                  role: 'Breach / Alert',
                  glow: 'shadow-glow-magenta',
                },
              ].map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handleCopy(color.hex)}
                  className="group relative text-left p-4 rounded-2xl glass-surface glass-surface-hover border border-white/5 transition-all text-slate-200"
                >
                  <div
                    className={`w-full h-12 rounded-xl mb-3 flex items-center justify-center transition-transform group-hover:scale-105 ${
                      color.glow || ''
                    } ${color.border || ''}`}
                    style={{ backgroundColor: color.hex }}
                  >
                    {copiedColor === color.hex && (
                      <span className="p-1 rounded-full bg-black/60 text-white text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="font-heading font-semibold text-xs text-white truncate">
                    {color.name}
                  </div>
                  <div className="font-mono text-[11px] text-cyan-400 font-medium">
                    {color.hex}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {color.role}
                  </div>
                </button>
              ))}
            </div>

            {/* Strength Spectrum Swatches */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                Password Strength Chromatic Scale (Red &rarr; Orange &rarr; Yellow &rarr;
                Green &rarr; Cyan)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  {
                    label: 'Level 1: Critical',
                    hex: '#EF4444',
                    bits: '< 28 bits',
                    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
                  },
                  {
                    label: 'Level 2: Weak',
                    hex: '#F97316',
                    bits: '28-45 bits',
                    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]',
                  },
                  {
                    label: 'Level 3: Fair',
                    hex: '#EAB308',
                    bits: '46-60 bits',
                    glow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]',
                  },
                  {
                    label: 'Level 4: Strong',
                    hex: '#10B981',
                    bits: '61-75 bits',
                    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
                  },
                  {
                    label: 'Level 5: Fortress',
                    hex: '#22D3EE',
                    bits: '76+ bits',
                    glow: 'shadow-glow-cyan',
                  },
                ].map((tier) => (
                  <button
                    key={tier.hex}
                    onClick={() => handleCopy(tier.hex)}
                    className="p-3.5 rounded-2xl glass-surface text-left hover:border-white/20 transition-all"
                  >
                    <div
                      className={`h-4 rounded-lg w-full mb-2.5 ${tier.glow}`}
                      style={{ backgroundColor: tier.hex }}
                    />
                    <div className="text-xs font-semibold text-white">{tier.label}</div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                      <span>{tier.hex}</span>
                      <span className="text-slate-300">{tier.bits}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 2: Glassmorphism Cards */}
          <section className="space-y-6">
            <SectionTitle
              tag="[ 02 // GLASS CONTAINER SUITE ]"
              title="GlassCard Component"
              subtitle="Multi-layered glassmorphic panels featuring backdrop blur, subtle 1px gradient borders, soft inner glows, and optional HUD corner brackets."
              icon={<ShieldCheck className="w-5 h-5" />}
              accent="cyan"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Default Glass */}
              <GlassCard variant="default">
                <div className="flex items-center justify-between mb-4">
                  <GlowBadge variant="neutral" size="sm">
                    DEFAULT SURFACE
                  </GlowBadge>
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="font-heading font-semibold text-white text-base mb-1">
                  Subtle Command Surface
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Neutral translucent glass with soft top-rim light reflection, designed
                  for high-density telemetry dashboards without eye strain.
                </p>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>blur: 16px</span>
                  <span>border: white/10</span>
                </div>
              </GlassCard>

              {/* Card 2: Cyan Aura with HUD Corners */}
              <GlassCard variant="cyan" showCorners>
                <div className="flex items-center justify-between mb-4">
                  <GlowBadge variant="cyan" size="sm" pulseDot>
                    ACTIVE PROTOCOL
                  </GlowBadge>
                  <KeyRound className="w-4 h-4 text-neon-cyan" />
                </div>
                <h3 className="font-heading font-semibold text-white text-base mb-1">
                  Cyan Neon Glass + HUD Corners
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  High-priority card with active inner-cyan glow, 1px border highlight,
                  and tactical corner brackets for targeted security focus.
                </p>
                <div className="mt-4 pt-3 border-t border-neon-cyan/20 flex items-center justify-between text-[11px] font-mono text-neon-cyan">
                  <span>inner-glow: active</span>
                  <span>hud-brackets: 4</span>
                </div>
              </GlassCard>

              {/* Card 3: Violet Cryptographic Surface */}
              <GlassCard variant="violet">
                <div className="flex items-center justify-between mb-4">
                  <GlowBadge variant="violet" size="sm">
                    CRYPTOGRAPHIC BARRIER
                  </GlowBadge>
                  <Cpu className="w-4 h-4 text-neon-violet" />
                </div>
                <h3 className="font-heading font-semibold text-white text-base mb-1">
                  Electric Violet Aura
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tuned for hashing, salt inspection, and entropy calculation views with
                  an electric violet ambiance and high aesthetic presence.
                </p>
                <div className="mt-4 pt-3 border-t border-neon-violet/20 flex items-center justify-between text-[11px] font-mono text-neon-violet">
                  <span>glow: #8B5CF6</span>
                  <span>state: secured</span>
                </div>
              </GlassCard>

              {/* Card 4: Danger Alert */}
              <GlassCard variant="magenta">
                <div className="flex items-center justify-between mb-4">
                  <GlowBadge variant="danger" size="sm" pulseDot>
                    BREACH DETECTED
                  </GlowBadge>
                  <ShieldAlert className="w-4 h-4 text-neon-magenta" />
                </div>
                <h3 className="font-heading font-semibold text-white text-base mb-1">
                  Magenta Threat Card
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Critical warning panel triggered when passwords appear in known breach
                  dumps or exhibit vulnerable keyboard patterns.
                </p>
                <div className="mt-4 pt-3 border-t border-neon-magenta/20 flex items-center justify-between text-[11px] font-mono text-rose-300">
                  <span>threat-level: critical</span>
                  <span>k-anon: matched</span>
                </div>
              </GlassCard>

              {/* Card 5: Interactive Hover-Lift Card */}
              <GlassCard variant="default" interactive className="md:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <GlowBadge variant="cyan" size="sm">
                    INTERACTIVE MOTION
                  </GlowBadge>
                  <span className="text-[11px] font-mono text-neon-cyan">
                    HOVER TO LIFT
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-heading font-semibold text-white text-base mb-1">
                      Fluid Tactile Glassmorphism
                    </h3>
                    <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                      Uses Framer Motion spring physics to elevate on hover with dynamic
                      box-shadow glow intensification and smooth tap contraction.
                    </p>
                  </div>
                  <NeonButton
                    variant="cyan"
                    size="sm"
                    rightIcon={<Zap className="w-3.5 h-3.5" />}
                  >
                    Trigger Action
                  </NeonButton>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* SECTION 3: Neon Buttons Suite */}
          <section className="space-y-6">
            <SectionTitle
              tag="[ 03 // INTERACTIVE CONTROLS ]"
              title="NeonButton Component"
              subtitle="Polished buttons with glowing aura states, ambient shimmer sweeps, loading spinners, and multi-size variants."
              icon={<Zap className="w-5 h-5" />}
              accent="violet"
            />

            <GlassCard variant="default" className="space-y-6">
              {/* Button Color Variants */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Style Variants
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <NeonButton
                    variant="cyan"
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                  >
                    Cyan Primary
                  </NeonButton>
                  <NeonButton
                    variant="violet"
                    leftIcon={<Sparkles className="w-4 h-4" />}
                  >
                    Electric Violet
                  </NeonButton>
                  <NeonButton variant="danger" leftIcon={<Flame className="w-4 h-4" />}>
                    Danger Action
                  </NeonButton>
                  <NeonButton
                    variant="outline"
                    leftIcon={<Terminal className="w-4 h-4" />}
                  >
                    Glass Outline
                  </NeonButton>
                  <NeonButton variant="ghost">Ghost Button</NeonButton>
                </div>
              </div>

              {/* Button Sizes */}
              <div className="pt-4 border-t border-white/5">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Size Scale (Small, Medium, Large)
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <NeonButton variant="cyan" size="sm">
                    Small (sm)
                  </NeonButton>
                  <NeonButton variant="cyan" size="md">
                    Medium (md)
                  </NeonButton>
                  <NeonButton variant="cyan" size="lg">
                    Large (lg)
                  </NeonButton>
                </div>
              </div>

              {/* Interactive States: Loading & Disabled */}
              <div className="pt-4 border-t border-white/5">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  States (Loading &amp; Disabled)
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <NeonButton
                    variant="violet"
                    isLoading={btnLoading}
                    onClick={() => {
                      setBtnLoading(true);
                      setTimeout(() => setBtnLoading(false), 2000);
                    }}
                  >
                    {btnLoading ? 'Computing Entropy...' : 'Click to Test Loading'}
                  </NeonButton>
                  <NeonButton variant="cyan" disabled>
                    Disabled State
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* SECTION 4: GlowBadges & Status Indicators */}
          <section className="space-y-6">
            <SectionTitle
              tag="[ 04 // STATUS PILLS & TELEMETRY ]"
              title="GlowBadge Component"
              subtitle="High-visibility status pills with glowing dropshadows, live pulsing ping-dots, and custom icon slots."
              icon={<Radio className="w-5 h-5" />}
              accent="magenta"
            />

            <GlassCard variant="default" className="space-y-6">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  Badge Color Palette &amp; Glows
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <GlowBadge variant="cyan" pulseDot>
                    CYAN TELEMETRY
                  </GlowBadge>
                  <GlowBadge variant="violet" pulseDot>
                    VIOLET CRYPTO
                  </GlowBadge>
                  <GlowBadge variant="danger" pulseDot>
                    DANGER BREACH
                  </GlowBadge>
                  <GlowBadge variant="warning" pulseDot>
                    WARNING VULNERABLE
                  </GlowBadge>
                  <GlowBadge variant="success" pulseDot>
                    SUCCESS SECURED
                  </GlowBadge>
                  <GlowBadge variant="neutral">NEUTRAL STANDBY</GlowBadge>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                  With Icons &amp; Sizes
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <GlowBadge
                    variant="danger"
                    size="sm"
                    icon={<ShieldAlert className="w-3 h-3" />}
                  >
                    PWNED IN 4 LEAKS
                  </GlowBadge>
                  <GlowBadge
                    variant="success"
                    size="md"
                    icon={<ShieldCheck className="w-3.5 h-3.5" />}
                  >
                    NIST 800-63B COMPLIANT
                  </GlowBadge>
                  <GlowBadge
                    variant="cyan"
                    size="lg"
                    icon={<Database className="w-4 h-4" />}
                  >
                    BCRYPT SALT: 10 ROUNDS
                  </GlowBadge>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* SECTION 5: Dynamic Animated Counter & Live Telemetry */}
          <section className="space-y-6">
            <SectionTitle
              tag="[ 05 // REAL-TIME METRICS ]"
              title="AnimatedCounter Component"
              subtitle="Spring-physics animated numeric tweens for live Shannon entropy, time-to-crack estimates, and hash performance metrics."
              icon={<Cpu className="w-5 h-5" />}
              accent="cyan"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GlassCard variant="cyan" className="space-y-2">
                <div className="text-xs font-mono text-neon-cyan flex items-center justify-between">
                  <span>SHANNON ENTROPY</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="text-3xl font-heading font-extrabold text-white">
                  <AnimatedCounter value={entropyVal} suffix=" bits" decimals={1} />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Formula: H = L &times; log&#8322;(N)
                </p>
              </GlassCard>

              <GlassCard variant="violet" className="space-y-2">
                <div className="text-xs font-mono text-neon-violet flex items-center justify-between">
                  <span>TIME TO CRACK</span>
                  <ClockIcon />
                </div>
                <div className="text-3xl font-heading font-extrabold text-white">
                  <AnimatedCounter
                    value={crackYears > 1000000 ? crackYears / 1000000 : crackYears}
                    prefix="~"
                    suffix={crackYears > 1000000 ? 'M yrs' : ' yrs'}
                    decimals={1}
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Cluster: 10B guesses/sec (GPU)
                </p>
              </GlassCard>

              <GlassCard variant="magenta" className="space-y-2">
                <div className="text-xs font-mono text-rose-300 flex items-center justify-between">
                  <span>BREACH OCCURRENCES</span>
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div className="text-3xl font-heading font-extrabold text-white">
                  <AnimatedCounter value={breachCount} suffix=" hits" decimals={0} />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Zero-knowledge k-anonymity
                </p>
              </GlassCard>

              <GlassCard variant="default" className="space-y-2">
                <div className="text-xs font-mono text-emerald-400 flex items-center justify-between">
                  <span>BCRYPT WORK FACTOR</span>
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="text-3xl font-heading font-extrabold text-white">
                  <AnimatedCounter value={1024} prefix="2^10 = " decimals={0} />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  Adaptive salt iterations
                </p>
              </GlassCard>
            </div>
          </section>

          {/* SECTION 6: Password Strength Spectrum Preview */}
          <section className="space-y-6">
            <SectionTitle
              tag="[ 06 // SECURITY SPECTRUM ]"
              title="Interactive Strength Matrix Preview"
              subtitle="Click through each strength tier to preview the reactive visual shifts across color, border, and glow states."
              icon={<KeyRound className="w-5 h-5" />}
              accent="cyan"
            />

            <GlassCard variant="default" className="space-y-6">
              {/* Step Selector Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {strengthSteps.map((step, idx) => (
                  <button
                    key={step.label}
                    onClick={() => setActiveStrength(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      activeStrength === idx
                        ? `bg-cyber-surface-raised ${step.borderColor} ${step.textColor} shadow-lg`
                        : 'bg-cyber-surface/40 border-white/5 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider">
                      Tier {idx + 1}
                    </div>
                    <div className="text-sm font-heading font-bold">{step.label}</div>
                  </button>
                ))}
              </div>

              {/* Dynamic Preview Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">CRYPTOGRAPHIC RESISTANCE</span>
                  <span className={`font-bold ${currentStrength.textColor}`}>
                    {currentStrength.label} &mdash; {currentStrength.bits} BITS
                  </span>
                </div>
                <div className="h-3 w-full bg-cyber-surface-raised rounded-full p-0.5 overflow-hidden flex gap-1">
                  {strengthSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 rounded-full transition-all duration-500 ${
                        i <= activeStrength
                          ? `${currentStrength.color} ${currentStrength.shadow}`
                          : 'bg-white/5'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Detailed Inspection Card for Active Tier */}
              <div
                className={`p-5 rounded-2xl bg-cyber-surface border ${currentStrength.borderColor} transition-all`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <div className="text-xs font-mono text-slate-400">
                      SAMPLE CREDENTIAL
                    </div>
                    <div className="font-mono text-lg font-bold text-white tracking-wider">
                      {currentStrength.sample}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-400">
                      CRACK TIME ESTIMATE
                    </div>
                    <div
                      className={`font-mono text-base font-bold ${currentStrength.textColor}`}
                    >
                      {currentStrength.timeText}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                  {currentStrength.desc}
                </p>
              </div>
            </GlassCard>
          </section>

          {/* SECTION 7: Typography & Telemetry Specimen */}
          <section className="space-y-6">
            <SectionTitle
              tag="[ 07 // TYPOGRAPHIC MATRIX ]"
              title="Typography Hierarchy & Telemetry Specimens"
              subtitle="Space Grotesk for bold commanding titles, Inter for legible UI text, and JetBrains Mono for cryptographic hashes, salts, and entropy data."
              icon={<Terminal className="w-5 h-5" />}
              accent="violet"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard variant="default" className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Heading: Space Grotesk
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
                    Heading 1: Defense Command Matrix
                  </h1>
                  <h2 className="text-xl md:text-2xl font-heading font-bold text-slate-200">
                    Heading 2: Information Entropy Engine
                  </h2>
                  <h3 className="text-lg md:text-xl font-heading font-semibold text-slate-300">
                    Heading 3: Cryptographic Salting &amp; Hashes
                  </h3>
                </div>
                <div className="pt-3 border-t border-white/5 text-xs text-slate-400">
                  Body Font: Inter &bull; Crisp, balanced, readable across small and large
                  displays.
                </div>
              </GlassCard>

              <GlassCard variant="cyan" className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-neon-cyan flex items-center justify-between">
                  <span>Code &amp; Data: JetBrains Mono</span>
                  <Binary className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-xl bg-[#05060F]/90 border border-neon-cyan/25 font-mono text-xs space-y-1.5 text-slate-300 overflow-x-auto">
                  <div className="text-neon-cyan">{'// k-Anonymity SHA-1 Query'}</div>
                  <div>
                    PREFIX: <span className="text-emerald-400 font-bold">5BAA6</span>{' '}
                    (Sent to API)
                  </div>
                  <div>
                    SUFFIX:{' '}
                    <span className="text-slate-400">
                      1E4C9B93F3F0682250B6CF8331B7EE68FD8
                    </span>
                  </div>
                  <div className="pt-2 text-neon-violet">{'// Bcrypt Salted Hash'}</div>
                  <div className="text-[11px] text-slate-400 break-all">
                    $2b$10$N9qo8uLOickgx2ZMRZoMye.I...X2W0p
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>
        </main>
      </div>

      {/* Futuristic Command Center Footer */}
      <Footer onReplayBoot={handleReplayBoot} />
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-neon-violet"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeWidth="2" d="M12 6v6l4 2" />
    </svg>
  );
}
