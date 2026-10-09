import { SKETCHES } from '../../../../og/sketches';
import { CONTACT } from '../../HoldContact';
import { chicagoClock } from '../../chicagoTime';
import { LANDER_ROOMS, nextRoom, roomName, type LanderRoomId } from '../../landerRooms';


type Entry = { name: string; line: string; href?: string };

const OVERRIDES: Record<string, string> = {
  fmhy: 'A directory of backup sites for the days fmhy.net is down.',
};

function firstSentence(text: string) {
  return text.match(/^.*?\.(?=\s[A-Z]|$)/)?.[0] ?? text;
}

const ENTRIES: Entry[] = [
  ...SKETCHES.map(s => {
    const name = s.href.split('/').pop() ?? s.label.toLowerCase();
    return { name, line: OVERRIDES[name] ?? firstSentence(s.blurb) };
  }),
  { name: 'ai-cybercrime', line: 'A paper on how AI lowers the barrier to cybercrime. Revised October 2026, and open.', href: '/wc/papers/ai-cybercrime' },
];

export const NAMES = ENTRIES.map(e => e.name);
export const COMMANDS = [
  'help', 'whoami', 'contact', 'linkedin', 'ls', 'cat', 'open', 'rooms', 'room', 'clear',
];
export const CHIPS = ['help', 'whoami', 'contact', 'ls', 'rooms', 'linkedin', 'clear'];

export type Result = { lines: string[]; action?: 'clear' | 'linkedin' | 'room' | 'navigate'; room?: LanderRoomId; href?: string };

export function run(input: string, current: LanderRoomId): Result {
  const [cmd = '', ...rest] = input.trim().split(/\s+/);
  const arg = rest.join(' ').toLowerCase();
  switch (cmd.toLowerCase()) {
    case '':
      return { lines: [] };
    case 'help':
      return { lines: [
        'help      this list',
        'whoami    who runs this',
        'contact   how to reach a person',
        'linkedin  open the profile in a new tab',
        'ls        the back rooms',
        'cat NAME  one line about a back room',
        'open NAME try a door',
        'rooms     the front-page rooms',
        'clear     empty the screen',
        'Tab completes. Up and down bring back old commands.',
      ] };
    case 'whoami':
      return { lines: ['0w0. One human, many tabs.', `Based in ${CONTACT.place}.`] };
    case 'contact':
      return { lines: [CONTACT.email, CONTACT.phone, CONTACT.place, CONTACT.linkedin] };
    case 'linkedin':
      return { lines: ['Opening LinkedIn in a new tab.'], action: 'linkedin' };
    case 'ls':
      return { lines: [
        'Back rooms. One is open; the rest stay locked while the site is being built.',
        ...ENTRIES.map(e => `${e.name.padEnd(16)}${e.href ? 'open' : 'locked'}`),
      ] };
    case 'cat': {
      if (!arg) return { lines: ['cat what? Try ls to see the names.'] };
      const hit = ENTRIES.find(e => e.name === arg);
      return { lines: [hit ? hit.line : `No room called "${arg}". ls lists them.`] };
    }
    case 'open': {
      if (!arg) return { lines: ['open what? Try ls to see the names.'] };
      const hit = ENTRIES.find(e => e.name === arg);
      if (hit?.href) return { lines: [`Opening ${hit.name}.`], action: 'navigate', href: hit.href };
      return { lines: [hit
        ? `${hit.name} is locked. The door stays shut while the site is being built.`
        : `No room called "${arg}". ls lists them.`] };
    }
    case 'rooms':
      return { lines: [
        ...LANDER_ROOMS.map(r => `${r.id.padEnd(14)}${r.name}${r.id === current ? '  (you are here)' : ''}`),
        'room ID walks you to one. The switch at the top right steps through them.',
      ] };
    case 'room': {
      const hit = LANDER_ROOMS.find(r => r.id === arg);
      if (!arg || !hit) return { lines: [`room ID, where ID is one of: ${LANDER_ROOMS.map(r => r.id).join(', ')}.`] };
      if (hit.id === current) return { lines: ['You are already here.'] };
      return { lines: [`Walking you to ${hit.name}.`], action: 'room', room: hit.id };
    }
    case 'clear':
      return { lines: [], action: 'clear' };
    default:
      return { lines: [`I do not know "${cmd}". help lists what I do know.`] };
  }
}

export function complete(buffer: string): string {
  const m = buffer.match(/^(\S*)(\s+)?(.*)$/);
  if (!m) return buffer;
  const [, head, gap, tail] = m;
  if (!gap) {
    const hits = COMMANDS.filter(c => c.startsWith(head.toLowerCase()));
    return hits.length === 1 ? `${hits[0]} ` : buffer;
  }
  if (head === 'cat' || head === 'open') {
    const hits = NAMES.filter(n => n.startsWith(tail.toLowerCase()));
    return hits.length === 1 ? `${head} ${hits[0]}` : buffer;
  }
  if (head === 'room') {
    const hits = LANDER_ROOMS.filter(r => r.id.startsWith(tail.toLowerCase()));
    return hits.length === 1 ? `room ${hits[0].id}` : buffer;
  }
  return buffer;
}

export function bootLines(current: LanderRoomId): string[] {
  const now = new Date();
  const fmt = (tz?: string) =>
    now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', timeZone: tz });
  const yes = (q: string) => window.matchMedia(q).matches;
  return [
    'mythcorp internal terminal',
    `your time      ${fmt()}`,
    `chicago time   ${chicagoClock(now)}`,
    `reduced motion ${yes('(prefers-reduced-motion: reduce)') ? 'preferred' : 'not asked for'}`,
    `dark mode      ${yes('(prefers-color-scheme: dark)') ? 'preferred' : 'not asked for'}`,
    `front rooms    ${LANDER_ROOMS.length}`,
    `this room      ${roomName(current)}`,
    `next room      ${roomName(nextRoom(current))}`,
    yes('(pointer: coarse)') ? 'Type help, or tap a command below.' : 'Type help to start.',
  ];
}
