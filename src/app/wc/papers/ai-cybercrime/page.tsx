'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { SiteHeader } from '../../../components/SiteHeader';
import { BarrierToEntry } from './_components/BarrierToEntry';
import { EndingsBranch } from './_components/EndingsBranch';
import { EvidenceTimeline } from './_components/EvidenceTimeline';
import { HorizonExtrapolator } from './_components/HorizonExtrapolator';
import { Cite, ClaimTag, ForecastFrame, Supplement } from './_components/PaperApparatus';
import { PAPER_SOURCES } from './_components/paperSources';
import { ScenarioSection } from './_components/ScenarioSection';
import { ReadingProgressBar } from '../_components/ReadingProgressBar';
import { SectionNav } from '../_components/SectionNav';
import { RevealOnView } from '../_components/RevealOnView';

// Source: Pioneer Scholars 2025 final paper by Weibao Chen, revised October 2026.
// Original PDF and reviewer evaluation are kept locally; do not include verbatim text from either.

const SECTIONS = [
  { id: 'record', eyebrow: '[ 1 · EVIDENCE ]', title: 'What the record shows' },
  { id: 'barrier', eyebrow: '[ 2 · RATING ]', title: 'How far the barrier fell' },
  { id: 'trend', eyebrow: '[ 3 · INFERENCE ]', title: 'From trend to forecast' },
  { id: 'scenario', eyebrow: '[ 4 · SCENARIO ]', title: 'Four stages, dated' },
  { id: 'endings', eyebrow: '[ 5 · FORECAST ]', title: 'Two endings' },
  { id: 'implications', eyebrow: '[ 6 ]', title: 'What follows' },
  { id: 'reviewer-feedback', eyebrow: '[ HONEST NOTE ]', title: 'What the reviewer flagged' },
  { id: 'revision-notes', eyebrow: '[ REVISION ]', title: 'Revision notes' },
  { id: 'sources', eyebrow: '[ SOURCES ]', title: 'Sources' },
];

export default function AiCybercrimePaper() {
  return (
    <div className="relative min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />
      <ReadingProgressBar />
      <SectionNav sections={SECTIONS} />

      <article className="mx-auto max-w-3xl px-4 pt-24 pb-24 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /wc/papers/ai-cybercrime ]
        </p>
        <h1 className="themed-heading mt-3 text-3xl font-bold leading-[1.05] sm:text-5xl">
          The AI-driven democratization of cybercrime
        </h1>
        <p className="mt-3 text-base text-[color:var(--fg-muted)] sm:text-lg">
          A forecast of emergent threats, in four stages. Revised October 2026.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-[color:var(--fg-subtle)]">
          <span className="themed-pill px-3 py-1 font-mono uppercase tracking-widest">Weibao Chen</span>
          <span className="themed-pill px-3 py-1 font-mono uppercase tracking-widest">2025, revised 2026-10</span>
          <span className="themed-pill px-3 py-1 font-mono uppercase tracking-widest">Pioneer Scholars</span>
        </div>

        <div className="mt-10 border-y border-[color:var(--border)] py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">thesis</p>
          <p className="mt-3 font-serif text-xl leading-snug text-[color:var(--fg)] sm:text-2xl">
            AI is moving the hard part of cybercrime from skill to access. For fraud that shift has already
            happened. For breaking into systems it happened in 2026 at the gated frontier, and downloadable
            models are a few months behind.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[color:var(--fg-muted)]">
            On the current trend I expect attackers to get expert-level vulnerability tools within a year or two. The
            question I think decides 2027 to 2030 is whether the capacity to fix flaws grows as fast as AI&rsquo;s
            capacity to find them.
          </p>
        </div>

        <div className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--fg-subtle)]">how to read this page</p>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
            <KeyItem kind="evidence">A dated public report says it. Click the bracketed number for the source.</KeyItem>
            <KeyItem kind="forecast">My projection, in a dashed frame, with a confidence level and the inference shown.</KeyItem>
            <KeyItem kind="rating">A judgment of mine on a stated rubric, with my reasoning next to it.</KeyItem>
          </dl>
        </div>

        <Section id="record" eyebrow="[ 1 · EVIDENCE ]" title="What the record shows, 2024 to 2026">
          <p>
            Three years of public reporting tell a fairly clear story. Up to early 2025, AI made existing attackers
            faster. Microsoft and OpenAI, then Google, reviewed state-backed misuse of their models and found speed-ups
            to ordinary work and no new capability.<Cite ids={['msft-2024', 'gtig-2025-01']} />
          </p>
          <p>
            In the second half of 2025 the reports change. AI agents carry most of an operation, with humans checking
            in, and malware starts calling models while it runs.<Cite ids={['anthropic-2025-08', 'gtig-2025-11', 'anthropic-2025-11']} /> In
            April 2026 a developer says its unreleased model can find and exploit software flaws better than all but
            the most skilled humans.<Cite ids={['glasswing-2026-04']} />
          </p>
          <p>
            Defense moves on the same calendar, and on some measures it moves first. The first AI-found real
            vulnerability was a defensive result,<Cite ids={['bigsleep-2024']} /> and DARPA&rsquo;s 2025 challenge found and
            patched flaws for about $152 a task.<Cite ids={['aixcc-2025']} /> The figure lets you walk the record.
          </p>
          <RevealOnView><EvidenceTimeline /></RevealOnView>
          <Supplement title="How much to trust these reports">
            <p>
              Most of the 2025 and 2026 evidence comes from AI developers describing misuse of their own models and
              the abilities of their own models. They have reasons to emphasize both the danger and their own
              response. The outside checks I found are a government benchmark of a rival model<Cite ids={['caisi-2026-09']} /> and
              independent validation of a sample of reported flaws.<Cite ids={['glasswing-2026-05']} />
            </p>
            <p>
              The FBI&rsquo;s count of AI-related complaints depends on victims noticing AI was involved. In investment
              fraud it ties $632 million of more than $8 billion in losses to AI, and says many victims do not realize
              how much AI was involved.<Cite ids={['ic3-2025']} />
            </p>
          </Supplement>
        </Section>

        <Section id="barrier" eyebrow="[ 2 · RATING ]" title="How far the barrier fell">
          <p>
            The original paper scored six attacks from 1 to 10 for how reachable they are to a non-expert, before and
            after AI, and never said how. This version uses a rubric of five yes or no questions you can check. The
            answers are mine. The reasons and sources are one click away on each row.
          </p>
          <p>
            The pattern that comes out: attacks that are mostly writing or impersonation opened up a lot. Intrusion and
            vulnerability work opened up little, so far, because the capable models are gated.
          </p>
          <RevealOnView><BarrierToEntry figureNumber={2} /></RevealOnView>
        </Section>

        <Section id="trend" eyebrow="[ 3 · INFERENCE ]" title="From trend to forecast">
          <p>
            The 2025 paper anchored its stages to a survey of 2,778 AI researchers, which gave a 50% chance of
            human-level machine intelligence by 2047, 13 years earlier than the same survey found in
            2022.<Cite ids={['grace-2024']} /> That was a stretch. The survey asks about general milestones, and none of
            them is a cyberattack.
          </p>
          <p>
            So this version leans on a measurement instead. METR tracks the length of software task, in skilled-human
            time, that an AI agent finishes half the time. Over its whole record that length doubles about every 196
            days; since 2024, every 89.<Cite ids={['metr-2026-01']} /> Figure 3 projects it forward. The survey stays as a
            cross-check, labelled as one.
          </p>
          <RevealOnView><HorizonExtrapolator /></RevealOnView>
          <Supplement title="Why a software benchmark is a fair proxy, and where it breaks">
            <p>
              Attack campaigns are long software tasks with an adversary. An agent that cannot finish a day of
              ordinary programming will not run a week of intrusion without help. That makes the time horizon a
              ceiling on attack autonomy, and the most consistently measured one I found.
            </p>
            <p>
              It breaks in three places. METR&rsquo;s tasks have no defender pushing back. Its own authors say results may
              not carry beyond the software and reasoning domains they test.<Cite ids={['metr-2025']} /> And the trend is
              sensitive to which tasks are in the suite.<Cite ids={['metr-2026-01']} /> I treat the crossing dates as the
              earliest plausible time for each stage, then add a lag.
            </p>
          </Supplement>
        </Section>

        <Section id="scenario" eyebrow="[ 4 · SCENARIO ]" title="Four stages, dated">
          <p>
            The taxonomy from the 2025 paper, rebuilt as a dated scenario. The first three chapters are evidence and
            the last two are forecasts. Each states what would trigger it, what changes on both sides and how sure I
            am. The readout tracks where you are and marks every number as measured or scenario.
          </p>
          <ScenarioSection />
        </Section>

        <Section id="endings" eyebrow="[ 5 · FORECAST ]" title="Two endings, 2029 to 2030">
          <p>
            Both endings assume attackers get the tools. They split on repair, the rate at which found flaws actually
            get fixed, which is the one number from 2026 that looks worst.
          </p>
          <EndingsBranch />
        </Section>

        <Section id="implications" eyebrow="[ 6 ]" title="What follows for policy and defense">
          <p>
            These follow from the evidence. Where they go past it, I say so.
          </p>
          <ol className="ml-5 list-decimal space-y-3">
            <li>
              <strong className="text-[color:var(--fg)]">Pay for fixing, not only finding.</strong>{' '}
              The measured bottleneck in 2026 is human capacity to triage and patch.<Cite ids={['glasswing-2026-05']} /> Automated
              patching already works in competition at low cost, and the systems are open source.<Cite ids={['aixcc-2025']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Keep measuring diffusion on a schedule.</strong>{' '}
              CAISI&rsquo;s open-weight lag is the earliest warning that gated capability has spread.<Cite ids={['caisi-2026-09']} /> It
              is only useful if it is repeated for every major release.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Count AI&rsquo;s role in crime better.</strong>{' '}
              The FBI&rsquo;s first AI count rests on what victims noticed.<Cite ids={['ic3-2025']} /> Neither ending can be told
              apart from the other without a better measure.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Treat fraud as its own problem.</strong>{' '}
              Patching does nothing for impersonation. The Hong Kong loss went through 15 transfers approved on the
              strength of familiar faces on a call.<Cite ids={['hk-2024']} /> My inference is that the defense there is
              procedure, such as confirming payments through a second channel, more than software.
            </li>
          </ol>
          <ForecastFrame label="forecast, low confidence">
            <p>
              My guess for 2030 sits between the endings, closer to A for small organizations and closer to B for large
              ones. That is the NCSC&rsquo;s digital divide carried three years further than they took it.<Cite ids={['ncsc-2025']} />
            </p>
          </ForecastFrame>
        </Section>

        <Section id="reviewer-feedback" eyebrow="[ HONEST NOTE ]" title="What the reviewer flagged">
          <p>
            The original paper was a first-time research project graded B+. The reviewer (Prof. Suleyman Uludag,
            U. Michigan-Flint CS) liked the taxonomy and the use of expert-survey grounding, and flagged three
            problems. Here is what I did about each.
          </p>
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong className="text-[color:var(--fg)]">Repetition.</strong>{' '}
              Each fact now appears once, in the section that uses it, and the figures carry the detail the prose
              used to restate.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Speculation versus evidence.</strong>{' '}
              Every claim is tagged as evidence, forecast or my rating, forecasts sit in dashed frames, and each
              forecast shows the inference behind it.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Depth and primary sources.</strong>{' '}
              The reference list below has {PAPER_SOURCES.length} dated sources. All but one are the original
              report, assessment or dataset.
            </li>
          </ul>
        </Section>

        <Section id="revision-notes" eyebrow="[ REVISION ]" title="Revision notes, October 2026">
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong className="text-[color:var(--fg)]">Written with AI help.</strong>{' '}
              This revision was researched and drafted with Claude, an AI model, working from my 2025 paper and under my
              direction. Every source below was opened and checked against the claim it supports. The 2025 paper was my
              own work.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Dates moved.</strong>{' '}
              The 2025 version put Stage 3 at 2027 to 2032 and Stage 4 at 2030 to 2047. The record now shows Stage 3
              abilities at the gated frontier in April 2026, so the scenario runs 2023 to 2030.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Stages renamed.</strong>{' '}
              Unreliable Agent, Reliable Agent, Superhuman Coder and Superhuman Attacker became Assistant, Supervised
              agent, Expert vulnerability work and Unsupervised campaigns, which name what is observable.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Scores rebuilt.</strong>{' '}
              The 1 to 10 barrier scores came from tables in the paper I built on, with no rubric. They are now my
              ratings on a five-question rubric, and several numbers changed.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Survey kept in its lane.</strong>{' '}
              Grace et al. now appears only as what it measured. The step from any trend to a stage is written out
              and labelled as mine.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Claims cut.</strong>{' '}
              Unsourced lines are gone, including a 2024 agent demo I could not trace, named criminal tools, &ldquo;orders
              of magnitude&rdquo; and &ldquo;permanently behind&rdquo;.
            </li>
          </ul>
          <p>
            Added: the evidence section, the scenario readout, two endings with signposts and this list. The next
            revision should re-read the signposts against new reports and replace scenario values with measurements
            as they arrive.
          </p>
        </Section>

        <Section id="sources" eyebrow="[ SOURCES ]" title="Sources">
          <p className="text-sm">
            Each source was opened and read for this revision. Dates are publication dates. Entries marked as reporting
            are news accounts of an official statement I could not find in the original.
          </p>
          <ol className="space-y-3 text-sm">
            {PAPER_SOURCES.map((s, i) => (
              <li key={s.id} id={`ref-${s.id}`} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2">
                <span className="font-mono text-xs text-[color:var(--accent)]">[{i + 1}]</span>
                <span className="min-w-0 break-words">
                  <span className="text-[color:var(--fg)]">{s.author}.</span>{' '}
                  <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[color:var(--accent)]">
                    {s.title}
                  </a>
                  . <span className="font-mono text-xs">{s.date}</span>
                  {s.kind === 'reporting' && <span className="font-mono text-xs"> · reporting</span>}
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <div className="mt-16 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--fg-subtle)]">
          ← Back to <Link href="/wc/papers" className="text-[color:var(--accent)] underline underline-offset-4">/wc/papers</Link>
        </div>
      </article>
    </div>
  );
}

function KeyItem({ kind, children }: { kind: 'evidence' | 'forecast' | 'rating'; children: ReactNode }) {
  return (
    <div>
      <dt><ClaimTag kind={kind} /></dt>
      <dd className="mt-1.5 text-[color:var(--fg-muted)]">{children}</dd>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        {eyebrow}
      </p>
      <h2 className="themed-heading mt-2 text-2xl font-semibold sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-base leading-relaxed text-[color:var(--fg-muted)]">
        {children}
      </div>
    </section>
  );
}
