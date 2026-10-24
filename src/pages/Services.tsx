import { useEffect, useState, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { services } from '../data/content';
import ServiceVisual from '../components/ServiceVisual';
import HeroEcosystem, { EcosystemCardId } from '../components/HeroEcosystem';
import Reveal from '../components/Reveal';
import './Services.css';

export default function Services() {
  const location = useLocation();
  const heroRef = useRef<HTMLElement>(null);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<EcosystemCardId | null>(null);

  // Scroll to service anchor if hash is present
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  // Subtle cursor-responsive light effect on desktop
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroRef.current.style.setProperty('--mouse-x', `${x}px`);
    heroRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  const handlePillClick = (e: React.MouseEvent<HTMLAnchorElement>, serviceId: string) => {
    e.preventDefault();
    const el = document.getElementById(serviceId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', `#${serviceId}`);
    }
  };

  // Determine if pill should be highlighted from card hover
  const isPillHighlighted = (serviceId: string) => {
    if (activeServiceId === serviceId) return true;
    if (hoveredCardId) {
      if (hoveredCardId === 'design' && (serviceId === 'ui-ux-design' || serviceId === 'website-development')) return true;
      if (hoveredCardId === 'development' && (serviceId === 'website-development' || serviceId === 'ui-ux-design')) return true;
      if (hoveredCardId === 'analytics' && (serviceId === 'business-analytics' || serviceId === 'seo-digital-marketing')) return true;
      if (hoveredCardId === 'automation' && (serviceId === 'ai-automation' || serviceId === 'crm-workflow-automation')) return true;
    }
    return false;
  };

  return (
    <>
      {/* ── Services Hero — Split Layout ─────────────── */}
      <section
        ref={heroRef}
        className="services-hero section"
        aria-label="Services overview and ecosystem"
        onPointerMove={handlePointerMove}
      >
        {/* Subtle background ambient particles */}
        <div className="services-hero-ambient-particles" aria-hidden="true">
          <span className="hero-particle particle-p1" />
          <span className="hero-particle particle-p2" />
          <span className="hero-particle particle-p3" />
          <span className="hero-particle particle-p4" />
          <span className="hero-particle particle-p5" />
          <span className="hero-particle particle-p6" />
        </div>

        <div className="container services-hero-inner">
          {/* LEFT — Heading & intro */}
          <div className="services-hero-left">
            <Reveal>
              <h1 className="services-hero-title">
                Everything your business needs to{' '}
                <span className="text-accent">get found, earn trust, and grow.</span>
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="services-hero-subtitle">
                Six core services covering your complete digital presence — from the website
                your customers see to the systems that power your business behind the scenes.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="services-hero-nav" role="navigation" aria-label="Services list">
                {services.map((service) => {
                  const isHighlighted = isPillHighlighted(service.id);
                  return (
                    <a
                      key={service.id}
                      href={`#${service.id}`}
                      className={`services-nav-pill ${isHighlighted ? 'is-highlighted' : ''}`}
                      onMouseEnter={() => setActiveServiceId(service.id)}
                      onMouseLeave={() => setActiveServiceId(null)}
                      onClick={(e) => handlePillClick(e, service.id)}
                      aria-label={`Jump to ${service.number} ${service.title}`}
                    >
                      <span className="services-nav-num">{service.number}</span>
                      <span className="services-nav-label">{service.title}</span>
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Interactive Ecosystem Visual */}
          <Reveal delay={160} direction="right" className="services-hero-right">
            <HeroEcosystem
              activeServiceId={activeServiceId}
              onCardHover={setHoveredCardId}
              activeCardId={hoveredCardId}
              onCardClick={(serviceId: string) => {
                const el = document.getElementById(serviceId);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  window.history.pushState(null, '', `#${serviceId}`);
                }
              }}
            />
          </Reveal>
        </div>
      </section>

      {/* ── Service Blocks ────────────────────────────── */}
      {services.map((service, i) => {
        const isEven = i % 2 === 0;
        return (
          <section
            key={service.id}
            id={service.id}
            className={`service-block section ${isEven ? '' : 'service-block-alt'}`}
            aria-label={`Service: ${service.title}`}
            data-index={service.number}
          >
            <div className="container">
              <div className={`service-block-layout ${isEven ? '' : 'reversed'}`}>
                <div className="service-block-content">
                  <Reveal>
                    <div className="service-block-meta">
                      <span className="service-block-number">{service.number}</span>
                      <span className="service-meta-divider" aria-hidden="true">/</span>
                      <span className="service-block-discipline">DISCIPLINE 0{i + 1}</span>
                    </div>
                    <h2 className="service-block-title">{service.title}</h2>
                  </Reveal>
                  <Reveal delay={80}>
                    <p className="service-block-description">{service.fullDescription}</p>
                  </Reveal>

                  <Reveal delay={160}>
                    <div className="service-details-grid">
                      <div className="service-detail service-detail-included">
                        <div className="detail-card-head">
                          <span className="detail-badge">CAPABILITIES</span>
                          <h4 className="detail-label">What's included</h4>
                        </div>
                        <ul className="detail-list">
                          {service.includes.map((item) => (
                            <li key={item}>
                              <span className="detail-check-icon" aria-hidden="true">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="service-details-stack">
                        <div className="service-detail service-detail-target">
                          <div className="detail-card-head">
                            <span className="detail-badge">PROFILE</span>
                            <h4 className="detail-label">Who it's for</h4>
                          </div>
                          <p className="detail-text">{service.whoItsFor}</p>
                        </div>
                        <div className="service-detail service-detail-outcome">
                          <div className="detail-card-head">
                            <span className="detail-badge detail-badge-impact">DELIVERABLE IMPACT</span>
                            <h4 className="detail-label">The outcome</h4>
                          </div>
                          <p className="detail-text detail-outcome-text">{service.outcome}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={240}>
                    <div className="service-block-actions">
                      <Link
                        to={`/contact?service=${service.id}`}
                        className="btn btn-primary service-block-cta"
                      >
                        Discuss this service <ArrowRight size={14} weight="bold" />
                      </Link>
                    </div>
                  </Reveal>
                </div>

                <Reveal delay={120} direction={isEven ? 'right' : 'left'} className="service-visual-col">
                  <div className="service-visual-wrapper">
                    <div className="service-visual-header">
                      <span className="service-visual-number" aria-hidden="true">
                        {service.number}
                      </span>
                    </div>
                    <div className="service-block-visual">
                      <ServiceVisual serviceId={service.id} size="large" />
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            {i < services.length - 1 && (
              <div className="container">
                <hr className="divider" />
              </div>
            )}
          </section>
        );
      })}

      {/* ── Bottom CTA ─────────────────────────────────── */}
      <section className="section services-cta" aria-label="Get started">
        <div className="container" style={{ textAlign: 'center' }}>
          <Reveal>
            <h2 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-xl)' }}>
              Not sure which service you need?
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto var(--space-2xl)' }}>
              Tell us about your business and goals — we'll help you figure out where to start.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Start a conversation <ArrowRight size={16} weight="bold" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
