export const LANDER_ROOMS = [
  { id: 'installation', name: 'Installation' },
  { id: 'tour', name: 'Tour' },
  { id: 'letgo', name: 'Let go' },
  { id: 'console', name: 'Console' },
] as const;

export type LanderRoomId = (typeof LANDER_ROOMS)[number]['id'];

const ROOM_KEY = 'mythcorp:lander-room';

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

/** First visit opens the Installation. Each later load opens the next room,
 *  so a reload always lands somewhere new. `?room=console` pins one for
 *  sharing or tests and leaves the rotation alone. Picked once per page load
 *  for the same reasons as the scene rotation in holdCompositions.ts. */
let roomPick: LanderRoomId | undefined;

export function takeLanderRoom(): LanderRoomId {
  roomPick ??= pickRoom();
  return roomPick;
}

/** A visitor's explicit switch counts as the room they last saw. */
export function rememberRoom(id: LanderRoomId) {
  roomPick = id;
  try {
    window.localStorage.setItem(ROOM_KEY, id);
  } catch {}
}

function pickRoom(): LanderRoomId {
  const pinned = roomById(new URLSearchParams(window.location.search).get('room'));
  if (pinned) return pinned;
  try {
    const last = roomById(window.localStorage.getItem(ROOM_KEY));
    const room = last ? nextRoom(last) : LANDER_ROOMS[0].id;
    window.localStorage.setItem(ROOM_KEY, room);
    return room;
  } catch {
    return LANDER_ROOMS[0].id;
  }
}
