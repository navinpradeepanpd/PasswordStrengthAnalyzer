import React, { useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * NeonButton - High-polish, sci-fi command center interactive button.
 * Includes magnetic hover physics, click ripple waves, and accessible focus states.
 *
 * @param {Object} props
 * @param {'cyan'|'violet'|'danger'|'outline'|'ghost'} [props.variant='cyan']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.isLoading=false]
 * @param {boolean} [props.magnetic=false]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 */
export default function NeonButton({
  children,
  variant = 'cyan',
  size = 'md',
  isLoading = false,
  magnetic = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-xl',
    md: 'px-5 py-2.5 text-sm gap-2 rounded-2xl',
    lg: 'px-7 py-3.5 text-base gap-2.5 rounded-2xl font-semibold',
  };

  const variantStyles = {
    cyan: 'bg-neon-cyan text-cyber-bg font-semibold shadow-glow-cyan hover:bg-cyan-300 hover:shadow-glow-cyan-lg border border-cyan-300/50',
    violet:
      'bg-[#7C3AED] text-white font-semibold shadow-glow-violet hover:bg-violet-600 hover:shadow-glow-violet-lg border border-violet-400/50',
    danger:
      'bg-[#E11D48] text-white font-semibold shadow-glow-magenta hover:bg-rose-600 hover:shadow-[0_0_35px_-4px_rgba(225,29,72,0.65)] border border-rose-400/50',
    outline:
      'bg-cyber-surface/60 backdrop-blur-md text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan/10 hover:border-neon-cyan hover:shadow-glow-cyan',
    ghost:
      'bg-transparent text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10',
  };

  // Magnetic hover pull
  const handleMouseMove = (e) => {
    if (!magnetic || shouldReduceMotion || disabled || isLoading) return;
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * 0.18;
    const distanceY = (e.clientY - centerY) * 0.18;
    setPosition({ x: distanceX, y: distanceY });
  };

  const handleMouseLeave = () => {
    if (magnetic) setPosition({ x: 0, y: 0 });
  };

  // Click ripple effect
  const handleClick = (e) => {
    if (disabled || isLoading) return;

    if (buttonRef.current && !shouldReduceMotion) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };

      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      animate={shouldReduceMotion ? {} : { x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      whileHover={disabled || isLoading || shouldReduceMotion ? {} : { scale: 1.02 }}
      whileTap={disabled || isLoading || shouldReduceMotion ? {} : { scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || isLoading}
      onClick={handleClick}
      aria-busy={isLoading}
      className={`relative inline-flex items-center justify-center tracking-wide font-sans transition-all duration-200 select-none overflow-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060F] ${
        sizeStyles[size]
      } ${variantStyles[variant]} ${
        disabled ? 'opacity-40 cursor-not-allowed filter grayscale' : 'cursor-pointer'
      } ${className}`}
      {...props}
    >
      {/* Click ripple animation waves */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-[ping_0.6s_ease-out_forwards]"
          style={{
            left: ripple.x - 12,
            top: ripple.y - 12,
            width: 24,
            height: 24,
          }}
        />
      ))}

      {/* Dynamic ambient highlight shimmer */}
      <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:animate-shimmer pointer-events-none" />

      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
}
