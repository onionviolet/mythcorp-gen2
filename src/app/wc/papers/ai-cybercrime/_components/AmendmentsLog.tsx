import type { ReactNode } from 'react';
import { Cite } from './PaperApparatus';

export const PAPER_VERSION = { label: 'v2.7', date: '2026-10-08' } as const;

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
        Mandiant&rsquo;s average time from patch release to first exploitation fell from 63 days to 5 between 2018 and 2023,
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
        The older record is concrete. Between about 2007 and 2011 the stolen-data market was already split into
        specialists for each step, from data theft to cash-out.<Cite ids={['hutchings-holt-2015']} /> In 2010 a banking-trojan kit
        sold for $3,000 to $19,000, and in 2012 botnet attack time rented for $30 to $70 an hour.<Cite ids={['dupont-2017']} /> By
        2014 a denial-of-service subscription had a median price of $4.00 a month, bought mostly by gamers; that survey
        heard back from only 13 of 51 operators it invited.<Cite ids={['hutchings-clayton-2016']} />
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
        tests: 13% of real web flaws on CVE-Bench<Cite ids={['cvebench-2025']} /> and about 20% on CyberGym.<Cite ids={['cybergym-2025']} /> The
        name Superhuman Coder is also AI 2027&rsquo;s, which put one in March 2027.<Cite ids={['ai2027-2025']} /> A critique
        argued its timeline model was built to blow up and fit METR&rsquo;s data poorly,<Cite ids={['titotal-2025']} /> and by
        April 2026 two of its authors had moved their medians for an automated coder from late 2029 and early 2032 to
        mid 2028 and mid 2030.<Cite ids={['aifutures-2026']} /> Dated stages, theirs and mine, move by years within a year.
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
    now: 'I found no sign of an AI-driven crime wave in the harm data so far. That is a statement about what official counts can show, which is a small and lopsided share of cybercrime, so it is not proof that no wave exists. The paper forecasts capability and access. It does not claim current harm.',
    evidence: (
      <>
        Ransomware payments fell from $1.25 billion in 2023 to $820 million in 2025.<Cite ids={['chainalysis-2025', 'chainalysis-2026']} /> AI-tagged
        losses were about 4% of the FBI&rsquo;s 2025 total.<Cite ids={['ic3-2025']} /> Mandiant does not count 2025 as the year AI
        directly caused breaches.<Cite ids={['mtrends-2026']} /> Police action has measurably cut rented attack services
        before.<Cite ids={['collier-2019']} /> The limit: in a Dutch survey of 97,186 crime victims from 2012 to 2015, only
        7.1% of hacking, 24.0% of consumer fraud and 26.3% of identity theft reached the police, against 37.5% for all
        crimes.<Cite ids={['vandeweijer-2019']} /> The 2026 International AI Safety Report, backed by more than 30 countries and international organizations,
        says criminals and state groups do use AI, and that it is still uncertain whether attackers or defenders gain
        more.<Cite ids={['iasr-2026']} /> Older economics points the same way on size: in 2019 new computer crimes cost a
        typical citizen tens of cents a year, against tens of dollars for payment fraud,<Cite ids={['anderson-2019']} /> and
        open underground markets were full of cheats, with their profits widely overestimated.<Cite ids={['herley-2009']} />
      </>
    ),
  },
  {
    id: 'am-6',
    date: '2026-10-07',
    topic: 'What actually limits fraud',
    effect: 'narrows',
    before: 'When AI writes the lure and fakes the voice, fraud becomes open to anyone.',
    now: 'AI cheapens the lure, the script and the call. The fraud networks studied most closely were limited by trusted people to move the money and to work on the inside, and AI does not supply those people.',
    evidence: (
      <>
        Eighteen Dutch police investigations of online-banking phishing and malware networks, 2004 to 2014: 13 grew only
        through offline social ties, core members bought their technical skill, and the scarce part was money mules,
        cashers and insiders at banks and phone companies.<Cite ids={['leukfeldt-2017']} /> Scope: Dutch cases, banking fraud
        only, and only the networks police chose to investigate.
      </>
    ),
  },
  {
    id: 'am-7',
    date: '2026-10-07',
    topic: 'Voice impersonation before AI',
    effect: 'narrows',
    before: 'Voice or video impersonation scored 0 before AI: no tools were on offer.',
    now: 'Generic voice impersonation was already for sale, so Q3 is now yes before AI and the row scores 2 before, 8 now. What was not for sale was the face or voice of a specific person the victim would recognize, which is what the Hong Kong case used.',
    evidence: (
      <>
        Stolen-data forums sold calls by hired voices to pass bank voice checks, around 10 to 12 WebMoney dollars a
        call,<Cite ids={['hutchings-holt-2015']} /> and Dutch phishing networks used human callers posing as bank
        staff.<Cite ids={['leukfeldt-2017']} /> The Hong Kong call faked the victim&rsquo;s own company executives.<Cite ids={['hk-2024']} />
      </>
    ),
  },
  {
    id: 'am-8',
    date: '2026-10-08',
    topic: 'What the open-weight lag means',
    effect: 'narrows',
    before: 'A shrinking gap between downloadable models and the frontier is a direct risk signal.',
    now: 'The lag measures how fast capability spreads. Whether a downloadable model adds risk beyond the tools attackers already have is a separate question that has not been answered yet, so I read the lag as a precondition for Ending A and nothing more.',
    evidence: (
      <>
        A broad review of open foundation models found current research insufficient to pin down their marginal risk,
        cyberattacks included.<Cite ids={['kapoor-2024']} /> Government measures of the lag itself: about four months from
        CAISI,<Cite ids={['caisi-2026-09']} /> four to eight months in the UK AI Security Institute&rsquo;s report, drawing on outside indexes.<Cite ids={['aisi-2025']} />
      </>
    ),
  },
  {
    id: 'am-9',
    date: '2026-10-08',
    topic: 'What minus 7 days measures',
    effect: 'narrows',
    before: 'The average time from disclosure to first exploitation reached minus 7 days, so repair now starts, on average, after the attack has.',
    now: 'Mandiant counts from patch release, not disclosure, and only zero-days can push that average below zero. Zero-days already ran for months before disclosure in 2008 to 2011, and in that data most attacks came after a flaw went public. The negative average says more about zero-days than about the typical attack.',
    evidence: (
      <>
        Field data from 11 million hosts found zero-day attacks lasting a median of 8 months before disclosure, and
        attacks on those flaws rising between 2 and 100,000 times once they were public.<Cite ids={['bilge-2012']} /> Mandiant
        defines its measure as time to exploitation before or after a patch is released, and zero-days were 70% of its 2023
        set, up from 62% in 2021 and 2022.<Cite ids={['gtte-2024']} /> Its 2026 report reads minus 7 days as exploitation
        before a patch exists.<Cite ids={['mtrends-2026']} />
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
