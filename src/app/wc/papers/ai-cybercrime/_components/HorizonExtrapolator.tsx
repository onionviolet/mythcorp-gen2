'use client';

import { useEffect, useRef, useState } from 'react';
import { Cite, FigureCaption } from './PaperApparatus';
import {
  CENTRAL_DOUBLING_DAYS,
  DOUBLING_PRESETS,
  HORIZON_POINTS,
  HORIZON_THRESHOLDS,
  ANCHOR_TIME,
  crossingTime,
  monthLabel,
  projectedMinutes,
} from './horizonModel';

const X0 = Date.parse('2025-01-01');
const X1 = Date.parse('2029-01-01');
const Y0 = Math.log10(10);
const Y1 = Math.log10(60_000);
const SURVEY_TIME = Date.parse('2028-01-01');
const HEIGHT = 280;
const PAD = { l: 44, r: 12, t: 14, b: 26 };

function useWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export function HorizonExtrapolator() {
  const [days, setDays] = useState(CENTRAL_DOUBLING_DAYS);
  const [ref, width] = useWidth();

  const r2 = (n: number) => Math.round(n * 100) / 100;
  const x = (t: number) => r2(PAD.l + ((t - X0) / (X1 - X0)) * (width - PAD.l - PAD.r));
  const y = (m: number) => {
    const v = Math.min(Y1, Math.max(Y0, Math.log10(m)));
    return r2(PAD.t + (1 - (v - Y0) / (Y1 - Y0)) * (HEIGHT - PAD.t - PAD.b));
  };

  const steps = 48;
  const line = (d: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = ANCHOR_TIME + ((X1 - ANCHOR_TIME) * i) / steps;
      pts.push(`${x(t).toFixed(1)},${y(projectedMinutes(t, d)).toFixed(1)}`);
    }
    return pts;
  };
  const fast = line(DOUBLING_PRESETS[0].days);
  const slow = line(DOUBLING_PRESETS[2].days);
  const band = `M${fast.join(' L')} L${[...slow].reverse().join(' L')} Z`;
  const active = `M${line(days).join(' L')}`;
  const measured = `M${HORIZON_POINTS.map((p) => `${x(Date.parse(p.date))},${y(p.minutes)}`).join(' L')}`;

  const yTicks = [10, 60, 600, 6_000, 60_000];
  const yTickLabel = (m: number) => (m < 60 ? `${m}m` : `${(m / 60).toLocaleString('en-US')}h`);
  const years = [2025, 2026, 2027, 2028, 2029];

  return (
    <figure className="mt-8">
      <div className="themed-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--fg-muted)]">
              doubling time
            </p>
            <p className="font-serif text-2xl text-[color:var(--accent)]">{days} days</p>
          </div>
          <div role="group" aria-label="METR doubling-time estimates" className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {DOUBLING_PRESETS.map((p) => (
              <button
                key={p.days}
                type="button"
                aria-pressed={days === p.days}
                onClick={() => setDays(p.days)}
                className={[
                  'min-h-8 border px-2 transition-colors',
                  days === p.days
                    ? 'border-[color:var(--accent)] text-[color:var(--accent)]'
                    : 'border-[color:var(--border)] text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]',
                ].join(' ')}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {p.days}d {p.label}
              </button>
            ))}
          </div>
        </div>
        <label className="mt-3 block">
          <span className="sr-only">Doubling time in days</span>
          <input
            type="range"
            min={80}
            max={240}
            step={1}
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10))}
            className="w-full accent-[color:var(--accent)]"
          />
        </label>

        <div ref={ref} className="mt-3 w-full">
          <svg width={width} height={HEIGHT} role="img" aria-label={`Agent time horizon, measured points to May 2026, projected to 2029 at a ${days}-day doubling time`} className="block">
            {yTicks.map((m) => (
              <g key={m}>
                <line x1={PAD.l} x2={width - PAD.r} y1={y(m)} y2={y(m)} style={{ stroke: 'var(--border)' }} strokeWidth={1} />
                <text x={PAD.l - 6} y={y(m) + 3} textAnchor="end" fontSize={10} style={{ fill: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>{yTickLabel(m)}</text>
              </g>
            ))}
            {years.map((yr) => {
              const t = Date.parse(`${yr}-01-01`);
              return (
                <text key={yr} x={x(t)} y={HEIGHT - 8} textAnchor={yr === 2029 ? 'end' : 'middle'} fontSize={10} style={{ fill: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>{yr}</text>
              );
            })}
            {HORIZON_THRESHOLDS.map((th) => (
              <g key={th.label}>
                <line x1={PAD.l} x2={width - PAD.r} y1={y(th.minutes)} y2={y(th.minutes)} style={{ stroke: 'var(--fg-muted)' }} strokeDasharray="2 4" strokeWidth={1} />
                <text x={PAD.l + 4} y={y(th.minutes) - 4} fontSize={10} style={{ fill: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>{th.label}</text>
              </g>
            ))}
            <line x1={x(SURVEY_TIME)} x2={x(SURVEY_TIME)} y1={PAD.t} y2={HEIGHT - PAD.b} style={{ stroke: 'var(--accent-warm)' }} strokeDasharray="4 3" />
            <text x={x(SURVEY_TIME) - 4} y={PAD.t + 10} textAnchor="end" fontSize={10} style={{ fill: 'var(--accent-warm)', fontFamily: 'var(--font-mono)' }}>survey 2028</text>
            <path d={band} style={{ fill: 'var(--accent)', opacity: 0.12 }} />
            <path d={active} fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth={2} strokeDasharray="6 4" />
            <path d={measured} fill="none" style={{ stroke: 'var(--fg)' }} strokeWidth={2} />
            {HORIZON_POINTS.map((p) => (
              <g key={p.date}>
                <circle cx={x(Date.parse(p.date))} cy={y(p.minutes)} r={4} style={{ fill: 'var(--fg)' }} />
                {p.lowerBound && (
                  <path d={`M${x(Date.parse(p.date))},${y(p.minutes) - 6} l-4,6 m4,-6 l4,6 M${x(Date.parse(p.date))},${y(p.minutes) - 6} v-10`} fill="none" style={{ stroke: 'var(--fg)' }} strokeWidth={1.5} />
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2" aria-live="polite">
          {HORIZON_THRESHOLDS.slice(1).map((th) => (
            <p key={th.label} className="font-mono text-xs text-[color:var(--fg-muted)]">
              crosses a {th.label.split(' (')[0]}: <span className="text-[color:var(--accent)]">{monthLabel(crossingTime(th.minutes, days))}</span>
            </p>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[color:var(--border)] pt-3 font-mono text-[10px] text-[color:var(--fg-subtle)]">
          <span>solid: measured by METR</span>
          <span>dashed: projection, chosen doubling time</span>
          <span>shaded: range between 89 and 196 days</span>
          <span>arrow: lower bound</span>
        </div>
      </div>
      <FigureCaption
        n={3}
        claim="If any of METR's measured doubling times holds, AI agents reach software tasks that take a skilled person a work month between early 2027 and early 2028. I tie Stage 4 to that step plus a lag. The tie is my assumption, not METR's or the survey's."
        source={<>METR measured points from three reports<Cite ids={['metr-2025', 'metr-2026-01', 'metr-2026-05']} />, plotted on the date METR published them. The May 2026 point is a floor because the task suite saturated near 16 hours, so the projection starts low. Survey line: Grace et al., 50% chance of an AI autonomously building a payment-processing site by 2028<Cite ids={['grace-2024']} />.</>}
      />
    </figure>
  );
}
