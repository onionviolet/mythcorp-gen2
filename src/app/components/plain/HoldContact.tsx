'use client';

// Walkthrough: /wc/learn/plain-mode

import Link from 'next/link';
import { DisturbedText, GENTLE } from './DisturbedText';
import { LinkedInInvite } from './LinkedInInvite';

/** The one place the contact details live. The console room prints them too. */
export const CONTACT = {
  email: 'info@mythcorp.com',
  phone: '(676) 767-7676',
  tel: '+16767677676',
  place: 'Chicago, IL',
  linkedin: 'https://www.linkedin.com/in/0w0/',
} as const;

const LINES = [CONTACT.email, CONTACT.phone, CONTACT.place.toUpperCase()] as const;

/**
 * The contact details set large in the backdrop of the lower third, where the
 * cursor erodes them like the rest of the room. aria-hidden: the corner links
 * below are the usable copy.
 */
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
      <a href={`mailto:${CONTACT.email}`} className="w-fit transition-colors hover:text-[color:var(--fg)]">
        <DisturbedText text={CONTACT.email} strength={GENTLE} />
      </a>
      <a href={`tel:${CONTACT.tel}`} className="w-fit transition-colors hover:text-[color:var(--fg)]">
        <DisturbedText text={CONTACT.phone} strength={GENTLE} />
      </a>
      <DisturbedText text={CONTACT.place} strength={GENTLE} />
      <Link href="/wc/papers/ai-cybercrime" className="w-fit transition-colors hover:text-[color:var(--fg)]">
        <DisturbedText text="Read the paper →" strength={GENTLE} />
      </Link>
    </address>
  );
}
