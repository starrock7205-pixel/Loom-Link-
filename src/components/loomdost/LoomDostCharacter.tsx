import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { DostState } from '../../types/loomDost';

interface LoomDostCharacterProps {
  state: DostState;
  size?: 'sm' | 'md';
}

/**
 * Handloom-inspired SVG guide character ("Loom Dost"):
 * Warm ivory medallion, deep indigo craft turban/loom frame, and terracotta weaving shuttle motif.
 * Subtle, respectful animations with full reduced-motion support.
 */
export function LoomDostCharacter({
  state,
  size = 'md',
}: LoomDostCharacterProps) {
  const shouldReduceMotion = useReducedMotion();
  const dimensions = size === 'sm' ? 'w-11 h-11' : 'w-14 h-14';

  const bodyAnimation = shouldReduceMotion
    ? {}
    : state === 'IDLE'
      ? { y: [0, -2, 0], rotate: [0, 1.5, 0, -1.5, 0] }
      : state === 'LISTENING'
        ? { scale: [1, 1.04, 1] }
        : state === 'THINKING'
          ? { rotate: [0, 2, -2, 0] }
          : state === 'APPROVAL_REMINDER'
            ? { scale: [1, 1.03, 1] }
            : { y: [0, -1.5, 0] };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${dimensions}`}>
      {/* Subtle listening pulse ring */}
      {state === 'LISTENING' && !shouldReduceMotion && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-[#C2593F]"
          animate={{ scale: [1, 1.25], opacity: [0.7, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
      )}

      {/* Subtle spinning warp ring during THINKING */}
      {state === 'THINKING' && !shouldReduceMotion && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border-2 border-dashed border-[#C2593F]/75"
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <motion.svg
        viewBox="0 0 64 64"
        className="w-full h-full drop-shadow-xs"
        aria-hidden="true"
        animate={bodyAnimation}
        transition={{
          duration: state === 'IDLE' ? 3.2 : 1.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Warm Ivory Medallion Background */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="#FAF7F2"
          stroke="#1E2A4A"
          strokeWidth="2.5"
        />

        {/* Woven Indigo Border Arc (Gadwal temple weave motif) */}
        <path
          d="M12 24 C16 11, 48 11, 52 24"
          fill="#1E2A4A"
        />
        <path
          d="M14 24 L20 20 L26 24 L32 20 L38 24 L44 20 L50 24"
          fill="none"
          stroke="#C2593F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Friendly Face Medallion */}
        <circle cx="32" cy="34" r="14" fill="#F2ECE1" stroke="#1E2A4A" strokeWidth="1.6" />

        {/* Terracotta Bindi / Craft Mark */}
        <circle cx="32" cy="25.5" r="2" fill="#C2593F" />

        {/* Expressive Eyes */}
        {state === 'ERROR_HELP' ? (
          <>
            <path d="M25 32 Q27 30 29 32" stroke="#1E2A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M35 32 Q37 30 39 32" stroke="#1E2A4A" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="27" cy="32.5" r="2" fill="#1E2A4A" />
            <circle cx="37" cy="32.5" r="2" fill="#1E2A4A" />
          </>
        )}

        {/* Warm Smile */}
        {state === 'APPROVAL_REMINDER' ? (
          <path
            d="M28 38.5 Q32 40.5 36 38.5"
            stroke="#1E2A4A"
            strokeWidth="1.8"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M27 37.5 Q32 42 37 37.5"
            stroke="#C2593F"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Handloom Shuttle / Spool Crest at Bottom */}
        <path
          d="M17 50 Q32 45 47 50 Q32 56 17 50 Z"
          fill="#1E2A4A"
        />
        <line
          x1="24"
          y1="50"
          x2="40"
          y2="50"
          stroke="#FAF7F2"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Listening 3-Bar Waveform Pill */}
      {state === 'LISTENING' && (
        <div
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#C2593F] flex items-center gap-0.5 shadow"
        >
          {[0, 1, 2].map((bar) => (
            <motion.span
              key={bar}
              className="w-0.5 h-2.5 bg-white rounded-full"
              animate={shouldReduceMotion ? {} : { scaleY: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: bar * 0.15,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
