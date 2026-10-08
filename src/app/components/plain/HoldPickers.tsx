'use client';

// Walkthrough: /wc/learn/plain-mode

import { DisturbedText, GENTLE } from './DisturbedText';
import { SCHEME_CHOICES, type SchemeChoice } from './holdScheme';

/** Light/dark picker. The other controls are rows in `HoldStatus`. */
export function SchemePicker({
  choice,
  onPick,
}: {
  choice: SchemeChoice;
  onPick: (c: SchemeChoice) => void;
}) {
  return (
    <div className="flex items-center gap-x-3">
      {SCHEME_CHOICES.map((name) => (
        <PickerButton
          key={name}
          label={name}
          active={name === choice}
          onClick={() => onPick(name)}
        />
      ))}
    </div>
  );
}

function PickerButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'tracking-[0.16em] transition-colors',
        active
          ? 'text-[color:var(--fg)] underline underline-offset-4'
          : 'text-[color:var(--fg-subtle)] hover:text-[color:var(--fg)]',
      ].join(' ')}
    >
      {/* GENTLE, not FULL: the cursor is on this control precisely when its
          label matters, and DisturbedText keeps the real string in the DOM so
          `aria-pressed` still has something honest to name. */}
      <DisturbedText text={label} strength={GENTLE} />
    </button>
  );
}
