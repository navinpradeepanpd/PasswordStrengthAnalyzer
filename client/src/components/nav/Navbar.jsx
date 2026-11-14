import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Radio, Lock, KeyRound, Menu, X } from 'lucide-react';
import GlowBadge from '../ui/GlowBadge';
import NeonButton from '../ui/NeonButton';

const NAV_LINKS = [
  { id: 'hero', label: 'Overview' },
  { id: 'analyzer', label: 'Analyzer' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'crypto-specs', label: 'Design Specs' },
];

export default function Navbar({ onAnalyzeClick, onHowItWorksClick }) {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection & Scroll-Spy observer
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Section detection
      const scrollPos = window.scrollY + 200;
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const link = NAV_LINKS[i];
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(link.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (id === 'analyzer' && onAnalyzeClick) {
      onAnalyzeClick();
      return;
    }
    if (id === 'how-it-works' && onHowItWorksClick) {
      onHowItWorksClick();
      return;
    }
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-[#05060F]/90 backdrop-blur-2xl border-white/15 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-[#05060F]/80 backdrop-blur-xl border-white/10 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo & Status Indicator */}
        <button
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-3 text-left group focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:outline-none rounded-xl p-1"
        >
          <div className="p-2 sm:p-2.5 rounded-2xl bg-cyber-surface border border-neon-cyan/40 text-neon-cyan shadow-glow-cyan group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-base sm:text-lg tracking-wider text-white">
                AEGIS
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 hidden xs:inline-block">
                DEFENSE OS v2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>COMMAND MATRIX // ACTIVE</span>
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links with Scroll-Spy */}
        <nav
          className="hidden md:flex items-center gap-1 p-1 rounded-full bg-cyber-surface/60 border border-white/10 backdrop-blur-md"
          aria-label="Main Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:outline-none ${
                  isActive
                    ? 'text-neon-cyan font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavPill"
                    className="absolute inset-0 rounded-full bg-neon-cyan/15 border border-neon-cyan/40 shadow-glow-cyan -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Badges */}
        <div className="hidden lg:flex items-center gap-2.5">
          <GlowBadge variant="cyan" pulseDot size="sm">
            GRID: ONLINE
          </GlowBadge>
          <GlowBadge variant="violet" size="sm" icon={<Lock className="w-3 h-3" />}>
            256-BIT CRYPTO
          </GlowBadge>
          <NeonButton
            variant="cyan"
            size="sm"
            magnetic
            leftIcon={<KeyRound className="w-3.5 h-3.5" />}
            onClick={() => scrollToSection('analyzer')}
          >
            Analyze Password
          </NeonButton>
        </div>

        {/* Mobile Action + Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <NeonButton
            variant="cyan"
            size="sm"
            leftIcon={<KeyRound className="w-3.5 h-3.5" />}
            onClick={() => scrollToSection('analyzer')}
            className="text-xs px-2.5 py-1.5"
          >
            Analyze
          </NeonButton>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-cyber-surface border border-white/15 text-slate-300 hover:text-white hover:border-neon-cyan focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:outline-none transition-all"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-neon-cyan" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-[#05060F]/95 backdrop-blur-2xl px-6 py-4 space-y-4"
          >
            <nav className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-mono text-left transition-all ${
                      isActive
                        ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                GRID: SECURE
              </span>
              <span>AES-256 / BCRYPT</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
