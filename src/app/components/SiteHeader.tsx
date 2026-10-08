'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { SITE_LOCKED } from '../../siteLock';

type NavItem = { href: string; label: string };

const DEFAULT_NAV: ReadonlyArray<NavItem> = [
  { href: '/about', label: 'ABOUT' },
  { href: '/contact', label: 'CONTACT' },
  { href: '/wc', label: 'WC' },
];

const MENU_LINKS: ReadonlyArray<NavItem> = [
  { href: '/', label: 'Home' },
  { href: '/experience', label: '3D experience' },
  { href: '/wc', label: 'The back room' },
  { href: '/wc/learn', label: 'Walkthroughs' },
  { href: '/wc/papers', label: 'Papers' },
  { href: '/og', label: 'Sketches' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

interface SiteHeaderProps {
  nav?: ReadonlyArray<NavItem>;
  tagline?: string;
  logoIsLink?: boolean;
}

export function SiteHeader({
  nav = DEFAULT_NAV,
  tagline = 'FOUNDED IN CHICAGO',
  logoIsLink = true,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click + ESC.
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Close on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const LOGO_CLASS =
    'font-serif text-xl font-semibold tracking-wider text-[color:var(--fg)] drop-shadow-[0_0_12px_var(--accent-glow)] sm:text-2xl';

  return (
    <header className="fixed top-0 left-0 right-0 z-30
                       border-b border-[color:var(--border)]
                       bg-[color:var(--bg-overlay)] backdrop-blur-md">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3 sm:px-6 sm:py-4">
        {/* Left: real hamburger menu (now a working dropdown) */}
        <div ref={menuRef} className="relative">
          {!SITE_LOCKED && (<>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open menu"
            className="flex items-center gap-2 rounded px-1.5 py-1
                       transition-opacity hover:opacity-80"
          >
            <span aria-hidden className="flex h-6 w-6 flex-col justify-center gap-1">
              <span className={`h-0.5 bg-[color:var(--fg)] transition-all duration-200 ${menuOpen ? 'w-full translate-y-1.5 rotate-45' : 'w-full'}`} />
              <span className={`h-0.5 bg-[color:var(--fg)] transition-all duration-200 ${menuOpen ? 'w-full opacity-0' : 'w-1/2'}`} />
              <span className={`h-0.5 bg-[color:var(--fg)] transition-all duration-200 ${menuOpen ? 'w-full -translate-y-1.5 -rotate-45' : 'w-full'}`} />
            </span>
            <span className="hidden text-sm font-medium tracking-wide text-[color:var(--fg)] sm:inline">
              {menuOpen ? 'CLOSE' : 'MENU'}
            </span>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute left-0 top-full mt-3 w-64 overflow-hidden
                         rounded-xl border border-[color:var(--border-strong)]
                         bg-[color:var(--bg-overlay)] shadow-2xl backdrop-blur-md
                         site-menu-in"
            >
              <style>{`
                @keyframes siteMenuIn {
                  from { opacity: 0; transform: translateY(-6px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
                .site-menu-in { animation: siteMenuIn 0.18s ease-out; }
              `}</style>
              <ul className="py-2">
                {MENU_LINKS.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href} role="none">
                      <Link
                        role="menuitem"
                        href={item.href}
                        className={[
                          'flex items-center justify-between gap-3 px-4 py-2 text-sm transition-colors',
                          active
                            ? 'bg-[color:var(--accent)]/10 text-[color:var(--accent)]'
                            : 'text-[color:var(--fg)] hover:bg-[color:var(--bg-elevated)] hover:text-[color:var(--accent-soft)]',
                        ].join(' ')}
                      >
                        <span>{item.label}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
                          {item.href}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          </>)}
        </div>

        {/* Center: logo */}
        <div className="flex flex-col items-center text-center">
          {/* Rendered as two explicit branches rather than one dynamic tag with
              spread props. The old version aliased Link-or-'span' into a
              variable, which TypeScript cannot narrow, so it needed an `as any`
              to spread href onto something that might be a span. Writing both
              cases out is longer and needs no cast. */}
          {logoIsLink ? (
            <Link href="/" className={LOGO_CLASS}>
              MYTHCORP
            </Link>
          ) : (
            <span className={LOGO_CLASS}>MYTHCORP</span>
          )}
          {tagline && (
            <span className="mt-0.5 text-[10px] font-mono uppercase tracking-[0.25em]
                             text-[color:var(--fg-muted)] sm:text-xs">
              {tagline}
            </span>
          )}
        </div>

        {/* Right: nav links + theme switcher */}
        <nav className="flex items-center justify-self-end gap-2 sm:gap-4">
          <ul className="hidden items-center gap-4 sm:flex">
            {(SITE_LOCKED ? [] : nav).map((item) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      'text-xs font-medium tracking-widest transition-colors sm:text-sm',
                      active
                        ? 'text-[color:var(--accent)] underline underline-offset-4'
                        : 'text-[color:var(--fg)] hover:text-[color:var(--accent-soft)]',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {!SITE_LOCKED && <ThemeSwitcher compact />}
        </nav>
      </div>
    </header>
  );
}
