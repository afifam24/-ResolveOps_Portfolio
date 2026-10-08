import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, X } from '@phosphor-icons/react';
import { navigation, brand } from '../data/content';
import './SiteHeader.css';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    document.body.classList.remove('menu-open');
  }, [location.pathname]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle('menu-open', next);
      return next;
    });
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        document.body.classList.remove('menu-open');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <Link
          to="/"
          className="header-logo"
          aria-label="ResolveOPS Home"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <img src="/assets/logo.png" alt="ResolveOPS Logo" className="header-logo-icon" />
          <div className="header-logo-text">
            <span className="logo-name">{brand.name}</span>
            <span className="logo-subtitle">{brand.subtitle}</span>
          </div>
        </Link>

        <nav className="header-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/contact" className="btn btn-primary header-cta">
            Start a project
          </Link>

          <button
            className="mobile-menu-toggle"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {navigation.map((item, i) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : '0ms' }}
              tabIndex={menuOpen ? 0 : -1}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="btn btn-primary mobile-cta"
            style={{ transitionDelay: menuOpen ? `${80 + navigation.length * 60}ms` : '0ms' }}
            tabIndex={menuOpen ? 0 : -1}
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
