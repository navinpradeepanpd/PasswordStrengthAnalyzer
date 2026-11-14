import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * GlassCard - Cyberpunk sci-fi command center glassmorphism container.
 * Features 3D perspective tilt on hover, dynamic specular shine, 1px gradient borders, and soft inner glow.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {'default'|'cyan'|'violet'|'magenta'|'subtle'} [props.variant='default']
 * @param {boolean} [props.interactive=false] - Enables hover elevation and neon aura
 * @param {boolean} [props.tilt=false] - Enables 3D perspective mouse tilt
 * @param {boolean} [props.showCorners=false] - Renders futuristic HUD corner brackets
 * @param {string} [props.className='']
 */
export default function GlassCard({
  children,
  variant = 'default',
  interactive = false,
  tilt = false,
  showCorners = false,
  className = '',
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const [tiltStyle, setTiltStyle] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const variantStyles = {
    default: 'glass-surface border-white/10 hover:border-white/20',
    cyan: 'bg-cyber-surface/75 backdrop-blur-xl border border-neon-cyan/30 shadow-[0_0_30px_-8px_rgba(34,211,238,0.25)] shadow-inner-glow-cyan',
    violet:
      'bg-cyber-surface/75 backdrop-blur-xl border border-neon-violet/30 shadow-[0_0_30px_-8px_rgba(139,92,246,0.25)] shadow-inner-glow-violet',
    magenta:
      'bg-cyber-surface/75 backdrop-blur-xl border border-neon-magenta/30 shadow-[0_0_30px_-8px_rgba(244,63,94,0.25)]',
    subtle: 'bg-cyber-surface-subtle/50 backdrop-blur-md border border-white/5',
  };

  const handleMouseMove = (e) => {
    if ((!tilt && !interactive) || shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 4; // Max 4 deg tilt
    const rotateY = ((x - centerX) / centerX) * 4;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTiltStyle({ rotateX, rotateY, glareX, glareY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  };

  const Component = interactive || tilt ? motion.div : 'div';
  const interactiveProps =
    interactive || tilt
      ? {
          animate: shouldReduceMotion
            ? {}
            : {
                rotateX: tiltStyle.rotateX,
                rotateY: tiltStyle.rotateY,
                transformPerspective: 1000,
              },
          transition: { type: 'spring', stiffness: 300, damping: 25 },
          whileTap: shouldReduceMotion ? {} : { scale: 0.99 },
        }
      : {};

  return (
    <Component
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl p-6 transition-all duration-300 ${variantStyles[variant]} ${
        interactive ? 'cursor-pointer hover:shadow-glow-cyan' : ''
      } ${className}`}
      {...interactiveProps}
      {...props}
    >
      {/* Dynamic Specular Mouse Glare */}
      {(tilt || interactive) && tiltStyle.isHovered && !shouldReduceMotion && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300 opacity-20"
          style={{
            background: `radial-gradient(circle at ${tiltStyle.glareX}% ${tiltStyle.glareY}%, rgba(255,255,255,0.4) 0%, transparent 65%)`,
          }}
        />
      )}

      {/* Sci-Fi HUD Corner Brackets */}
      {showCorners && (
        <>
          <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-neon-cyan/50 pointer-events-none" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-neon-cyan/50 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-neon-cyan/50 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-neon-cyan/50 pointer-events-none" />
        </>
      )}

      {/* Soft Top Rim Light */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {children}
    </Component>
  );
}
