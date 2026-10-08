import { Link } from 'react-router-dom';
import { ArrowUp, EnvelopeSimple, InstagramLogo } from '@phosphor-icons/react';
import { brand, navigation, projects } from '../data/content';
import Reveal from './Reveal';
import './SiteFooter.css';

export default function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      {/* Background Watermark Layer - subtle integrated background watermark */}
      <div className="footer-watermark" aria-hidden="true">
        ResolveOPS
      </div>

      <div className="container footer-inner">
        <Reveal>
          <div className="footer-top">
            {/* Column 1: Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img src="/assets/logo.png" alt="ResolveOPS Logo" className="footer-logo-icon" />
                <div className="footer-logo-text">
                  <span className="footer-logo-name">{brand.name}</span>
                  <span className="footer-logo-subtitle">GROWTH STUDIO</span>
                </div>
              </div>
              <p className="footer-tagline">{brand.tagline}</p>
              <p className="footer-description">{brand.footerDescription}</p>
            </div>

            {/* Column 2: EXPLORE */}
            <div className="footer-col">
              <h4 className="footer-col-title">EXPLORE</h4>
              <ul className="footer-links">
                {navigation.map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="footer-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: SELECTED WORK */}
            <div className="footer-col">
              <h4 className="footer-col-title">SELECTED WORK</h4>
              <ul className="footer-links">
                {projects.map((project) => (
                  <li key={project.id}>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link"
                    >
                      {project.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: CONTACT */}
            <div className="footer-col">
              <h4 className="footer-col-title">CONTACT</h4>
              <ul className="footer-links">
                <li>
                  <a href={`mailto:${brand.email}`} className="footer-email">
                    <EnvelopeSimple size={16} weight="bold" />
                    <span>{brand.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/resolveops.growthstudio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-email"
                    aria-label="Instagram"
                  >
                    <InstagramLogo size={16} weight="bold" />
                    <span>Instagram</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} {brand.name}
          </p>
          <button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <ArrowUp size={15} weight="bold" />
            <span>Back to top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
