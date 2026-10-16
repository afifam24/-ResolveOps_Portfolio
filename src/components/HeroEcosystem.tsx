import { useEffect, useRef } from 'react';
import {
  PaintBrush,
  Code,
  ChartLine,
  Lightning,
} from '@phosphor-icons/react';
import './HeroEcosystem.css';

// ── Capability cards data ──────────────────────────
const CARDS = [
  { id: 'design',      label: 'DESIGN',      desc: 'Websites & user experiences',      Icon: PaintBrush, position: 'top-left'     },
  { id: 'development', label: 'DEVELOPMENT', desc: 'Web apps & integrations',           Icon: Code,       position: 'top-right'    },
  { id: 'analytics',   label: 'ANALYTICS',   desc: 'Reports & business insights',       Icon: ChartLine,  position: 'bottom-left'  },
  { id: 'automation',  label: 'AUTOMATION',  desc: 'Connected workflows & processes',   Icon: Lightning,  position: 'bottom-right' },
] as const;

function useConnectionCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    const getOrb = () => ({ x: canvas.width / 2, y: canvas.height / 2 });
    const getCardAnchors = () => {
      const w = canvas.width;
      const h = canvas.height;
      return [
        { x: w * 0.18 + 60, y: h * 0.17 + 20 },
        { x: w * 0.82 - 60, y: h * 0.17 + 20 },
        { x: w * 0.18 + 60, y: h * 0.83 - 20 },
        { x: w * 0.82 - 60, y: h * 0.83 - 20 },
      ];
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (canvas.width === 0 || canvas.height === 0) { raf = requestAnimationFrame(draw); return; }
      const orb = getOrb();
      const anchors = getCardAnchors();
      t += 0.008;
      anchors.forEach((anchor, i) => {
        const pulse = prefersReduced ? 0.35 : 0.25 + 0.14 * Math.sin(t * 1.5 + i * 1.1);
        const grad = ctx.createLinearGradient(orb.x, orb.y, anchor.x, anchor.y);
        grad.addColorStop(0, `rgba(139, 92, 246, ${pulse})`);
        grad.addColorStop(0.5, `rgba(167, 139, 250, ${pulse * 0.55})`);
        grad.addColorStop(1, `rgba(167, 139, 250, ${pulse * 0.15})`);
        ctx.beginPath();
        ctx.moveTo(orb.x, orb.y);
        ctx.lineTo(anchor.x, anchor.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
        if (!prefersReduced) {
          const phase = (t * 0.55 + i * 0.25) % 1;
          const nx = orb.x + (anchor.x - orb.x) * phase;
          const ny = orb.y + (anchor.y - orb.y) * phase;
          const nodeAlpha = Math.sin(phase * Math.PI) * 0.9;
          ctx.beginPath(); ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196, 181, 253, ${nodeAlpha})`; ctx.fill();
          ctx.beginPath(); ctx.arc(nx, ny, 5.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${nodeAlpha * 0.22})`; ctx.fill();
        }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef, containerRef]);
}

export default function HeroEcosystem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useConnectionCanvas(canvasRef, containerRef);
  return (
    <div className="hero-ecosystem" ref={containerRef} aria-hidden="true">
      <canvas className="ecosystem-canvas" ref={canvasRef} />
      <div className="ecosystem-orb-wrap">
        <div className="ecosystem-orb">
          <div className="orb-ring orb-ring-1" />
          <div className="orb-ring orb-ring-2" />
          <div className="orb-ring orb-ring-3" />
          <div className="orb-core">
            <span className="orb-brand-r">R</span>
          </div>
          <div className="orb-ambient" />
        </div>
      </div>
      {CARDS.map(({ id, label, desc, Icon, position }) => (
        <div key={id} className={`ecosystem-card ecosystem-card--${position}`}>
          <div className="ecosystem-card-icon"><Icon size={18} weight="duotone" /></div>
          <div className="ecosystem-card-text">
            <span className="ecosystem-card-label">{label}</span>
            <span className="ecosystem-card-desc">{desc}</span>
          </div>
        </div>
      ))}
      <div className="ecosystem-scroll-cue">
        <span className="scroll-cue-text">SCROLL TO EXPLORE</span>
        <div className="scroll-cue-arrow">
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M6 0v16M1 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
