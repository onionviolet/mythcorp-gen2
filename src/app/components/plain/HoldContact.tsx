'use client';

// Walkthrough: /wc/learn/plain-mode

import Link from 'next/link';
import { LinkedInInvite } from './LinkedInInvite';

/** The one place the contact details live. The console room prints them too. */
export const CONTACT = {
  email: 'info@mythcorp.com',
  phone: '(676) 767-7676',
  tel: '+16767677676',
  place: 'Chicago, IL',
  linkedin: 'https://www.linkedin.com/in/0w0/',
} as const;

/** The reachable copy: small, in the corner, and actually clickable. */
export function HoldContactLinks() {
  return (
    <address className="ml-auto flex flex-col gap-1 not-italic font-mono text-[11px]
                        uppercase tracking-[0.18em] text-[color:var(--fg-subtle)]">
      <LinkedInInvite />
      <a
        href={`mailto:${CONTACT.email}`}
        className="w-fit transition-colors hover:text-[color:var(--fg)]"
      >
        {CONTACT.email}
      </a>
      <a
        href={`tel:${CONTACT.tel}`}
        className="w-fit transition-colors hover:text-[color:var(--fg)]"
      >
        {CONTACT.phone}
      </a>
      <span>{CONTACT.place}</span>
      <Link href="/wc/papers/ai-cybercrime" className="w-fit text-[color:var(--fg)] transition-colors hover:text-[color:var(--accent)]">
        Read the paper →
      </Link>
    </address>
  );
}
