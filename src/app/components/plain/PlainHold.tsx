'use client';

// Walkthrough: /wc/learn/plain-mode

import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { HOLD_ATTR, isHeld } from './holdState';
import { usePlainScheme } from './usePlainScheme';
import { HoldInstallation } from './HoldInstallation';
import { HoldRoomSwitch } from './HoldRoomSwitch';
import type { HoldRoomProps } from './HoldRoomFrame';
import { rememberRoom, takeLanderRoom, type LanderRoomId } from './landerRooms';

const LinkedInBanner = dynamic(() => import('./LinkedInBanner').then(m => m.LinkedInBanner), { ssr: false });

const TourRoom = dynamic(() => import('./rooms/TourRoom').then(m => m.TourRoom), { ssr: false });
const LetGoRoom = dynamic(() => import('./rooms/LetGoRoom').then(m => m.LetGoRoom), { ssr: false });
const ConsoleRoom = dynamic(() => import('./rooms/ConsoleRoom').then(m => m.ConsoleRoom), { ssr: false });

const ROOMS: Record<LanderRoomId, React.ComponentType<HoldRoomProps>> = {
  installation: HoldInstallation,
  tour: TourRoom,
  letgo: LetGoRoom,
  console: ConsoleRoom,
};

/**
 * The front page while the site is held: one of several rooms, a different
 * one on each reload, all keeping the identity and the contact links.
 */
export function PlainHold() {
  const { theme, ready } = useTheme();
  const pathname = usePathname() ?? '/';
  const held = isHeld(theme, pathname);
  const [banner, setBanner] = useState(false);
  const [room, setRoom] = useState<LanderRoomId | null>(null);
  const { choice, scheme, setChoice } = usePlainScheme();

  // The pre-paint script sets this attribute so the page never flashes its
  // real content. React only takes ownership once the stored theme has been
  // read back: acting a frame earlier would clear it on the default theme
  // and reveal the very page the script just hid.
  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    if (held) root.setAttribute(HOLD_ATTR, 'on');
    else root.removeAttribute(HOLD_ATTR);
    return () => {
      root.removeAttribute(HOLD_ATTR);
    };
  }, [held, ready]);

  useEffect(() => {
    const readBanner = () => {
      if (!held) return;
      const exportBanner = pathname === '/' && new URLSearchParams(window.location.search).get('banner') === 'linkedin';
      setBanner(exportBanner);
      if (!exportBanner) setRoom(takeLanderRoom());
    };
    readBanner();
    window.addEventListener('popstate', readBanner);
    return () => window.removeEventListener('popstate', readBanner);
  }, [held, pathname]);

  const openBanner = (next: boolean) => {
    window.history.pushState(null, '', next ? '/?banner=linkedin' : '/');
    setBanner(next);
    if (!next) setRoom(takeLanderRoom());
  };

  if (!held) return null;
  if (banner) return <LinkedInBanner scheme={scheme} schemeChoice={choice} onSchemeChoice={setChoice} onExit={() => openBanner(false)} />;

  const Room = room ? ROOMS[room] : null;
  const switchRoom = (next: LanderRoomId) => {
    rememberRoom(next);
    setRoom(next);
  };

  return (
    <>
      <h1 className="sr-only">Mythcorp, work in progress</h1>
      {Room && room && (
        <Room
          key={room}
          scheme={scheme}
          schemeChoice={choice}
          onSchemeChoice={setChoice}
          roomSwitch={<div className="flex flex-wrap items-center gap-x-6">
            <HoldRoomSwitch room={room} onRoom={switchRoom} />
            <Link href="/?banner=linkedin" onClick={event => { event.preventDefault(); openBanner(true); }}
              className="pointer-events-auto hidden min-h-11 content-center font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--fg-subtle)] hover:text-[color:var(--fg)] sm:block sm:min-h-0">Banner</Link>
          </div>}
          onRoom={switchRoom}
        />
      )}
    </>
  );
}
