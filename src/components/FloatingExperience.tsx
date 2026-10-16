import { useEffect, useRef, useState } from 'react';
import {
  Lightning,
  ChartLineUp,
  Check,
  CaretDown,
  ArrowRight,
  List,
  PaintBrush,
  Code,
  TrendUp,
} from '@phosphor-icons/react';
import './FloatingExperience.css';

// ── Cinematic Glowing Aurora Ribbon Animation ─────────────────
function useRibbonCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Particle dust along ribbon
    const particles = Array.from({ length: 24 }, () => ({
      p: Math.random(),
      speed: 0.001 + Math.random() * 0.002,
      size: 1 + Math.random() * 2,
      offset: (Math.random() - 0.5) * 20,
      alpha: 0.3 + Math.random() * 0.7,
    }));

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (w === 0 || h === 0) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      t += prefersReduced ? 0.003 : 0.016;

      // ── Layered luminous strands sweeping in an elegant diagonal S-curve ──
      // Starting from bottom-center/left (w * 0.28, h * 0.78) to upper-right (w * 0.96, h * 0.22)
      const strandConfigs = [
        { color: '#6366f1', alpha: 0.30, width: 6,   waveAmp: 36, speed: 1.0,  phase: 0.0 },
        { color: '#8b5cf6', alpha: 0.55, width: 4.5, waveAmp: 28, speed: 1.25, phase: 0.6 },
        { color: '#a855f7', alpha: 0.65, width: 3.5, waveAmp: 32, speed: 1.1,  phase: 1.2 },
        { color: '#c084fc', alpha: 0.75, width: 2.5, waveAmp: 24, speed: 1.4,  phase: 1.8 },
        { color: '#e879f9', alpha: 0.60, width: 3.0, waveAmp: 30, speed: 0.95, phase: 2.4 },
        { color: '#38bdf8', alpha: 0.45, width: 2.0, waveAmp: 22, speed: 1.35, phase: 3.0 },
        { color: '#f5f3ff', alpha: 0.85, width: 1.5, waveAmp: 18, speed: 1.5,  phase: 3.6 },
        { color: '#d946ef', alpha: 0.50, width: 4.0, waveAmp: 34, speed: 1.05, phase: 4.2 },
      ];

      // Draw diffuse background glow behind ribbon
      const diffuseGrad = ctx.createRadialGradient(
        w * 0.68,
        h * 0.48,
        20,
        w * 0.68,
        h * 0.48,
        w * 0.4
      );
      diffuseGrad.addColorStop(0, 'rgba(168, 85, 247, 0.28)');
      diffuseGrad.addColorStop(0.4, 'rgba(139, 92, 246, 0.12)');
      diffuseGrad.addColorStop(0.8, 'rgba(99, 102, 241, 0.04)');
      diffuseGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = diffuseGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw strands
      strandConfigs.forEach((s) => {
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 20;
        ctx.globalAlpha = s.alpha;

        const steps = 70;
        for (let i = 0; i <= steps; i++) {
          const prog = i / steps; // 0 to 1

          // Base S-curve trajectory
          const baseX = w * (0.24 + prog * 0.74);
          const baseY = h * (0.82 - prog * 0.60);

          // Flowing wave offsets
          const envelope = Math.sin(prog * Math.PI); // 0 at ends, 1 in middle
          const wave =
            Math.sin(prog * 8.5 + t * s.speed + s.phase) * s.waveAmp * envelope +
            Math.cos(prog * 5.0 - t * (s.speed * 0.8)) * (s.waveAmp * 0.45) * envelope;

          // Normal direction perpendicular to trajectory (~ -45 deg slope)
          const normX = -wave * 0.6;
          const normY = wave * 0.8;

          const px = baseX + normX;
          const py = baseY + normY;

          if (i === 0) {
            ctx.moveTo(px, py);
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.stroke();
      });

      // Draw floating luminous particles along the ribbon
      ctx.shadowBlur = 10;
      particles.forEach((p) => {
        p.p = (p.p + p.speed) % 1;
        const prog = p.p;
        const baseX = w * (0.24 + prog * 0.74);
        const baseY = h * (0.82 - prog * 0.60);
        const wave = Math.sin(prog * 8.5 + t * 1.2) * 25 * Math.sin(prog * Math.PI);

        const x = baseX - wave * 0.6 + Math.sin(t + p.offset) * 8;
        const y = baseY + wave * 0.8 + p.offset;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#c084fc';
        ctx.globalAlpha = p.alpha * Math.sin(prog * Math.PI);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [canvasRef]);
}

export default function FloatingExperience() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [toggleActive, setToggleActive] = useState(true);

  useRibbonCanvas(canvasRef);

  // Smooth 3D tilt tracking on mouse movement
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currRotX = 0;
    let currRotY = 0;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotY = nx * 8; // subtle perspective sway
      targetRotX = -ny * 6;
    };

    const onPointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    const tick = () => {
      currRotX += (targetRotX - currRotX) * 0.08;
      currRotY += (targetRotY - currRotY) * 0.08;
      stage.style.setProperty('--kiosk-tilt-x', `${currRotX.toFixed(2)}deg`);
      stage.style.setProperty('--kiosk-tilt-y', `${currRotY.toFixed(2)}deg`);
      rafId = requestAnimationFrame(tick);
    };

    stage.addEventListener('pointermove', onPointerMove, { passive: true });
    stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="kiosk-experience" ref={stageRef} aria-label="ResolveOPS Digital Experience Showcase">
      {/* Floor glow reflection underneath the monitor */}
      <div className="kiosk-floor-reflection" aria-hidden="true" />
      <div className="kiosk-top-ambient-light" aria-hidden="true" />

      {/* 3D Scene Container */}
      <div className="kiosk-scene-3d">

        {/* ── Main Monitor Kiosk ───────────────────────── */}
        <div className="kiosk-monitor-wrap">
          {/* Physical Kiosk Base Stand */}
          <div className="kiosk-stand-base" aria-hidden="true">
            <div className="kiosk-stand-stem" />
            <div className="kiosk-stand-foot" />
          </div>

          {/* Angled Monitor Screen */}
          <div className="kiosk-monitor-frame">
            {/* Inner Screen Surface */}
            <div className="kiosk-screen-content">

              {/* Monitor Top Navigation Bar */}
              <div className="kiosk-nav-bar">
                <div className="kiosk-nav-brand">
                  <span className="kiosk-brand-icon">R</span>
                  <span className="kiosk-brand-name">ResolveOPS</span>
                </div>
                <div className="kiosk-nav-links">
                  <span className="kiosk-link active">Home</span>
                  <span className="kiosk-link">Services</span>
                  <span className="kiosk-link">Work</span>
                  <span className="kiosk-link">About</span>
                </div>
                <div className="kiosk-nav-menu-btn" aria-hidden="true">
                  <List size={16} weight="bold" />
                </div>
              </div>

              {/* Monitor Hero Content */}
              <div className="kiosk-screen-hero">
                <h3 className="kiosk-screen-heading">
                  Modern websites<br />
                  for growing businesses.
                </h3>
                <p className="kiosk-screen-subtext">
                  Clean design. Fast performance.<br />
                  Built for your goals.
                </p>
                <div className="kiosk-screen-cta">
                  <span>Get started</span>
                  <ArrowRight size={12} weight="bold" />
                </div>
              </div>

              {/* Glowing Aurora Ribbon Canvas */}
              <canvas ref={canvasRef} className="kiosk-ribbon-canvas" aria-hidden="true" />

              {/* Bottom 4 Services Strip inside the monitor */}
              <div className="kiosk-screen-footer-services">
                <div className="kiosk-service-col">
                  <PaintBrush size={14} weight="duotone" className="kiosk-svc-icon" />
                  <div className="kiosk-svc-text">
                    <span className="kiosk-svc-title">Design</span>
                    <span className="kiosk-svc-sub">User experiences</span>
                  </div>
                </div>

                <div className="kiosk-service-col">
                  <Code size={14} weight="duotone" className="kiosk-svc-icon" />
                  <div className="kiosk-svc-text">
                    <span className="kiosk-svc-title">Development</span>
                    <span className="kiosk-svc-sub">Web apps & integrations</span>
                  </div>
                </div>

                <div className="kiosk-service-col">
                  <Lightning size={14} weight="duotone" className="kiosk-svc-icon" />
                  <div className="kiosk-svc-text">
                    <span className="kiosk-svc-title">Automation</span>
                    <span className="kiosk-svc-sub">Workflows & processes</span>
                  </div>
                </div>

                <div className="kiosk-service-col">
                  <TrendUp size={14} weight="duotone" className="kiosk-svc-icon" />
                  <div className="kiosk-svc-text">
                    <span className="kiosk-svc-title">Analytics</span>
                    <span className="kiosk-svc-sub">Data & insights</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Floating Automation Card (Top Right) ────── */}
        <div className="kiosk-floating-card card-automation" aria-hidden="true">
          {/* Stacked translucent layers behind */}
          <div className="card-ghost-layer layer-2" />
          <div className="card-ghost-layer layer-1" />

          <div className="card-inner">
            <div className="card-header">
              <div className="card-icon-wrap icon-automation">
                <Lightning size={18} weight="fill" />
              </div>
              <div className="card-titles">
                <span className="card-main-title">Automation</span>
                <span className="card-sub-title">Connected workflows & processes</span>
              </div>
            </div>

            <div className="card-list">
              <div className="card-list-item">
                <div className="check-box">
                  <Check size={11} weight="bold" />
                </div>
                <span className="item-text">Task automation</span>
                <button
                  type="button"
                  className={`card-toggle-switch ${toggleActive ? 'active' : ''}`}
                  onClick={() => setToggleActive((prev) => !prev)}
                  aria-label="Toggle automation status"
                >
                  <span className="toggle-slider" />
                </button>
              </div>

              <div className="card-list-item">
                <div className="check-box">
                  <Check size={11} weight="bold" />
                </div>
                <span className="item-text">API integrations</span>
              </div>

              <div className="card-list-item">
                <div className="check-box">
                  <Check size={11} weight="bold" />
                </div>
                <span className="item-text">Workflow builder</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Floating Analytics Card (Bottom Right Foreground) ── */}
        <div className="kiosk-floating-card card-analytics" aria-hidden="true">
          <div className="card-inner">
            <div className="card-header">
              <div className="card-icon-wrap icon-analytics">
                <ChartLineUp size={18} weight="duotone" />
              </div>
              <div className="card-titles">
                <span className="card-main-title">Analytics</span>
                <span className="card-sub-title">Reports & business insights</span>
              </div>
              <div className="card-dropdown-pill">
                <span>Last 30 days</span>
                <CaretDown size={11} weight="bold" />
              </div>
            </div>

            {/* Total growth badge & SVG line chart */}
            <div className="analytics-chart-section">
              <div className="chart-badge-wrap">
                <div className="growth-pill">
                  <span className="growth-label">Total growth</span>
                  <span className="growth-val">+24.8%</span>
                </div>
              </div>

              <div className="analytics-svg-wrap">
                <svg
                  className="analytics-svg"
                  viewBox="0 0 320 85"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="anGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(167, 139, 250, 0.45)" />
                      <stop offset="60%" stopColor="rgba(139, 92, 246, 0.12)" />
                      <stop offset="100%" stopColor="rgba(91, 63, 208, 0)" />
                    </linearGradient>
                    <linearGradient id="anLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#c4b5fd" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>

                  {/* Area fill */}
                  <path
                    d="M 0 62 Q 30 70, 55 65 T 100 58 T 145 46 T 190 38 T 235 50 T 280 24 T 320 28 L 320 85 L 0 85 Z"
                    fill="url(#anGrad)"
                  />

                  {/* Wave line */}
                  <path
                    d="M 0 62 Q 30 70, 55 65 T 100 58 T 145 46 T 190 38 T 235 50 T 280 24 T 320 28"
                    stroke="url(#anLine)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="analytics-line-glow"
                  />

                  {/* Peak glowing node */}
                  <circle cx="280" cy="24" r="3.5" fill="#ffffff" />
                  <circle cx="280" cy="24" r="8" fill="rgba(236, 72, 153, 0.4)" className="node-ripple" />
                </svg>
              </div>
            </div>

            {/* Bottom 3 metrics row */}
            <div className="analytics-metrics-row">
              <div className="metric-box">
                <span className="metric-title">Visitors</span>
                <span className="metric-number">12.4K</span>
                <span className="metric-trend green">▲ +12%</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Conversions</span>
                <span className="metric-number">3.2K</span>
                <span className="metric-trend green">▲ +18%</span>
              </div>
              <div className="metric-box">
                <span className="metric-title">Revenue</span>
                <span className="metric-number">$28.6K</span>
                <span className="metric-trend green">▲ +24%</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
