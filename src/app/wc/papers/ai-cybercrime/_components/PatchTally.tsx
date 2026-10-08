import { Cite, FigureCaption } from './PaperApparatus';

export const PATCH_TALLY = { reported: 530, patched: 75, asOf: '2026-05-22' } as const;

export function PatchTally({ figureNumber }: { figureNumber: number }) {
  const { reported, patched, asOf } = PATCH_TALLY;
  const waiting = reported - patched;
  return (
    <figure className="mt-6">
      <div className="themed-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px]">
          <span className="text-[color:var(--fg-muted)]">
            high or critical flaws sent to open-source maintainers, as of {asOf}
          </span>
          <span className="text-[color:var(--fg-subtle)]">1 mark = 1 flaw</span>
        </div>
        <div
          role="img"
          aria-label={`${reported} flaws reported, ${patched} patched, ${waiting} without a patch`}
          className="mt-3 flex flex-wrap gap-[2px]"
        >
          {Array.from({ length: reported }, (_, i) => (
            <span
              key={i}
              className={`block h-[7px] w-[7px] ${i < patched ? 'bg-[color:var(--accent)]' : 'border border-[color:var(--border-strong)]'}`}
            />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs">
          <span className="flex items-center gap-1.5 text-[color:var(--fg)]">
            <span className="block h-2 w-2 bg-[color:var(--accent)]" /> {patched} patched
          </span>
          <span className="flex items-center gap-1.5 text-[color:var(--fg-muted)]">
            <span className="block h-2 w-2 border border-[color:var(--border-strong)]" /> {waiting} without a patch yet
          </span>
        </div>
      </div>
      <FigureCaption
        n={figureNumber}
        claim="In the first public count, about one in seven serious flaws that AI found and sent to open-source maintainers had a patch. This is a single snapshot, about six weeks after the program began, so it shows the queue at one moment and says nothing about where it went next."
        source={<>Anthropic, Project Glasswing initial update, {asOf}<Cite ids={['glasswing-2026-05']} />. Counts are the developer&rsquo;s own.</>}
      />
    </figure>
  );
}
