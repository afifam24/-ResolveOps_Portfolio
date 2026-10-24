import { useEffect, useRef } from 'react';
import './DigitalCore.css';

/**
 * DigitalCore — Intelligent Connected Network Hero Background
 * 
 * Replaces the flowing wave animation with a refined, cinematic,
 * technology-inspired abstract network representing web development,
 * business automation, data analytics, and digital growth.
 * 
 * Key Principles:
 * 1. Abstract Connected Network: Delicate, glowing nodes & fine geometric connections with 3D depth.
 * 2. Automation-Inspired Motion: Subtle pulses of light (data packets) traveling along conduits.
 * 3. Premium Lighting: Preserves dark purple (#0D0718) and deep violet (#160B2B, #29134D) atmosphere
 *    with restrained lavender (#B69AFF) and soft violet (#A78BFA) highlights.
 * 4. Content Clarity: Central safe zone ensures the hero headline, subtext, and CTAs remain
 *    100% crisp, unobstructed, and legible.
 * 5. High Performance: Single 2D canvas, smooth RAF, paused when off-screen or tab hidden,
 *    respects prefers-reduced-motion.
 */

interface Node3D {
  id: number;
  // Normalized base coordinates [0, 1] relative to width and height
  baseXPct: number;
  baseYPct: number;
  z: number; // depth: -0.7 (far/subtle) to 0.7 (near/crisp)
  
  // Drift kinematics for slow, organic floating
  driftRadiusX: number;
  driftRadiusY: number;
  driftSpeed: number;
  phaseX: number;
  phaseY: number;

  // Visual attributes
  baseRadius: number;
  baseAlpha: number;
  isAnchor: boolean;
  ringPhase: number;

  // Dynamic arrival bloom
  bloom: number;

  // Runtime projected coordinates
  projX: number;
  projY: number;
  projRadius: number;
  projAlpha: number;
}

interface Edge {
  source: number;
  target: number;
  baseAlpha: number;
  calmMultiplier: number;
  length: number;
}

interface DataPulse {
  edgeIndex: number;
  progress: number;   // 0 to 1 along edge
  speed: number;      // progress increment per frame
  trailLength: number; // fraction of line length
  active: boolean;
  delayTimer: number; // frames before launch
}

export default function DigitalCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse parallax variables
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // ── Graph State ───────────────────────────────────────────
    let nodes: Node3D[] = [];
    let edges: Edge[] = [];
    let pulses: DataPulse[] = [];

    // Helper: Build graph suited to current screen dimensions
    const initGraph = (w: number, h: number) => {
      nodes = [];
      edges = [];
      pulses = [];

      const isMobile = w < 768;
      const isTablet = w >= 768 && w < 1024;

      // Central exclusion zone parameters
      const safeRx = isMobile ? Math.min(w * 0.42, 190) : Math.min(w * 0.35, 420);
      const safeRy = isMobile ? Math.min(h * 0.28, 160) : Math.min(h * 0.26, 210);
      const safeCx = w * 0.5;
      const safeCy = h * 0.46;

      // Cluster configuration
      // 1: Northwest (Web Development & Architecture)
      // 2: Northeast (Business Automation & Workflows)
      // 3: Southwest (Data Analytics & Business Intelligence)
      // 4: Southeast (Digital Growth Systems)
      // 5: Upper Atmosphere (Constellation Horizon)
      const clusterDefs = [
        { name: 'NW', count: isMobile ? 6 : isTablet ? 10 : 14, minX: 0.04, maxX: 0.35, minY: 0.12, maxY: 0.44 },
        { name: 'NE', count: isMobile ? 6 : isTablet ? 10 : 14, minX: 0.65, maxX: 0.96, minY: 0.12, maxY: 0.44 },
        { name: 'SW', count: isMobile ? 5 : isTablet ? 8 : 12, minX: 0.05, maxX: 0.36, minY: 0.58, maxY: 0.88 },
        { name: 'SE', count: isMobile ? 5 : isTablet ? 8 : 12, minX: 0.64, maxX: 0.95, minY: 0.58, maxY: 0.88 },
        { name: 'TOP', count: isMobile ? 3 : isTablet ? 5 : 7, minX: 0.30, maxX: 0.70, minY: 0.06, maxY: 0.18 },
      ];

      let nodeId = 0;

      clusterDefs.forEach((cluster) => {
        for (let i = 0; i < cluster.count; i++) {
          // Distribute with slight natural variation
          const baseXPct = cluster.minX + Math.random() * (cluster.maxX - cluster.minX);
          const baseYPct = cluster.minY + Math.random() * (cluster.maxY - cluster.minY);

          // Test against safe zone
          const testX = baseXPct * w;
          const testY = baseYPct * h;
          const distNorm = Math.sqrt(((testX - safeCx) / safeRx) ** 2 + ((testY - safeCy) / safeRy) ** 2);
          
          // Gently push outward if too close to center
          let finalXPct = baseXPct;
          let finalYPct = baseYPct;
          if (distNorm < 0.95) {
            const angle = Math.atan2(testY - safeCy, testX - safeCx);
            const pushedX = safeCx + Math.cos(angle) * (safeRx * 1.05);
            const pushedY = safeCy + Math.sin(angle) * (safeRy * 1.05);
            finalXPct = Math.max(0.03, Math.min(0.97, pushedX / w));
            finalYPct = Math.max(0.06, Math.min(0.92, pushedY / h));
          }

          // Depth layer: -0.7 to 0.7
          const z = -0.7 + Math.random() * 1.4;
          const isAnchor = Math.random() < (isMobile ? 0.12 : 0.18);

          nodes.push({
            id: nodeId++,
            baseXPct: finalXPct,
            baseYPct: finalYPct,
            z,
            driftRadiusX: 10 + Math.random() * 16,
            driftRadiusY: 8 + Math.random() * 14,
            driftSpeed: 0.0004 + Math.random() * 0.0006, // Very slow, soothing drift
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            baseRadius: isAnchor ? 2.4 : 1.3 + Math.random() * 1.0,
            baseAlpha: 0.35 + Math.random() * 0.45,
            isAnchor,
            ringPhase: Math.random() * Math.PI * 2,
            bloom: 0,
            projX: 0,
            projY: 0,
            projRadius: 0,
            projAlpha: 0,
          });
        }
      });

      // Connect nodes: establish geometric structure without spiderweb noise
      const maxDist = isMobile ? Math.min(w, h) * 0.28 : Math.min(w, h) * 0.22;
      const maxEdgesPerNode = isMobile ? 3 : 4;
      const nodeEdgeCounts = new Array(nodes.length).fill(0);

      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        const p1x = n1.baseXPct * w;
        const p1y = n1.baseYPct * h;

        // Find nearest candidates
        const candidates: { j: number; dist: number }[] = [];
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodeEdgeCounts[j] >= maxEdgesPerNode) continue;
          const n2 = nodes[j];
          const p2x = n2.baseXPct * w;
          const p2y = n2.baseYPct * h;
          const dx = p1x - p2x;
          const dy = p1y - p2y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 35 && dist < maxDist) {
            candidates.push({ j, dist });
          }
        }

        candidates.sort((a, b) => a.dist - b.dist);

        for (const cand of candidates) {
          if (nodeEdgeCounts[i] >= maxEdgesPerNode) break;
          if (nodeEdgeCounts[cand.j] >= maxEdgesPerNode) continue;

          // Check if edge line cuts across central text zone
          const n2 = nodes[cand.j];
          const midX = ((n1.baseXPct + n2.baseXPct) * 0.5) * w;
          const midY = ((n1.baseYPct + n2.baseYPct) * 0.5) * h;
          const midDistNorm = Math.sqrt(((midX - safeCx) / safeRx) ** 2 + ((midY - safeCy) / safeRy) ** 2);

          // Attenuation for lines passing through or near center
          let calmMultiplier = 1.0;
          if (midDistNorm < 0.8) {
            calmMultiplier = 0.08; // Whisper quiet near text
          } else if (midDistNorm < 1.1) {
            calmMultiplier = 0.25 + (midDistNorm - 0.8) / 0.3 * 0.75;
          }

          // Compute base alpha based on average depth
          const avgZ = (n1.z + n2.z) * 0.5;
          const depthFactor = 0.5 + (avgZ + 0.7) / 1.4 * 0.5;
          const baseAlpha = (0.12 + (1 - cand.dist / maxDist) * 0.18) * depthFactor;

          edges.push({
            source: i,
            target: cand.j,
            baseAlpha,
            calmMultiplier,
            length: cand.dist,
          });

          nodeEdgeCounts[i]++;
          nodeEdgeCounts[cand.j]++;
        }
      }

      // Initialize Automation Pulses
      const pulseCount = isMobile ? 3 : isTablet ? 5 : 7;
      for (let p = 0; p < pulseCount; p++) {
        if (edges.length === 0) break;
        // Select an edge that has good visibility
        const candidateEdgeIndex = Math.floor(Math.random() * edges.length);
        pulses.push({
          edgeIndex: candidateEdgeIndex,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.0025, // Slow, elegant speed (takes ~4-6 seconds)
          trailLength: 0.20 + Math.random() * 0.12,
          active: true,
          delayTimer: Math.floor(Math.random() * 60),
        });
      }
    };

    // Responsive Canvas Resize
    const handleResize = () => {
      const rect = wrapper.getBoundingClientRect();
      const newW = Math.max(rect.width, 320);
      const newH = Math.max(rect.height, 480);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = newW;
      height = newH;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      initGraph(width, height);

      if (prefersReducedMotion) {
        renderFrame(12.0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Visibility Management
    let isVisible = true;
    let isTabActive = !document.hidden;

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && isTabActive && !prefersReducedMotion) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(wrapper);

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isVisible && isTabActive && !prefersReducedMotion) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // ── Frame Renderer ────────────────────────────────────────
    const renderFrame = (time: number) => {
      ctx.save();
      ctx.scale(dpr, dpr);

      // Smooth mouse parallax easing
      mouseX += (targetMouseX - mouseX) * 0.035;
      mouseY += (targetMouseY - mouseY) * 0.035;

      const safeRx = width < 768 ? Math.min(width * 0.42, 190) : Math.min(width * 0.35, 420);
      const safeRy = width < 768 ? Math.min(height * 0.28, 160) : Math.min(height * 0.26, 210);
      const safeCx = width * 0.5;
      const safeCy = height * 0.46;

      // 1. Draw Base Dark-Purple Atmosphere
      ctx.fillStyle = '#0c0618';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Volumetric Radial Ambient Lighting
      // Northwest Ambient Glow (#29134D)
      const gradNW = ctx.createRadialGradient(
        width * 0.16 + mouseX * 15,
        height * 0.32 + mouseY * 15,
        0,
        width * 0.16 + mouseX * 15,
        height * 0.32 + mouseY * 15,
        width * 0.45
      );
      gradNW.addColorStop(0, 'rgba(41, 19, 77, 0.45)');
      gradNW.addColorStop(0.5, 'rgba(22, 11, 43, 0.20)');
      gradNW.addColorStop(1, 'rgba(13, 7, 24, 0)');
      ctx.fillStyle = gradNW;
      ctx.fillRect(0, 0, width, height);

      // Northeast Ambient Glow (#29134D)
      const gradNE = ctx.createRadialGradient(
        width * 0.84 + mouseX * 18,
        height * 0.36 + mouseY * 18,
        0,
        width * 0.84 + mouseX * 18,
        height * 0.36 + mouseY * 18,
        width * 0.42
      );
      gradNE.addColorStop(0, 'rgba(41, 19, 77, 0.40)');
      gradNE.addColorStop(0.5, 'rgba(22, 11, 43, 0.18)');
      gradNE.addColorStop(1, 'rgba(13, 7, 24, 0)');
      ctx.fillStyle = gradNE;
      ctx.fillRect(0, 0, width, height);

      // Central Hero Subtle Ambient Glow (Restrained Lavender / Soft Violet #5B3FD0 / #7C3AED)
      // Provides a luminous high-end studio backing without competing with text
      const gradCenter = ctx.createRadialGradient(
        safeCx,
        safeCy,
        0,
        safeCx,
        safeCy,
        safeRx * 1.3
      );
      gradCenter.addColorStop(0, 'rgba(91, 63, 208, 0.08)');
      gradCenter.addColorStop(0.45, 'rgba(41, 19, 77, 0.04)');
      gradCenter.addColorStop(1, 'rgba(13, 7, 24, 0)');
      ctx.fillStyle = gradCenter;
      ctx.fillRect(0, 0, width, height);

      // 3. Project Nodes into 3D Space with Parallax & Calm Zone Multipliers
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Smooth multi-frequency harmonic sinusoidal drift
        const driftX = Math.sin(time * n.driftSpeed + n.phaseX) * n.driftRadiusX;
        const driftY = Math.cos(time * (n.driftSpeed * 0.85) + n.phaseY) * n.driftRadiusY;

        const rawX = n.baseXPct * width + driftX;
        const rawY = n.baseYPct * height + driftY;

        // 3D perspective scale
        const focal = 500;
        const scale = focal / (focal + n.z * 180);

        // Differential parallax: foreground shifts more than background
        const parallaxFactor = 1.0 + n.z * 0.55;
        const projX = safeCx + (rawX - safeCx) * scale + mouseX * 22 * parallaxFactor;
        const projY = safeCy + (rawY - safeCy) * scale + mouseY * 16 * parallaxFactor;

        // Central text exclusion check
        const distNorm = Math.sqrt(((projX - safeCx) / safeRx) ** 2 + ((projY - safeCy) / safeRy) ** 2);
        let calmAlpha = 1.0;
        if (distNorm < 0.65) {
          calmAlpha = 0.05;
        } else if (distNorm < 1.05) {
          calmAlpha = 0.05 + ((distNorm - 0.65) / 0.40) * 0.95;
        }

        const depthAlpha = (0.45 + (n.z + 0.7) / 1.4 * 0.55);
        const finalAlpha = n.baseAlpha * depthAlpha * calmAlpha;
        const finalRadius = n.baseRadius * scale;

        n.projX = projX;
        n.projY = projY;
        n.projRadius = finalRadius;
        n.projAlpha = finalAlpha;

        // Smoothly decay pulse bloom
        if (n.bloom > 0.01) {
          n.bloom *= 0.94;
        } else {
          n.bloom = 0;
        }
      }

      // 4. Render Geometric Connecting Lines
      ctx.lineWidth = 0.85;
      for (let e = 0; e < edges.length; e++) {
        const edge = edges[e];
        const n1 = nodes[edge.source];
        const n2 = nodes[edge.target];

        const lineAlpha = edge.baseAlpha * edge.calmMultiplier * Math.min(n1.projAlpha, n2.projAlpha);
        if (lineAlpha < 0.01) continue;

        ctx.beginPath();
        ctx.moveTo(n1.projX, n1.projY);
        ctx.lineTo(n2.projX, n2.projY);

        // Elegant lavender-violet connection line (#A78BFA)
        ctx.strokeStyle = `rgba(167, 139, 250, ${lineAlpha.toFixed(3)})`;
        ctx.stroke();
      }

      // 5. Render Automation Pulses (Light Packets traveling along conduits)
      for (let p = 0; p < pulses.length; p++) {
        const pulse = pulses[p];
        if (!pulse.active) {
          pulse.delayTimer--;
          if (pulse.delayTimer <= 0) {
            pulse.active = true;
            pulse.progress = 0;
            // Pick an edge with good calm visibility
            let attempts = 0;
            let nextEdge = Math.floor(Math.random() * edges.length);
            while (attempts < 5 && edges[nextEdge].calmMultiplier < 0.4) {
              nextEdge = Math.floor(Math.random() * edges.length);
              attempts++;
            }
            pulse.edgeIndex = nextEdge;
          }
          continue;
        }

        pulse.progress += pulse.speed;

        const edge = edges[pulse.edgeIndex];
        const n1 = nodes[edge.source];
        const n2 = nodes[edge.target];

        const calm = edge.calmMultiplier * Math.min(n1.projAlpha, n2.projAlpha);
        if (calm > 0.08) {
          // Calculate head and tail coordinates
          const headT = Math.min(1.0, pulse.progress);
          const tailT = Math.max(0.0, pulse.progress - pulse.trailLength);

          const headX = n1.projX + (n2.projX - n1.projX) * headT;
          const headY = n1.projY + (n2.projY - n1.projY) * headT;
          const tailX = n1.projX + (n2.projX - n1.projX) * tailT;
          const tailY = n1.projY + (n2.projY - n1.projY) * tailT;

          // Gradient trail
          const pulseGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
          pulseGrad.addColorStop(0, 'rgba(167, 139, 250, 0)');
          pulseGrad.addColorStop(0.65, `rgba(182, 154, 255, ${(0.45 * calm).toFixed(3)})`);
          pulseGrad.addColorStop(1, `rgba(245, 243, 255, ${(0.90 * calm).toFixed(3)})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(headX, headY);
          ctx.strokeStyle = pulseGrad;
          ctx.lineWidth = 1.6;
          ctx.stroke();

          // Concentrated luminous head
          ctx.beginPath();
          ctx.arc(headX, headY, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.95 * calm).toFixed(3)})`;
          ctx.fill();

          // Subtle head glow
          ctx.beginPath();
          ctx.arc(headX, headY, 3.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(182, 154, 255, ${(0.35 * calm).toFixed(3)})`;
          ctx.fill();
        }

        // On arrival at destination node
        if (pulse.progress >= 1.0) {
          n2.bloom = 1.0;
          pulse.active = false;
          pulse.delayTimer = 40 + Math.floor(Math.random() * 90);
        }
      }

      // 6. Render Nodes with Refined Dimensional Lighting
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.projAlpha < 0.02) continue;

        const x = n.projX;
        const y = n.projY;
        const r = n.projRadius;
        const alpha = n.projAlpha;

        // Arrival bloom ripple expansion
        if (n.bloom > 0.05) {
          const bloomRadius = r + (1.0 - n.bloom) * 9;
          const bloomAlpha = n.bloom * 0.45 * alpha;
          ctx.beginPath();
          ctx.arc(x, y, bloomRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(182, 154, 255, ${bloomAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }

        // Anchor nodes: subtle telemetry breathing ring
        if (n.isAnchor) {
          const ringAlpha = (0.16 + 0.12 * Math.sin(time * 0.0018 + n.ringPhase)) * alpha;
          ctx.beginPath();
          ctx.arc(x, y, r * 2.3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(182, 154, 255, ${ringAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // Outer soft glow halo
        const haloGrad = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
        haloGrad.addColorStop(0, `rgba(182, 154, 255, ${(0.45 * alpha).toFixed(3)})`);
        haloGrad.addColorStop(0.5, `rgba(139, 92, 246, ${(0.18 * alpha).toFixed(3)})`);
        haloGrad.addColorStop(1, 'rgba(13, 7, 24, 0)');
        ctx.beginPath();
        ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
        ctx.fillStyle = haloGrad;
        ctx.fill();

        // Node Solid Core
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        if (n.z > 0.2) {
          // Foreground nodes: brilliant lavender-white center
          ctx.fillStyle = `rgba(255, 255, 255, ${(0.95 * alpha).toFixed(3)})`;
        } else {
          // Mid & background nodes: soft lavender (#B69AFF / #E9E5FF)
          ctx.fillStyle = `rgba(233, 229, 255, ${(0.80 * alpha).toFixed(3)})`;
        }
        ctx.fill();
      }

      // 7. Grounding blend into next section (#0D0718)
      const bottomBlend = ctx.createLinearGradient(0, height * 0.86, 0, height);
      bottomBlend.addColorStop(0, 'rgba(12, 6, 24, 0)');
      bottomBlend.addColorStop(0.65, 'rgba(12, 6, 24, 0.75)');
      bottomBlend.addColorStop(1, '#0c0618');
      ctx.fillStyle = bottomBlend;
      ctx.fillRect(0, height * 0.86, width, height * 0.14);

      ctx.restore();
    };

    // ── Animation Loop ─────────────────────────────────────────
    let startTime = performance.now();
    let isRunning = false;

    const loop = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      renderFrame(elapsed);
      animId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (isRunning || prefersReducedMotion) return;
      isRunning = true;
      animId = requestAnimationFrame(loop);
    };

    const stopLoop = () => {
      if (!isRunning) return;
      isRunning = false;
      cancelAnimationFrame(animId);
    };

    if (!prefersReducedMotion && isVisible && isTabActive) {
      startLoop();
    } else {
      renderFrame(14.0);
    }

    return () => {
      stopLoop();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <div className="digital-core-wrapper" ref={wrapperRef} aria-hidden="true">
      <canvas ref={canvasRef} className="digital-core-fluid-canvas" />
      <div className="digital-core-atmosphere" />
    </div>
  );
}
