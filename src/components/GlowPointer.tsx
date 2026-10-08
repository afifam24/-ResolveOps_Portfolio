import { useEffect, useRef } from 'react';
import './GlowPointer.css';

export default function GlowPointer() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -200, y: -200 });
  const ringPos = useRef({ x: -200, y: -200 });
  const glowPos = useRef({ x: -200, y: -200 });
  const isVisible = useRef(false);
  const isHovered = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Check for touch device or prefers-reduced-motion
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || isReducedMotion) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        // Snap initial positions so elements don't fly in from outside the screen
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        glowPos.current.x = e.clientX;
        glowPos.current.y = e.clientY;
      }

      // Detect interactive elements for ring expansion (1.4x) and dot shrink
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        'a, button, input, textarea, select, [role="button"], .btn, [data-cursor-hover], label, summary, .stage-nav-btn, .mobile-menu-toggle'
      );
      if (isHovered.current !== interactive) {
        isHovered.current = interactive;
        if (dotRef.current) {
          dotRef.current.classList.toggle('hovered', interactive);
        }
        if (ringRef.current) {
          ringRef.current.classList.toggle('hovered', interactive);
        }
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (glowRef.current) glowRef.current.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible.current = true;
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
      if (glowRef.current) glowRef.current.style.opacity = '1';
    };

    const render = () => {
      // Ring follows mouse with a smooth delay
      const ringEase = 0.16;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ringEase;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ringEase;

      // Subtle background glow follows smoothly
      const glowEase = 0.09;
      glowPos.current.x += (mousePos.current.x - glowPos.current.x) * glowEase;
      glowPos.current.y += (mousePos.current.y - glowPos.current.y) * glowEase;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0)`;
        dotRef.current.style.opacity = isVisible.current ? '1' : '0';
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
        ringRef.current.style.opacity = isVisible.current ? '1' : '0';
      }

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0)`;
        glowRef.current.style.opacity = isVisible.current ? '1' : '0';
      }

      rafId.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <>
      {/* Subtle large background glow */}
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      {/* Delayed smooth ring */}
      <div ref={ringRef} className="cursor-ring-wrapper" aria-hidden="true">
        <div className="cursor-ring" />
      </div>
      {/* Exact stick center dot */}
      <div ref={dotRef} className="cursor-dot-wrapper" aria-hidden="true">
        <div className="cursor-dot" />
      </div>
    </>
  );
}
