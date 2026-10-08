import { lazy, Suspense, useState, useEffect, useRef, useCallback } from 'react';
import WebGLErrorBoundary from './WebGLErrorBoundary';
import heroAuroraBg from '../assets/hero-aurora-bg.jpg';
import './DigitalCore.css';

// ── Lazy-load R3F 3D Scene ────────────────────────────
const DigitalCoreScene = lazy(() => import('./DigitalCoreScene'));

// ── WebGL feature detection ──────────────────────────
function canCreateWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    const ext = (gl as WebGLRenderingContext).getExtension('WEBGL_lose_context');
    ext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export default function DigitalCore() {
  const [isPaused, setIsPaused] = useState(false);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [initFailed, setInitFailed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const userPausedRef = useRef(false);

  // Check WebGL support once on mount
  useEffect(() => {
    setHasWebGL(canCreateWebGL());
  }, []);

  // Respect prefers-reduced-motion
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Suspend when off-screen
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Suspend when tab is hidden
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const handler = () => setTabVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  const handlePauseToggle = useCallback(() => {
    setIsPaused(prev => {
      const next = !prev;
      userPausedRef.current = next;
      return next;
    });
  }, []);

  const handleInitError = useCallback(() => {
    setInitFailed(true);
  }, []);

  const shouldAnimate = !isPaused && !isReducedMotion && isVisible && tabVisible;

  return (
    <div className="digital-core-wrapper" ref={wrapperRef} aria-hidden="true">
      {/* 1. Base High-Fidelity Aurora Visual Plate */}
      <img
        src={heroAuroraBg}
        alt=""
        className="digital-core-bg-plate"
        loading="eager"
        decoding="async"
        style={{
          animationPlayState: shouldAnimate ? 'running' : 'paused',
        }}
      />

      {/* 2. Deep Atmospheric Vignette to guarantee pristine headline contrast */}
      <div className="digital-core-atmosphere" />

      {/* 3. Living 3D WebGL Layer (floating glass spheres, orbital ring, stardust) */}
      {hasWebGL && !initFailed && !isReducedMotion && (
        <WebGLErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <DigitalCoreScene
              shouldAnimate={shouldAnimate}
              onError={handleInitError}
            />
          </Suspense>
        </WebGLErrorBoundary>
      )}

      {/* 4. Core Animation Pause Control */}
      {hasWebGL && !initFailed && !isReducedMotion && (
        <div className="core-controls">
          <button
            className="btn-ghost core-pause-btn"
            onClick={handlePauseToggle}
            aria-label={isPaused ? 'Play animation' : 'Pause animation'}
          >
            {isPaused ? 'Play' : 'Pause'} Core
          </button>
        </div>
      )}
    </div>
  );
}
