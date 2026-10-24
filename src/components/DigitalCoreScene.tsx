import { palette } from '../lib/palette';
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';

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

  useFrame(() => {
    if (!shouldAnimate) return;
    // Elegant, smooth 3D mouse parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.42, 0.035);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.28, 0.035);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group>
      {/* Drifting Stardust Particles */}
      <Stardust vW={vW} vH={vH} />

      {/* Flowing Purple Neon Aurora Silk Light Strands */}
      <SilkFlowStrands vW={vW} vH={vH} />

      {/* Ambient & Atmosphere Lighting */}
      <ambientLight intensity={0.65} color="#E9E5FF" />
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
