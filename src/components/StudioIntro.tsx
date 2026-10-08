import { accentChannels } from '../lib/palette';
import { useEffect, useRef, useState } from 'react';
import './StudioIntro.css';

// ── Canvas atmosphere — floating particles + pointer reactivity ──
function useAtmosphereCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  pointerRef: React.RefObject<{ x: number; y: number }>
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let redrawStatic = () => {};
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      redrawStatic();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    interface Dot {
      x: number; y: number;
      ox: number; oy: number;      // origin (base) position
      vx: number; vy: number;
      size: number;
      alpha: number;
      alphaTarget: number;
      alphaSpeed: number;
      flickerTimer: number;
      flickerInterval: number;
    }

    const COUNT = 22;
    const MAX_CONNECT_DIST = 110;
    const POINTER_RADIUS   = 80;   // px — area where pointer affects particles
    const MAX_PUSH         = 8;    // max displacement in px from pointer
    const A = accentChannels();
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const makeDot = (w: number, h: number): Dot => {
      const x = rand(0.05, 0.95) * w;
      const y = rand(0.05, 0.95) * h;
      return {
        x, y, ox: x, oy: y,
        vx: rand(-0.15, 0.15),
        vy: rand(-0.12, 0.12),
        size: rand(1.0, 2.2),
        alpha: prefersReduced ? .5 : 0,
        alphaTarget: rand(0.40, 0.90),
        alphaSpeed: rand(0.003, 0.008),
        flickerTimer: rand(0, 200),
        flickerInterval: rand(120, 380),
      };
    };

    let dots: Dot[] = [];
    const init = () => {
      dots = Array.from({ length: COUNT }, () => makeDot(canvas.width, canvas.height));
    };
    init();

    let raf = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Raw pointer in canvas-local coords
      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const hasPointer = px >= 0 && py >= 0;

      // ── 1. Update dot positions & alphas ──────────────────
      for (const d of dots) {
        // Base wandering motion
        if (!prefersReduced) {
          d.ox += d.vx;
          d.oy += d.vy;
          if (d.ox < -10)    d.ox = w + 10;
          if (d.ox > w + 10) d.ox = -10;
          if (d.oy < -10)    d.oy = h + 10;
          if (d.oy > h + 10) d.oy = -10;
        }

        // Pointer reactivity
        let renderX = d.ox;
        let renderY = d.oy;

        if (hasPointer && !prefersReduced) {
          const ddx = d.ox - px;
          const ddy = d.oy - py;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < POINTER_RADIUS && dist > 0) {
            const strength = 1 - dist / POINTER_RADIUS;
            const pushLen  = strength * MAX_PUSH;
            const norm     = 1 / dist;
            renderX = d.ox + ddx * norm * pushLen;
            renderY = d.oy + ddy * norm * pushLen;
          }
        }

        d.x = renderX;
        d.y = renderY;

        // Flicker fade
        d.flickerTimer++;
        if (d.flickerTimer > d.flickerInterval) {
          d.flickerTimer    = 0;
          d.flickerInterval = rand(120, 380);
          d.alphaTarget     = d.alphaTarget > 0.12 ? rand(0.12, 0.25) : rand(0.40, 0.90);
        }
        d.alpha += (d.alphaTarget - d.alpha) * d.alphaSpeed;
      }

      // ── 2. Draw connection lines (with faint glow) ─────────
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_CONNECT_DIST) {
            let lineMult = 1;
            if (hasPointer && !prefersReduced) {
              const dpa = Math.sqrt((a.x - px) ** 2 + (a.y - py) ** 2);
              const dpb = Math.sqrt((b.x - px) ** 2 + (b.y - py) ** 2);
              if (dpa < POINTER_RADIUS && dpb < POINTER_RADIUS) {
                lineMult = 1 + (1 - Math.min(dpa, dpb) / POINTER_RADIUS) * 1.5;
              }
            }
            const la = (1 - dist / MAX_CONNECT_DIST) * Math.min(a.alpha, b.alpha) * 1.05 * lineMult;
            const strokeAlpha = Math.min(la, 0.92);

            // Very faint soft glow on lines
            ctx.shadowColor = `rgba(${A[0]},${A[1]},${A[2]},${strokeAlpha * 0.35})`;
            ctx.shadowBlur = 3;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${A[0]},${A[1]},${A[2]},${strokeAlpha})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      // ── 3. Draw particles / nodes (with subtle teal glow) ──
      for (const d of dots) {
        let alphaMult = 1;
        if (hasPointer && !prefersReduced) {
          const ddx = d.ox - px;
          const ddy = d.oy - py;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < POINTER_RADIUS && dist > 0) {
            const strength = 1 - dist / POINTER_RADIUS;
            alphaMult = 1 + strength * 0.9;
          }
        }

        const finalAlpha = Math.min(d.alpha * alphaMult, 1);

        // Soft, subtle teal glow around the node
        ctx.shadowColor = `rgba(${A[0]},${A[1]},${A[2]},${finalAlpha * 0.55})`;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${A[0]},${A[1]},${A[2]},${finalAlpha})`;
        ctx.fill();
      }

      // Reset shadow blur
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      if (!prefersReduced) raf = requestAnimationFrame(draw);
    };

    redrawStatic = () => { if (prefersReduced) draw(); };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef, pointerRef]);
}

function useNextSectionObserver() {
  const [nearNext, setNearNext] = useState(false);
  useEffect(() => {
    const target = document.querySelector('.service-stage') as HTMLElement | null;
    if (!target) return;
    const obs = new IntersectionObserver(
      ([e]) => setNearNext(e.isIntersecting || e.boundingClientRect.top < window.innerHeight * 1.1),
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);
  return nearNext;
}

export default function StudioIntro() {
  const contentRef   = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const nearNext   = useNextSectionObserver();

  // Shared pointer position (canvas-local coords), -1 when absent
  const pointerRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });

  useAtmosphereCanvas(canvasRef, pointerRef);

  useEffect(() => {
    const lines = contentRef.current?.querySelectorAll('.si-line');
    if (!lines) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('si-line-active', entry.isIntersecting));
    }, { rootMargin: '-15% 0px -25% 0px', threshold: .5 });
    lines.forEach(line => observer.observe(line));
    return () => observer.disconnect();
  }, []);

  // ── Reveal observer ──────────────────────────────────────
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { setRevealed(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); obs.unobserve(el); } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // ── Pointer tracking — feeds both canvas reactivity and parallax ──
  useEffect(() => {
    const section = canvasWrapRef.current?.closest('section') as HTMLElement | null;
    const canvasWrap = canvasWrapRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvasWrap || !canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Smooth parallax via lerp in RAF
    let targetTx = 0, targetTy = 0;
    let currentTx = 0, currentTy = 0;
    let rafId = 0;

    const MAX_SHIFT = 3; // px

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;   // 0-1 across section
      const ny = (e.clientY - rect.top)  / rect.height;

      // Parallax: pointer right → canvas shifts left
      targetTx = -(nx - 0.5) * 2 * MAX_SHIFT;
      targetTy = -(ny - 0.5) * 2 * MAX_SHIFT;

      // Canvas-local coords for particle reactivity (relative to canvas element)
      const canvasRect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      };
    };

    const onLeave = () => {
      targetTx = 0;
      targetTy = 0;
      pointerRef.current = { x: -1, y: -1 };
    };

    const tick = () => {
      currentTx += (targetTx - currentTx) * 0.06;
      currentTy += (targetTy - currentTy) * 0.06;
      canvasWrap.style.transform = `translate(${currentTx.toFixed(3)}px, ${currentTy.toFixed(3)}px)`;
      rafId = requestAnimationFrame(tick);
    };

    section.addEventListener('pointermove', onMove, { passive: true });
    section.addEventListener('pointerleave', onLeave, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="section studio-intro" aria-label="About us">
      <div className={`si-transition-bar${nearNext ? ' si-bar-lit' : ''}`} aria-hidden="true" />

      <div className="container">
        <div className="studio-intro-grid">

          {/* Left: text content */}
          <div ref={contentRef} className={`studio-intro-content${revealed ? ' si-revealed' : ''}`}>
            <div className="si-label">The Studio</div>

            {/*
              Headline animated LINE-by-LINE — NOT word-by-word.
              Each .si-line is display:block so all natural word spacing
              inside the line is fully preserved. No spacing bugs possible.
            */}
            <h2 className="si-headline">
              <span className="si-line" style={{ transitionDelay: '120ms' }}>
                We bring design, development, marketing, automation,
              </span>
              <span className="si-line" style={{ transitionDelay: '240ms' }}>
                and analytics together —
              </span>
              <span className="si-line" style={{ transitionDelay: '380ms' }}>
                <span className={`si-accent-phrase${revealed ? ' si-sweep' : ''}`}>
                  <span className="accent-word">built</span>{' '}
                  <span className="accent-word">around</span>{' '}
                  <span className="accent-word">your</span>{' '}
                  <span className="accent-word">business</span>{' '}
                  <span className="accent-word">goals.</span>
                </span>
              </span>
            </h2>

            <p className="si-body">
              ResolveOPS is a technology and growth studio building <strong>websites, automations and reporting tools</strong> around practical business needs. We handle the technical work so you can focus on running your business.
            </p>
          </div>

          {/* Right: canvas atmosphere — NO orbs, NO rings, NO circles */}
          <div ref={canvasWrapRef} className="studio-intro-canvas" aria-hidden="true">
            {/* Diffuse ambient glow — shapeless, CSS only */}
            <div className="si-ambient-field" />
            {/* Particle + connection-line atmosphere */}
            <canvas ref={canvasRef} className="si-canvas" />

            {/* Scroll-to-explore cue */}
            <div className="si-scroll-cue">
              <span className="si-scroll-text">Scroll to explore</span>
              <div className="si-scroll-line" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

