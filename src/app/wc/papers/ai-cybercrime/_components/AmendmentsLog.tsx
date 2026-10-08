import type { ReactNode } from 'react';
import { Cite } from './PaperApparatus';

export const PAPER_VERSION = { label: 'v2.1', date: '2026-10-07' } as const;

type Effect = 'strengthens' | 'narrows' | 'reverses';

type Amendment = {
  id: string;
  date: string;
  topic: string;
  effect: Effect;
  before: ReactNode;
  now: ReactNode;
  evidence: ReactNode;
};

export const AMENDMENTS: ReadonlyArray<Amendment> = [
  {
    id: 'am-1',
    date: '2026-10-07',
    topic: 'Who closes the repair window',
    effect: 'narrows',
    before: 'The 2025 paper implied that AI is what collapses the time defenders have to patch.',
    now: 'AI arrives into a repair window that was already closing. My forecast is about whether AI makes it close faster, and how much repair can speed up in response.',
    evidence: (
      <>
        Mandiant&rsquo;s average time from disclosure to first exploitation fell from 63 days to 5 between 2018 and 2023,
        before AI agents existed,<Cite ids={['gtte-2024']} /> and sat at minus 7 days for 2025.<Cite ids={['mtrends-2026']} /> Older
        work had already found that attackers watching open-source repositories can get weeks to months of head start
        before disclosure.<Cite ids={['li-2017']} />
      </>
    ),
  },
  {
    id: 'am-2',
    date: '2026-10-07',
    topic: 'Is AI the first deskilling',
    effect: 'narrows',
    before: 'AI removes the need to understand the tools, a new kind of democratization.',
    now: 'This is the second wave. Crime-as-a-service already rented some attacks to buyers with no technical skill. AI extends that market to work services did not cover well, such as fluent, personal lures and routine code.',
    evidence: (
      <>
        Criminologists describe an industrialized underground where users buy attack capacity as a service and need no
        skill at all.<Cite ids={['collier-2021']} /> By 2023 malicious language-model services were sold on underground
        marketplaces and forums, cheaper for malicious code than traditional malware vendors.<Cite ids={['malla-2024']} />
      </>
    ),
  },
  {
    id: 'am-3',
    date: '2026-10-07',
    topic: 'When expert vulnerability work arrives',
    effect: 'strengthens',
    before: 'Stage 3 (then called Superhuman Coder) between 2027 and 2032; Stage 4 between 2030 and 2047.',
    now: 'Stage 3 abilities at the gated frontier in April 2026; Stage 4 forecast for 2028, low confidence. Independent benchmarks show lower success than the developer reports, so the frontier claims carry less weight than the dates suggest.',
    evidence: (
      <>
        Developer reports of expert-level vulnerability work in 2026.<Cite ids={['glasswing-2026-04', 'mythos-2026-04']} /> Academic
        tests: 13% of real web flaws on CVE-Bench<Cite ids={['cvebench-2025']} /> and about 20% on CyberGym.<Cite ids={['cybergym-2025']} />
      </>
    ),
  },
  {
    id: 'am-4',
    date: '2026-10-07',
    topic: 'The barrier scores',
    effect: 'narrows',
    before: 'Six attacks scored 1 to 10 from tables in another paper, with no rubric.',
    now: 'My ratings on a five-question rubric. The phishing rating has a controlled study behind it. Intrusion and new-flaw work stay low.',
    evidence: (
      <>
        Fully AI-written spear phishing drew the same click rate as emails from human experts, 54% against 12% for a
        generic control, in a study of 101 university-recruited participants.<Cite ids={['heiding-2024']} />
      </>
    ),
  },
  {
    id: 'am-5',
    date: '2026-10-07',
    topic: 'Is AI already making cybercrime worse',
    effect: 'reverses',
    before: 'The 2025 version said the pool of plausible attackers grows by orders of magnitude, and read as if harm was already rising.',
    now: 'I found no sign of an AI-driven crime wave in the harm data so far. The paper forecasts capability and access. It does not claim current harm.',
    evidence: (
      <>
        Ransomware payments fell from $1.25 billion in 2023 to $820 million in 2025.<Cite ids={['chainalysis-2025', 'chainalysis-2026']} /> AI-tagged
        losses were about 4% of the FBI&rsquo;s 2025 total.<Cite ids={['ic3-2025']} /> Mandiant does not count 2025 as the year AI
        directly caused breaches.<Cite ids={['mtrends-2026']} /> Police action has measurably cut rented attack services
        before.<Cite ids={['collier-2019']} />
      </>
    ),
  },
];

function EffectTag({ effect }: { effect: Effect }) {
  const style =
    effect === 'strengthens'
      ? 'border-[color:var(--fg-muted)] text-[color:var(--fg)]'
      : effect === 'narrows'
        ? 'border-dashed border-[color:var(--accent)] text-[color:var(--accent)]'
        : 'border-[color:var(--accent-warm)] bg-[color:var(--accent-warm)] text-[color:var(--bg)]';
  return (
    <span className={`inline-block border px-1.5 py-px font-mono text-[10px] uppercase tracking-widest ${style}`} style={{ borderRadius: 'var(--radius-sm)' }}>
      {effect}
    </span>
  );
}

export function AmendmentsLog() {
  return (
    <ol className="space-y-6">
      {AMENDMENTS.map((a, i) => (
        <li key={a.id} id={a.id} className="scroll-mt-28 border-t border-[color:var(--border-strong)] pt-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-mono text-xs text-[color:var(--accent)]">A{i + 1}</span>
            <span className="font-mono text-xs text-[color:var(--fg-subtle)]">{a.date}</span>
            <EffectTag effect={a.effect} />
          </div>
          <h3 className="mt-2 font-serif text-lg text-[color:var(--fg)]">{a.topic}</h3>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">claim before</dt>
              <dd className="mt-1 text-[color:var(--fg-muted)] line-through decoration-[color:var(--fg-subtle)] decoration-1">{a.before}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">claim now</dt>
              <dd className="mt-1 text-[color:var(--fg)]">{a.now}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">what moved it</dt>
              <dd className="mt-1 text-[color:var(--fg-muted)]">{a.evidence}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ol>
  );
}
