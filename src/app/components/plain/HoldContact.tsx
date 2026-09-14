'use client';

// Walkthrough: /wc/learn/plain-mode

/**
 * The contact details, sitting in the backdrop rather than behind a link.
 * There is nowhere else to go from this screen, so the one thing a visitor
 * might actually want is set large and left in the room with them.
 *
 * It lives in the lower third on purpose. The field draws WORK IN PROGRESS
 * across the upper third, and when both sat centred neither could be read.
 *
 * aria-hidden is deliberate: the same three values are in the DOM once more,
 * as real mailto/tel links in the corner, and a screen reader should be given
 * the usable copy rather than this one.
 */
import { DisturbedText, GENTLE } from './DisturbedText';
import { LinkedInInvite } from './LinkedInInvite';

const LINES = ['info@mythcorp.com', '(676) 767-7676', 'CHICAGO, IL'] as const;

export function HoldContact() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 flex flex-col items-center
                 justify-end gap-[0.3em] overflow-hidden pb-[24vh] font-mono
                 text-[color:var(--fg)] opacity-[0.055]"
    >
      {LINES.map((line) => (
        <DisturbedText
          key={line}
          text={line}
          className="whitespace-nowrap text-[4.4vw] leading-none tracking-[0.08em]"
        />
      ))}
    </div>
  );
}

/** The reachable copy: small, in the corner, and actually clickable. */
export function HoldContactLinks() {
  return (
    <address className="ml-auto flex flex-col gap-1 not-italic font-mono text-[11px]
                        uppercase tracking-[0.18em] text-[color:var(--fg-subtle)]">
      <LinkedInInvite />
      <a
        href="mailto:info@mythcorp.com"
        className="w-fit transition-colors hover:text-[color:var(--fg)]"
      >
        <DisturbedText text="info@mythcorp.com" strength={GENTLE} />
      </a>
      <a
        href="tel:+16767677676"
        className="w-fit transition-colors hover:text-[color:var(--fg)]"
      >
        <DisturbedText text="(676) 767-7676" strength={GENTLE} />
      </a>
      <DisturbedText text="Chicago, IL" strength={GENTLE} />
    </address>
  );
}
