'use client';

import { LANDER_ROOMS, nextRoom, roomName, type LanderRoomId } from './landerRooms';

/** Steps to the next front-page room without a reload. Reads as a line of
 *  the system, like the readout rows, not as a nav button. */
export function HoldRoomSwitch({ room, onRoom }: { room: LanderRoomId; onRoom: (room: LanderRoomId) => void }) {
  const index = LANDER_ROOMS.findIndex(item => item.id === room) + 1;
  const upcoming = nextRoom(room);
  return (
    <button
      type="button"
      onClick={() => onRoom(upcoming)}
      aria-label={`Room ${index} of ${LANDER_ROOMS.length}, ${roomName(room)}. Go to ${roomName(upcoming)}`}
      data-lander-room={room}
      className="group pointer-events-auto flex min-h-11 items-center gap-2 whitespace-nowrap font-mono text-[11px]
                 uppercase tracking-[0.18em] text-[color:var(--fg-subtle)] transition-colors
                 hover:text-[color:var(--fg)] focus-visible:text-[color:var(--fg)] sm:min-h-0"
    >
      <span className="max-[379px]:hidden">{index}/{LANDER_ROOMS.length}</span>
      <span className="text-[color:var(--fg)]">{roomName(room)}</span>
      <span aria-hidden className="hidden transition-transform group-hover:translate-x-0.5 sm:inline">
        → {roomName(upcoming)}
      </span>
    </button>
  );
}
