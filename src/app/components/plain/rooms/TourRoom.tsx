'use client';

import { useEffect, useRef, useState } from 'react';
import { HoldRoomFrame, type HoldRoomProps } from '../HoldRoomFrame';
import { TourAct, scrollParent } from './tour/TourAct';
import { CalhounFigure, DoubtFigure, PaperFigure, StarFigure } from './tour/tourFigures';

const LOCKED = 'not open yet';

const ACTS = [
  {
    title: 'A paper on AI and cybercrime',
    figureLabel: 'Barrier to entry, before and after AI. Toggle between the two.',
    body: [
      'This is a research paper I wrote in 2025, now being turned into a web page you can poke at.',
      'The figure is from it. Flip between before AI and October 2026 to compare how reachable each attack is for a non-expert. The 1 to 10 scores are my ratings on a five-question rubric shown with the figure, not measurements.',
    ],
    figure: <PaperFigure />,
  },
  {
    title: 'How doubt gets manufactured',
    figureLabel: 'Solar module price over time, and the share of new cars that are electric.',
    body: [
      'An essay on how some industries sell doubt to buy delay, and the one curve that kept falling anyway.',
      'The numbers are approximate and sourced in the essay. The shape is the point.',
    ],
    figure: <DoubtFigure />,
  },
  {
    title: 'Universe 25',
    figureLabel: 'The four phases of the colony, A to D.',
    body: [
      'John Calhoun built a mouse utopia in 1968 with unlimited food and no predators, and the colony still died out.',
      'My essay argues the story is about roles running out, not room. Step through the four phases it went through.',
    ],
    figure: <CalhounFigure />,
  },
  {
    title: 'A simulation lab',
    figureLabel: 'A small star field. The slider changes how many stars.',
    body: [
      'The full lab is a 3D simulation with controls for how it looks and moves.',
      'This is the pocket version I use in the walkthroughs, so it is lighter than the real thing.',
    ],
    figure: <StarFigure />,
  },
] as const;

const TOTAL = ACTS.length + 1;

export function TourRoom(props: HoldRoomProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.act));
        }
      },
      { root: scrollParent(root), rootMargin: '-45% 0px -45% 0px' },
    );
    root.querySelectorAll('[data-act]').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <HoldRoomFrame {...props} scroll>
      <div ref={rootRef} className="relative">
        <div className="pointer-events-none sticky top-0 z-10 bg-[color:var(--bg)] px-5 py-2 font-mono text-xs text-[color:var(--fg-muted)] sm:px-8">
          <span aria-live="polite">
            The locked rooms · act {active} of {TOTAL}
          </span>
        </div>
        <p className="mx-auto max-w-3xl px-5 pt-6 text-sm text-[color:var(--fg-muted)] sm:px-8 sm:text-base">
          The rest of this site is closed while I finish it. Here is what is behind the door. Scroll.
        </p>
        {ACTS.map((act, i) => (
          <TourAct key={act.title} n={i + 1} total={TOTAL} title={act.title} status={LOCKED} figure={act.figure} figureLabel={act.figureLabel}>
            {act.body.map(line => <p key={line}>{line}</p>)}
          </TourAct>
        ))}
        <section
          data-act={TOTAL}
          aria-label="Contact"
          className="mx-auto flex min-h-[60%] w-full max-w-3xl flex-col justify-center px-5 py-14 sm:px-8"
        >
          <p className="font-mono text-xs text-[color:var(--fg-subtle)]">{TOTAL} of {TOTAL}</p>
          <p className="mt-2 text-2xl text-[color:var(--fg)] sm:text-3xl">If any of this sounds interesting, write to me. The links are below.</p>
        </section>
      </div>
    </HoldRoomFrame>
  );
}
