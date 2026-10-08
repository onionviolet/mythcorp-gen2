export const LANDER_ROOMS = [
  { id: 'installation', name: 'Installation' },
  { id: 'tour', name: 'Tour' },
  { id: 'letgo', name: 'Let go' },
  { id: 'console', name: 'Console' },
] as const;

export type LanderRoomId = (typeof LANDER_ROOMS)[number]['id'];

export function roomName(id: LanderRoomId): string {
  return LANDER_ROOMS.find(room => room.id === id)?.name ?? id;
}

export function nextRoom(id: LanderRoomId): LanderRoomId {
  const i = LANDER_ROOMS.findIndex(room => room.id === id);
  return LANDER_ROOMS[(i + 1) % LANDER_ROOMS.length].id;
}

function roomById(id: string | null | undefined): LanderRoomId | undefined {
  const wanted = id?.toLowerCase();
  return LANDER_ROOMS.find(room => room.id === wanted)?.id;
}

/** Every load opens the Installation, the signature room; its scenes still
 *  rotate per load (holdCompositions.ts). The other rooms are one click away
 *  on the switch, and `?room=console` links straight to one. Picked once per
 *  page load so a re-run effect cannot change it. */
let roomPick: LanderRoomId | undefined;

export function takeLanderRoom(): LanderRoomId {
  roomPick ??= roomById(new URLSearchParams(window.location.search).get('room')) ?? LANDER_ROOMS[0].id;
  return roomPick;
}

/** A visitor's explicit switch becomes this load's room. */
export function rememberRoom(id: LanderRoomId) {
  roomPick = id;
}
