import React from 'react';

/**
 * SectionTitle - Futuristic HUD section header for command center interfaces.
 *
 * @param {Object} props
 * @param {string} props.title - Main heading (Space Grotesk)
 * @param {string} [props.tag] - Sci-fi tag index (e.g. "[ 01 // SYSTEM TELEMETRY ]")
 * @param {string} [props.subtitle] - Supporting description
 * @param {React.ReactNode} [props.icon] - Accent icon
 * @param {'cyan'|'violet'|'magenta'|'emerald'} [props.accent='cyan']
 * @param {string} [props.className='']
 */
export default function SectionTitle({
  title,
  tag,
  subtitle,
  icon,
  accent = 'cyan',
  className = '',
}) {
  const accentColors = {
    cyan: {
      text: 'text-neon-cyan',
      border: 'border-neon-cyan/40',
      glow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]',
      line: 'from-neon-cyan/60 via-neon-cyan/20 to-transparent',
      tagBg: 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan',
    },
    violet: {
      text: 'text-neon-violet',
      border: 'border-neon-violet/40',
      glow: 'shadow-[0_0_15px_rgba(139,92,246,0.5)]',
      line: 'from-neon-violet/60 via-neon-violet/20 to-transparent',
      tagBg: 'bg-neon-violet/10 border-neon-violet/30 text-neon-violet',
    },
    magenta: {
      text: 'text-neon-magenta',
      border: 'border-neon-magenta/40',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]',
      line: 'from-neon-magenta/60 via-neon-magenta/20 to-transparent',
      tagBg: 'bg-neon-magenta/10 border-neon-magenta/30 text-neon-magenta',
    },
    emerald: {
      text: 'text-neon-emerald',
      border: 'border-neon-emerald/40',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
      line: 'from-neon-emerald/60 via-neon-emerald/20 to-transparent',
      tagBg: 'bg-neon-emerald/10 border-neon-emerald/30 text-neon-emerald',
    },
  };

  const style = accentColors[accent] || accentColors.cyan;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Sci-Fi Tag & Marker */}
      {tag && (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-sm bg-neon-cyan animate-pulse" />
          <span className="font-mono text-[11px] tracking-widest uppercase text-slate-400">
            {tag}
          </span>
        </div>
      )}

      {/* Main Heading Row */}
      <div className="flex items-center gap-3">
        {icon && (
          <div
            className={`p-2 rounded-xl bg-cyber-surface border ${style.border} ${style.text} ${style.glow}`}
          >
            {icon}
          </div>
        )}
        <h2 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-white">
          {title}
        </h2>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">{subtitle}</p>
      )}

      {/* Decorative Cyber Divider */}
      <div className="pt-2 flex items-center gap-2">
        <div className={`h-0.5 w-16 bg-gradient-to-r ${style.line}`} />
        <div className="h-0.5 flex-1 bg-white/5" />
        <div className="w-1 h-1 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
