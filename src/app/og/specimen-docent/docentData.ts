/** Act copy follows the front page Tour room (components/plain/rooms/TourRoom.tsx).
 *  Copied rather than imported so the study can change pacing without touching
 *  the live room; the figures themselves are the real Tour figures. */

export type DocentFigure = 'paper' | 'doubt' | 'calhoun' | 'stars';

export type DocentAct = {
  id: string;
  /** What the readout calls this act when it holds the specimen's attention. */
  tag: string;
  title: string;
  status: string;
  body: string[];
  figure: DocentFigure | null;
  figureLabel: string;
  href?: string;
};

const LOCKED = 'not open yet';

export const DOCENT_ACTS: ReadonlyArray<DocentAct> = [
  {
    id: 'paper',
    tag: 'paper',
    title: 'A paper on AI and cybercrime',
    status: 'open now',
    href: '/wc/papers/ai-cybercrime',
    figure: 'paper',
    figureLabel: 'Barrier to entry for each attack, before AI and in October 2026.',
    body: [
      'This is a research paper I wrote in 2025, now revised into a web page you can read and poke at. It is the one door that is open.',
      'The figure is from it. Each line runs from an attack\'s score before AI to its score in October 2026, so you can see which ones opened up for non-experts and which are still gated. The 0 to 10 scores are my ratings on a five-question rubric shown with the figure, not measurements.',
    ],
  },
  {
    id: 'doubt',
    tag: 'doubt',
    title: 'How doubt gets manufactured',
    status: LOCKED,
    figure: 'doubt',
    figureLabel: 'Solar module price over time, and the share of new cars that are electric.',
    body: [
      'An essay on how some industries sell doubt to buy delay, and the one curve that kept falling anyway.',
      'The numbers are approximate and sourced in the essay. The shape is the point.',
    ],
  },
  {
    id: 'calhoun',
    tag: 'universe 25',
    title: 'Universe 25',
    status: LOCKED,
    figure: 'calhoun',
    figureLabel: 'The four phases of the colony, A to D.',
    body: [
      'John Calhoun built a mouse utopia in 1968 with unlimited food and no predators, and the colony still died out.',
      'My essay argues the story is about roles running out, not room. Step through the four phases it went through.',
    ],
  },
  {
    id: 'stars',
    tag: 'lab',
    title: 'A simulation lab',
    status: LOCKED,
    figure: 'stars',
    figureLabel: 'A small star field. The slider changes how many stars.',
    body: [
      'The full lab is a 3D simulation with controls for how it looks and moves.',
      'This is the pocket version I use in the walkthroughs, so it is lighter than the real thing.',
    ],
  },
  {
    id: 'contact',
    tag: 'door',
    title: 'If any of this sounds interesting, write to me.',
    status: 'end of the tour',
    figure: null,
    figureLabel: '',
    body: ['The contact links are on the front page, under the specimen.'],
  },
];
