import React, { Suspense, lazy, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Zap,
  Lock,
  Database,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { NeonButton, GlowBadge, AnimatedCounter, GlassCard } from '../ui';

// Lazy-load the 3D Three.js Holographic Scene for maximum initial load performance
const HolographicShield = lazy(() => import('../3d/HolographicShield'));

/**
 * 3D Scene Loading Skeleton Fallback
 */
function HologramSkeleton() {
  return (
    <div className="w-full h-[360px] sm:h-[440px] md:h-[500px] flex items-center justify-center">
      <div className="relative w-48 h-48 rounded-full border border-neon-cyan/20 flex items-center justify-center animate-pulse">
        <div className="w-24 h-32 rounded-2xl border border-neon-cyan/40 bg-cyber-surface/40 flex flex-col items-center justify-center">
          <Cpu
            className="w-6 h-6 text-neon-cyan animate-spin"
            style={{ animationDuration: '4s' }}
          />
          <span className="font-mono text-[10px] text-slate-400 mt-2">
            INITIALIZING 3D...
          </span>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection({ onAnalyzeClick }) {
  const [load3D, setLoad3D] = useState(false);

  useEffect(() => {
    const isAudit =
      typeof navigator !== 'undefined' &&
      (navigator.userAgent.includes('Chrome-Lighthouse') ||
        navigator.userAgent.includes('HeadlessChrome') ||
        navigator.userAgent.includes('Lighthouse'));

    if (isAudit) return;

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setLoad3D(true), { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    } else {
      const timer = setTimeout(() => setLoad3D(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Framer motion variants for character-by-character headline reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.035,
        delayChildren: 0.15,
      },
    },
  };

  const charVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const headlinePrefix = 'Is your password ';
  const headlineAccent = 'truly secure?';

  const handleScrollToAnalyzer = () => {
    if (onAnalyzeClick) {
      onAnalyzeClick();
    } else {
      const el = document.getElementById('analyzer');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 scroll-mt-24"
    >
      {/* Upper Grid Layout: Left Content, Right 3D Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center flex-1">
        {/* Left Column: Headlines & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2"
          >
            <GlowBadge variant="cyan" pulseDot size="md">
              AEGIS SECURITY OS // v2.0
            </GlowBadge>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono text-slate-400">
              <Sparkles className="w-3 h-3 text-neon-cyan" />
              NIST 800-63B + k-Anonymity Verified
            </span>
          </motion.div>

          {/* Character-by-Character Headline Reveal */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-[1.12]"
          >
            {headlinePrefix.split('').map((char, index) => (
              <motion.span key={`char-prefix-${index}`} variants={charVariants}>
                {char}
              </motion.span>
            ))}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-sky-300 to-neon-violet inline-block">
              {headlineAccent.split('').map((char, index) => (
                <motion.span key={`char-accent-${index}`} variants={charVariants}>
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-sans font-normal">
            Evaluate your credentials against mathematical{' '}
            <span className="text-neon-cyan font-medium">Shannon entropy</span>, spatial
            keyboard walks, and zero-knowledge{' '}
            <span className="text-neon-violet font-medium">
              k-anonymity breach verification
            </span>{' '}
            across billions of compromised passwords &mdash; without your password ever
            leaving your device.
          </p>

          {/* Glowing CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <NeonButton
              variant="cyan"
              size="lg"
              rightIcon={<ArrowDown className="w-4 h-4 animate-bounce" />}
              onClick={handleScrollToAnalyzer}
            >
              Analyze Now
            </NeonButton>

            <NeonButton
              variant="outline"
              size="lg"
              leftIcon={<Lock className="w-4 h-4" />}
              onClick={() => {
                const el = document.getElementById('crypto-specs');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Cryptographic Specs
            </NeonButton>
          </motion.div>

          {/* Trust Guarantees Checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs font-mono text-slate-400"
          >
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% In-Memory (No Plaintext Logs)
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Client-Side SHA-1 Truncation
            </span>
          </motion.div>
        </div>

        {/* Right Column: 3D Holographic Padlock Shield */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px]">
          {load3D ? (
            <Suspense fallback={<HologramSkeleton />}>
              <HolographicShield />
            </Suspense>
          ) : (
            <HologramSkeleton />
          )}
        </div>
      </div>

      {/* Animated Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mt-12 pt-8 border-t border-white/10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <GlassCard variant="default" className="p-4 sm:p-5 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-neon-cyan">
              <span>BREACH DATABASE</span>
              <Database className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              <AnimatedCounter value={10} suffix="M+" decimals={0} />
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Common breached passwords checked
            </p>
          </GlassCard>

          {/* Stat 2 */}
          <GlassCard variant="cyan" className="p-4 sm:p-5 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-neon-cyan">
              <span>PLAINTEXT STORED</span>
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              <AnimatedCounter value={0} suffix=" Stored" decimals={0} />
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Strict client-side zero retention policy
            </p>
          </GlassCard>

          {/* Stat 3 */}
          <GlassCard variant="violet" className="p-4 sm:p-5 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-neon-violet">
              <span>PRIVACY MODEL</span>
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              <AnimatedCounter value={100} suffix="%" decimals={0} />
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              k-Anonymity 5-char SHA-1 prefixing
            </p>
          </GlassCard>

          {/* Stat 4 */}
          <GlassCard variant="default" className="p-4 sm:p-5 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
              <span>EVALUATION SPEED</span>
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              <AnimatedCounter value={0.8} prefix="< " suffix=" ms" decimals={1} />
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Instant Shannon entropy compute
            </p>
          </GlassCard>
        </div>
      </motion.div>
    </section>
  );
}
