'use client';

// Walkthrough: /wc/learn/plain-mode

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MESSAGE_LINES, type MessageStyle } from './messageStore';
import { SCHEME_INK, type Scheme } from './holdScheme';
import { renderMessageImage } from './messageImage';
import { useScramble } from './useScramble';
import { DisturbedText } from './DisturbedText';
import styles from './HoldMessage.module.css';

const ParticleObject = dynamic(
  () => import('../canvasui/ParticleObject').then((m) => m.ParticleObject),
  { ssr: false },
);

/** DOM renderings of the message; the default `field` style is dye in the canvas, not here. */
export function HoldMessage({ style, scheme }: { style: MessageStyle; scheme: Scheme }) {
  const run = useDecodeCycle(style === 'decode');
  const printable = useMessageImage(style === 'dust');
  const dustFrame = useRef<HTMLDivElement>(null);
  const [dustScale, setDustScale] = useState(4.4);

  useEffect(() => {
    if (style !== 'dust' || !printable || !dustFrame.current) return;
    const node = dustFrame.current;
    const fit = () => {
      const { width, height } = node.getBoundingClientRect();
      if (height > 0) setDustScale(Math.min(7.2, 3.3 * width / height));
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(node);
    return () => observer.disconnect();
  }, [style, printable]);

  if (style === 'field') return null;

  // The words as the spectre's particle cloud, from a PNG of the type.
  if (style === 'dust') {
    if (!printable) return null;
    return (
      <div ref={dustFrame} className="pointer-events-none absolute inset-x-0 top-[6%] h-[34%]">
        {/* The canvas itself must take pointer events for the scatter to work. */}
        <ParticleObject
          className="pointer-events-auto absolute inset-0 h-full w-full"
          src={printable}
          color={SCHEME_INK[scheme].ink}
          count={40000}
          size={1.5}
          radius={0.22}
          strength={1.6}
          swirl={0.7}
          spring={0.05}
          damping={0.86}
          drift={0.12}
          scale={dustScale}
          floatIntensity={0.5}
          rotationIntensity={0.15}
          floatSpeed={1.1}
          orbit={false}
          zoom={false}
          autoRotate={false}
          cameraDistance={3.6}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[11%] flex flex-col
                 items-center gap-[0.04em] font-mono font-bold leading-[0.95]
                 text-[color:var(--fg)]"
    >
      {MESSAGE_LINES.map((line) => (
        style === 'decode' ? (
          <span
            key={line}
            className={`${styles.decodeLine} text-[8.5vw] tracking-[0.02em]`}
            data-decode-label={line}
          >
            <DecodingLine key={run} text={line} />
          </span>
        ) : (
          <span
            key={line}
            className={`${styles.solidLine} text-[8.5vw]`}
            data-solid-label={line}
          >
            <DisturbedText text={line} className={styles.solidText} gather />
          </span>
        )
      ))}
    </div>
  );
}

/** Rasterize after fonts load, or the cloud is built from a fallback face. */
function useMessageImage(active: boolean): string | null {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active) return;
    let live = true;
    const done = () => { if (live) setReady(true); };
    // Not `document.fonts?.ready.then(done) ?? done()`: that lints as an unused expression.
    if (document.fonts) document.fonts.ready.then(done);
    else done();
    return () => { live = false; };
  }, [active]);

  return useMemo(() => {
    if (!active || !ready) return null;
    const family = getComputedStyle(document.documentElement)
      .getPropertyValue('--font-mono').trim() || 'ui-monospace, monospace';
    return renderMessageImage(MESSAGE_LINES, family);
  }, [active, ready]);
}

/** A counter that remounts the lines, because useScramble runs once per mount. */
function useDecodeCycle(active: boolean): number {
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setRun((n) => n + 1), 5200);
    return () => clearInterval(id);
  }, [active]);
  return run;
}

function DecodingLine({ text }: { text: string }) {
  return <span className={styles.decodeText}>{useScramble(text, { active: true, frames: 42 })}</span>;
}
