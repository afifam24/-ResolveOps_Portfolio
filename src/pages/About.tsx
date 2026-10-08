import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { brand, processSteps } from '../data/content';
import Reveal from '../components/Reveal';
import NetworkCanvas from '../components/NetworkCanvas';
import ProcessTimeline from '../components/ProcessTimeline';
import './About.css';

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="about-hero section" aria-label="About ResolveOPS">
        {/* Network animation — sits behind all content */}
        <div className="about-network-bg" aria-hidden="true">
          <NetworkCanvas />
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <Reveal>
            <h1 className="about-hero-title">
              A freelance community that builds
              <span className="text-accent"> what businesses actually need.</span>
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="about-hero-subtitle">
              ResolveOPS is a Growth studio — a team of freelancers working together to deliver
              design, development, marketing, automation, and analytics as one connected service.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section about-philosophy" aria-label="Our approach">
        <div className="container">
          <div className="philosophy-grid">
            <Reveal>
              <div className="philosophy-item" tabIndex={0}>
                <h3 className="philosophy-number">We Design</h3>
                <p className="philosophy-text">
                  Clear interfaces and visual systems that make your business easy to understand
                  and engaging to interact with. Every design decision serves a purpose — helping
                  your visitors find what they need and take the next step.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="philosophy-item" tabIndex={0}>
                <h3 className="philosophy-number">We Develop</h3>
                <p className="philosophy-text">
                  Responsive websites, automated workflows, CRM systems, and custom tools —
                  built to work reliably across devices and grow with your business. We handle the
                  technical complexity so you don't have to.
                </p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="philosophy-item" tabIndex={0}>
                <h3 className="philosophy-number">We Grow</h3>
                <p className="philosophy-text">
                  SEO, analytics, and marketing systems that bring the right people to your business
                  and help you understand what's working. Growth isn't a one-time effort — it's
                  the continuous process of learning and improving.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="section about-process" aria-label="How we work">
        <div className="container">
          <div className="about-process-header">
            <Reveal>
              <h2 className="about-section-title">How we approach every project</h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="about-section-subtitle">
                Every project follows the same thoughtful structure — from the first conversation
                to the work that happens after launch.
              </p>
            </Reveal>
          </div>

          <ProcessTimeline steps={processSteps} />
        </div>
      </section>

      {/* Values */}
      <section className="section about-values" aria-label="What we believe">
        <div className="container">
          <Reveal>
            <h2 className="about-section-title">What we believe</h2>
          </Reveal>
          <div className="values-grid">
            <Reveal delay={60}>
              <div className="value-card">
                <h4 className="value-title">Clarity over complexity</h4>
                <p className="value-text">
                  The best solutions are the ones your team can understand and use. We build 
                  straightforward systems that solve real problems without unnecessary complication.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="value-card">
                <h4 className="value-title">Results over deliverables</h4>
                <p className="value-text">
                  A website that nobody visits, a dashboard nobody reads, or an automation nobody 
                  uses — those aren't results. We measure our work by what it enables for your business.
                </p>
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="value-card">
                <h4 className="value-title">Honest communication</h4>
                <p className="value-text">
                  We tell you what we can do, what we can't, and what we'd recommend. 
                  No inflated promises, no vague timelines, no scope that keeps growing without a conversation.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section about-cta" aria-label="Get started">
        <div className="container" style={{ textAlign: 'center' }}>
          <Reveal>
            <h2 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-xl)' }}>
              {brand.ctaHeading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Start a project <ArrowRight size={16} weight="bold" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
