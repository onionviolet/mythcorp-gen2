export type Sketch = {
  href: string;
  label: string;
  title: string;
  blurb: string;
  status: 'sketch' | 'graduated' | 'parked';
};

export const SKETCHES: ReadonlyArray<Sketch> = [
  {
    href: '/og/hero-lab',
    label: 'HERO LAB',
    title: 'Title + Model Study',
    blurb: 'An experimental hero composition with a wavy 3D title and spectre model.',
    status: 'sketch',
  },

  {
    href: '/og/animals',
    label: 'INTERMISSION',
    title: 'Animal Break Time',
    blurb: 'A live GIPHY intermission, pulled back to rebuild with licensed cute anime or animal art instead.',
    status: 'parked',
  },
  {
    href: '/og/doubt',
    label: 'DOUBT',
    title: 'Manufactured Doubt',
    blurb: 'How doubt gets manufactured to delay action (tobacco to climate), and the one honest reason for optimism it could not stop. Interactive solar + EV curves. Companion to the Calhoun ramble.',
    status: 'sketch',
  },
  {
    href: '/og/calhoun',
    label: 'CALHOUN',
    title: 'The Calhoun Effect',
    blurb: 'A ramble on Universe 25, what the mouse-utopia experiment is taken to mean vs. what it meant, and the doubt/slogan machinery in between. Links to a behavioral-sink mode in the lab.',
    status: 'sketch',
  },
  {
    href: '/og/interactive',
    label: 'INTERACTIVE',
    title: '"W I P" sideways type',
    blurb: 'CSS-only isometric 3D type. Placeholder for an actual interactive demo (R3F shader playground? scene picker?).',
    status: 'sketch',
  },
  {
    href: '/og/chat',
    label: 'CHAT',
    title: 'Local-only chat sandbox',
    blurb: 'A real chat UI with no backend. Useful as a placeholder until a WebSocket layer makes sense.',
    status: 'sketch',
  },
  {
    href: '/og/specimen-story',
    label: 'SPECIMEN STORY',
    title: 'How the Hold Works',
    blurb: 'A scroll tour of the holding installation, one working part at a time.',
    status: 'sketch',
  },
  {
    href: '/og/orbit',
    label: 'ORBIT',
    title: 'Spiral Index',
    blurb: 'The back-room sketches circle the spectre on a slow helix. Scroll and each one takes its turn at the front.',
    status: 'sketch',
  },
  {
    href: '/og/gravity',
    label: 'GRAVITY',
    title: 'Words With Weight',
    blurb: 'The holding page words fall, settle, and can be picked up and thrown.',
    status: 'sketch',
  },
  {
    href: '/fmhy',
    label: 'FMHY',
    title: 'FMHY backup (graduated)',
    blurb: 'Started here as a placeholder shell. Now a real backup-sites directory at /fmhy: mirrors pulled from the fmhy/edit backups list, for the days fmhy.net is down.',
    status: 'graduated',
  },
];

export const STATUS_CLASS: Record<Sketch['status'], string> = {
  sketch: 'border-[color:var(--border)] bg-[color:var(--bg-overlay)] text-[color:var(--fg-subtle)]',
  graduated: 'border-[color:var(--accent-soft)]/40 bg-[color:var(--accent-soft)]/10 text-[color:var(--accent-soft)]',
  parked: 'border-[color:var(--accent-warm)]/40 bg-[color:var(--accent-warm)]/10 text-[color:var(--accent-warm)]',
};
