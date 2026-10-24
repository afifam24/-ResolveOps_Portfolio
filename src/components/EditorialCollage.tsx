import { useState, useCallback, useRef } from 'react';
import { ArrowUpRight, Code, Eye, Sparkle, TrendUp } from '@phosphor-icons/react';
import './EditorialCollage.css';

export default function EditorialCollage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [hoveredPanel, setHoveredPanel] = useState<string | null>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
    setHoveredPanel(null);
  }, []);

  const offsetX = mouseOffset.x;
  const offsetY = mouseOffset.y;

  return (
    <div
      className="editorial-collage"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Art-directed creative studio collage"
    >
      {/* ── Background Editorial Annotation Watermark ── */}
      <div className="collage-grid-lines" aria-hidden="true" />
      <div className="collage-spec-stamp" aria-hidden="true">
        <span>RESOLVEOPS // ARCH. SPEC 2026</span>
        <span>FIG. 01 — MULTIDISCIPLINARY</span>
      </div>

      {/* ── Element 1: Cropped Luxury Website Interface Preview ── */}
      <div
        className={`collage-layer layer-website ${hoveredPanel === 'web' ? 'is-hovered' : ''}`}
        style={{
          transform: `translate3d(${offsetX * 14}px, ${offsetY * 14}px, 0) rotate(-1.5deg)`,
        }}
        onMouseEnter={() => setHoveredPanel('web')}
        onMouseLeave={() => setHoveredPanel(null)}
      >
        <div className="panel-tag-header">
          <span className="panel-spec-num">01 / DIGITAL INTERFACE</span>
          <ArrowUpRight size={14} className="panel-arrow" />
        </div>
        <div className="panel-site-mockup">
          <div className="mockup-nav">
            <span className="mockup-brand">ATELIER</span>
            <div className="mockup-links">
              <span className="mockup-link-dot" />
              <span className="mockup-link-dot" />
              <span className="mockup-link-dot" />
            </div>
          </div>
          <div className="mockup-hero">
            <span className="mockup-hero-label">CRAFTED EXPERIENCES</span>
            <h4 className="mockup-hero-headline">Meaningful Form & Function</h4>
            <div className="mockup-palette">
              <span className="swatch-color color-ivory" />
              <span className="swatch-color color-violet" />
              <span className="swatch-color color-black" />
            </div>
          </div>
        </div>
        <div className="layer-caption">
          <span>SPEC: INTERACTION DESIGN</span>
          <span className="caption-status">LIVE SYSTEM</span>
        </div>
      </div>

      {/* ── Element 2: Abstract Browser Window ── */}
      <div
        className={`collage-layer layer-browser ${hoveredPanel === 'browser' ? 'is-hovered' : ''}`}
        style={{
          transform: `translate3d(${offsetX * -18}px, ${offsetY * -18}px, 0) rotate(1.8deg)`,
        }}
        onMouseEnter={() => setHoveredPanel('browser')}
        onMouseLeave={() => setHoveredPanel(null)}
      >
        <div className="browser-chrome">
          <div className="browser-dots">
            <span className="b-dot" />
            <span className="b-dot" />
            <span className="b-dot" />
          </div>
          <div className="browser-url-pill">
            <span className="url-secure-lock" />
            <span className="url-text">resolveops.studio/deploy</span>
          </div>
          <Code size={13} className="browser-code-icon" />
        </div>
        <div className="browser-canvas">
          <div className="browser-wireframe-row">
            <div className="wire-col-left">
              <div className="wire-bar bar-long" />
              <div className="wire-bar bar-medium" />
              <div className="wire-chip-row">
                <span className="wire-chip chip-active">React 19</span>
                <span className="wire-chip">Vite</span>
                <span className="wire-chip">CSS</span>
              </div>
            </div>
            <div className="wire-col-right">
              <div className="wire-block-featured" />
            </div>
          </div>
        </div>
        <div className="browser-meta-strip">
          <span className="browser-ping-dot" />
          <span className="browser-status-text">Production Cluster: Active</span>
          <span className="browser-ms">18ms</span>
        </div>
      </div>

      {/* ── Element 3: Electric-Violet Typographic Poster ── */}
      <div
        className={`collage-layer layer-poster ${hoveredPanel === 'poster' ? 'is-hovered' : ''}`}
        style={{
          transform: `translate3d(${offsetX * 24}px, ${offsetY * 24}px, 0) rotate(-3.2deg)`,
        }}
        onMouseEnter={() => setHoveredPanel('poster')}
        onMouseLeave={() => setHoveredPanel(null)}
      >
        <div className="poster-inner">
          <div className="poster-top">
            <Sparkle size={16} weight="fill" className="poster-star" />
            <span className="poster-year">MMXXVI</span>
          </div>
          <div className="poster-center">
            <span className="poster-word word-1">DESIGN</span>
            <span className="poster-word word-symbol">×</span>
            <span className="poster-word word-2">ENGINE</span>
          </div>
          <div className="poster-bottom">
            <span className="poster-caption">COLLECTIVE DISCIPLINE</span>
            <span className="poster-index">№ 07</span>
          </div>
        </div>
      </div>

      {/* ── Element 4: Miniature Editorial Analytics Visualization ── */}
      <div
        className={`collage-layer layer-analytics ${hoveredPanel === 'analytics' ? 'is-hovered' : ''}`}
        style={{
          transform: `translate3d(${offsetX * -12}px, ${offsetY * -12}px, 0) rotate(2.4deg)`,
        }}
        onMouseEnter={() => setHoveredPanel('analytics')}
        onMouseLeave={() => setHoveredPanel(null)}
      >
        <div className="analytics-header">
          <div className="analytics-title-group">
            <TrendUp size={15} weight="bold" className="analytics-icon" />
            <span className="analytics-title">COMPOUND GROWTH</span>
          </div>
          <span className="analytics-badge">+184%</span>
        </div>
        <div className="analytics-graph-wrap">
          <svg className="analytics-svg" viewBox="0 0 160 52" fill="none">
            <defs>
              <linearGradient id="editorialGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 5 44 C 35 42 60 30 85 24 C 110 18 135 12 155 4 L 155 50 L 5 50 Z"
              fill="url(#editorialGrad)"
            />
            <path
              d="M 5 44 C 35 42 60 30 85 24 C 110 18 135 12 155 4"
              stroke="#6d28d9"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="85" cy="24" r="3" fill="#6d28d9" />
            <circle cx="155" cy="4" r="4" fill="#121114" />
            <circle cx="155" cy="4" r="7" stroke="#6d28d9" strokeWidth="1.2" />
          </svg>
        </div>
        <div className="analytics-footer">
          <span className="analytics-axis-label">Q1 // ATTRIBUTION</span>
          <span className="analytics-metric-val">3.8x LTV</span>
        </div>
      </div>

      {/* ── Element 5: Geometric Violet Arch Badge ── */}
      <div
        className="collage-layer layer-geometric"
        style={{
          transform: `translate3d(${offsetX * 8}px, ${offsetY * 8}px, 0)`,
        }}
        aria-hidden="true"
      >
        <div className="geometric-arch">
          <div className="arch-inner-ring" />
          <span className="arch-text">STUDIO</span>
        </div>
      </div>

      {/* ── Element 6: Floating Typographic Coordinate Tag ── */}
      <div
        className="collage-layer layer-stamp"
        style={{
          transform: `translate3d(${offsetX * -6}px, ${offsetY * -6}px, 0)`,
        }}
        aria-hidden="true"
      >
        <span className="stamp-border">AUTHENTIC CRAFT</span>
      </div>
    </div>
  );
}
