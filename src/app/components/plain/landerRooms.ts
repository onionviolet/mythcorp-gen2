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

export function roomFromUrl(url: URL): LanderRoomId {
  return roomById(url.searchParams.get('room')) ?? 'installation';
}

export function roomHref(id: LanderRoomId, url: URL) {
  const params = new URLSearchParams(url.search);
  params.delete('banner');
  if (id === 'installation') params.delete('room');
  else params.set('room', id);
  return url.pathname + (params.size ? '?' + params.toString() : '');
}
