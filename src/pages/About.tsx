import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Sparkle } from '@phosphor-icons/react';
import { brand, processSteps } from '../data/content';
import Reveal from '../components/Reveal';
import EditorialCollage from '../components/EditorialCollage';
import ProcessTimeline from '../components/ProcessTimeline';
import './About.css';

export default function About() {
  return (
    <div className="about-editorial-page">
      {/* ── 1. Asymmetrical Editorial Hero ────────────────────────── */}
      <section className="editorial-hero" aria-label="About ResolveOPS">
        <div className="editorial-container">
          {/* Top Editorial Label Bar */}
          <div className="hero-editorial-meta">
            <div className="meta-left">
              <span className="meta-dot" />
              <span className="editorial-label">ABOUT THE STUDIO</span>
            </div>
            <div className="meta-right">
              <span className="editorial-label">INDEPENDENT MINDS. CONNECTED WORK.</span>
              <span className="meta-sep">/</span>
              <span className="editorial-label label-dim">EST. 2024</span>
            </div>
          </div>

          <div className="hero-editorial-layout">
            {/* Left Narrative Stage */}
            <div className="hero-text-col">
              <Reveal>
                <div className="hero-subhead-pill">
                  <Sparkle size={12} weight="fill" className="pill-sparkle" />
                  <span>The Collective Growth Studio</span>
                </div>
              </Reveal>

              <Reveal delay={60}>
                <h1 className="editorial-hero-title">
                  GOOD WORK.<br />
                  <span className="hero-accent-text">BETTER TOGETHER.</span>
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="editorial-hero-lead">
                  ResolveOPS is an independent growth studio bringing design, development, marketing,
                  automation, and analytics together to build meaningful digital experiences.
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="hero-manifesto-quote">
                  <span className="quote-bar" />
                  <p className="quote-text">
                    "We build what businesses actually need — combining freelance craft
                    with unified agency execution."
                  </p>
                </div>
              </Reveal>
            </div>

            {/* Right Art-Directed Visual Collage */}
            <div className="hero-visual-col" aria-label="Art-directed creative studio composition">
              <Reveal delay={100}>
                <EditorialCollage />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Creative Studio Story Section ──────────────────────── */}
      <section className="editorial-story" aria-label="Studio Manifesto">
        <div className="editorial-container">
          <div className="story-meta-header">
            <span className="story-stamp">[01 // MANIFESTO & PERSPECTIVE]</span>
            <span className="story-stamp stamp-right">RESOLVEOPS GROWTH STUDIO</span>
          </div>

          <div className="story-grid">
            <div className="story-left">
              <Reveal>
                <h2 className="story-display-title">
                  One studio.<br />
                  Multiple perspectives.<br />
                  <span className="text-violet">Work that connects.</span>
                </h2>
              </Reveal>
            </div>

            <div className="story-right">
              <Reveal delay={100}>
                <p className="story-paragraph story-paragraph--lead">
                  Traditional agencies divide projects into isolated silos. Designers invent without
                  respecting code, engineers build without brand feeling, and marketers operate on
                  speculation.
                </p>
              </Reveal>

              <Reveal delay={160}>
                <p className="story-paragraph">
                  ResolveOPS brings design, development, marketing, automation,
                  and analytics together under one roof. By connecting creative
                  thinking with technical execution and business strategy, we
                  build cohesive digital experiences that help businesses grow.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="story-footnote">
                  <span className="footnote-num">01.1</span>
                  <span className="footnote-text">
                    Collaborative thinking. Connected execution. Meaningful results.
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Three Large Horizontal Editorial Blocks (We Design, We Develop, We Grow) ── */}
      <section className="editorial-disciplines" aria-label="Our disciplines">
        <div className="editorial-container">
          <div className="disciplines-header">
            <Reveal>
              <div className="disciplines-label-row">
                <span className="editorial-tag">[02 // CORE DISCIPLINES]</span>
                <span className="disciplines-subtag">HOW WE BUILD RESULTS</span>
              </div>
              <h2 className="disciplines-section-title">
                Three interconnected pillars of digital growth
              </h2>
            </Reveal>
          </div>

          <div className="disciplines-list">
            {/* BLOCK 1: WE DESIGN */}
            <Reveal>
              <div className="discipline-block discipline-block--design" tabIndex={0}>
                <div className="discipline-meta-row">
                  <span className="disc-index">01 / INTERFACE & BRAND</span>
                  <ArrowUpRight size={18} className="disc-arrow" />
                </div>

                <div className="discipline-main-row">
                  <div className="discipline-info">
                    <h3 className="discipline-title">We Design</h3>
                    <p className="discipline-lead-desc">
                      Clear interfaces and visual systems that make your business easy to understand
                      and engaging to interact with.
                    </p>
                    <div className="discipline-hover-reveal">
                      <p className="discipline-full-text">
                        Every design decision serves a purpose — helping your visitors find what
                        they need and take the next step. From typography scales to component
                        tokens, we craft memorable brand identities and frictionless digital journeys.
                      </p>
                    </div>
                  </div>

                  {/* Miniature Interface Specimen Preview */}
                  <div className="discipline-preview-box preview-box--design" aria-hidden="true">
                    <div className="specimen-card">
                      <div className="specimen-header">
                        <span className="specimen-title">TYPE & GRID SPECIMEN</span>
                        <span className="specimen-tag">v2.4</span>
                      </div>
                      <div className="specimen-body">
                        <div className="type-sample">
                          <span className="type-large">Aa</span>
                          <div className="type-meta">
                            <span className="type-name">Manrope / Grotesk</span>
                            <span className="type-weights">400 · 600 · 800</span>
                          </div>
                        </div>
                        <div className="specimen-swatches">
                          <div className="specimen-swatch swatch-ivory">
                            <span>#FBFAF7</span>
                          </div>
                          <div className="specimen-swatch swatch-violet">
                            <span>#6D28D9</span>
                          </div>
                          <div className="specimen-swatch swatch-carbon">
                            <span>#121114</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* BLOCK 2: WE DEVELOP */}
            <Reveal delay={100}>
              <div className="discipline-block discipline-block--develop" tabIndex={0}>
                <div className="discipline-meta-row">
                  <span className="disc-index">02 / CODE & INFRASTRUCTURE</span>
                  <ArrowUpRight size={18} className="disc-arrow" />
                </div>

                <div className="discipline-main-row">
                  <div className="discipline-info">
                    <h3 className="discipline-title">We Develop</h3>
                    <p className="discipline-lead-desc">
                      Responsive websites, automated workflows, CRM systems, and custom tools —
                      built to work reliably across devices.
                    </p>
                    <div className="discipline-hover-reveal">
                      <p className="discipline-full-text">
                        We handle the technical complexity so you don't have to. Engineered with
                        modern React, lightweight CSS, resilient APIs, and seamless automation pipelines
                        that scale effortlessly with your company.
                      </p>
                    </div>
                  </div>

                  {/* Miniature Development & Architecture Preview */}
                  <div className="discipline-preview-box preview-box--develop" aria-hidden="true">
                    <div className="dev-browser-card">
                      <div className="dev-card-header">
                        <div className="dev-dots">
                          <span className="dev-dot" />
                          <span className="dev-dot" />
                          <span className="dev-dot" />
                        </div>
                        <span className="dev-title">sys.deploy // active</span>
                        <span className="dev-badge-green">200 OK</span>
                      </div>
                      <div className="dev-card-body">
                        <div className="dev-pipeline-diagram">
                          <div className="pipeline-step step-active">
                            <span className="step-label">UI Component</span>
                          </div>
                          <span className="pipeline-connector">→</span>
                          <div className="pipeline-step">
                            <span className="step-label">Edge API</span>
                          </div>
                          <span className="pipeline-connector">→</span>
                          <div className="pipeline-step step-success">
                            <span className="step-label">Engine</span>
                          </div>
                        </div>
                        <div className="dev-code-snippet">
                          <code>const studio = await resolveOPS.deploy(&#123; mode: 'scale' &#125;);</code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* BLOCK 3: WE GROW */}
            <Reveal delay={200}>
              <div className="discipline-block discipline-block--grow" tabIndex={0}>
                <div className="discipline-meta-row">
                  <span className="disc-index">03 / ANALYTICS & MARKET ACCELERATION</span>
                  <ArrowUpRight size={18} className="disc-arrow" />
                </div>

                <div className="discipline-main-row">
                  <div className="discipline-info">
                    <h3 className="discipline-title">We Grow</h3>
                    <p className="discipline-lead-desc">
                      SEO, analytics, and marketing systems that bring the right people to your business
                      and help you understand what's working.
                    </p>
                    <div className="discipline-hover-reveal">
                      <p className="discipline-full-text">
                        Growth isn't a one-time effort — it's the continuous process of learning and
                        improving. We implement structured attribution, conversion tracking, and
                        retention funnels that provide transparent proof of value.
                      </p>
                    </div>
                  </div>

                  {/* Miniature Analytics Visualization Preview */}
                  <div className="discipline-preview-box preview-box--grow" aria-hidden="true">
                    <div className="growth-chart-card">
                      <div className="chart-meta-header">
                        <span className="chart-tag">CONTINUOUS PERFORMANCE</span>
                        <span className="chart-metric-badge">+3.8x Lift</span>
                      </div>
                      <div className="chart-canvas-wrap">
                        <svg className="growth-editorial-svg" viewBox="0 0 240 68" fill="none">
                          <defs>
                            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6d28d9" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#6d28d9" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <line x1="0" y1="20" x2="240" y2="20" stroke="rgba(18, 17, 20, 0.08)" strokeDasharray="3 3" />
                          <line x1="0" y1="46" x2="240" y2="46" stroke="rgba(18, 17, 20, 0.08)" strokeDasharray="3 3" />
                          <path
                            d="M 5 56 C 50 54 85 40 120 32 C 160 22 195 14 235 6 L 235 66 L 5 66 Z"
                            fill="url(#growthFill)"
                          />
                          <path
                            d="M 5 56 C 50 54 85 40 120 32 C 160 22 195 14 235 6"
                            stroke="#6d28d9"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                          />
                          <circle cx="120" cy="32" r="3.5" fill="#6d28d9" />
                          <circle cx="235" cy="6" r="4.5" fill="#121114" />
                          <circle cx="235" cy="6" r="8" stroke="#6d28d9" strokeWidth="1.2" />
                        </svg>
                      </div>
                      <div className="chart-meta-footer">
                        <span>BASELINE: ORGANIC</span>
                        <span className="metric-peak">PEAK: VELOCITY ACCELERATED</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 4. How We Work (Process Timeline) ──────────────────────── */}
      <section className="editorial-process" aria-label="How we work">
        <div className="editorial-container">
          <div className="process-editorial-header">
            <Reveal>
              <span className="editorial-tag">[03 // EXECUTION FRAMEWORK]</span>
              <h2 className="editorial-section-title">How we approach every project</h2>
              <p className="editorial-section-subtitle">
                Every project follows the same thoughtful structure — from the first conversation
                to the compounding work that happens after launch.
              </p>
            </Reveal>
          </div>

          <ProcessTimeline steps={processSteps} />
        </div>
      </section>

      {/* ── 5. What We Believe (Values) ────────────────────────────── */}
      <section className="editorial-values" aria-label="What we believe">
        <div className="editorial-container">
          <div className="values-editorial-header">
            <Reveal>
              <span className="editorial-tag">[04 // STUDIO PRINCIPLES]</span>
              <h2 className="editorial-section-title">What we believe</h2>
            </Reveal>
          </div>

          <div className="editorial-values-grid">
            <Reveal delay={60}>
              <div className="editorial-value-item">
                <span className="value-num">01</span>
                <h4 className="value-item-title">Clarity over complexity</h4>
                <p className="value-item-desc">
                  The best solutions are the ones your team can understand and use. We build
                  straightforward systems that solve real problems without unnecessary complication.
                </p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="editorial-value-item">
                <span className="value-num">02</span>
                <h4 className="value-item-title">Results over deliverables</h4>
                <p className="value-item-desc">
                  A website that nobody visits, a dashboard nobody reads, or an automation nobody
                  uses — those aren't results. We measure our work by what it enables for your business.
                </p>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="editorial-value-item">
                <span className="value-num">03</span>
                <h4 className="value-item-title">Honest communication</h4>
                <p className="value-item-desc">
                  We tell you what we can do, what we can't, and what we'd recommend.
                  No inflated promises, no vague timelines, no scope that keeps growing without a conversation.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 6. Editorial CTA Section ──────────────────────────────── */}
      <section className="editorial-cta" aria-label="Get started">
        <div className="editorial-container">
          <div className="cta-editorial-box">
            <Reveal>
              <span className="cta-pre-label">[INITIATE COLLABORATION]</span>
              <h2 className="cta-editorial-heading">
                Ready to build something <span className="text-violet">meaningful?</span>
              </h2>
            </Reveal>

            <Reveal delay={100}>
              <p className="cta-editorial-sub">
                Let's discuss how our multidisciplinary collective can accelerate your digital vision.
              </p>
            </Reveal>

            <Reveal delay={160}>
              <Link to="/contact" className="editorial-cta-btn">
                <span>Start a project</span>
                <ArrowRight size={18} weight="bold" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
