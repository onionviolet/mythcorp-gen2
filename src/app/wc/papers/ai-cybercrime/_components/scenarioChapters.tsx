import type { ReactNode } from 'react';
import { Cite } from './PaperApparatus';
import { PatchTally } from './PatchTally';
import type { Vignette } from './StoryVignette';
import { CENTRAL_DOUBLING_DAYS, horizonLabel, projectedMinutes } from './horizonModel';
import { FIGURE } from './figureNumbers';

export type IndicatorStatus = 'measured' | 'scenario' | 'not measured';

export type IndicatorReading = { value: string; status: IndicatorStatus };

export type IndicatorKey = 'horizon' | 'lag' | 'repair';

export const INDICATORS: ReadonlyArray<{ key: IndicatorKey; name: string; definition: string }> = [
  {
    key: 'horizon',
    name: 'Agent time horizon',
    definition: 'Length of a software task, in skilled-human time, that the best agent METR measured completes half the time. Software tasks, not attacks.',
  },
  {
    key: 'lag',
    name: 'Open-weight lag',
    definition: 'How far the best downloadable model trails the US frontier on CAISI\'s cyber benchmarks, in months. First measured September 2026.',
  },
  {
    key: 'repair',
    name: 'Found vs fixed',
    definition: 'Serious flaws found by AI systems compared with flaws actually patched, where someone has published both counts.',
  },
];

export type ScenarioChapter = {
  id: string;
  when: string;
  stage: 1 | 2 | 3 | 4;
  stageName: string;
  kind: 'evidence' | 'forecast';
  confidence: string;
  body: ReactNode;
  trigger: ReactNode;
  attackers: ReactNode;
  defenders: ReactNode;
  inference: ReactNode;
  readings: Record<IndicatorKey, IndicatorReading>;
  year: number;
  vignette?: Vignette;
};

const projected = (iso: string) =>
  `${horizonLabel(projectedMinutes(Date.parse(iso), CENTRAL_DOUBLING_DAYS))}`;

export const SCENARIO_CHAPTERS: ReadonlyArray<ScenarioChapter> = [
  {
    id: 'ch-2024',
    when: '2023 to 2024',
    stage: 1,
    stageName: 'Assistant',
    kind: 'evidence',
    confidence: 'observed',
    body: (
      <>
        <p>
          Attackers use chat models the way everyone else does. Microsoft and OpenAI name five
          state-linked groups using them for reconnaissance, coding help and translation, and find
          nothing new in kind.<Cite ids={['msft-2024']} /> The NCSC expects the biggest gain to go
          to less-skilled criminals writing phishing lures, from a low base.<Cite ids={['ncsc-2024']} />
        </p>
        <p>
          The case that looks like the future is the Hong Kong video call. A finance employee sends
          HK$200 million across 15 transfers after a meeting in which everyone else on screen is a
          deepfake.<Cite ids={['hk-2024']} />
        </p>
      </>
    ),
    trigger: 'Public chat models that write fluent text and short working scripts.',
    attackers: 'Faster research and better writing. No new kind of attack on the record.',
    defenders: (
      <>An AI agent finds its first real exploitable bug in widely used software, fixed before release.<Cite ids={['bigsleep-2024']} /></>
    ),
    inference: (
      <p>
        I call this Stage 1 because the human plans and runs every step and the model answers
        questions. Every report from this period describes speed-ups to existing work.
      </p>
    ),
    year: 2024,
    readings: {
      horizon: { value: 'about 1 h by Mar 2025', status: 'measured' },
      lag: { value: 'no measure yet', status: 'not measured' },
      repair: { value: 'no public count', status: 'not measured' },
    },
  },
  {
    id: 'ch-2025',
    when: '2025',
    stage: 2,
    stageName: 'Supervised agent',
    kind: 'evidence',
    confidence: 'observed, self-reported by developers',
    body: (
      <>
        <p>
          In January Google still describes AI as a productivity tool for attackers.<Cite ids={['gtig-2025-01']} /> By
          August, Anthropic reports one actor using an AI coding agent throughout an extortion campaign
          against at least 17 organizations, and another selling ransomware they appeared unable to build
          without AI.<Cite ids={['anthropic-2025-08']} />
        </p>
        <p>
          In November Google sees malware that queries a language model while it runs.<Cite ids={['gtig-2025-11']} /> Anthropic
          reports a state-sponsored espionage campaign in which AI did an estimated 80 to 90% of the work and
          humans stepped in at 4 to 6 decisions. The same report says the agent sometimes invented
          credentials and overstated what it had found.<Cite ids={['anthropic-2025-11']} /> The human has become a
          supervisor, and the agent is still unreliable.
        </p>
      </>
    ),
    trigger: 'Agents that use tools in a loop for hours instead of answering one prompt.',
    attackers: 'A small crew directs an operation that the AI mostly carries out.',
    defenders: (
      <>DARPA&rsquo;s finalists find 86% of planted flaws at about $152 a task.<Cite ids={['aixcc-2025']} /> An autonomous tester tops a bug-bounty leaderboard, with humans reviewing each report.<Cite ids={['xbow-2025']} /></>
    ),
    inference: (
      <p>
        METR&rsquo;s best measured agent went from about an hour (March 2025) to 320 minutes on its newer
        suite (January 2026).<Cite ids={['metr-2025', 'metr-2026-01']} /> Multi-hour autonomy is what lets an agent
        carry a campaign between human check-ins, which is the pattern the November report describes.
      </p>
    ),
    year: 2025,
    vignette: {
      when: '2025',
      builtFrom: ['gtig-2025-11', 'malla-2024', 'tidelift-2024', 'xbow-2025'],
      body: (
        <>
          <p>
            Alex is 19 and spends most nights on game servers. In a forum he scrolls past an ad for an AI tool that
            writes malicious code, sold by subscription for less than the old malware kits cost. He does not buy it. He
            is not sure what he would do with it.
          </p>
          <p>
            Ines maintains a small open-source library after work, unpaid. A bug report arrives from an automated
            tester, polite and correct. She fixes it on a Sunday.
          </p>
        </>
      ),
    },
    readings: {
      horizon: { value: '320 min, top model', status: 'measured' },
      lag: { value: 'no measure yet', status: 'not measured' },
      repair: { value: '54 of 63 found, 43 patched (contest)', status: 'measured' },
    },
  },
  {
    id: 'ch-2026',
    when: 'January to October 2026',
    stage: 3,
    stageName: 'Expert vulnerability work, gated',
    kind: 'evidence',
    confidence: 'observed; frontier claims are the developer\'s own',
    body: (
      <>
        <p>
          In April Anthropic announces a model it says surpasses all but the most skilled humans at finding
          and exploiting software flaws, and keeps it from public release.<Cite ids={['glasswing-2026-04']} /> Its
          write-up says over 99% of what the model found was still unpatched at the time.<Cite ids={['mythos-2026-04']} /> Access
          goes to about 50 defending organizations, then roughly 150 more in June.<Cite ids={['glasswing-2026-06']} />
        </p>
        <p>
          A month in, partners report over 10,000 high or critical flaws. Of 530 sent to open-source
          maintainers, 75 have patches, and some maintainers ask for slower disclosure.<Cite ids={['glasswing-2026-05']} />
        </p>
        <PatchTally figureNumber={FIGURE.patchTally} />
        <p>
          In September NIST&rsquo;s CAISI rates the best downloadable model about four months behind the US frontier
          on cyber tasks.<Cite ids={['caisi-2026-09']} />
        </p>
        <p>
          My 2025 paper put this stage at 2027 to 2032. At the frontier it arrived in April 2026.
        </p>
      </>
    ),
    trigger: 'A model at expert level on finding and exploiting vulnerabilities.',
    attackers: 'No public report yet of these capabilities in criminal hands.',
    defenders: 'Finding flaws becomes cheap. Fixing them stays slow, because it runs on human maintainers.',
    inference: (
      <p>
        Independent firms checked a sample of 1,752 reported flaws and confirmed 90.6% as real.<Cite ids={['glasswing-2026-05']} /> That
        is the only outside check on the frontier numbers, and it is a sample.
      </p>
    ),
    year: 2026,
    vignette: {
      when: '2026',
      builtFrom: ['glasswing-2026-04', 'glasswing-2026-05', 'caisi-2026-09'],
      body: (
        <>
          <p>
            In April Ines reads that the strongest bug-finding model will go only to defenders. By May her inbox holds
            more serious reports than she can read in a month of weekends. Her co-maintainer asks the finders to slow
            down.
          </p>
          <p>
            Alex reads the same news from the other side. The model everyone is talking about is locked away. The ones
            he could download are a few months behind.
          </p>
        </>
      ),
    },
    readings: {
      horizon: { value: 'over 16 h (floor)', status: 'measured' },
      lag: { value: 'about 4 months', status: 'measured' },
      repair: { value: '530 reported, 75 patched', status: 'measured' },
    },
  },
  {
    id: 'ch-2027',
    when: 'Late 2026 to 2027',
    stage: 3,
    stageName: 'The gate leaks',
    kind: 'forecast',
    confidence: 'moderate',
    body: (
      <>
        <p>
          A downloadable model matches the gated frontier of April 2026, with safeguards that do not hold.
          This has partly started: on a benchmark of turning already-known browser flaws into working exploits,
          Anthropic measured the September 2026 open model at 12% against 14% for its gated one.<Cite ids={['anthropic-2026-09']} />
        </p>
        <p>
          Criminal use starts where the FBI already sees AI, in fraud,<Cite ids={['ic3-2025']} /> now with
          working exploits for flaws that defenders found but have not patched. The Stage 3 backlog becomes
          the attack surface.
        </p>
      </>
    ),
    trigger: 'A public evaluation showing a downloadable model level with the gated frontier of early 2026.',
    attackers: 'Exploiting known but unpatched flaws gets cheap. Zero-day work reaches mid-tier criminal groups.',
    defenders: (
      <>The contest becomes patch speed. Organizations that cannot patch in days fall on the wrong side of what the NCSC calls a digital divide.<Cite ids={['ncsc-2025']} /></>
    ),
    inference: (
      <>
        <p>
          Two measured inputs. CAISI puts the open-weight lag at about four months.<Cite ids={['caisi-2026-09']} /> In
          June 2026 Anthropic said it expected other companies to have comparable models within 6 to 12 months,
          possibly without safeguards.<Cite ids={['glasswing-2026-06']} /> Both put wide availability between
          December 2026 and mid 2027.
        </p>
        <p>
          The step from available capability to criminal use is my inference. No source measures how long
          that step takes.
        </p>
      </>
    ),
    year: 2027,
    vignette: {
      when: 'late 2026 to 2027, forecast',
      builtFrom: ['anthropic-2026-09', 'glasswing-2026-06', 'glasswing-2026-05', 'dbir-2026'],
      body: (
        <>
          <p>
            A downloadable model now does what the locked one did a year ago. In Alex&rsquo;s group chat someone posts a
            link. Nobody in the chat has ever written an exploit by hand.
          </p>
          <p>
            Ines&rsquo;s queue still holds the reports she has not reached. Those are the flaws that start turning up in
            attacks, because they were found and never fixed.
          </p>
        </>
      ),
    },
    readings: {
      horizon: { value: `${projected('2027-06-30')} by mid 2027`, status: 'scenario' },
      lag: { value: '4 months or less', status: 'scenario' },
      repair: { value: 'backlog grows', status: 'scenario' },
    },
  },
  {
    id: 'ch-2028',
    when: '2028',
    stage: 4,
    stageName: 'Unsupervised campaigns',
    kind: 'forecast',
    confidence: 'low',
    body: (
      <>
        <p>
          Agents finish software tasks that take a skilled person a month (Figure {FIGURE.horizon}). An attacker briefs an
          agent and lets it run a campaign for weeks without stopping at decision points.
        </p>
        <p>
          Whether that matters depends on what defenders did in 2027. If the backlog of easy flaws is gone,
          a patient agent has less to find. If it is not, one person can run what used to take a team.
          The two endings below split here.
        </p>
      </>
    ),
    trigger: 'A threat report describing a campaign with no human decision points, plus multi-week agent results on public evaluations.',
    attackers: 'One person directs campaigns that used to take a team.',
    defenders: 'AI triage and patching at the same speed as AI discovery, or a growing backlog.',
    inference: (
      <>
        <p>
          Figure {FIGURE.horizon} puts the work-month crossing between early 2027 and early 2028 on METR&rsquo;s measured
          doubling times. The survey gives a 50% chance that AI can autonomously build a payment-processing
          site from scratch by 2028.<Cite ids={['grace-2024']} /> I read that as a multi-week project for a skilled
          person; the survey gives no task length, so that reading is mine.
        </p>
        <p>
          I add six to twelve months between the benchmark and real campaigns, because real networks fight back
          and benchmarks do not. That lag is a guess.
        </p>
      </>
    ),
    year: 2028,
    vignette: {
      when: '2028, forecast',
      builtFrom: ['metr-2026-01', 'leukfeldt-2017', 'hutchings-clayton-2016', 'aixcc-2025', 'lohn-2022'],
      body: (
        <>
          <p>
            Alex could brief an agent on a Friday and let it work for weeks. Skill is no longer what stops him. What
            stops him is that he knows nobody who would move stolen money, and payment services still close the
            accounts of people selling attacks.
          </p>
          <p>
            Ines&rsquo;s project now has an AI patcher, paid for by a grant. It writes fixes faster than she can review
            them. Whether anyone installs them is out of her hands.
          </p>
        </>
      ),
    },
    readings: {
      horizon: { value: `${projected('2028-06-30')} by mid 2028`, status: 'scenario' },
      lag: { value: 'assumed under 4 months', status: 'scenario' },
      repair: { value: 'decides the ending', status: 'scenario' },
    },
  },
];
