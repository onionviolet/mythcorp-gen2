'use client';

// Walkthrough: /wc/learn/plain-mode

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { HOLD_ATTR, isHeld } from './holdState';
import { usePlainScheme } from './usePlainScheme';
import { PaperLink } from './HoldContact';
import { HoldInstallation } from './HoldInstallation';
import { HoldRoomSwitch } from './HoldRoomSwitch';
import type { HoldRoomProps } from './HoldRoomFrame';
import { roomFromUrl, roomHref, type LanderRoomId } from './landerRooms';
import { noteRoom } from './anomalyLedger';
import { beginDrop, captureDrop } from './roomDrop';
import { LetGoRoom } from './rooms/LetGoRoom';
import { TourRoom } from './rooms/TourRoom';

const LinkedInBanner = dynamic(() => import('./LinkedInBanner').then(m => m.LinkedInBanner), { ssr: false });
const ConsoleRoom = dynamic(() => import('./rooms/ConsoleRoom').then(m => m.ConsoleRoom), { ssr: false });

const ROOMS: Record<LanderRoomId, React.ComponentType<HoldRoomProps>> = {
  installation: HoldInstallation,
  tour: TourRoom,
  letgo: LetGoRoom,
  console: ConsoleRoom,
};

/**
 * The held home opens the Installation by default. Room links and history
 * select the other rooms while preserving the scene parameters.
 */
export function PlainHold() {
  const { theme, ready } = useTheme();
  const pathname = usePathname() ?? '/';
  const held = isHeld(theme, pathname);
  const [banner, setBanner] = useState(false);
  const [room, setRoom] = useState<LanderRoomId | null>(null);
  const currentRoom = useRef<LanderRoomId | null>(null);
  const origin = useRef<DOMRect | null>(null);
  const drop = useRef<ReturnType<typeof captureDrop>>(null);
  const dropping = useRef<Animation | null>(null);
  const [dropDirection, setDropDirection] = useState<'down' | 'up' | null>(null);
  const [throughRibbon, setThroughRibbon] = useState(false);
  const enterRoom = useCallback((next: LanderRoomId) => {
    const previous = currentRoom.current;
    if (previous === next) return;
    const paired = (previous === 'installation' && next === 'tour') || (previous === 'tour' && next === 'installation');
    const down = previous === 'tour' && next === 'letgo';
    const up = previous === 'letgo' && next === 'tour';
    drop.current = down || up ? captureDrop(down, dropping.current) : null;
    setDropDirection(down ? 'down' : up ? 'up' : null);
    origin.current = paired ? document.querySelector('[data-door-ribbon]')?.getBoundingClientRect() ?? null : null;
    setThroughRibbon(paired);
    currentRoom.current = next;
    setRoom(next);
  }, []);

  useLayoutEffect(() => {
    if (!throughRibbon || !room) return;
    document.querySelector<HTMLElement>('[data-lander-room]')?.focus({ preventScroll: true });
    const ribbon = document.querySelector<SVGSVGElement>('[data-door-ribbon]');
    const from = origin.current;
    if (!ribbon || !from || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const to = ribbon.getBoundingClientRect();
    if (!to.width || !to.height) return;
    const transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
    const animation = ribbon.animate([{ transform }, { transform: 'none' }], {
      duration: 320, easing: 'cubic-bezier(.22,.7,.2,1)',
    });
    return () => animation.cancel();
  }, [room, throughRibbon]);
  useLayoutEffect(() => {
    if (!dropDirection) return;
    const target = document.querySelector<HTMLElement>('[data-lander-room]');
    if (!target) return;
    if (dropDirection === 'up') {
      const scroller = document.querySelector('[data-tour-scroll]');
      if (scroller) scroller.scrollTop = Number(window.history.state?.tourScroll) || 0;
    }
    target.focus({ preventScroll: true });
    if (!drop.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const run = beginDrop(dropDirection, target, drop.current);
    dropping.current = run.animation;
    return () => {
      run.dispose();
      dropping.current = null;
    };
  }, [room, dropDirection]);

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
      if (!exportBanner) enterRoom(roomFromUrl(new URL(window.location.href)));
    };
    readBanner();
    window.addEventListener('popstate', readBanner);
    return () => window.removeEventListener('popstate', readBanner);
  }, [held, pathname, enterRoom]);

  useEffect(() => {
    if (room) noteRoom(room);
  }, [room]);

  const openBanner = (next: boolean) => {
    window.history.pushState(null, '', next ? '/?banner=linkedin' : '/');
    setBanner(next);
    if (!next) enterRoom(roomFromUrl(new URL(window.location.href)));
  };

  if (!held) return null;
  if (banner) return <LinkedInBanner scheme={scheme} schemeChoice={choice} onSchemeChoice={setChoice} onExit={() => openBanner(false)} />;

  const Room = room ? ROOMS[room] : null;
  const switchRoom = (next: LanderRoomId) => {
    if (next === currentRoom.current) return;
    if (currentRoom.current === 'tour' && next === 'letgo') {
      const tourScroll = document.querySelector('[data-tour-scroll]')?.scrollTop ?? 0;
      window.history.replaceState({ ...window.history.state, tourScroll }, '');
    }
    window.history.pushState(null, '', roomHref(next, new URL(window.location.href)));
    enterRoom(next);
  };

  return (
    <>
      <h1 className="sr-only">Mythcorp, work in progress</h1>
      {!room && <div className="fixed bottom-4 right-4 z-10"><PaperLink /></div>}
      {Room && room && (
        <Room
          key={room}
          doorArrival={throughRibbon || Boolean(dropDirection)}
          scheme={scheme}
          schemeChoice={choice}
          onSchemeChoice={setChoice}
          // The banner export stays at /?banner=linkedin; it is a tool for me, not a
          // room for visitors, so it has no link in the header.
          roomSwitch={<HoldRoomSwitch room={room} onRoom={switchRoom} />}
          onRoom={switchRoom}
        />
      )}
    </>
  );
}
