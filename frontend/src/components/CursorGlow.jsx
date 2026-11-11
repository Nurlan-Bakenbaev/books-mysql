import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glow = useRef(null);
  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    const hide = () => { if (glow.current) glow.current.style.opacity = '0'; };
    const move = (event) => {
      if (!media.matches || event.pointerType !== 'mouse') { hide(); return; }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!glow.current) return;
        glow.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        glow.current.style.opacity = '1';
      });
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    media.addEventListener('change', hide);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      media.removeEventListener('change', hide);
    };
  }, []);
  return <div ref={glow} className="cursor-glow" aria-hidden="true" />;
}
