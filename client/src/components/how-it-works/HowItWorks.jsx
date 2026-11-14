import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cpu } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import PipelineDiagram from './PipelineDiagram';
import LiveSha256Hasher from './LiveSha256Hasher';
import InteractiveSaltDemo from './InteractiveSaltDemo';
import ConceptCards from './ConceptCards';
import SecurityTipsAccordion from './SecurityTipsAccordion';

export default function HowItWorks() {
  const containerRef = useRef(null);

  // Parallax subtle floating glow
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.15, 0.4, 0.15]);

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative z-10 space-y-16 scroll-mt-24"
    >
      {/* Decorative Parallax Glow Background */}
      <motion.div
        style={{ y: glowY, opacity: glowOpacity }}
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-neon-cyan/20 via-neon-violet/15 to-transparent blur-3xl -z-10 rounded-full"
      />

      {/* Section Header */}
      <div className="space-y-4">
        <SectionTitle
          tag="[ ARCHITECTURE & CRYPTOGRAPHY ]"
          title="How It Works: The Cryptographic Engine"
          subtitle="An interactive educational laboratory demystifying Shannon information entropy, one-way adaptive key derivation, 128-bit random salting, and zero-knowledge k-anonymity."
          icon={<Cpu className="w-5 h-5" />}
          accent="cyan"
        />
      </div>

      {/* PART 1: The Cryptographic Pipeline Diagram (Animated SVG) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <span>Part 1 &mdash; End-to-End Cryptographic Dataflow Pipeline</span>
        </div>
        <PipelineDiagram />
      </div>

      {/* PART 2: Interactive Cryptographic Demos */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
          <span className="w-2 h-2 rounded-full bg-neon-violet animate-pulse" />
          <span>Part 2 &mdash; Hands-On Cryptographic Prototyping Labs</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interactive Lab 1: Live SHA-256 Matrix Scrambler */}
          <LiveSha256Hasher />

          {/* Interactive Lab 2: Interactive 128-bit Salting Engine */}
          <InteractiveSaltDemo />
        </div>
      </div>

      {/* PART 3: Deep Dive Concept Cards (Entropy, Bcrypt, Salting, Brute-Force, k-Anonymity) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <span>Part 3 &mdash; Core Cryptographic Foundations &amp; Threat Modeling</span>
        </div>
        <ConceptCards />
      </div>

      {/* PART 4: Password Security Tips Accordion */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Part 4 &mdash; NIST SP 800-63B Password Defense Guidelines</span>
        </div>

        <SecurityTipsAccordion />
      </div>
    </section>
  );
}
