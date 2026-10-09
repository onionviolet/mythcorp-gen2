'use client';

import type { ReactNode } from 'react';
import { DisturbedText } from './DisturbedText';
import { HoldContactLinks } from './HoldContact';
import { HoldOperator } from './HoldOperator';
import { SchemePicker } from './HoldPickers';
import type { Scheme, SchemeChoice } from './holdScheme';
import type { LanderRoomId } from './landerRooms';
import { useScramble } from './useScramble';
import entrance from './holdEntrance.module.css';

export type HoldRoomProps = {
  scheme: Scheme;
  schemeChoice: SchemeChoice;
  onSchemeChoice: (choice: SchemeChoice) => void;
  roomSwitch: ReactNode;
  onRoom: (room: LanderRoomId) => void;
};

/** The parts every front-page room keeps: who this is, how to switch rooms
 *  and schemes, and how to reach a person. A room owns only the middle.
 *  `scroll` lets that middle scroll while the top and bottom stay put. */
export function HoldRoomFrame({
  schemeChoice, onSchemeChoice, roomSwitch, children, scroll = false, chrome = 'solid',
}: HoldRoomProps & { children: ReactNode; scroll?: boolean; chrome?: 'solid' | 'over' }) {
  const wordmark = useScramble('MYTHCORP');
  const over = chrome === 'over';
  return (
    <div className={`${entrance.lander} fixed inset-0 z-10 flex flex-col`}>
      <header
        className={`${entrance.identity} relative z-20 flex items-center justify-between gap-4 p-5 font-mono text-xs sm:p-8
                    ${over ? 'pointer-events-none' : ''}`}
      >
        <DisturbedText text={wordmark} className="tracking-[0.3em] text-[color:var(--fg)] min-[380px]:tracking-[0.45em]" />
        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-x-3 gap-y-1 min-[380px]:gap-x-6 [-webkit-text-stroke:3px_var(--bg)] [paint-order:stroke_fill]">
          {roomSwitch}
          <SchemePicker choice={schemeChoice} onPick={onSchemeChoice} />
        </div>
      </header>
      <main className={`relative min-h-0 flex-1 ${scroll ? 'overflow-y-auto overscroll-contain' : ''}`}>
        {children}
      </main>
      <footer className="relative z-20 flex flex-wrap justify-between gap-5 p-5 font-mono text-xs sm:p-8">
        <HoldOperator />
        <HoldContactLinks />
      </footer>
    </div>
  );
}
