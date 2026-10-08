import { useEffect, useRef, useState } from 'react';
import './WelcomeOrbLoader.css';

interface WelcomeOrbLoaderProps {
  onComplete?: () => void;
}

/** Reference-inspired 2.4-second character intro, followed by a short fade.
 * Runs once per page load. Waits for window.load, with an five-second ceiling.
 * All listeners, scroll locks and timers are restored on unmount/StrictMode replay.
 */
export default function WelcomeOrbLoader({ onComplete }: WelcomeOrbLoaderProps) {
  const [exiting, setExiting] = useState(false);
  const complete = useRef(onComplete);
  complete.current = onComplete;

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let introDone = false;
    let pageReady = document.readyState === 'complete';
    let leaving = false;
    let finishTimer: number | undefined;
    const exit = () => {
      if (leaving) return;
      leaving = true;
      setExiting(true);
      finishTimer = window.setTimeout(() => complete.current?.(), reduced ? 0 : 350);
    };
    const ready = () => {
      pageReady = true;
      if (introDone) exit();
    };
    window.addEventListener('load', ready);
    const introTimer = window.setTimeout(() => {
      introDone = true;
      if (pageReady) exit();
    }, reduced ? 150 : 2400);
    const ceilingTimer = window.setTimeout(exit, reduced ? 1500 : 3500);
    return () => {
      window.removeEventListener('load', ready);
      window.clearTimeout(introTimer);
      window.clearTimeout(ceilingTimer);
      window.clearTimeout(finishTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className={`orb-overlay${exiting ? ' orb-exit' : ''}`} role="status" aria-label="Loading Resolveops" aria-live="polite">
      <div className="orb-stage" aria-hidden="true">
        <div className="orb-character">
          <div className="orb-sphere">
            <div className="orb-face">
              <span className="orb-eye orb-eye--left" />
              <span className="orb-eye orb-eye--right" />
            </div>
          </div>
        </div>
        <div className="orb-satellites">
          <span className="orb-dot orb-dot--left" />
          <span className="orb-dot orb-dot--right" />
        </div>
      </div>
      <div className="orb-wordmark" aria-hidden="true">Resolveops</div>
    </div>
  );
}
