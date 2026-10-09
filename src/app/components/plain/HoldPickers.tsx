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
  const next = SCHEME_CHOICES[(SCHEME_CHOICES.indexOf(choice) + 1) % SCHEME_CHOICES.length];
  return (
    <>
      <div className="hidden items-center gap-x-3 sm:flex">
        {SCHEME_CHOICES.map((name) => (
          <PickerButton
            key={name}
            label={name}
            active={name === choice}
            onClick={() => onPick(name)}
          />
        ))}
      </div>
      {/* Phones: three 44px targets beside the wordmark and room switch wrap
          onto the title, so the picker becomes one control that cycles, like
          the readout rows. */}
      <button
        type="button"
        onClick={() => onPick(next)}
        aria-label={`Colour scheme, ${choice}. Activate for ${next}`}
        className="tracking-[0.16em] text-[color:var(--fg)] transition-colors
                   pointer-coarse:min-h-11 pointer-coarse:min-w-11 sm:hidden"
      >
        <span className="border-b border-current">
          <DisturbedText text={choice} strength={GENTLE} />
        </span>
      </button>
    </>
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
        'tracking-[0.16em] transition-colors pointer-coarse:min-h-11 pointer-coarse:min-w-11',
        active
          ? 'text-[color:var(--fg)]'
          : 'text-[color:var(--fg-subtle)] hover:text-[color:var(--fg)]',
      ].join(' ')}
    >
      {/* GENTLE, not FULL: the cursor is on this control precisely when its
          label matters, and DisturbedText keeps the real string in the DOM so
          `aria-pressed` still has something honest to name. */}
      <span className={`border-b ${active ? 'border-current' : 'border-transparent'}`}>
        <DisturbedText text={label} strength={GENTLE} />
      </span>
    </button>
  );
}
