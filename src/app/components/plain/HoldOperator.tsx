'use client';

import { openTerminal } from '../terminalEvents';
import entrance from './holdEntrance.module.css';

export function HoldOperator() {
  return (
    <details className={`${entrance.operator} relative self-end font-mono text-[11px]`}>
      <summary
        aria-label="0w0, operator notes"
        className="flex min-h-11 min-w-11 cursor-pointer items-center
                   text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]"
      >
        <span aria-hidden>0w0</span>
      </summary>
      <div className="mt-1 w-36 text-[color:var(--fg-muted)]">
        <p className="mb-2">One human. Many tabs.</p>
        <button
          type="button"
          onClick={openTerminal}
          aria-haspopup="dialog"
          className="flex min-h-11 w-full items-center justify-between
                     hover:text-[color:var(--fg)] focus-visible:text-[color:var(--fg)]"
        >
          Open console <kbd aria-hidden>/</kbd>
        </button>
        <a
          href="/robots.txt"
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center justify-between
                     hover:text-[color:var(--fg)] focus-visible:text-[color:var(--fg)]"
        >
          robots.txt <span aria-hidden>↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </details>
  );
}
