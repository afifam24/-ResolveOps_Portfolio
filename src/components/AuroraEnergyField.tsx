import { useEffect, useRef } from 'react';
import './DigitalCore.css';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  baseAlpha: number;
  pulseSpeed: number;
  phase: number;
  trail: [number, number][];
}

interface AmbientGlowNode {
  xPct: number;
  yPct: number;
  radiusFactor: number;
  colorInner: string;
  colorMid: string;
  speed: number;
  phaseX: number;
  phaseY: number;
  parallaxScale: number;
}

export default function AuroraEnergyField() {
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

    // Mouse parallax
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
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ── Layer 1: Ambient Volumetric Light Field ──────
    // Strategically positioned around edges and selected areas using #29134D and #160B2B
    const ambientNodes: AmbientGlowNode[] = [
      {
        xPct: 0.16,
        yPct: 0.32,
        radiusFactor: 0.54,
        colorInner: 'rgba(41, 19, 77, 0.65)', // #29134D (subtle violet glow)
        colorMid: 'rgba(22, 11, 43, 0.30)',   // #160B2B (deep purple)
        speed: 0.14,
        phaseX: 0,
        phaseY: 1.0,
        parallaxScale: 24,
      },
      {
        xPct: 0.84,
        yPct: 0.40,
        radiusFactor: 0.50,
        colorInner: 'rgba(41, 19, 77, 0.60)', // #29134D (subtle violet glow)
        colorMid: 'rgba(22, 11, 43, 0.28)',   // #160B2B (deep purple)
        speed: 0.18,
        phaseX: 2.2,
        phaseY: 0.6,
        parallaxScale: 30,
      },
      {
        xPct: 0.50,
        yPct: 0.14,
        radiusFactor: 0.44,
        colorInner: 'rgba(41, 19, 77, 0.52)', // #29134D (subtle violet glow)
        colorMid: 'rgba(22, 11, 43, 0.22)',   // #160B2B (deep purple)
        speed: 0.12,
        phaseX: 3.5,
        phaseY: 2.5,
        parallaxScale: 18,
      },
      {
        xPct: 0.30,
        yPct: 0.78,
        radiusFactor: 0.48,
        colorInner: 'rgba(41, 19, 77, 0.55)', // #29134D (subtle violet glow)
        colorMid: 'rgba(22, 11, 43, 0.25)',   // #160B2B (deep purple)
        speed: 0.11,
        phaseX: 1.4,
        phaseY: 3.8,
        parallaxScale: 20,
      },
    ];

    // ── Layer 3: Particles & Energy Trails ─────────────
    let particles: Particle[] = [];

    const initParticles = (count: number) => {
      particles = [];
      for (let i = 0; i < count; i++) {
        const z = 0.4 + Math.random() * 1.2;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          baseRadius: (1.0 + Math.random() * 1.5) * z,
          baseAlpha: 0.35 + Math.random() * 0.45,
          pulseSpeed: 0.7 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2,
          trail: [],
        });
      }
    };

    // Responsive Canvas Resizing
    const handleResize = () => {
      const rect = wrapper.getBoundingClientRect();
      const newW = Math.max(rect.width, 320);
      const newH = Math.max(rect.height, 480);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = newW;
      height = newH;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      const targetCount = width < 768 ? 26 : 58;
      if (particles.length === 0) {
        initParticles(targetCount);
      } else {
        for (const p of particles) {
          if (p.x > width) p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
        }
      }

      if (prefersReducedMotion) {
        renderFrame(14.0);
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

    // ── Layer 2: Volumetric Aurora Ribbon Engine ───────
    // Color harmonization: #0D0718 (base), #160B2B (deep purple), #29134D (violet glow), #A78BFA (accent purple)
    interface AuroraRibbonConfig {
      baseY: number; // 0 to 1
      amplitude: number; // in pixels
      curtainDepth: number; // height of volumetric drape
      speed: number;
      wavelength: number;
      colorTop: string;
      colorMid: string;
      colorBottom: string;
      crestStroke: string;
      crestGlow: string;
      crestWidth: number;
      secondaryWave: { freq: number; amp: number; speed: number };
      tertiaryWave: { freq: number; amp: number; speed: number };
    }

    const auroraRibbons: AuroraRibbonConfig[] = [
      // Ribbon 1: Deep Ethereal Wave (Back layer)
      {
        baseY: 0.52,
        amplitude: 65,
        curtainDepth: 180,
        speed: 0.18,
        wavelength: 2.2,
        colorTop: 'rgba(41, 19, 77, 0.55)',   // #29134D
        colorMid: 'rgba(22, 11, 43, 0.35)',   // #160B2B
        colorBottom: 'rgba(13, 7, 24, 0)',    // #0D0718
        crestStroke: 'rgba(167, 139, 250, 0.45)', // #A78BFA
        crestGlow: '#A78BFA',
        crestWidth: 1.8,
        secondaryWave: { freq: 4.2, amp: 28, speed: -0.22 },
        tertiaryWave: { freq: 1.4, amp: 35, speed: 0.12 },
      },
      // Ribbon 2: Primary Fluid Aurora Curtain (Dramatic volumetric ribbon)
      {
        baseY: 0.38,
        amplitude: 85,
        curtainDepth: 230,
        speed: 0.28,
        wavelength: 2.6,
        colorTop: 'rgba(41, 19, 77, 0.70)',   // #29134D
        colorMid: 'rgba(22, 11, 43, 0.45)',   // #160B2B
        colorBottom: 'rgba(13, 7, 24, 0)',    // #0D0718
        crestStroke: 'rgba(167, 139, 250, 0.85)', // #A78BFA
        crestGlow: '#A78BFA',
        crestWidth: 2.6,
        secondaryWave: { freq: 5.1, amp: 38, speed: -0.32 },
        tertiaryWave: { freq: 1.8, amp: 45, speed: 0.18 },
      },
      // Ribbon 3: Ethereal High Crown Ribbon (Floating across upper atmosphere)
      {
        baseY: 0.22,
        amplitude: 50,
        curtainDepth: 150,
        speed: 0.22,
        wavelength: 3.1,
        colorTop: 'rgba(41, 19, 77, 0.50)',   // #29134D
        colorMid: 'rgba(22, 11, 43, 0.28)',   // #160B2B
        colorBottom: 'rgba(13, 7, 24, 0)',    // #0D0718
        crestStroke: 'rgba(167, 139, 250, 0.65)', // #A78BFA
        crestGlow: '#A78BFA',
        crestWidth: 2.0,
        secondaryWave: { freq: 6.0, amp: 22, speed: -0.26 },
        tertiaryWave: { freq: 2.1, amp: 28, speed: 0.15 },
      },
      // Ribbon 4: Accent Purple Energy Filament (Refined, agile luminous thread)
      {
        baseY: 0.44,
        amplitude: 75,
        curtainDepth: 80,
        speed: 0.38,
        wavelength: 3.6,
        colorTop: 'rgba(167, 139, 250, 0.35)', // #A78BFA
        colorMid: 'rgba(41, 19, 77, 0.35)',    // #29134D
        colorBottom: 'rgba(13, 7, 24, 0)',     // #0D0718
        crestStroke: 'rgba(167, 139, 250, 0.95)', // #A78BFA
        crestGlow: '#A78BFA',
        crestWidth: 2.8,
        secondaryWave: { freq: 6.8, amp: 32, speed: -0.42 },
        tertiaryWave: { freq: 2.4, amp: 25, speed: 0.24 },
      },
    ];

    const drawAuroraRibbon = (ribbon: AuroraRibbonConfig, time: number) => {
      const segments = 48;
      const topPoints: [number, number][] = [];
      const botPoints: [number, number][] = [];
      const crestPoints: [number, number][] = [];

      const baseY = height * ribbon.baseY + mouseY * 22;

      for (let i = 0; i <= segments; i++) {
        const u = i / segments;
        const x = u * width;

        // Wave displacement
        const w1 = Math.sin(u * ribbon.wavelength * Math.PI + time * ribbon.speed) * ribbon.amplitude;
        const w2 = Math.sin(u * ribbon.secondaryWave.freq * Math.PI + time * ribbon.secondaryWave.speed) * ribbon.secondaryWave.amp;
        const w3 = Math.cos(u * ribbon.tertiaryWave.freq * Math.PI + time * ribbon.tertiaryWave.speed) * ribbon.tertiaryWave.amp;

        const crestY = baseY + w1 + w2 + w3;

        // Curtain vertical drape height with natural breathing modulation
        const drapeMod = 0.75 + 0.25 * Math.sin(u * 6.0 + time * 0.5);
        const edgeTaper = Math.sin(u * Math.PI); // Smoothly tapers at left and right edges
        const drapeHeight = ribbon.curtainDepth * drapeMod * edgeTaper;

        // Shimmering vertical rays along the ribbon
        const rayOffset = Math.sin(u * 28.0 + time * 1.2) * (drapeHeight * 0.12);

        topPoints.push([x, crestY - drapeHeight * 0.15]);
        botPoints.push([x, crestY + drapeHeight + rayOffset]);
        crestPoints.push([x, crestY]);
      }

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // 1. Draw Volumetric Curtain Mesh
      ctx.beginPath();
      ctx.moveTo(topPoints[0][0], topPoints[0][1]);
      for (let i = 1; i < topPoints.length; i++) {
        const [x, y] = topPoints[i];
        const [prevX, prevY] = topPoints[i - 1];
        ctx.quadraticCurveTo(prevX, prevY, (prevX + x) / 2, (prevY + y) / 2);
      }
      ctx.lineTo(topPoints[topPoints.length - 1][0], topPoints[topPoints.length - 1][1]);

      for (let i = botPoints.length - 1; i >= 0; i--) {
        const [x, y] = botPoints[i];
        ctx.lineTo(x, y);
      }
      ctx.closePath();

      const curtainGrad = ctx.createLinearGradient(
        0,
        baseY - ribbon.amplitude,
        0,
        baseY + ribbon.curtainDepth
      );
      curtainGrad.addColorStop(0, ribbon.colorTop);
      curtainGrad.addColorStop(0.35, ribbon.colorMid);
      curtainGrad.addColorStop(1, ribbon.colorBottom);

      ctx.fillStyle = curtainGrad;
      ctx.fill();

      // 2. Draw Luminous Accent Purple Crest Line (#A78BFA)
      ctx.beginPath();
      ctx.moveTo(crestPoints[0][0], crestPoints[0][1]);
      for (let i = 1; i < crestPoints.length; i++) {
        const [x, y] = crestPoints[i];
        const [prevX, prevY] = crestPoints[i - 1];
        ctx.quadraticCurveTo(prevX, prevY, (prevX + x) / 2, (prevY + y) / 2);
      }
      ctx.lineTo(crestPoints[crestPoints.length - 1][0], crestPoints[crestPoints.length - 1][1]);

      ctx.strokeStyle = ribbon.crestStroke;
      ctx.lineWidth = ribbon.crestWidth;
      ctx.shadowColor = ribbon.crestGlow;
      ctx.shadowBlur = 18;
      ctx.stroke();

      ctx.restore();
    };

    // ── Master Render Frame ───────────────────────────
    const renderFrame = (timeSec: number) => {
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Base Background: #0D0718
      ctx.fillStyle = '#0D0718';
      ctx.fillRect(0, 0, width, height);

      // 2. Deep Purple Gradient Transition: #160B2B
      const baseGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        width * 0.1,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      baseGrad.addColorStop(0, 'rgba(22, 11, 43, 0.65)'); // #160B2B
      baseGrad.addColorStop(0.65, 'rgba(22, 11, 43, 0.25)');
      baseGrad.addColorStop(1, 'rgba(13, 7, 24, 0)');     // #0D0718
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // ── Layer 1: Subtle Violet Glow Nodes (#29134D) ─────
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const maxDim = Math.max(width, height);
      for (const node of ambientNodes) {
        const cx =
          width * (node.xPct + Math.sin(timeSec * node.speed + node.phaseX) * 0.09) +
          mouseX * node.parallaxScale;
        const cy =
          height * (node.yPct + Math.cos(timeSec * node.speed * 0.85 + node.phaseY) * 0.09) +
          mouseY * (node.parallaxScale * 0.7);
        const rad =
          maxDim * node.radiusFactor * (1 + 0.09 * Math.sin(timeSec * node.speed * 1.5));

        const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        radGrad.addColorStop(0, node.colorInner);
        radGrad.addColorStop(0.5, node.colorMid);
        radGrad.addColorStop(1, 'rgba(13, 7, 24, 0)');

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ── Layer 2: Flowing Aurora Ribbons ─────────────
      for (const ribbon of auroraRibbons) {
        drawAuroraRibbon(ribbon, timeSec);
      }

      // ── Layer 3: Particles & Glowing Energy Trails ──
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Flow vector field with gentle curl drift
          const flowAngle =
            (Math.sin(p.y * 0.0024 + timeSec * 0.24) +
              Math.cos(p.x * 0.0024 + timeSec * 0.28)) *
            Math.PI;
          const vx = Math.cos(flowAngle) * 0.32 * p.z;
          const vy = -0.38 * p.z + Math.sin(flowAngle) * 0.22 * p.z;

          p.x += vx + mouseX * 0.35 * p.z;
          p.y += vy + mouseY * 0.25 * p.z;

          // Trail history
          p.trail.push([p.x, p.y]);
          if (p.trail.length > 5) {
            p.trail.shift();
          }

          // Screen boundary wrap
          if (p.y < -25) {
            p.y = height + 20;
            p.x = Math.random() * width;
            p.trail = [];
          } else if (p.y > height + 25) {
            p.y = -20;
            p.x = Math.random() * width;
            p.trail = [];
          }

          if (p.x < -25) {
            p.x = width + 20;
            p.trail = [];
          } else if (p.x > width + 25) {
            p.x = -20;
            p.trail = [];
          }
        }

        // Particle Breathing & Pulsing
        const pulse = 0.72 + 0.28 * Math.sin(timeSec * p.pulseSpeed + p.phase);
        const alpha = Math.max(0.12, p.baseAlpha * pulse);

        // Faint Curved Energy Trail using Accent Purple (#A78BFA)
        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0][0], p.trail[0][1]);
          for (let h = 1; h < p.trail.length; h++) {
            ctx.lineTo(p.trail[h][0], p.trail[h][1]);
          }
          ctx.strokeStyle = `rgba(167, 139, 250, ${alpha * 0.45})`; // #A78BFA
          ctx.lineWidth = Math.max(0.8, p.baseRadius * 0.55);
          ctx.stroke();
        }

        // Luminous Photon Core & Halo using #A78BFA & #29134D
        const glowRad = p.baseRadius * 3.2;
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRad);
        pGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        pGrad.addColorStop(0.35, `rgba(167, 139, 250, ${alpha * 0.85})`); // #A78BFA
        pGrad.addColorStop(0.70, `rgba(41, 19, 77, ${alpha * 0.40})`);   // #29134D
        pGrad.addColorStop(1, 'rgba(13, 7, 24, 0)');                     // #0D0718

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ── Layer 4: Deep Atmospheric Central Negative Space ──
      // Subtle center veil using Base #0D0718 so the headline stands out with 100% crisp contrast
      const centerGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.46,
        Math.min(width, height) * 0.12,
        width * 0.5,
        height * 0.46,
        Math.min(width, height) * 0.65
      );
      centerGrad.addColorStop(0, 'rgba(13, 7, 24, 0.45)'); // #0D0718
      centerGrad.addColorStop(0.6, 'rgba(13, 7, 24, 0.15)');
      centerGrad.addColorStop(1, 'rgba(13, 7, 24, 0)');

      ctx.fillStyle = centerGrad;
      ctx.fillRect(0, 0, width, height);

      // Seamless bottom grounding gradient into #0D0718 / #160B2B
      const groundGrad = ctx.createLinearGradient(0, height * 0.82, 0, height);
      groundGrad.addColorStop(0, 'rgba(13, 7, 24, 0)');
      groundGrad.addColorStop(1, '#0D0718');

      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, height * 0.8, width, height * 0.2);

      ctx.restore();
    };

    // ── Animation Loop ────────────────────────────────
    let startTime = performance.now();
    let isRunning = false;

    const tick = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      renderFrame(elapsed);
      if (isRunning) {
        animId = requestAnimationFrame(tick);
      }
    };

    const startLoop = () => {
      if (isRunning || prefersReducedMotion) return;
      isRunning = true;
      startTime = performance.now();
      animId = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      isRunning = false;
      if (animId) {
        cancelAnimationFrame(animId);
      }
    };

    if (prefersReducedMotion) {
      renderFrame(14.0);
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      window.removeEventListener('resize', handleResize);
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="digital-core-wrapper" ref={wrapperRef} aria-hidden="true">
      <canvas ref={canvasRef} className="digital-core-fluid-canvas" />
      <div className="digital-core-atmosphere" />
    </div>
  );
}
