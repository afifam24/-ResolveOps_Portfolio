import { palette } from '../lib/palette';
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';

// ── Floating Glowing Glass Orb ────────────────────────

interface GlassOrbProps {
  basePos: [number, number, number];
  radius: number;
  speed: number;
  floatAmp: number;
  phase: number;
  color: string;
  emissive: string;
  hasRing?: boolean;
}

function GlassOrb({
  basePos,
  radius,
  speed,
  floatAmp,
  phase,
  color,
  emissive,
  hasRing = false,
}: GlassOrbProps) {
  const meshRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const starRef = useRef<THREE.Mesh>(null);

  // Geometry and materials
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(radius, 36, 36), [radius]);
  const haloGeo = useMemo(() => new THREE.SphereGeometry(radius * 1.14, 24, 24), [radius]);

  const orbMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(emissive),
        emissiveIntensity: 0.55,
        roughness: 0.18,
        metalness: 0.12,
        transparent: true,
        opacity: 0.78,
      }),
    [color, emissive]
  );

  const haloMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#D8CCFA'),
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      }),
    []
  );

  // Thin elliptical orbital ring curve for the ringed sphere
  const ringGeo = useMemo(() => {
    if (!hasRing) return null;
    const curve = new THREE.EllipseCurve(0, 0, radius * 2.2, radius * 1.05, 0, 2 * Math.PI, false, 0);
    const points = curve.getPoints(64);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(p.x, p.y, 0))
    );
    return geometry;
  }, [hasRing, radius]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const t = performance.now() * 0.001 * speed + phase;

    // Gentle organic floating
    const x = basePos[0] + Math.cos(t * 0.7) * (floatAmp * 0.45);
    const y = basePos[1] + Math.sin(t) * floatAmp;
    const z = basePos[2] + Math.sin(t * 0.5) * 0.15;

    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.y += delta * 0.18;
    meshRef.current.rotation.x += delta * 0.08;

    // Orbiting star on the ring
    if (hasRing && ringRef.current && starRef.current) {
      ringRef.current.rotation.x = 1.25;
      ringRef.current.rotation.y = -0.35 + Math.sin(t * 0.2) * 0.08;

      const starAngle = t * 1.15;
      const rx = radius * 2.2;
      const ry = radius * 1.05;
      starRef.current.position.set(
        Math.cos(starAngle) * rx,
        Math.sin(starAngle) * ry,
        0
      );
    }
  });

  return (
    <group ref={meshRef}>
      {/* Central Glass Orb */}
      <mesh geometry={sphereGeo} material={orbMaterial} />
      {/* Outer Glow Halo */}
      <mesh geometry={haloGeo} material={haloMaterial} />

      {/* Saturn-like Orbital Ring & Traveler Star */}
      {hasRing && ringGeo && (
        <group ref={ringRef}>
          <lineLoop geometry={ringGeo}>
            <lineBasicMaterial color="#DDD6FE" transparent opacity={0.65} linewidth={1} />
          </lineLoop>
          {/* Orbiting bright luminous star */}
          <mesh ref={starRef}>
            <sphereGeometry args={[radius * 0.12, 12, 12]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>
      )}
    </group>
  );
}

// ── Drifting Cosmic Stardust Particles ────────────────

function Stardust({ vW, vH }: { vW: number; vH: number }) {
  const count = 48;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const ph = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Keep stars along outer flanks, avoiding center text
      const flank = Math.random() < 0.5 ? -1 : 1;
      const x = flank * (vW * 0.28 + Math.random() * (vW * 0.26));
      const y = (Math.random() - 0.5) * vH * 1.1;
      const z = (Math.random() - 0.5) * 2.5;

      pos[i * 3]     = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return [pos, ph];
  }, [vW, vH]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame(() => {
    if (!meshRef.current) return;
    const t = performance.now() * 0.001;
    const posAttr = meshRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const pos = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Gentle subtle vertical drift
      pos[idx + 1] += Math.sin(t * 0.4 + phases[i]) * 0.0015;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.055}
        color="#E9E5FF"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
}

// ── Flowing Silk Light Strands (Left & Right Flanks) ──

function SilkFlowStrands({ vW, vH }: { vW: number; vH: number }) {
  const leftRef = useRef<THREE.LineSegments>(null);
  const rightRef = useRef<THREE.LineSegments>(null);

  const strandCount = 12;
  const pointsPerStrand = 36;

  const [leftGeo, rightGeo] = useMemo(() => {
    const createFlankGeo = () => {
      const total = strandCount * pointsPerStrand;
      const positions = new Float32Array(total * 3);
      const colors = new Float32Array(total * 3);
      const indices: number[] = [];

      for (let s = 0; s < strandCount; s++) {
        for (let p = 0; p < pointsPerStrand - 1; p++) {
          indices.push(s * pointsPerStrand + p, s * pointsPerStrand + p + 1);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geo.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
      return geo;
    };

    return [createFlankGeo(), createFlankGeo()];
  }, []);

  useFrame(() => {
    const t = performance.now() * 0.0006;

    // Animate Left Flank Strands
    if (leftRef.current) {
      const posAttr = leftGeo.attributes.position as THREE.BufferAttribute;
      const colAttr = leftGeo.attributes.color as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const col = colAttr.array as Float32Array;

      for (let s = 0; s < strandCount; s++) {
        const spread = (s / (strandCount - 1) - 0.5) * 0.6;
        for (let p = 0; p < pointsPerStrand; p++) {
          const u = p / (pointsPerStrand - 1);
          const i3 = (s * pointsPerStrand + p) * 3;

          const baseX = -vW * 0.46 + Math.sin(u * Math.PI) * 0.8 + spread;
          const baseY = (0.5 - u) * vH * 1.25;
          const waveX = Math.sin(u * 4 - t * 2 + s * 0.3) * 0.18;
          const waveZ = Math.cos(u * 3 + t + s * 0.2) * 0.25;

          pos[i3]     = baseX + waveX;
          pos[i3 + 1] = baseY;
          pos[i3 + 2] = -0.5 + waveZ;

          const alpha = Math.sin(u * Math.PI) * 0.35;
          col[i3]     = 0.65 * alpha;
          col[i3 + 1] = 0.55 * alpha;
          col[i3 + 2] = 0.98 * alpha;
        }
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }

    // Animate Right Flank Strands
    if (rightRef.current) {
      const posAttr = rightGeo.attributes.position as THREE.BufferAttribute;
      const colAttr = rightGeo.attributes.color as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;
      const col = colAttr.array as Float32Array;

      for (let s = 0; s < strandCount; s++) {
        const spread = (s / (strandCount - 1) - 0.5) * 0.6;
        for (let p = 0; p < pointsPerStrand; p++) {
          const u = p / (pointsPerStrand - 1);
          const i3 = (s * pointsPerStrand + p) * 3;

          const baseX = vW * 0.46 - Math.sin(u * Math.PI) * 0.8 + spread;
          const baseY = (0.5 - u) * vH * 1.25;
          const waveX = Math.sin(u * 4 + t * 2 + s * 0.3) * 0.18;
          const waveZ = Math.cos(u * 3 - t + s * 0.2) * 0.25;

          pos[i3]     = baseX + waveX;
          pos[i3 + 1] = baseY;
          pos[i3 + 2] = -0.6 + waveZ;

          const alpha = Math.sin(u * Math.PI) * 0.38;
          col[i3]     = 0.72 * alpha;
          col[i3 + 1] = 0.62 * alpha;
          col[i3 + 2] = 1.0 * alpha;
        }
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      <lineSegments ref={leftRef} geometry={leftGeo}>
        <lineBasicMaterial vertexColors transparent opacity={0.4} depthWrite={false} />
      </lineSegments>
      <lineSegments ref={rightRef} geometry={rightGeo}>
        <lineBasicMaterial vertexColors transparent opacity={0.4} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

// ── Main Scene ────────────────────────────────────────

function AuroraLivingScene({ shouldAnimate }: { shouldAnimate: boolean }) {
  const { camera, pointer, viewport } = useThree();
  const vW = viewport.width;
  const vH = viewport.height;
  const isMobile = vW < 6.5;

  // Responsive positions framing the headline
  const orb1Pos: [number, number, number] = useMemo(
    () => [-vW * 0.36, vH * 0.27, -0.2],
    [vW, vH]
  );
  const orb2Pos: [number, number, number] = useMemo(
    () => [vW * 0.41, -vH * 0.04, 0.1],
    [vW, vH]
  );
  const orb3Pos: [number, number, number] = useMemo(
    () => [-vW * 0.31, -vH * 0.37, -0.1],
    [vW, vH]
  );

  useFrame(() => {
    if (!shouldAnimate) return;
    // Elegant, smooth 3D mouse parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.42, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.28, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      {/* 3 Floating Glass Orbs matching the exact composition */}
      {/* 1. Top-Left Floating Glass Orb */}
      <GlassOrb
        basePos={orb1Pos}
        radius={isMobile ? 0.36 : 0.48}
        speed={0.85}
        floatAmp={0.16}
        phase={0.2}
        color="#C4B5FD"
        emissive="#7C3AED"
      />

      {/* 2. Middle-Right Glass Orb with Saturn-like Orbital Ring & Orbiting Star */}
      <GlassOrb
        basePos={orb2Pos}
        radius={isMobile ? 0.38 : 0.52}
        speed={0.9}
        floatAmp={0.18}
        phase={2.4}
        color="#DDD6FE"
        emissive="#8B5CF6"
        hasRing={true}
      />

      {/* 3. Bottom-Left Floating Glass Orb */}
      <GlassOrb
        basePos={orb3Pos}
        radius={isMobile ? 0.28 : 0.38}
        speed={0.75}
        floatAmp={0.14}
        phase={4.1}
        color="#A78BFA"
        emissive="#6D28D9"
      />

      {/* Drifting Stardust */}
      <Stardust vW={vW} vH={vH} />

      {/* Subtle Flowing Silk Aurora Light Strands */}
      <SilkFlowStrands vW={vW} vH={vH} />

      {/* Scene Lighting */}
      <ambientLight intensity={0.65} color="#E9E5FF" />
      <pointLight position={[orb1Pos[0], orb1Pos[1], 1.2]} intensity={1.2} color="#C4B5FD" distance={7} />
      <pointLight position={[orb2Pos[0], orb2Pos[1], 1.2]} intensity={1.5} color="#E9E5FF" distance={8} />
      <pointLight position={[orb3Pos[0], orb3Pos[1], 1.2]} intensity={0.9} color="#8B5CF6" distance={6} />
      <pointLight position={[0, -vH * 0.4, -1]} intensity={0.8} color="#7C3AED" distance={10} />
    </group>
  );
}

// ── Exported Component ────────────────────────────────

interface Props {
  shouldAnimate: boolean;
  onError: () => void;
}

export default function DigitalCoreScene({ shouldAnimate, onError }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const canvas = el.querySelector('canvas');
    if (!canvas) return;
    const handle = (e: Event) => {
      e.preventDefault();
      console.warn('[DigitalCoreScene] WebGL context lost');
      onError();
    };
    canvas.addEventListener('webglcontextlost', handle);
    return () => canvas.removeEventListener('webglcontextlost', handle);
  }, [onError]);

  return (
    <div className="digital-core-canvas" ref={canvasRef}>
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: true,
          alpha: true,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        frameloop={shouldAnimate ? 'always' : 'never'}
      >
        <AuroraLivingScene shouldAnimate={shouldAnimate} />
        <Preload all />
      </Canvas>
    </div>
  );
}
