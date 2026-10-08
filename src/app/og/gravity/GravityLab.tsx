'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTokenInk } from '../../wc/lab/canvas/_components/tokenInk';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LINES,
  createWorld,
  dropAll,
  grab,
  impulse,
  isIdle,
  letGo,
  moveHeld,
  quiesce,
  readout,
  rehang,
  release,
  setBounds,
  settle,
  step,
  wake,
  type LetterWorld,
} from './letterSolver';

const MAX_RUN_SECONDS = 9;

function worldHeight(width: number): number {
  return Math.round(Math.min(640, Math.max(340, width * 0.62)));
}

function detectLowPower(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return (
    nav.connection?.saveData === true ||
    (nav.hardwareConcurrency ?? 8) <= 2 ||
    (nav.deviceMemory ?? 8) <= 2
  );
}

export function GravityLab() {
  const { theme } = useTheme();
  const ink = useTokenInk();
  const inkRef = useRef(ink);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const worldRef = useRef<LetterWorld | null>(null);
  const fontRef = useRef('serif');
  const reducedRef = useRef(false);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const runningRef = useRef(false);
  const selectedRef = useRef(0);
  const dragRef = useRef<{ id: number; ox: number; oy: number; px: number; py: number; pt: number; vx: number; vy: number } | null>(null);
  const activeSinceRef = useRef(0);
  const lastReadRef = useRef(0);
  const readoutRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef(0);
  const drawRef = useRef<() => void>(() => {});
  const [lowPower, setLowPower] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [announce, setAnnounce] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    inkRef.current = ink;
    drawRef.current();
  }, [ink]);

  const writeReadout = useCallback(() => {
    const w = worldRef.current;
    const el = readoutRef.current;
    if (!w || !el) return;
    const r = readout(w);
    el.textContent = `hanging ${r.hanging} | awake ${r.awake} | asleep ${r.asleep} | kinetic ${r.kinetic.toFixed(1)} mJ | peak impact ${Math.round(r.peak)} px/s`;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const w = worldRef.current;
    if (!canvas || !w) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = canvas.width / w.width;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w.width, w.height);
    const i = inkRef.current;
    ctx.strokeStyle = i['--fg'] || 'currentColor';
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, w.height - 0.5);
    ctx.lineTo(w.width, w.height - 0.5);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const b of w.bodies) {
      const settled = !b.hanging && !b.awake && !b.held;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.a);
      ctx.font = `600 ${b.size}px ${fontRef.current}`;
      ctx.fillStyle = b.line === 1 ? i['--accent'] || i['--fg'] : i['--fg'];
      ctx.globalAlpha = settled ? 0.82 : 1;
      ctx.fillText(b.ch, 0, b.size * 0.04);
      ctx.restore();
    }
    const sel = w.bodies[selectedRef.current];
    if (sel && document.activeElement === canvas) {
      ctx.strokeStyle = i['--accent-warm'] || i['--accent'];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(sel.x, sel.y, sel.r * 1.25, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  const stop = useCallback(() => {
    runningRef.current = false;
    cancelAnimationFrame(rafRef.current);
  }, []);

  const frame = useCallback(
    (now: number) => {
      const w = worldRef.current;
      if (!w || !runningRef.current) return;
      const dt = Math.min((now - lastRef.current) / 1000, 1 / 20);
      lastRef.current = now;
      step(w, dt);
      if (!dragRef.current && now - activeSinceRef.current > MAX_RUN_SECONDS * 1000) quiesce(w);
      draw();
      if (now - lastReadRef.current > 100) {
        lastReadRef.current = now;
        writeReadout();
      }
      if (isIdle(w) && !dragRef.current) {
        runningRef.current = false;
        writeReadout();
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    },
    [draw, writeReadout],
  );

  const start = useCallback(() => {
    if (runningRef.current || reducedRef.current || document.hidden) return;
    activeSinceRef.current = performance.now();
    runningRef.current = true;
    lastRef.current = performance.now();
    rafRef.current = requestAnimationFrame(frame);
  }, [frame]);

  const touch = useCallback(() => {
    activeSinceRef.current = performance.now();
    const w = worldRef.current;
    if (reducedRef.current && w) {
      settle(w);
      draw();
      writeReadout();
    } else {
      start();
    }
  }, [draw, start, writeReadout]);

  const reset = useCallback(() => {
    const w = worldRef.current;
    if (!w) return;
    window.clearTimeout(autoRef.current);
    dragRef.current = null;
    rehang(w);
    draw();
    writeReadout();
    setAnnounce('Reset. The words hang again.');
  }, [draw, writeReadout]);

  const letAllFall = useCallback(() => {
    const w = worldRef.current;
    if (!w) return;
    window.clearTimeout(autoRef.current);
    dropAll(w, reducedRef.current ? 0 : 0.07, Math.random);
    setAnnounce('Every letter let go.');
    touch();
  }, [touch]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const low = detectLowPower();
    reducedRef.current = mq.matches;
    setReduced(mq.matches);
    setLowPower(low);

    const readFont = () => {
      const probe = probeRef.current;
      if (probe) fontRef.current = getComputedStyle(probe).fontFamily || 'serif';
    };
    readFont();

    const fit = () => {
      const width = Math.max(260, Math.floor(wrap.clientWidth));
      const height = worldHeight(width);
      const dpr = Math.min(window.devicePixelRatio || 1, low ? 1 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.height = `${height}px`;
      if (!worldRef.current) {
        const w = createWorld(width, height, low);
        worldRef.current = w;
        if (mq.matches) {
          dropAll(w, 0, Math.random);
          settle(w);
        } else {
          autoRef.current = window.setTimeout(letAllFall, 1400);
        }
        setReady(true);
      } else {
        setBounds(worldRef.current, width, height);
        if (reducedRef.current) settle(worldRef.current);
      }
      draw();
      writeReadout();
      if (!reducedRef.current && worldRef.current && !isIdle(worldRef.current)) start();
    };
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    const onMotion = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
      if (mq.matches && worldRef.current) {
        settle(worldRef.current);
        stop();
        draw();
      }
    };
    mq.addEventListener('change', onMotion);
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (worldRef.current && !isIdle(worldRef.current)) start();
    };
    document.addEventListener('visibilitychange', onVisibility);
    document.fonts?.ready.then(() => {
      readFont();
      draw();
    });
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearTimeout(autoRef.current);
      stop();
    };
  }, [draw, letAllFall, start, stop, writeReadout]);

  useEffect(() => {
    const probe = probeRef.current;
    if (probe) fontRef.current = getComputedStyle(probe).fontFamily || 'serif';
    drawRef.current();
  }, [theme]);

  const pointer = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    return rect ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : { x: 0, y: 0 };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const w = worldRef.current;
    if (!w) return;
    const p = pointer(e);
    let best = -1;
    let bestD = Infinity;
    for (const b of w.bodies) {
      if (b.inert) continue;
      const d = Math.hypot(b.x - p.x, b.y - p.y);
      if (d < b.r * 1.4 && d < bestD) {
        best = b.id;
        bestD = d;
      }
    }
    if (best < 0) return;
    window.clearTimeout(autoRef.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    const b = w.bodies[best];
    selectedRef.current = best;
    grab(w, best, b.x, b.y);
    dragRef.current = { id: best, ox: b.x - p.x, oy: b.y - p.y, px: p.x, py: p.y, pt: e.timeStamp, vx: 0, vy: 0 };
    e.currentTarget.focus({ preventScroll: true });
    touch();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const w = worldRef.current;
    const d = dragRef.current;
    if (!w || !d) return;
    const p = pointer(e);
    const dt = Math.max((e.timeStamp - d.pt) / 1000, 0.001);
    d.vx = d.vx * 0.6 + ((p.x - d.px) / dt) * 0.4;
    d.vy = d.vy * 0.6 + ((p.y - d.py) / dt) * 0.4;
    d.px = p.x;
    d.py = p.y;
    d.pt = e.timeStamp;
    moveHeld(w, d.id, p.x + d.ox, p.y + d.oy);
    if (reducedRef.current) {
      w.bodies[d.id].x = w.bodies[d.id].tx;
      w.bodies[d.id].y = w.bodies[d.id].ty;
      draw();
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const w = worldRef.current;
    const d = dragRef.current;
    if (!w || !d) return;
    dragRef.current = null;
    const b = w.bodies[d.id];
    const stale = e.timeStamp - d.pt > 90;
    if (reducedRef.current) {
      b.x = b.tx;
      b.y = b.ty;
      letGo(w, d.id, 0, 0);
    } else {
      letGo(w, d.id, stale ? 0 : d.vx, stale ? 0 : d.vy);
    }
    touch();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    const w = worldRef.current;
    if (!w) return;
    const n = w.bodies.length;
    const sel = w.bodies[selectedRef.current];
    const say = (text: string) => setAnnounce(text);
    const describe = () => {
      const b = w.bodies[selectedRef.current];
      say(`Letter ${b.ch}, ${b.hanging ? 'hanging' : b.awake ? 'moving' : 'resting'}.`);
    };
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      letAllFall();
      return;
    }
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      reset();
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      if (e.shiftKey && !sel.hanging && !sel.inert) {
        impulse(w, sel.id, dir * 420, -120);
        touch();
        say(`Nudged ${sel.ch} ${dir > 0 ? 'right' : 'left'}.`);
      } else {
        let next = selectedRef.current;
        do next = (next + dir + n) % n;
        while (w.bodies[next].inert && next !== selectedRef.current);
        selectedRef.current = next;
        describe();
        draw();
      }
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      if (sel.inert) return;
      window.clearTimeout(autoRef.current);
      if (sel.hanging) {
        release(w, sel.id);
        say(`Dropped ${sel.ch}.`);
      } else {
        wake(w, sel.id);
        impulse(w, sel.id, 0, e.key === 'ArrowUp' ? -820 : 520);
        say(`${e.key === 'ArrowUp' ? 'Popped' : 'Pushed down'} ${sel.ch}.`);
      }
      touch();
    }
  };

  const secondLine = LINES[1];

  return (
    <div>
      <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-6xl">
        <span ref={probeRef} className="sr-only" />
        Let go
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-[color:var(--fg-muted)]">
        The words are not finished, so they fall. Grab a letter and throw it.
        {lowPower ? ' Low-power mode: only the wordmark is simulated.' : ''}
        {reduced ? ' Reduced motion: letters are already at rest, and a dropped letter lands without flight.' : ''}
      </p>

      <div ref={wrapRef} className="mt-6 w-full">
        <p className="sr-only">{`${LINES[0]}. ${secondLine}.`}</p>
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="application"
          aria-label="Falling letters. Left and Right select a letter. Enter drops it. Shift with an arrow nudges it. Space drops everything. R re-hangs the words."
          className="block w-full touch-none rounded-[var(--radius,0)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] outline-none focus-visible:border-[color:var(--accent)]"
          style={{ cursor: 'grab', visibility: ready ? 'visible' : 'hidden' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
          onFocus={() => drawRef.current()}
          onBlur={() => drawRef.current()}
        />
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={letAllFall}
          className="border border-[color:var(--border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--fg)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]"
        >
          Drop all
        </button>
        <button
          type="button"
          onClick={reset}
          className="border border-[color:var(--border-strong)] px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--fg)] hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]"
        >
          Re-hang
        </button>
        <span className="font-mono text-[11px] text-[color:var(--fg-subtle)]">
          Tab to the field: arrows select, Enter drops, Shift+arrow nudges, Space drops all, R re-hangs.
        </span>
      </div>

      <div
        ref={readoutRef}
        aria-hidden="true"
        className="mt-4 font-mono text-[11px] tracking-wide text-[color:var(--fg-muted)]"
      />
    </div>
  );
}
