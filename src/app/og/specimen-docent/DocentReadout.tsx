'use client';

import { useEffect, useState } from 'react';
import type { MutableRefObject } from 'react';
import { DOCENT_ACTS } from './docentData';
import type { DocentTelemetry } from './DocentStage';

const KNOCKOUT = '[-webkit-text-stroke:3px_var(--bg)] [paint-order:stroke_fill]';

function sign(deg: number) {
  const r = Math.round(deg);
  return `${r >= 0 ? '+' : '-'}${Math.abs(r).toString().padStart(2, '0')}`;
}

/** Owns the telemetry state so the stage's frequent updates re-render only
 *  this readout, not the acts and their live figures. */
export function DocentReadout({
  sink,
  activeStep,
  live,
}: {
  sink: MutableRefObject<(t: DocentTelemetry) => void>;
  activeStep: number;
  live: boolean;
}) {
  const [telemetry, setTelemetry] = useState<DocentTelemetry | null>(null);
  useEffect(() => {
    sink.current = setTelemetry;
    return () => {
      sink.current = () => {};
    };
  }, [sink]);

  const shown = live ? telemetry : null;
  const attention = (() => {
    if (!live) return DOCENT_ACTS[activeStep]?.tag;
    if (!shown || shown.source === 'rest') return 'none';
    if (shown.source === 'pointer') return 'you';
    return DOCENT_ACTS[shown.index ?? activeStep]?.tag ?? 'none';
  })();

  return (
    <dl
      className={`flex flex-wrap gap-x-2 px-4 pb-3 pt-1 font-mono text-[11px] leading-5 tracking-wide md:absolute md:bottom-10 md:left-[6%] md:grid md:grid-cols-[auto_1fr] md:gap-x-4 md:p-0 [&>dd]:mr-2 md:[&>dd]:mr-0 ${KNOCKOUT}`}
      data-testid="docent-readout"
    >
      <dt className="text-[color:var(--fg-subtle)]">ATTENTION</dt>
      <dd className="text-[color:var(--fg)]">{attention}</dd>
      <dt className="text-[color:var(--fg-subtle)]">GAZE</dt>
      <dd className="text-[color:var(--fg)]">
        {shown ? (
          <>
            {sign(shown.gaze)}°<span className="hidden md:inline"> yaw</span> {sign(shown.pitch)}°
            <span className="hidden md:inline"> pitch</span>
          </>
        ) : (
          'held'
        )}
      </dd>
      <dt className="text-[color:var(--fg-subtle)]">STEP</dt>
      <dd className="text-[color:var(--fg-muted)]">
        {(shown?.step ?? activeStep).toFixed(2)}
        <span className="hidden md:inline"> / {(DOCENT_ACTS.length - 1).toFixed(2)}</span>
      </dd>
    </dl>
  );
}
