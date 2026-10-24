import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  PaintBrush,
  Code,
  ChartLine,
  Lightning,
} from '@phosphor-icons/react';
import './HeroEcosystem.css';

// ── Capability cards data ──────────────────────────
export const ECOSYSTEM_CARDS = [
  { id: 'design',      label: 'DESIGN',      desc: 'Websites & user experiences',      Icon: PaintBrush, position: 'top-left'     },
  { id: 'development', label: 'DEVELOPMENT', desc: 'Web apps & integrations',           Icon: Code,       position: 'top-right'    },
  { id: 'analytics',   label: 'ANALYTICS',   desc: 'Reports & business insights',       Icon: ChartLine,  position: 'bottom-left'  },
  { id: 'automation',  label: 'AUTOMATION',  desc: 'Connected workflows & processes',   Icon: Lightning,  position: 'bottom-right' },
] as const;

export type EcosystemCardId = (typeof ECOSYSTEM_CARDS)[number]['id'];

// Mapping between Services and Ecosystem Cards
export const SERVICE_CARD_MAP: Record<string, EcosystemCardId[]> = {
  'website-development': ['development', 'design'],
  'ui-ux-design': ['design', 'development'],
  'seo-digital-marketing': ['analytics', 'development'],
  'ai-automation': ['automation'],
  'crm-workflow-automation': ['automation', 'analytics'],
  'business-analytics': ['analytics'],
};

export const CARD_SERVICE_MAP: Record<EcosystemCardId, string> = {
  'design': 'ui-ux-design',
  'development': 'website-development',
  'analytics': 'business-analytics',
  'automation': 'ai-automation',
};

interface ParticlePacket {
  progress: number;      // 0 = at card, 1 = at central core
  speed: number;         // travel speed per frame
  baseSpeed: number;     // baseline speed
  delay: number;         // delay frames before relaunch
  tailLength: number;    // fraction of line length for illuminated tail
  size: number;          // particle radius
  alpha: number;         // opacity
}

interface CoreRipple {
  r: number;
  maxR: number;
  alpha: number;
  speed: number;
}

interface OrbitingMote {
  radiusX: number;
  radiusY: number;
  tiltAngle: number;
  speed: number;
  angle: number;
  size: number;
  baseAlpha: number;
}

interface AmbientDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulsePhase: number;
}

interface CachedAnchor {
  id: EcosystemCardId;
  x: number;
  y: number;
}

export interface HeroEcosystemProps {
  activeServiceId?: string | null;
  onCardHover?: (cardId: EcosystemCardId | null) => void;
  activeCardId?: EcosystemCardId | null;
  onCardClick?: (serviceId: string) => void;
}

function useConnectionCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
  highlightedCardIds: EcosystemCardId[],
  cardElementsRef: React.MutableRefObject<Map<string, HTMLElement>>
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
    let coreGlowBoost = 0;

    // Cache card anchor points to avoid layout thrashing during draw()
    let cachedAnchors: CachedAnchor[] = [];

    const updateAnchors = () => {
      if (!container) return;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      const containerRect = container.getBoundingClientRect();

      cachedAnchors = ECOSYSTEM_CARDS.map((card, i) => {
        const el = cardElementsRef.current.get(card.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          let anchorX = rect.left - containerRect.left;
          let anchorY = rect.top - containerRect.top;

          // Connect directly to the inner quadrant / icon region of the card
          if (card.position === 'top-left') {
            anchorX += rect.width * 0.84;
            anchorY += rect.height * 0.82;
          } else if (card.position === 'top-right') {
            anchorX += rect.width * 0.16;
            anchorY += rect.height * 0.82;
          } else if (card.position === 'bottom-left') {
            anchorX += rect.width * 0.84;
            anchorY += rect.height * 0.18;
          } else {
            anchorX += rect.width * 0.16;
            anchorY += rect.height * 0.18;
          }
          return { id: card.id, x: anchorX, y: anchorY };
        }

        // Proportional fallback
        const defaultAnchors = [
          { x: w * 0.18 + 70, y: h * 0.18 + 24 },
          { x: w * 0.82 - 70, y: h * 0.18 + 24 },
          { x: w * 0.18 + 70, y: h * 0.82 - 24 },
          { x: w * 0.82 - 70, y: h * 0.82 - 24 },
        ];
        return { id: card.id, ...defaultAnchors[i] };
      });
    };

    const resize = () => {
      if (!canvas || !container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = container.offsetWidth * dpr;
      canvas.height = container.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateAnchors();
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(container);

    // Initialise traveling packets for each of the 4 connections (traveling CARD -> CORE)
    const packets: ParticlePacket[][] = [
      // Top-Left (DESIGN): organic timing offset
      [
        { progress: 0.15, speed: 0.0034, baseSpeed: 0.0034, delay: 0, tailLength: 0.22, size: 2.2, alpha: 0.95 },
        { progress: 0.65, speed: 0.0038, baseSpeed: 0.0038, delay: 0, tailLength: 0.18, size: 1.8, alpha: 0.80 },
      ],
      // Top-Right (DEVELOPMENT)
      [
        { progress: 0.40, speed: 0.0032, baseSpeed: 0.0032, delay: 0, tailLength: 0.24, size: 2.2, alpha: 0.95 },
        { progress: 0.90, speed: 0.0036, baseSpeed: 0.0036, delay: 0, tailLength: 0.18, size: 1.8, alpha: 0.80 },
      ],
      // Bottom-Left (ANALYTICS)
      [
        { progress: 0.25, speed: 0.0035, baseSpeed: 0.0035, delay: 0, tailLength: 0.22, size: 2.2, alpha: 0.95 },
        { progress: 0.75, speed: 0.0031, baseSpeed: 0.0031, delay: 0, tailLength: 0.18, size: 1.8, alpha: 0.80 },
      ],
      // Bottom-Right (AUTOMATION)
      [
        { progress: 0.50, speed: 0.0033, baseSpeed: 0.0033, delay: 0, tailLength: 0.23, size: 2.2, alpha: 0.95 },
        { progress: 0.05, speed: 0.0037, baseSpeed: 0.0037, delay: 0, tailLength: 0.18, size: 1.8, alpha: 0.80 },
      ],
    ];

    // Energy ripples expanding from core upon particle impact
    const ripples: CoreRipple[] = [];

    // Micro-particles orbiting the central core in 3D-like elliptical trajectories
    const orbitingMotes: OrbitingMote[] = [
      { radiusX: 52, radiusY: 34, tiltAngle: -0.45, speed: 0.014, angle: 0.2, size: 1.6, baseAlpha: 0.85 },
      { radiusX: 68, radiusY: 42, tiltAngle: 0.55, speed: -0.011, angle: 2.1, size: 1.4, baseAlpha: 0.75 },
      { radiusX: 84, radiusY: 54, tiltAngle: -0.25, speed: 0.008, angle: 4.3, size: 1.8, baseAlpha: 0.80 },
      { radiusX: 74, radiusY: 48, tiltAngle: 0.85, speed: -0.009, angle: 1.2, size: 1.3, baseAlpha: 0.70 },
    ];

    // Subtle ambient background dust particles drifting gently
    const ambientDust: AmbientDust[] = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * (container.offsetWidth || 600),
      y: Math.random() * (container.offsetHeight || 500),
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: 1.0 + Math.random() * 1.5,
      alpha: 0.12 + Math.random() * 0.16,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    // Trigger core impact sequence: spawn concentric energy ripple and boost central glow
    const triggerCoreImpact = (coreRadius: number, intensity: number = 0.35) => {
      coreGlowBoost = Math.min(coreGlowBoost + intensity, 1.0);
      if (ripples.length < 6) {
        ripples.push({
          r: coreRadius * 0.85,
          maxR: coreRadius * 2.3,
          alpha: 0.65 * intensity * 2.5,
          speed: 0.75 + Math.random() * 0.25,
        });
      }
    };

    const draw = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const orb = { x: w / 2, y: h / 2 };
      const coreRadius = Math.min(w, h) * 0.08 + 14;
      t += 0.008;

      // Exponential decay of core glow boost
      coreGlowBoost *= 0.95;

      const hasActive = highlightedCardIds.length > 0;

      // ── 1. Draw Subtle Ambient Drifting Dust Particles ─────────
      if (!prefersReduced) {
        ambientDust.forEach((d) => {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0) d.x = w;
          if (d.x > w) d.x = 0;
          if (d.y < 0) d.y = h;
          if (d.y > h) d.y = 0;

          const currentAlpha = d.alpha * (0.65 + 0.35 * Math.sin(t * 1.8 + d.pulsePhase));
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(196, 181, 253, ${currentAlpha})`;
          ctx.fill();
        });
      }

      // ── 2. Draw Dynamic Core Energy Ripple Waves ──────────────
      if (!prefersReduced && ripples.length > 0) {
        for (let j = ripples.length - 1; j >= 0; j--) {
          const rip = ripples[j];
          rip.r += rip.speed;
          const progress = (rip.r - coreRadius * 0.85) / (rip.maxR - coreRadius * 0.85);
          const currentAlpha = Math.max(0, rip.alpha * (1 - progress));

          ctx.beginPath();
          ctx.arc(orb.x, orb.y, rip.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(196, 181, 253, ${currentAlpha * 0.75})`;
          ctx.lineWidth = Math.max(0.6, 1.2 * (1 - progress));
          ctx.stroke();

          // Delicate outer violet haze on ripple
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, rip.r + 1.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139, 92, 246, ${currentAlpha * 0.35})`;
          ctx.lineWidth = 2.0;
          ctx.stroke();

          if (rip.r >= rip.maxR || currentAlpha <= 0.01) {
            ripples.splice(j, 1);
          }
        }
      }

      // ── 3. Draw Core Dynamic Glow Halo on Impact ──────────────
      if (!prefersReduced && coreGlowBoost > 0.02) {
        const glowGrad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, coreRadius * 1.8);
        glowGrad.addColorStop(0, `rgba(233, 229, 255, ${coreGlowBoost * 0.45})`);
        glowGrad.addColorStop(0.35, `rgba(167, 139, 250, ${coreGlowBoost * 0.28})`);
        glowGrad.addColorStop(0.75, `rgba(139, 92, 246, ${coreGlowBoost * 0.12})`);
        glowGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, coreRadius * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      // ── 4. Draw Connecting Lines & Traveling Light Pulses ─────
      cachedAnchors.forEach((anchor, i) => {
        const isHighlighted = highlightedCardIds.includes(anchor.id);
        const isDimmed = hasActive && !isHighlighted;

        // Line properties based on interaction state
        let baseAlpha: number;
        let strokeWidth: number;

        if (isHighlighted) {
          baseAlpha = 0.95;
          strokeWidth = 1.75;
        } else if (isDimmed) {
          baseAlpha = 0.12;
          strokeWidth = 0.8;
        } else {
          // Subtle organic breathing of the line
          baseAlpha = prefersReduced ? 0.32 : 0.24 + 0.08 * Math.sin(t * 1.4 + i * 1.2);
          strokeWidth = 1.0;
        }

        // Vector from central core to card anchor
        const dx = anchor.x - orb.x;
        const dy = anchor.y - orb.y;
        const dist = Math.hypot(dx, dy);

        // Core emitter point at radius edge
        const coreX = orb.x + (dx / dist) * coreRadius;
        const coreY = orb.y + (dy / dist) * coreRadius;

        // Base connecting line gradient
        const lineGrad = ctx.createLinearGradient(coreX, coreY, anchor.x, anchor.y);
        if (isHighlighted) {
          lineGrad.addColorStop(0, `rgba(233, 229, 255, ${baseAlpha})`);
          lineGrad.addColorStop(0.35, `rgba(196, 181, 253, ${baseAlpha * 0.85})`);
          lineGrad.addColorStop(0.75, `rgba(139, 92, 246, ${baseAlpha * 0.6})`);
          lineGrad.addColorStop(1, `rgba(139, 92, 246, ${baseAlpha * 0.25})`);
        } else {
          lineGrad.addColorStop(0, `rgba(167, 139, 250, ${baseAlpha})`);
          lineGrad.addColorStop(0.5, `rgba(139, 92, 246, ${baseAlpha * 0.65})`);
          lineGrad.addColorStop(1, `rgba(139, 92, 246, ${baseAlpha * 0.18})`);
        }

        // Highlight beam aura
        if (isHighlighted && !prefersReduced) {
          ctx.beginPath();
          ctx.moveTo(coreX, coreY);
          ctx.lineTo(anchor.x, anchor.y);
          ctx.strokeStyle = `rgba(139, 92, 246, 0.4)`;
          ctx.lineWidth = strokeWidth + 4;
          ctx.stroke();
        }

        // Base line stroke
        ctx.beginPath();
        ctx.moveTo(coreX, coreY);
        ctx.lineTo(anchor.x, anchor.y);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();

        // ── 5. Connected Sequence: Particle Traveling CARD -> CORE ──
        if (!prefersReduced && (!hasActive || isHighlighted)) {
          const cardPackets = packets[i];
          const speedMultiplier = isHighlighted ? 1.8 : 1.0;

          cardPackets.forEach((p) => {
            if (p.delay > 0) {
              p.delay--;
              return;
            }

            p.progress += p.speed * speedMultiplier;

            // When packet reaches the central core:
            if (p.progress >= 1.0) {
              p.progress = 0;
              p.delay = Math.floor(15 + Math.random() * 30);
              // Trigger ripple wave and core glow intensify!
              triggerCoreImpact(coreRadius, isHighlighted ? 0.45 : 0.22);
            }

            // Current position along the path from anchor (p=0) to core (p=1)
            const curX = anchor.x + (coreX - anchor.x) * p.progress;
            const curY = anchor.y + (coreY - anchor.y) * p.progress;

            // Tail start position (segment where particle soft illumination passes)
            const tailP = Math.max(0, p.progress - p.tailLength);
            const tailX = anchor.x + (coreX - anchor.x) * tailP;
            const tailY = anchor.y + (coreY - anchor.y) * tailP;

            // Illuminated line trail behind particle
            const trailGrad = ctx.createLinearGradient(tailX, tailY, curX, curY);
            const trailAlpha = isHighlighted ? 0.95 : p.alpha * 0.75;
            trailGrad.addColorStop(0, 'rgba(167, 139, 250, 0)');
            trailGrad.addColorStop(0.65, `rgba(167, 139, 250, ${trailAlpha * 0.45})`);
            trailGrad.addColorStop(1, `rgba(233, 229, 255, ${trailAlpha})`);

            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(curX, curY);
            ctx.strokeStyle = trailGrad;
            ctx.lineWidth = strokeWidth + 1.2;
            ctx.stroke();

            // Particle Head: Bright luminous core + soft violet aura
            const headAlpha = Math.sin(p.progress * Math.PI) * (isHighlighted ? 1.0 : p.alpha);

            // Outer soft glow aura
            ctx.beginPath();
            ctx.arc(curX, curY, isHighlighted ? p.size * 3.4 : p.size * 2.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${headAlpha * (isHighlighted ? 0.6 : 0.4)})`;
            ctx.fill();

            // Inner bright white node
            ctx.beginPath();
            ctx.arc(curX, curY, isHighlighted ? p.size * 1.25 : p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${headAlpha})`;
            ctx.fill();
          });
        }
      });

      // ── 6. Draw Small Particles Orbiting the Center Core ───────
      if (!prefersReduced) {
        orbitingMotes.forEach((mote) => {
          mote.angle += mote.speed;

          // Parametric 3D-like elliptical orbit
          const cosA = Math.cos(mote.angle);
          const sinA = Math.sin(mote.angle);
          const ex = cosA * mote.radiusX;
          const ey = sinA * mote.radiusY;

          // Rotate by tilt angle
          const cosT = Math.cos(mote.tiltAngle);
          const sinT = Math.sin(mote.tiltAngle);
          const px = orb.x + (ex * cosT - ey * sinT);
          const py = orb.y + (ex * sinT + ey * cosT);

          // 3D depth cue: when passing in front (sinA > 0), brighter; behind (sinA < 0), softer
          const depthCue = 0.65 + 0.35 * sinA;
          const moteAlpha = mote.baseAlpha * depthCue;

          // Outer glow
          ctx.beginPath();
          ctx.arc(px, py, mote.size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 139, 250, ${moteAlpha * 0.45})`;
          ctx.fill();

          // Core node
          ctx.beginPath();
          ctx.arc(px, py, mote.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${moteAlpha})`;
          ctx.fill();
        });
      }

      if (!prefersReduced) {
        raf = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [canvasRef, containerRef, highlightedCardIds, cardElementsRef]);
}

export default function HeroEcosystem({
  activeServiceId = null,
  onCardHover,
  activeCardId = null,
  onCardClick,
}: HeroEcosystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Determine which cards should be highlighted
  const highlightedCardIds = useMemo<EcosystemCardId[]>(() => {
    if (activeServiceId && SERVICE_CARD_MAP[activeServiceId]) {
      return SERVICE_CARD_MAP[activeServiceId];
    }
    if (activeCardId) {
      return [activeCardId];
    }
    return [];
  }, [activeServiceId, activeCardId]);

  const isAnyActive = highlightedCardIds.length > 0;

  useConnectionCanvas(canvasRef, containerRef, highlightedCardIds, cardElementsRef);

  const registerCardRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) {
      cardElementsRef.current.set(id, el);
    } else {
      cardElementsRef.current.delete(id);
    }
  }, []);

  const handleCardClick = (cardId: EcosystemCardId) => {
    const targetServiceId = CARD_SERVICE_MAP[cardId];
    if (onCardClick) {
      onCardClick(targetServiceId);
    } else {
      const el = document.getElementById(targetServiceId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', `#${targetServiceId}`);
      }
    }
  };

  return (
    <div className="hero-ecosystem" ref={containerRef} aria-label="Interactive services ecosystem visualization">
      {/* ── Background Canvas Layer for Connected Network Lines ── */}
      <canvas className="ecosystem-canvas" ref={canvasRef} aria-hidden="true" />

      {/* ── Central Abstract Glowing Digital Core (NO letter R, NO initials, NO logo) ── */}
      <div className={`ecosystem-orb-wrap ${isAnyActive ? 'is-active' : ''}`} aria-hidden="true">
        <div className="ecosystem-orb">
          {/* Layer 1: Soft purple holographic ambient glow */}
          <div className="orb-ambient" />

          {/* Layer 2: Concentric orbital rings with rotating arcs & celestial markers */}
          <div className="orb-ring orb-ring-1">
            <span className="orb-marker marker-1" />
          </div>
          <div className="orb-ring orb-ring-2">
            <span className="orb-arc arc-1" />
            <span className="orb-marker marker-2" />
          </div>
          <div className="orb-ring orb-ring-3">
            <span className="orb-arc arc-2" />
          </div>

          {/* Layer 3: Concentric Energy Wave Ripples expanding outward */}
          <div className="orb-waves-layer">
            <div className="orb-energy-wave wave-1" />
            <div className="orb-energy-wave wave-2" />
          </div>

          {/* Layer 4: Abstract glowing digital energy core sphere */}
          <div className="orb-core">
            <div className="orb-core-glow" />
            <div className="orb-core-plasma" />
            <div className="orb-core-corona" />
            <div className="orb-core-nucleus" />
          </div>
        </div>
      </div>

      {/* ── Four Surrounding Service Capability Cards ── */}
      {ECOSYSTEM_CARDS.map(({ id, label, desc, Icon, position }) => {
        const isHighlighted = highlightedCardIds.includes(id);
        const isDimmed = isAnyActive && !isHighlighted;

        return (
          <div
            key={id}
            ref={(el) => registerCardRef(id, el)}
            className={`ecosystem-card ecosystem-card--${position} ${
              isHighlighted ? 'is-highlighted' : ''
            } ${isDimmed ? 'is-dimmed' : ''}`}
            onMouseEnter={() => onCardHover?.(id)}
            onMouseLeave={() => onCardHover?.(null)}
            onClick={() => handleCardClick(id)}
            role="button"
            tabIndex={0}
            aria-label={`${label}: ${desc}. Click to explore service details.`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick(id);
              }
            }}
          >
            <div className="ecosystem-card-icon">
              <Icon size={18} weight="duotone" />
            </div>
            <div className="ecosystem-card-text">
              <span className="ecosystem-card-label">{label}</span>
              <span className="ecosystem-card-desc">{desc}</span>
            </div>
            <div className="ecosystem-card-edge-glow" aria-hidden="true" />
          </div>
        );
      })}

      {/* ── Scroll to Explore Indicator ── */}
      <a
        href="#website-development"
        className="ecosystem-scroll-cue"
        aria-label="Scroll down to explore core services"
        onClick={(e) => {
          e.preventDefault();
          const target = document.getElementById('website-development');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.pushState(null, '', '#website-development');
          }
        }}
      >
        <span className="scroll-cue-text">SCROLL TO EXPLORE</span>
        <div className="scroll-cue-arrow" aria-hidden="true">
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
            <path
              d="M7 2v14M2 11l5 5 5-5"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </a>
    </div>
  );
}

