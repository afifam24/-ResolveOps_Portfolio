import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { services } from '../data/content';
import ServiceVisual from '../components/ServiceVisual';
import HeroEcosystem from '../components/HeroEcosystem';
import Reveal from '../components/Reveal';
import './Services.css';

export default function Services() {
  const location = useLocation();

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

  return (
    <>
      {/* ── Services Hero — Split Layout ─────────────── */}
      <section className="services-hero section" aria-label="Services">
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
              <div className="services-hero-nav">
                {services.map((service) => (
                  <a
                    key={service.id}
                    href={`#${service.id}`}
                    className="services-nav-pill"
                  >
                    <span className="services-nav-num">{service.number}</span>
                    <span className="services-nav-label">{service.title}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Interactive Ecosystem Visual */}
          <Reveal delay={160} direction="right" className="services-hero-right">
            <HeroEcosystem />
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
                    <span className="service-block-number">{service.number}</span>
                    <h2 className="service-block-title">{service.title}</h2>
                  </Reveal>
                  <Reveal delay={80}>
                    <p className="service-block-description">{service.fullDescription}</p>
                  </Reveal>

                  <Reveal delay={160}>
                    <div className="service-details-grid">
                      <div className="service-detail">
                        <h4 className="detail-label">What's included</h4>
                        <ul className="detail-list">
                          {service.includes.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="service-detail">
                        <h4 className="detail-label">Who it's for</h4>
                        <p className="detail-text">{service.whoItsFor}</p>
                        <h4 className="detail-label" style={{ marginTop: 'var(--space-lg)' }}>
                          The outcome
                        </h4>
                        <p className="detail-text">{service.outcome}</p>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={240}>
                    <Link
                      to={`/contact?service=${service.id}`}
                      className="btn btn-primary service-block-cta"
                    >
                      Discuss this service <ArrowRight size={14} weight="bold" />
                    </Link>
                  </Reveal>
                </div>

                <Reveal delay={120} direction={isEven ? 'right' : 'left'}>
                  <div className="service-block-visual">
                    <ServiceVisual serviceId={service.id} size="large" />
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
