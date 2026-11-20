import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useLoomDost } from '../../context/LoomDostContext';

interface RectBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Non-blocking viewport highlight ring over [data-dost-target="<targetId>"].
 * Strictly passive: never calls scrollIntoView or alters page scroll position.
 */
export function HighlightOverlay() {
  const { activeTargetId, setTargetOffscreen } = useLoomDost();
  const [rect, setRect] = useState<RectBox | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!activeTargetId) {
      setRect(null);
      setTargetOffscreen(false);
      return;
    }

    const measure = () => {
      const el = document.querySelector(
        `[data-dost-target="${activeTargetId}"]`
      );
      if (!el) {
        setRect(null);
        setTargetOffscreen(false);
        return;
      }

      const box = el.getBoundingClientRect();
      const inViewport =
        box.width > 0 &&
        box.height > 0 &&
        box.bottom > 40 &&
        box.top < window.innerHeight - 60;

      if (!inViewport) {
        setRect(null);
        setTargetOffscreen(true);
        return;
      }

      setTargetOffscreen(false);
      setRect({
        top: Math.max(4, box.top - 5),
        left: Math.max(4, box.left - 5),
        width: box.width + 10,
        height: box.height + 10,
      });
    };

    measure();
    const el = document.querySelector(`[data-dost-target="${activeTargetId}"]`);
    const observer =
      typeof ResizeObserver !== 'undefined' && el
        ? new ResizeObserver(measure)
        : null;
    if (observer && el) {
      observer.observe(el);
    }

    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    const interval = window.setInterval(measure, 450);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
      window.clearInterval(interval);
    };
  }, [activeTargetId, setTargetOffscreen]);

  if (!rect) return null;

  return (
    <motion.div
      aria-hidden="true"
      data-testid="loom-dost-highlight-ring"
      className="fixed z-35 pointer-events-none rounded-2xl border-[3px] border-[#C2593F] bg-[#C2593F]/8 shadow-[0_0_0_4px_rgba(30,42,74,0.14)]"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
      initial={{ opacity: 0 }}
      animate={
        shouldReduceMotion
          ? { opacity: 1 }
          : { opacity: [0.72, 1, 0.72], scale: [1, 1.01, 1] }
      }
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
