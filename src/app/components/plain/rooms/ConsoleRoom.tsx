'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { HoldRoomFrame, type HoldRoomProps } from '../HoldRoomFrame';
import { useReducedMotion } from '../useReducedMotion';
import { CONTACT } from '../HoldContact';
import { CHIPS, bootLines, complete, run } from './console/commands';

type Line = { id: number; text: string; echo?: boolean };

export function ConsoleRoom(props: HoldRoomProps) {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<Line[]>([]);
  const [booted, setBooted] = useState(false);
  const [value, setValue] = useState('');
  const history = useRef<string[]>([]);
  const cursor = useRef(0);
  const nextId = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const push = (texts: string[], echo = false) =>
    setLines(prev => [...prev, ...texts.map(text => ({ id: nextId.current++, text, echo }))]);

  useEffect(() => {
    const all = bootLines('console');
    setLines([]);
    setBooted(false);
    if (reduced) {
      push(all);
      setBooted(true);
      return;
    }
    let i = 0;
    const timer = window.setInterval(() => {
      push([all[i++]]);
      if (i >= all.length) {
        window.clearInterval(timer);
        setBooted(true);
      }
    }, 140);
    return () => window.clearInterval(timer);
  }, [reduced]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (booted && !window.matchMedia('(pointer: coarse)').matches) input.current?.focus();
  }, [booted]);

  const submit = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    history.current.push(text);
    cursor.current = history.current.length;
    const result = run(text, 'console');
    if (result.action === 'clear') {
      setLines([]);
    } else {
      push([`> ${text}`], true);
      push(result.lines);
    }
    if (result.action === 'linkedin') window.open(CONTACT.linkedin, '_blank', 'noopener,noreferrer');
    if (result.action === 'room' && result.room) props.onRoom(result.room);
    setValue('');
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      setValue(complete(value));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cursor.current > 0) setValue(history.current[--cursor.current]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      cursor.current = Math.min(cursor.current + 1, history.current.length);
      setValue(history.current[cursor.current] ?? '');
    }
  };

  return (
    <HoldRoomFrame {...props}>
      <div className="mx-auto flex h-full max-w-2xl flex-col px-5 font-mono text-xs sm:px-8">
        <div
          ref={scroller}
          role="log"
          aria-live="polite"
          aria-label="Console output"
          onClick={() => {
            if (!window.matchMedia('(pointer: coarse)').matches) input.current?.focus();
          }}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2 leading-relaxed"
        >
          {lines.map(line => (
            <p
              key={line.id}
              className={`whitespace-pre-wrap break-words ${
                line.echo ? 'text-[color:var(--fg)]' : 'text-[color:var(--fg-muted)]'
              }`}
            >
              {line.text}
            </p>
          ))}
        </div>
        {booted && (
          <>
            <form
              onSubmit={e => { e.preventDefault(); submit(value); }}
              className="flex items-center gap-2 border-t border-[color:var(--border)] py-2"
            >
              <label htmlFor="console-input" className="text-[color:var(--fg)]" aria-label="Command">
                <span aria-hidden>&gt;</span>
              </label>
              <input
                id="console-input"
                ref={input}
                value={value}
                onChange={e => setValue(e.target.value)}
                onKeyDown={onKey}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
                className="min-h-11 min-w-0 flex-1 bg-transparent text-[16px] text-[color:var(--fg)]
                           outline-none placeholder:text-[color:var(--fg-subtle)] sm:min-h-0 sm:text-xs"
                placeholder="type a command"
              />
            </form>
            <div className="hidden flex-wrap gap-2 pb-2 pointer-coarse:flex">
              {CHIPS.map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => submit(chip)}
                  className="min-h-11 border border-[color:var(--border)] px-3 text-[color:var(--fg-muted)]
                             active:text-[color:var(--fg)]"
                >
                  {chip}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </HoldRoomFrame>
  );
}
