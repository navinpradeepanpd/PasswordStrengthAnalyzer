import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Holographic Padlock & Security Core Mesh
 * Built with procedural Three.js geometries, emissive shaders, and dual orbital rings.
 */
function HologramScene({ prefersReducedMotion }) {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const coreRef = useRef();

  // Create orbiting cyber point cloud
  const particleCount = 75;
  const particles = useMemo(() => {
    const coords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.4 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      coords[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      coords[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      coords[i * 3 + 2] = radius * Math.cos(phi);
    }
    return coords;
  }, [particleCount]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth cursor tilt damping
    if (!prefersReducedMotion) {
      const targetRotationY = state.pointer.x * 0.65;
      const targetRotationX = -state.pointer.y * 0.45;

      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotationY,
        4,
        delta
      );
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotationX,
        4,
        delta
      );

      // Continuous slow orbital rotation for rings & core
      if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.45;
      if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.35;
      if (coreRef.current) coreRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={prefersReducedMotion ? 0 : 2}
        rotationIntensity={prefersReducedMotion ? 0 : 0.3}
        floatIntensity={prefersReducedMotion ? 0 : 0.5}
      >
        {/* === A. 3D Holographic Padlock Group === */}
        <group position={[0, -0.15, 0]}>
          {/* 1. Padlock Body */}
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[1.6, 1.3, 0.55]} />
            <meshStandardMaterial
              color="#0B0F1E"
              roughness={0.25}
              metalness={0.9}
              wireframe={false}
              transparent
              opacity={0.92}
            />
          </mesh>

          {/* 1b. Padlock Body Cyber Wireframe Cage */}
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[1.64, 1.34, 0.59]} />
            <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.35} />
          </mesh>

          {/* 2. Padlock Shackle Arc (Torus segment on top) */}
          <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.58, 0.14, 16, 48, Math.PI]} />
            <meshStandardMaterial
              color="#22D3EE"
              emissive="#06B6D4"
              emissiveIntensity={0.65}
              roughness={0.15}
              metalness={0.95}
            />
          </mesh>

          {/* 3. Glowing Keyhole / Cryptographic Core */}
          <group position={[0, -0.3, 0.3]}>
            <mesh>
              <circleGeometry args={[0.16, 32]} />
              <meshBasicMaterial color="#22D3EE" />
            </mesh>
            <mesh position={[0, -0.14, 0]}>
              <planeGeometry args={[0.12, 0.22]} />
              <meshBasicMaterial color="#22D3EE" />
            </mesh>
          </group>
        </group>

        {/* === B. Internal Floating Quantum Icosahedron Core === */}
        <mesh ref={coreRef} position={[0, -0.45, 0]}>
          <icosahedronGeometry args={[0.35, 1]} />
          <meshStandardMaterial
            color="#8B5CF6"
            emissive="#8B5CF6"
            emissiveIntensity={1.2}
            wireframe
          />
        </mesh>

        {/* === C. Outer Orbital Defense Rings === */}
        {/* Ring 1 (Cyan) */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.0, 0.02, 16, 64]} />
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.65} />
        </mesh>

        {/* Ring 2 (Electric Violet) */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[2.2, 0.018, 16, 64]} />
          <meshBasicMaterial color="#8B5CF6" transparent opacity={0.55} />
        </mesh>

        {/* === D. Orbiting Cyber Nodes / Particle Field === */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={particles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.065}
            color="#22D3EE"
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      </Float>

      {/* Cyber Point & Ambient Lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 4]} color="#22D3EE" intensity={2.2} distance={10} />
      <pointLight position={[-3, -2, -3]} color="#8B5CF6" intensity={1.8} distance={10} />
      <directionalLight position={[0, 4, 2]} intensity={0.8} color="#ffffff" />
    </group>
  );
}

/**
 * Fallback component for loading or WebGL-disabled environments
 */
function HologramFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-56 h-56 rounded-full border border-neon-cyan/30 flex items-center justify-center animate-pulse">
        <div
          className="absolute inset-0 rounded-full border border-neon-violet/30 animate-spin"
          style={{ animationDuration: '10s' }}
        />
        <div className="w-28 h-36 rounded-2xl border-2 border-neon-cyan bg-cyber-surface/60 backdrop-blur-md flex flex-col items-center justify-center shadow-glow-cyan">
          <div className="w-16 h-14 rounded-t-full border-2 border-neon-cyan -mt-16 mb-2 border-b-0" />
          <div className="w-3 h-3 rounded-full bg-neon-cyan animate-ping" />
          <span className="font-mono text-[10px] text-neon-cyan mt-2">AEGIS_3D</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Main Exported HolographicShield Component
 * Renders Three.js Canvas with performance optimizations and Error Boundary.
 */
export default function HolographicShield() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (!hasWebGL) {
    return <HologramFallback />;
  }

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] md:h-[500px] flex items-center justify-center">
      {/* Background Soft Glow Ring behind the 3D model */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-neon-cyan/20 to-neon-violet/20 blur-[80px] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 48 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
        dpr={Math.min(window.devicePixelRatio || 1, 2)}
        className="cursor-grab active:cursor-grabbing"
      >
        <HologramScene prefersReducedMotion={prefersReducedMotion} />
      </Canvas>

      {/* Interactive HUD Hint */}
      <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
        <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase bg-[#05060F]/60 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
          &bull; MOVE CURSOR TO TILT HOLOGRAPHIC CORE &bull;
        </span>
      </div>
    </div>
  );
}
