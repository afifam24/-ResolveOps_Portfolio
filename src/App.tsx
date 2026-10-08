import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import BorderGlow from './components/BorderGlow';
import SpecularButtons from './components/SpecularButtons';

import WelcomeOrbLoader from './components/WelcomeOrbLoader';
import RovaChat from './components/RovaChat';
import Home from './pages/Home';
import Services from './pages/Services';
import Work from './pages/Work';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import './index.css';
import './theme-v3.css';
import './theme-v4.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageTitleUpdater() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'ResolveOPS — Growth Studio | We Design. We Develop. We Grow.',
      '/services': 'Services — ResolveOPS Growth Studio',
      '/work': 'Our Work — ResolveOPS Growth Studio',
      '/about': 'About — ResolveOPS Growth Studio',
      '/contact': 'Start a Project — ResolveOPS Growth Studio',
    };
    document.title = titles[pathname] || 'ResolveOPS — Growth Studio';
  }, [pathname]);
  return null;
}

export default function App() {
  // Play on initial page load and refresh, without replaying on client-side routes.
  const [showLoader, setShowLoader] = useState(true);
  const handleLoaderComplete = () => setShowLoader(false);

  return (
    <>
      {showLoader && (
        <WelcomeOrbLoader onComplete={handleLoaderComplete} />
      )}
      <div inert={showLoader} aria-hidden={showLoader ? true : undefined}>
      <BrowserRouter>
        <ScrollToTop />
        <PageTitleUpdater />
        <BorderGlow />
        <SpecularButtons />
        <SiteHeader />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <SiteFooter />
        <RovaChat />
      </BrowserRouter>
      </div>
    </>
  );
}
