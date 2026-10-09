'use client';

// Walkthrough: /wc/learn/plain-mode

import { useCallback, useEffect, useRef, useState } from 'react';
import { HoldRoomFrame, type HoldRoomProps } from '../HoldRoomFrame';
import {
  LINES, createWorld, dropAll, grab, impulse, isIdle, letGo, moveHeld, quiesce,
  rehang, release, setBounds, settle, step, wake, type LetterWorld,
} from '../../../og/gravity/letterSolver';

const MAX_RUN_SECONDS = 9;

const BUTTON =
  'min-h-11 border border-[color:var(--border-strong)] px-3 py-1.5 pointer-coarse:px-4 font-mono text-xs text-[color:var(--fg)] ' +
  'hover:border-[color:var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]';

function detectLowPower(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  return nav.connection?.saveData === true || (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
}

export function LetGoRoom(props: HoldRoomProps) {
  const { scheme } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const worldRef = useRef<LetterWorld | null>(null);
  const inkRef = useRef({ fg: '#888', accent: '#888' });
  const fontRef = useRef('sans-serif');
  const reducedRef = useRef(false);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const runningRef = useRef(false);
  const selectedRef = useRef(0);
  const dragRef = useRef<{ id: number; ox: number; oy: number; px: number; py: number; pt: number; vx: number; vy: number } | null>(null);
  const activeSinceRef = useRef(0);
  const autoRef = useRef(0);
  const autoDueRef = useRef(true);
  const cancelAuto = useCallback(() => {
    autoDueRef.current = false;
    window.clearTimeout(autoRef.current);
  }, []);
  const drawRef = useRef<() => void>(() => {});
  const [lowPower, setLowPower] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [announce, setAnnounce] = useState('');

  const readStyle = useCallback(() => {
    const probe = probeRef.current;
    if (!probe) return;
    const cs = getComputedStyle(probe);
    inkRef.current = { fg: cs.color || '#888', accent: cs.outlineColor || cs.color || '#888' };
    fontRef.current = cs.fontFamily || 'sans-serif';
    drawRef.current();
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const w = worldRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !w || !ctx) return;
    const dpr = canvas.width / w.width;
    const ink = inkRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w.width, w.height);
    ctx.strokeStyle = ink.fg;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, w.height - 0.5);
    ctx.lineTo(w.width, w.height - 0.5);
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = ink.fg;
    for (const b of w.bodies) {
      const settled = !b.hanging && !b.awake && !b.held;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.a);
      ctx.font = `600 ${b.size}px ${fontRef.current}`;
      ctx.globalAlpha = settled ? 0.85 : 1;
      ctx.fillText(b.ch, 0, b.size * 0.04);
      ctx.restore();
    }
    const sel = w.bodies[selectedRef.current];
    if (sel && document.activeElement === canvas) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = ink.fg;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(sel.x, sel.y, sel.r * 1.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;
  }, []);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  // Re-resolve ink and font when the scheme changes. The attribute that flips
  // the tokens can land after this render, so also watch it directly.
  useEffect(() => {
    readStyle();
    const mo = new MutationObserver(readStyle);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-plain-scheme', 'data-theme', 'class', 'style'] });
    return () => mo.disconnect();
  }, [scheme, readStyle]);

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
      if (isIdle(w) && !dragRef.current) {
        runningRef.current = false;
        return;
      }
      rafRef.current = requestAnimationFrame(frame);
    },
    [draw],
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
    } else {
      start();
    }
  }, [draw, start]);

  const reset = useCallback(() => {
    const w = worldRef.current;
    if (!w) return;
    cancelAuto();
    dragRef.current = null;
    rehang(w);
    draw();
    setAnnounce('The words hang again.');
  }, [cancelAuto, draw]);

  const letAllFall = useCallback(() => {
    const w = worldRef.current;
    if (!w) return;
    cancelAuto();
    dropAll(w, reducedRef.current ? 0 : 0.07, Math.random);
    setAnnounce('Every letter let go.');
    touch();
  }, [cancelAuto, touch]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const low = detectLowPower();
    reducedRef.current = mq.matches;
    setReduced(mq.matches);
    setLowPower(low);

    const fit = () => {
      const width = Math.max(260, Math.floor(wrap.clientWidth));
      const height = Math.max(200, Math.floor(wrap.clientHeight));
      const dpr = Math.min(window.devicePixelRatio || 1, low ? 1 : 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      if (!worldRef.current) {
        const w = createWorld(width, height, low);
        worldRef.current = w;
        if (mq.matches) {
          autoDueRef.current = false;
          dropAll(w, 0, Math.random);
          settle(w);
        }
      } else {
        setBounds(worldRef.current, width, height);
        if (reducedRef.current) settle(worldRef.current);
      }
      draw();
      if (!reducedRef.current && worldRef.current && !isIdle(worldRef.current)) start();
    };
    fit();
    if (autoDueRef.current && !mq.matches) {
      window.clearTimeout(autoRef.current);
      autoRef.current = window.setTimeout(letAllFall, 1600);
    }

    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    const onMotion = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
      if (mq.matches && worldRef.current) {
        cancelAuto();
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
    document.fonts?.ready.then(readStyle);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', onMotion);
      document.removeEventListener('visibilitychange', onVisibility);
      window.clearTimeout(autoRef.current);
      stop();
    };
  }, [cancelAuto, draw, letAllFall, readStyle, start, stop]);

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
    cancelAuto();
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
        const b = w.bodies[next];
        say(`Letter ${b.ch}, ${b.hanging ? 'hanging' : b.awake ? 'moving' : 'resting'}.`);
        draw();
      }
      return;
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      if (sel.inert) return;
      cancelAuto();
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

  return (
    <HoldRoomFrame {...props}>
      <div className="flex h-full flex-col">
        <div ref={wrapRef} className="relative min-h-0 flex-1">
          <p className="sr-only">{`${LINES[0]}. ${LINES[1]}.`}</p>
          <span
            ref={probeRef}
            aria-hidden="true"
            className="pointer-events-none absolute h-0 w-0 overflow-hidden"
            style={{ color: 'var(--fg)', outlineColor: 'var(--accent)', fontFamily: 'var(--font-display)' }}
          />
          <canvas
            ref={canvasRef}
            tabIndex={0}
            role="application"
            aria-label="Falling letters. Left and Right select a letter. Enter drops it. Shift with an arrow nudges it. Space drops everything. R re-hangs the words."
            className="absolute inset-0 block h-full w-full touch-none outline-none"
            style={{ cursor: 'grab' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
            onFocus={() => drawRef.current()}
            onBlur={() => drawRef.current()}
          />
        </div>
        <p className="sr-only" role="status" aria-live="polite">{announce}</p>
        <div className="relative z-20 flex flex-wrap items-center gap-x-4 gap-y-2 px-5 pb-2 pt-1 font-mono text-xs sm:px-8">
          <button type="button" onClick={letAllFall} className={BUTTON}>Drop all</button>
          <button type="button" onClick={reset} className={BUTTON}>Re-hang</button>
          <span className="text-[color:var(--fg-muted)]">
            {reduced
              ? 'Reduced motion: the letters are already down. Grab one to move it.'
              : lowPower
                ? 'Low power: only MYTHCORP moves.'
                : 'Grab a letter and throw it.'}
          </span>
          <span className="hidden text-[color:var(--fg-subtle)] md:inline">
            Tab to the letters: arrows pick, Enter drops, Space drops all, R re-hangs.
          </span>
        </div>
      </div>
    </HoldRoomFrame>
  );
}
