import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import FloatingExperience from './FloatingExperience';
import './StudioIntro.css';

export default function StudioIntro() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section studio-intro" id="studio" aria-label="The Studio — Growth Experience">
      {/* Background ambient lighting effects */}
      <div className="si-ambient-glow si-ambient-top" aria-hidden="true" />
      <div className="si-ambient-glow si-ambient-center" aria-hidden="true" />
      <div className="si-transition-bar" aria-hidden="true" />

      <div className="container">
        <div className="studio-intro-grid">

          {/* LEFT: Text narrative matching the reference screenshot */}
          <div
            ref={contentRef}
            className={`studio-intro-content ${revealed ? 'si-revealed' : ''}`}
          >
            <span className="si-eyebrow">
              RESOLVE OPS / GROWTH STUDIO
            </span>

            <h2 className="si-headline">
              We turn digital ideas<br />
              into <span className="si-accent-word">business growth.</span>
            </h2>

            <p className="si-body">
              We build websites, automate workflows, and transform business data
              into clear insights—helping businesses attract enquiries and operate
              more efficiently.
            </p>

            {/* Action buttons matching the reference image */}
            <div className="si-actions">
              <Link to="/contact" className="si-btn-primary">
                <span>Start a project</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link to="/work" className="si-btn-secondary">
                <span>Explore our work</span>
                <ArrowUpRight size={16} weight="bold" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Kiosk & Floating Digital Experience */}
          <div className="studio-intro-experience">
            <FloatingExperience />
          </div>

        </div>

        {/* Scroll To Explore indicator matching bottom center of image */}
        <div className="si-scroll-explore" aria-hidden="true">
          <span className="si-scroll-label">SCROLL TO EXPLORE</span>
          <div className="si-scroll-circle">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v8.5M2 6.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="si-scroll-guide-line" />
        </div>
      </div>
    </section>
  );
}
