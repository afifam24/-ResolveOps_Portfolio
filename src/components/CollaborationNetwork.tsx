import { useEffect, useRef, useState } from 'react';
import {
  PaintBrush,
  Code,
  Megaphone,
  ChartLine,
} from '@phosphor-icons/react';
import './CollaborationNetwork.css';

export interface CollabDiscipline {
  id: 'design' | 'development' | 'marketing' | 'analytics';
  label: string;
  desc: string;
  Icon: React.ComponentType<any>;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const COLLAB_DISCIPLINES: CollabDiscipline[] = [
  {
    id: 'design',
    label: 'DESIGN',
    desc: 'Creative interfaces and visual identity.',
    Icon: PaintBrush,
    position: 'top-left',
  },
  {
    id: 'development',
    label: 'DEVELOPMENT',
    desc: 'Websites and digital experiences.',
    Icon: Code,
    position: 'top-right',
  },
  {
    id: 'marketing',
    label: 'MARKETING',
    desc: 'Visibility and audience growth.',
    Icon: Megaphone,
    position: 'bottom-left',
  },
  {
    id: 'analytics',
    label: 'ANALYTICS',
    desc: 'Data and business insights.',
    Icon: ChartLine,
    position: 'bottom-right',
  },
];

interface NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  disciplineId?: CollabDiscipline['id'];
}

interface CollabParticle {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  size: number;
  alpha: number;
}

export default function CollaborationNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeDiscipline, setActiveDiscipline] = useState<CollabDiscipline['id'] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let t = 0;
    let introFade = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      if (!canvas || !container) return;
      canvas.width = container.offsetWidth * dpr;
      canvas.height = container.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const w = container.offsetWidth;
    const h = container.offsetHeight;

    // Anchor positions mapping directly to the 4 quadrants
    const anchorPositions: { id: CollabDiscipline['id']; xP: number; yP: number }[] = [
      { id: 'design', xP: 0.26, yP: 0.24 },
      { id: 'development', xP: 0.74, yP: 0.24 },
      { id: 'marketing', xP: 0.26, yP: 0.76 },
      { id: 'analytics', xP: 0.74, yP: 0.76 },
    ];

    const nodeCount = w < 480 ? 10 : 16;
    const nodes: NetworkNode[] = [];

    // 4 discipline anchor nodes
    anchorPositions.forEach(({ id, xP, yP }) => {
      nodes.push({
        x: w * xP,
        y: h * yP,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: 4.5,
        baseAlpha: 0.9,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015,
        disciplineId: id,
      });
    });

    // Bridge cluster nodes connecting the disciplines
    for (let i = 4; i < nodeCount; i++) {
      nodes.push({
        x: w * (0.25 + Math.random() * 0.5),
        y: h * (0.25 + Math.random() * 0.5),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 2.2 + Math.random() * 1.5,
        baseAlpha: 0.45 + Math.random() * 0.35,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.012,
      });
    }

    // Dynamic light particles traveling across connections
    const particles: CollabParticle[] = Array.from({ length: w < 480 ? 8 : 14 }, () => ({
      fromNode: Math.floor(Math.random() * nodes.length),
      toNode: Math.floor(Math.random() * nodes.length),
      progress: Math.random(),
      speed: 0.0035 + Math.random() * 0.004,
      size: 1.8 + Math.random() * 0.8,
      alpha: 0.75 + Math.random() * 0.25,
    }));

    const maxConnectionDist = Math.min(w, h) * 0.52;

    const draw = () => {
      const curW = container.offsetWidth;
      const curH = container.offsetHeight;
      ctx.clearRect(0, 0, curW, curH);

      if (curW === 0 || curH === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }

      t += 0.008;
      if (introFade < 1) introFade = Math.min(1, introFade + 0.02);

      // Move nodes smoothly within bounds
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Keep specialist anchors gently tethered to their relative quadrants
        if (n.disciplineId) {
          const target = anchorPositions.find((a) => a.id === n.disciplineId);
          if (target) {
            const tx = curW * target.xP;
            const ty = curH * target.yP;
            n.vx += (tx - n.x) * 0.0008;
            n.vy += (ty - n.y) * 0.0008;
          }
        }

        // Soft bounce at boundaries
        const pad = 24;
        if (n.x < pad) { n.x = pad; n.vx = Math.abs(n.vx); }
        if (n.x > curW - pad) { n.x = curW - pad; n.vx = -Math.abs(n.vx); }
        if (n.y < pad) { n.y = pad; n.vy = Math.abs(n.vy); }
        if (n.y > curH - pad) { n.y = curH - pad; n.vy = -Math.abs(n.vy); }
      });

      // ── Draw Connection Lines ───────────────────────────
      const activeNodeIndex = nodes.findIndex((n) => n.disciplineId === activeDiscipline);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);

          if (dist > maxConnectionDist) continue;

          const isConnectedToActive =
            activeNodeIndex >= 0 && (i === activeNodeIndex || j === activeNodeIndex);
          const hasActive = activeNodeIndex >= 0;

          const proximityFade = (1 - dist / maxConnectionDist) ** 1.3;
          let alpha: number;
          let lineWidth: number;

          if (isConnectedToActive) {
            alpha = (0.55 + 0.35 * Math.sin(t * 3)) * proximityFade * introFade;
            lineWidth = 1.6;
          } else if (hasActive) {
            alpha = 0.08 * proximityFade * introFade;
            lineWidth = 0.8;
          } else {
            alpha = (0.2 + 0.08 * Math.sin(t * 1.5 + i + j)) * proximityFade * introFade;
            lineWidth = 1.0;
          }

          // Subtle organic breathing curve
          const bend = Math.sin(t * 1.2 + i * 0.7 + j * 0.4) * (dist * 0.05);
          const midX = (a.x + b.x) / 2 + (-dy / dist) * bend;
          const midY = (a.y + b.y) / 2 + (dx / dist) * bend;

          const lineGrad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          if (isConnectedToActive) {
            lineGrad.addColorStop(0, `rgba(221, 214, 254, ${alpha})`);
            lineGrad.addColorStop(0.5, `rgba(167, 139, 250, ${alpha * 0.9})`);
            lineGrad.addColorStop(1, `rgba(139, 92, 246, ${alpha * 0.6})`);
          } else {
            lineGrad.addColorStop(0, `rgba(167, 139, 250, ${alpha * 0.8})`);
            lineGrad.addColorStop(0.5, `rgba(139, 92, 246, ${alpha})`);
            lineGrad.addColorStop(1, `rgba(91, 63, 208, ${alpha * 0.6})`);
          }

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(midX, midY, b.x, b.y);
          ctx.strokeStyle = lineGrad;
          ctx.lineWidth = lineWidth;
          ctx.stroke();
        }
      }

      // ── Animate & Draw Flowing Light Particles ──────────
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.fromNode = Math.floor(Math.random() * nodes.length);
          let next = Math.floor(Math.random() * nodes.length);
          while (next === p.fromNode) {
            next = Math.floor(Math.random() * nodes.length);
          }
          p.toNode = next;
        }

        const a = nodes[p.fromNode];
        const b = nodes[p.toNode];
        if (!a || !b) return;

        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        if (dist > maxConnectionDist * 1.1) return;

        const px = a.x + (b.x - a.x) * p.progress;
        const py = a.y + (b.y - a.y) * p.progress;

        const isParticleActive =
          activeNodeIndex >= 0 &&
          (p.fromNode === activeNodeIndex || p.toNode === activeNodeIndex);

        const currentAlpha = (isParticleActive ? 0.95 : p.alpha * 0.75) * introFade;
        const currentSize = isParticleActive ? p.size * 1.4 : p.size;

        const pGrad = ctx.createRadialGradient(px, py, 0, px, py, currentSize * 3);
        pGrad.addColorStop(0, isParticleActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(221, 214, 254, 0.85)');
        pGrad.addColorStop(0.4, 'rgba(167, 139, 250, 0.55)');
        pGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(px, py, currentSize * 3, 0, Math.PI * 2);
        ctx.fillStyle = pGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      // ── Draw Glowing Network Nodes ───────────────────────
      nodes.forEach((n, idx) => {
        const isThisNodeActive = idx === activeNodeIndex;
        const pulse = (Math.sin(t * 2 + n.pulsePhase) + 1) / 2;
        const currentAlpha =
          (isThisNodeActive ? 1.0 : n.baseAlpha * (0.7 + 0.3 * pulse)) * introFade;
        const currentRadius = isThisNodeActive ? n.radius * 1.35 : n.radius;

        // Outer glow halo
        const glowRadius = isThisNodeActive ? currentRadius * 5.5 : currentRadius * 3.5;
        const glowGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowRadius);
        if (isThisNodeActive) {
          glowGrad.addColorStop(0, `rgba(221, 214, 254, 0.75)`);
          glowGrad.addColorStop(0.4, `rgba(167, 139, 250, 0.4)`);
          glowGrad.addColorStop(1, 'transparent');
        } else if (n.disciplineId) {
          glowGrad.addColorStop(0, `rgba(167, 139, 250, 0.45)`);
          glowGrad.addColorStop(0.5, `rgba(139, 92, 246, 0.2)`);
          glowGrad.addColorStop(1, 'transparent');
        } else {
          glowGrad.addColorStop(0, `rgba(139, 92, 246, 0.3)`);
          glowGrad.addColorStop(1, 'transparent');
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Inner solid core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = isThisNodeActive
          ? '#ffffff'
          : n.disciplineId
          ? '#e9e5ff'
          : `rgba(196, 181, 253, ${currentAlpha})`;
        ctx.fill();

        // Inner highlight ring for discipline anchors
        if (n.disciplineId) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, currentRadius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(167, 139, 250, ${isThisNodeActive ? 0.85 : 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      if (!prefersReduced) {
        raf = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [activeDiscipline]);

  return (
    <div
      className="collab-network"
      ref={containerRef}
      aria-label="Interactive collaboration network representing freelance specialists"
    >
      {/* Living Canvas Layer */}
      <canvas className="collab-canvas" ref={canvasRef} aria-hidden="true" />

      {/* Four Floating Specialist Discipline Cards with Miniature Visual Previews */}
      {COLLAB_DISCIPLINES.map(({ id, label, desc, Icon, position }) => {
        const isHovered = activeDiscipline === id;
        const isDimmed = activeDiscipline !== null && !isHovered;

        return (
          <div
            key={id}
            className={`collab-card collab-card--${position} ${
              isHovered ? 'is-highlighted' : ''
            } ${isDimmed ? 'is-dimmed' : ''}`}
            onMouseEnter={() => setActiveDiscipline(id)}
            onMouseLeave={() => setActiveDiscipline(null)}
            tabIndex={0}
            role="region"
            aria-label={`${label}: ${desc}`}
          >
            {/* Top row: Icon + Label + Live status dot */}
            <div className="collab-card-header">
              <div className="collab-card-icon">
                <Icon size={16} weight="duotone" />
              </div>
              <span className="collab-card-label">{label}</span>
              <span className="collab-card-dot" aria-hidden="true" />
            </div>

            {/* Description */}
            <p className="collab-card-desc">{desc}</p>

            {/* Miniature visual preview inside the card */}
            <div className="collab-card-mini-sandbox" aria-hidden="true">
              {id === 'design' && (
                <div className="mini-preview-design">
                  <div className="design-swatches">
                    <span className="swatch swatch--violet" />
                    <span className="swatch swatch--cyan" />
                    <span className="swatch-wire-bar" />
                  </div>
                  <div className="design-mini-blocks">
                    <div className="mini-block mini-block--active" />
                    <div className="mini-block" />
                  </div>
                </div>
              )}

              {id === 'development' && (
                <div className="mini-preview-dev">
                  <div className="dev-code-row">
                    <span className="dev-ping-dot" />
                    <span className="dev-token-tag">&lt;App /&gt;</span>
                    <span className="dev-token-arrow">→</span>
                    <span className="dev-token-badge">api.sync</span>
                  </div>
                  <div className="dev-mini-syntax">
                    <span className="dev-syntax-line line-1" />
                    <span className="dev-syntax-line line-2" />
                  </div>
                </div>
              )}

              {id === 'marketing' && (
                <div className="mini-preview-mkt">
                  <div className="mkt-header-row">
                    <span className="mkt-pulse-dot" />
                    <span className="mkt-reach-tag">Campaign Lift</span>
                    <span className="mkt-reach-val">+180%</span>
                  </div>
                  <div className="mkt-bar-track">
                    <div className="mkt-bar-fill" />
                  </div>
                </div>
              )}

              {id === 'analytics' && (
                <div className="mini-preview-analytics">
                  <div className="analytics-sparkline-row">
                    <svg className="analytics-sparkline-svg" viewBox="0 0 110 24" fill="none">
                      <path
                        d="M 2 18 Q 28 16 52 10 T 88 8 T 108 3"
                        stroke="#c4b5fd"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <circle cx="108" cy="3" r="3" fill="#ffffff" />
                      <circle cx="108" cy="3" r="6" stroke="rgba(196, 181, 253, 0.5)" strokeWidth="1" />
                    </svg>
                    <div className="analytics-metric">
                      <span className="metric-tag">ROAS</span>
                      <span className="metric-val">3.4x</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="collab-card-glow" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}
