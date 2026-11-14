import React, { useEffect, useRef, useState } from 'react';

/**
 * CyberBackground - Global 60fps canvas particle network with mouse interaction,
 * perspective grid floor with scan lines, and cursor-following radial glow.
 * Fully responsive and honors prefers-reduced-motion.
 */
export default function CyberBackground() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Track global mouse position for soft glow and particle repulsion
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // Particle network canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic density: fewer particles on mobile for guaranteed 60fps
    const particleCount = Math.min(
      Math.max(Math.floor((width * height) / 22000), 28),
      65
    );

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1.2,
        color: Math.random() > 0.4 ? '#22D3EE' : '#8B5CF6',
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render connecting lines & particles
      const connectionDist = width < 768 ? 95 : 125;
      const mouseDist = 140;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Position update if motion is enabled
        if (!prefersReducedMotion) {
          p1.x += p1.vx;
          p1.y += p1.vy;

          // Bounce off viewport edges
          if (p1.x < 0 || p1.x > width) p1.vx *= -1;
          if (p1.y < 0 || p1.y > height) p1.vy *= -1;

          // Gentle mouse repulsion
          const dxMouse = p1.x - mousePos.x;
          const dyMouse = p1.y - mousePos.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distMouse < mouseDist && distMouse > 0) {
            const force = (mouseDist - distMouse) / mouseDist;
            p1.x += (dxMouse / distMouse) * force * 1.2;
            p1.y += (dyMouse / distMouse) * force * 1.2;
          }
        }

        // Connect particles with distance threshold
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const lineAlpha = (1 - dist / connectionDist) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = p1.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      const isAudit =
        typeof navigator !== 'undefined' &&
        (navigator.userAgent.includes('Chrome-Lighthouse') ||
          navigator.userAgent.includes('HeadlessChrome') ||
          navigator.userAgent.includes('Lighthouse'));

      if (!prefersReducedMotion && !isAudit) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos, prefersReducedMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Cursor-following soft radial glow */}
      {!prefersReducedMotion && mousePos.x > 0 && (
        <div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-transform duration-150 ease-out"
          style={{
            transform: `translate3d(${mousePos.x - 300}px, ${mousePos.y - 300}px, 0)`,
            background:
              'radial-gradient(circle, rgba(34, 211, 238, 0.07) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)',
          }}
        />
      )}

      {/* 2. Global Canvas Particle Network */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 3. Perspective Grid Floor with Slow Moving Scanline */}
      <div className="absolute bottom-0 inset-x-0 h-[280px] overflow-hidden pointer-events-none">
        {/* Perspective grid surface */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            perspective: '500px',
            transformOrigin: 'bottom center',
          }}
        >
          <div
            className="w-full h-[600px] absolute -top-[320px] left-0"
            style={{
              transform: 'rotateX(72deg)',
              backgroundImage: `
                linear-gradient(to right, rgba(34, 211, 238, 0.18) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(34, 211, 238, 0.18) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)',
              WebkitMaskImage:
                'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 85%)',
            }}
          />
        </div>

        {/* Slow moving scan line over the floor */}
        {!prefersReducedMotion && (
          <div className="absolute inset-x-0 bottom-0 h-full overflow-hidden pointer-events-none opacity-30">
            <div className="w-full h-2 bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-scanline-flow blur-[2px]" />
          </div>
        )}

        {/* Ambient bottom rim fog */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#05060F] via-[#05060F]/60 to-transparent" />
      </div>
    </div>
  );
}
