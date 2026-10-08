import { useEffect } from 'react';

const selector = '.contact-form-container,.contact-card,.contact-sidebar-note,.project-card,.service-block-visual,.philosophy-item,.value-card,.rova-panel,.gallery-detail,.workflow-panel,.workflow-choice';

export default function BorderGlow() {
  useEffect(() => {
    let cards: HTMLElement[] = [];
    let pointer: { x: number; y: number } | null = null;
    let raf = 0;

    const collect = () => {
      cards = Array.from(document.querySelectorAll<HTMLElement>(selector));
      cards.forEach((card) => card.classList.add('border-glow'));
    };
    collect();

    const draw = () => {
      raf = 0;
      for (const card of cards) {
        if (!card.isConnected) continue;
        let opacity = 0;
        if (pointer) {
          const b = card.getBoundingClientRect();
          if (b.bottom >= 0 && b.top <= innerHeight) {
            const x = pointer.x - b.left;
            const y = pointer.y - b.top;
            const cx = Math.max(0, Math.min(b.width, x));
            const cy = Math.max(0, Math.min(b.height, y));
            const outside = Math.hypot(x - cx, y - cy);
            const inside = x >= 0 && x <= b.width && y >= 0 && y <= b.height;
            const distances = [Math.abs(x), Math.abs(b.width - x), Math.abs(y), Math.abs(b.height - y)];
            const edge = distances.indexOf(Math.min(...distances));
            const distance = inside ? Math.min(...distances) : outside;
            const range = inside ? 95 : 65;
            opacity = Math.max(0, 1 - distance / range);
            opacity = opacity * opacity * (3 - 2 * opacity);
            card.style.setProperty('--edge-x', `${inside ? (edge === 0 ? 0 : edge === 1 ? b.width : x) : cx}px`);
            card.style.setProperty('--edge-y', `${inside ? (edge === 2 ? 0 : edge === 3 ? b.height : y) : cy}px`);
          }
        }
        card.style.setProperty('--edge-opacity', String(opacity));
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !matchMedia('(hover:hover)').matches) return;
      pointer = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const reset = () => {
      pointer = null;
      schedule();
    };

    const observer = new MutationObserver(() => {
      collect();
      schedule();
    });
    observer.observe(document.getElementById('root')!, { childList: true, subtree: true });

    document.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      cards.forEach((c) => {
        c.classList.remove('border-glow');
        c.style.removeProperty('--edge-opacity');
      });
      document.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return null;
}
