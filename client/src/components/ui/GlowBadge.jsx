import React from 'react';

/**
 * GlowBadge - Futuristic cyber status pill badge with glow and optional pulsing indicator.
 *
 * @param {Object} props
 * @param {'cyan'|'violet'|'danger'|'warning'|'success'|'neutral'} [props.variant='cyan']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.pulseDot=false]
 * @param {React.ReactNode} [props.icon]
 * @param {string} [props.className='']
 * @param {React.ReactNode} props.children
 */
export default function GlowBadge({
  children,
  variant = 'cyan',
  size = 'md',
  pulseDot = false,
  icon,
  className = '',
  ...props
}) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] gap-1 rounded-full font-mono',
    md: 'px-2.5 py-1 text-xs gap-1.5 rounded-full font-mono',
    lg: 'px-3.5 py-1.5 text-sm gap-2 rounded-full font-sans',
  };

  const variantStyles = {
    cyan: {
      badge:
        'bg-neon-cyan/10 text-cyan-300 border border-neon-cyan/30 shadow-[0_0_12px_-2px_rgba(34,211,238,0.3)]',
      dot: 'bg-neon-cyan shadow-[0_0_8px_#22d3ee]',
    },
    violet: {
      badge:
        'bg-neon-violet/10 text-violet-300 border border-neon-violet/30 shadow-[0_0_12px_-2px_rgba(139,92,246,0.3)]',
      dot: 'bg-neon-violet shadow-[0_0_8px_#8b5cf6]',
    },
    danger: {
      badge:
        'bg-neon-magenta/10 text-rose-300 border border-neon-magenta/30 shadow-[0_0_12px_-2px_rgba(244,63,94,0.3)]',
      dot: 'bg-neon-magenta shadow-[0_0_8px_#f43f5e]',
    },
    warning: {
      badge:
        'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_-2px_rgba(245,158,11,0.3)]',
      dot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    },
    success: {
      badge:
        'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_-2px_rgba(16,185,129,0.3)]',
      dot: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
    },
    neutral: {
      badge: 'bg-white/5 text-slate-400 border border-white/10',
      dot: 'bg-slate-400',
    },
  };

  const current = variantStyles[variant] || variantStyles.cyan;

  return (
    <span
      className={`inline-flex items-center tracking-wide font-medium select-none uppercase ${
        sizeStyles[size]
      } ${current.badge} ${className}`}
      {...props}
    >
      {pulseDot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}
          />
          <span
            className={`relative inline-flex rounded-full h-1.5 w-1.5 ${current.dot}`}
          />
        </span>
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
