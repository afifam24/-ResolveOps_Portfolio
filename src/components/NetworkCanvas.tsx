import { accentChannels } from '../lib/palette';
import { useEffect, useRef, useCallback } from 'react';
import './NetworkCanvas.css';

// ─── Tuning constants ──────────────────────────────────────────────────────
const NODE_COUNT        = 16;    // enough for an interconnected cluster
const CONNECTION_DIST   = 175;   // px — generous enough for multiple links
const BASE_SPEED        = 0.14;  // slow drift
const NODE_RADIUS_MIN   = 2;
const NODE_RADIUS_MAX   = 4;
const LINE_OPACITY_BASE = 0.16;  // clearly visible but not heavy
const NODE_OPACITY_MIN  = 0.25;
const NODE_OPACITY_MAX  = 0.90;
const BRIGHT_NODE_COUNT = 4;     // these nodes get a bigger glow
const MOUSE_RADIUS      = 120;   // px — only affects the network, not far outside

// ─────────────────────────────────────────────────────────────────────────

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  baseOpacity: number;
  pulseOffset: number;
  pulseSpeed: number;
  isBright: boolean;     // brighter "anchor" nodes
}

function makeNodes(w: number, h: number): Node[] {
  return Array.from({ length: NODE_COUNT }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = (0.3 + Math.random() * 0.7) * BASE_SPEED;
    return {
      // Spread within the canvas but cluster slightly toward center
      x: w * (0.1 + Math.random() * 0.8),
      y: h * (0.1 + Math.random() * 0.8),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: NODE_RADIUS_MIN + Math.random() * (NODE_RADIUS_MAX - NODE_RADIUS_MIN),
      baseOpacity: NODE_OPACITY_MIN + Math.random() * (NODE_OPACITY_MAX - NODE_OPACITY_MIN),
      pulseOffset: Math.random() * Math.PI * 2,
      pulseSpeed: 0.006 + Math.random() * 0.010,
      isBright: i < BRIGHT_NODE_COUNT,
    };
  });
}

export default function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // -1 sentinel means "mouse not over the canvas"
  const mouse     = useRef<{ x: number; y: number; over: boolean }>({ x: 0, y: 0, over: false });
  const nodes     = useRef<Node[]>([]);
  const rafId     = useRef<number>(0);
  const tick      = useRef<number>(0);

  // ── Mouse tracking — canvas-relative, bounds-checked ──────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Only mark as "over" when the pointer is actually inside the canvas rect
    const over = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    mouse.current = { x, y, over };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouse.current = { x: 0, y: 0, over: false };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const [ACCENT_R, ACCENT_G, ACCENT_B] = accentChannels();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Resize ─────────────────────────────────────────────────────────────
    let redrawStatic = () => {};
    const resize = () => {
      const parent = canvas.parentElement!;
      canvas.width  = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      nodes.current = makeNodes(canvas.width, canvas.height);
      redrawStatic();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    // Attach to window so pointer-events:none on the wrapper doesn't matter
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // ── Draw loop ──────────────────────────────────────────────────────────
    const draw = () => {
      tick.current += 1;
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      const { x: mx, y: my, over: mOver } = mouse.current;

      // ── Move nodes (drift + soft bounce at canvas edges) ─────────────────
      for (const n of nodes.current) {
        n.x += n.vx;
        n.y += n.vy;
        // Soft bounce — reverse velocity when hitting a 10px margin
        if (n.x < 10)      { n.x = 10;     n.vx = Math.abs(n.vx); }
        if (n.x > W - 10)  { n.x = W - 10; n.vx = -Math.abs(n.vx); }
        if (n.y < 10)      { n.y = 10;     n.vy = Math.abs(n.vy); }
        if (n.y > H - 10)  { n.y = H - 10; n.vy = -Math.abs(n.vy); }
      }

      // ── Draw connections ─────────────────────────────────────────────────
      for (let i = 0; i < nodes.current.length; i++) {
        for (let j = i + 1; j < nodes.current.length; j++) {
          const a = nodes.current[i];
          const b = nodes.current[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONNECTION_DIST) continue;

          // Stronger lines between two bright nodes
          const brightBonus = (a.isBright && b.isBright) ? 0.12 : 0;
          const fade   = (1 - dist / CONNECTION_DIST) ** 1.2;
          let   alpha  = (LINE_OPACITY_BASE + brightBonus) * fade;

          // Mouse proximity boost (midpoint) — only when mouse is inside canvas
          if (mOver) {
            const mx2 = (a.x + b.x) / 2;
            const my2 = (a.y + b.y) / 2;
            const mDist = Math.sqrt((mx2 - mx) ** 2 + (my2 - my) ** 2);
            if (mDist < MOUSE_RADIUS) {
              alpha += (1 - mDist / MOUSE_RADIUS) * 0.18;
            }
          }

          // Breathing bezier bend
          const bend  = (Math.sin(tick.current * 0.0025 + i * 0.8 + j * 0.5) * 0.14 + 0.06) * dist;
          const cx    = (a.x + b.x) / 2 + (-dy / dist) * bend;
          const cy    = (a.y + b.y) / 2 + ( dx / dist) * bend;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(cx, cy, b.x, b.y);

          const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          g.addColorStop(0,   `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${alpha * 0.55})`);
          g.addColorStop(0.5, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${alpha})`);
          g.addColorStop(1,   `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${alpha * 0.55})`);
          ctx.strokeStyle = g;
          ctx.lineWidth   = 0.7 + fade * 0.7;
          ctx.stroke();
        }
      }

      // ── Draw nodes ───────────────────────────────────────────────────────
      for (const n of nodes.current) {
        const pulse    = (Math.sin(tick.current * n.pulseSpeed + n.pulseOffset) + 1) / 2;
        const pOpacity = n.baseOpacity * (0.5 + 0.5 * pulse);

        let mouseBoost = 0;
        if (mOver) {
          const mDist = Math.sqrt((n.x - mx) ** 2 + (n.y - my) ** 2);
          mouseBoost  = mDist < MOUSE_RADIUS ? (1 - mDist / MOUSE_RADIUS) : 0;
        }

        const finalOpacity = Math.min(1, pOpacity + mouseBoost * 0.4);
        const finalRadius  = n.radius + mouseBoost * 1.5;

        // Glow halo — bigger for bright nodes
        const glowR = n.isBright ? finalRadius * 6 : finalRadius * 3.5;
        const glowA = n.isBright ? finalOpacity * 0.28 : finalOpacity * 0.14;
        const glow  = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
        glow.addColorStop(0, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${glowA})`);
        glow.addColorStop(1, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        const core = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, finalRadius);
        core.addColorStop(0, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${finalOpacity})`);
        core.addColorStop(1, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},${finalOpacity * 0.25})`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, finalRadius, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
      }

      // ── Subtle pointer ambient — ONLY when mouse is inside the canvas ─────
      if (mOver && mx >= 0 && mx <= W && my >= 0 && my <= H) {
        const pg = ctx.createRadialGradient(mx, my, 0, mx, my, 50);
        pg.addColorStop(0, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.06)`);
        pg.addColorStop(1, `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0)`);
        ctx.beginPath();
        ctx.arc(mx, my, 50, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();
      }

      if (!reduced) rafId.current = requestAnimationFrame(draw);
    };

    redrawStatic = () => { if (reduced) draw(); };
    rafId.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId.current);
      ro.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className="network-canvas"
      aria-hidden="true"
    />
  );
}
