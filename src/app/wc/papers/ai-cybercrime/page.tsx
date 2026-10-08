'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { SiteHeader } from '../../../components/SiteHeader';
import { SITE_LOCKED } from '../../../../siteLock';
import { BarrierToEntry } from './_components/BarrierToEntry';
import { EndingsBranch } from './_components/EndingsBranch';
import { EvidenceTimeline } from './_components/EvidenceTimeline';
import { ExploitWindow } from './_components/ExploitWindow';
import { FIGURE } from './_components/figureNumbers';
import { HorizonExtrapolator } from './_components/HorizonExtrapolator';
import { AMENDMENTS, AmendmentsLog, PAPER_VERSION } from './_components/AmendmentsLog';
import { Cite, ClaimTag, ForecastFrame, Supplement } from './_components/PaperApparatus';
import { PAPER_SOURCES, type PaperSourceId } from './_components/paperSources';
import { ScenarioSection } from './_components/ScenarioSection';
import { ReadingProgressBar } from '../_components/ReadingProgressBar';
import { SectionNav } from '../_components/SectionNav';
import { Term } from './_components/GlossaryTerm';
import { PaperAct } from './_components/PaperAct';
import { PaperInSixty } from './_components/PaperInSixty';
import { PrintPaperButton } from './_components/PrintPaperButton';
import styles from './_components/paperMotion.module.css';
import printStyles from './_components/paperPrint.module.css';
import { PrintPrep } from './_components/PrintPrep';

// Source: Pioneer Scholars 2025 final paper by Weibao Chen, revised October 2026.
// Original PDF and reviewer evaluation are kept locally; do not include verbatim text from either.

const SECTIONS = [
  { id: 'abstract', eyebrow: 'Abstract', title: 'Abstract' },
  { id: 'methods', eyebrow: 'Methods', title: 'Methods' },
  { id: 'act-1', eyebrow: 'Part I', title: 'I. What changed' },
  { id: 'act-2', eyebrow: 'Part II', title: 'II. What comes next' },
  { id: 'act-3', eyebrow: 'Part III', title: 'III. What to do' },
  { id: 'back-matter', eyebrow: 'Appendices', title: 'Appendices and references' },
];

export default function AiCybercrimePaper() {
  return (
    <div className={`relative min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)] ${printStyles.printRoot}`}>
      <PrintPrep />
      <div className="print:hidden">
        <SiteHeader />
        <ReadingProgressBar />
        <SectionNav sections={SECTIONS} />
      </div>

      <article className="mx-auto max-w-3xl px-4 pt-24 pb-24 sm:px-6 print:pt-0">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)] print:hidden">
          [ /wc/papers/ai-cybercrime ]
        </p>
        <h1 className={`themed-heading mt-3 text-3xl font-bold leading-[1.05] sm:text-5xl ${styles.titleReveal}`}>
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
        <p className="mt-3 font-mono text-xs text-[color:var(--fg-muted)]">
          {PAPER_VERSION.label} · {PAPER_VERSION.date} ·{' '}
          <a href="#amendments" className="text-[color:var(--accent)] underline underline-offset-4">
            {AMENDMENTS.length} amendments
          </a>
          <span className="print:hidden">
            {' '}·{' '}
            <PrintPaperButton />
          </span>
        </p>

        <section id="abstract" aria-labelledby="abstract-title" className="mt-12 scroll-mt-24">
          <h2 id="abstract-title" className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--fg)]">Abstract</h2>
          <p className="mt-3 text-base leading-relaxed text-[color:var(--fg)]">
            This paper asks whether generative AI is widening who can commit cybercrime, and what that means for the
            balance between attackers and the people who fix software. It combines a review of public threat reports,
            government assessments and academic studies published between 2009 and 2026 with a dated four-stage scenario
            running to 2030. The evidence supports a narrower claim than the 2025 version of this paper made. AI has lowered
            the skill needed for attacks built on writing and impersonation, but crime-as-a-service had already removed the
            skill requirement for some attacks before it. Expert-level vulnerability discovery appeared in 2026 in models
            withheld from public release, and the best downloadable model trailed them by about four
            months. Over the same period the average time from patch release
            to first observed exploitation fell from 63 days in 2018 to 2019 to minus 7 days in
            2025, and only 75 of 530 AI-found flaws reported to open-source maintainers
            had patches in May 2026. Harm data show no measurable AI-driven increase so far.
            I forecast that whether repair can speed up as fast as discovery decides the outcome for 2027 to 2030, and I list
            the measurements that would falsify that forecast.
          </p>
        </section>

        <figure className="mt-10 border-l-0 border border-[color:var(--border)] p-5 break-inside-avoid print:border-0 print:p-0" style={{ borderRadius: 'var(--radius)' }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--fg-subtle)]">Case: the 2024 Hong Kong video call</p>
          <p className="mt-3 text-base leading-relaxed text-[color:var(--fg)]">
            In early 2024 a finance employee at a multinational company in Hong Kong joined a video conference with people
            who appeared to be the company&rsquo;s UK-based chief financial officer and other senior staff. Every participant
            other than the employee was a deepfake, pre-recorded and built from publicly available video and audio of the real
            people found on YouTube. Following the instructions, the employee made 15 transfers. When police received a
            report on 29 January 2024, HK$200 million (about US$26 million) had already been lost.<Cite ids={['hk-2024']} />
          </p>
        </figure>

        <div className="mt-10 border-y border-[color:var(--border)] py-6 print:border-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">thesis</p>
          <p className="mt-3 font-serif text-xl leading-snug text-[color:var(--fg)] sm:text-2xl">
            AI is moving the hard part of cybercrime from skill to access, for the second time. Crime-as-a-service
            did it first. AI arrives into a repair window that was already closing, and the question for 2027 to 2030
            is whether fixing can speed up as fast as AI speeds up finding.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[color:var(--fg-muted)]">
            For fraud the shift is visible in lures and fake voices, though the networks studied most closely were
            limited by the people who move the money, which AI does not supply.<Cite ids={['leukfeldt-2017']} /> For
            breaking into systems the shift reached the gated
            frontier in 2026, and <Term k="openWeights">downloadable models</Term> are a few months behind. The time from a
            patch&rsquo;s release to the first <Term k="exploit">exploitation</Term> of its flaw had already fallen before AI agents existed
            (section <a href="#repair" className="underline underline-offset-4">1.3</a>). The harm data
            so far show no AI-driven crime wave, though official counts catch only a small share of cybercrime, so read
            this as a forecast about capability and access.<Cite ids={['chainalysis-2026', 'ic3-2025', 'vandeweijer-2019']} /> The
            international consensus leaves the biggest question open too: the 2026 International AI Safety Report says it
            is still uncertain whether attackers or defenders will gain more from AI.<Cite ids={['iasr-2026']} />
          </p>
        </div>

        <div className="print:hidden">
          <PaperInSixty />
        </div>

        <div className="mt-8 print:hidden">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--fg-subtle)]">how to read this page</p>
          <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
            <KeyItem kind="evidence">A dated public report says it. Click the bracketed number for the source.</KeyItem>
            <KeyItem kind="forecast">My projection, in a dashed frame, with a confidence level and the inference shown.</KeyItem>
            <KeyItem kind="rating">A judgment of mine on a stated rubric, with my reasoning next to it.</KeyItem>
            <KeyItem kind="fiction">An illustrative scenario, collapsed by default, built only from cited facts. Never evidence.</KeyItem>
          </dl>
        </div>

        <Section id="methods" number="" eyebrow="methods" title="Methods" lead={<>
          I built the review around public threat reports and academic studies, adding primary reports and datasets from
          outside AI companies to check the repair and harm claims. A literature sweep looked for work that could support
          or test the thesis, including arguments against it. I read paywalled journal articles through Washington and Lee
          University&rsquo;s library and used open author copies where available. Two cited disclosure studies were read as
          abstracts only; I cite only claims in those abstracts.
        </>}>
          <p>
            Every sourced number comes from a source opened during the revision and checked against the claim it supports.
            I distinguish <ClaimTag kind="evidence" /> for dated reports, <ClaimTag kind="forecast" /> for my projections,
            <ClaimTag kind="rating" /> for my judgments on a stated rubric, and <ClaimTag kind="fiction" /> for illustrative
            scenes built from cited facts. Projections and model assumptions are labelled as mine.
          </p>
          <p>
            The barrier scores are my ratings, not measurements. Figure {FIGURE.barrier} gives the five yes or no questions,
            the scoring rule and my reasons for each answer. The dated scenario is illustrative. Its fictional characters
            show what a stage could mean for one person; they are not evidence.
          </p>
        </Section>

        <PaperAct
          id="act-1"
          numeral="I"
          title="What changed"
          takeaway="This part reviews the evidence on how AI has changed attacks and the barrier to entry, the capacity to repair flaws, and the evidence against the thesis."
        >
        <Section id="record" number="1.1" eyebrow="evidence" lead={<>Public reports from 2024 to 2026 show AI moving from assisting attackers to carrying out most of an operation, with expert-level vulnerability discovery appearing in withheld models in 2026.</>} title="What the record shows, 2024 to 2026">
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
          <EvidenceTimeline />
          <Supplement title="How much to trust these reports">
            <p>
              Most of the 2025 and 2026 evidence comes from AI developers describing misuse of their own models and
              the abilities of their own models. They have reasons to emphasize both the danger and their own
              response. The outside checks I found are a government benchmark of a rival model,<Cite ids={['caisi-2026-09']} />
              independent validation of a sample of reported flaws,<Cite ids={['glasswing-2026-05']} /> and the academic studies
              below.
            </p>
            <p>
              The FBI&rsquo;s count of AI-related complaints depends on victims noticing AI was involved. In investment
              fraud it ties $632 million of more than $8 billion in losses to AI, and says many victims do not realize
              how much AI was involved.<Cite ids={['ic3-2025']} />
            </p>
          </Supplement>
          <h3 className="pt-4 font-serif text-xl text-[color:var(--fg)]">What independent research measures</h3>
          <p>
            Academic tests of attacker-side ability back the developer reports on phishing and give a more modest picture
            on exploitation. Every one of them is narrower than this paper&rsquo;s claims, and each row says how.
          </p>
          <ul className="text-sm">
            {STUDY_ROWS.map((r) => (
              <li key={r.study} className="grid gap-1 border-b border-[color:var(--border)] py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                <span className="font-mono text-xs text-[color:var(--fg)]">{r.study}<Cite ids={[r.source]} /></span>
                <span>
                  <span className="text-[color:var(--fg)]">{r.result}</span>{' '}
                  <span className="text-[color:var(--fg-subtle)]">Narrower because: {r.limit}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>
        <Section id="barrier" number="1.2" eyebrow="rating" lead={<>On a five-question rubric, attacks built on writing, impersonation or routine code became much more accessible to non-experts, while intrusion and vulnerability work changed little because the most capable models remain gated.</>} title="How far the barrier fell">
          <p>
            The original paper scored six attacks from 1 to 10 for how reachable they are to a non-expert, before and
            after AI, and never said how. This version uses a rubric of five yes or no questions you can check. The
            answers are mine. The reasons and sources are one click away on each row.
          </p>
          <BarrierToEntry figureNumber={FIGURE.barrier} />
        </Section>
        <Section id="repair" number="1.3" eyebrow="evidence" lead={<>Independent measurements show the window for repair narrowing before AI agents existed, and recent indicators of remediation getting worse.</>} title="The repair side">
          <p>
            Everything above is about finding flaws and attacking. The thesis turns on fixing them, so here is what
            sources outside the AI companies measure on that side.
          </p>
          <p>
            The window between a patch&rsquo;s release and the first exploitation of its flaw has been closing for years. Mandiant
            measured an average of 63 days in 2018 to 2019 and 5 days in 2023.<Cite ids={['gtte-2024']} /> Its report on
            2025 puts the figure at minus 7 days, meaning exploitation on average began before a patch existed.<Cite ids={['mtrends-2026']} /> Only zero-days can push the average below zero, and they were 70% of Mandiant&rsquo;s 2023 set.<Cite ids={['gtte-2024']} /> Most
            of that fall came before AI agents existed, so AI did not start it. What AI can do is push a trend that was
            already running.
          </p>
          <p>
            An older measurement shows what a negative average can hide. On 11 million Windows hosts running
            Symantec&rsquo;s products from 2008 to 2011, 18 flaws were exploited before they were disclosed, for between 19
            days and 30 months, with a median of 8 months; the authors call these durations lower bounds. After
            disclosure, attacks on those flaws rose between 2 and 100,000 times, and exploits for 42% of the flaws used
            in host-based attacks showed up in the field within 30 days of disclosure.<Cite ids={['bilge-2012']} /> Exploitation
            before disclosure is not new, and most attacks still came after it. The data cover only customers of one
            antivirus vendor and miss web-based and highly targeted attacks.
          </p>
          <ExploitWindow />
          <p>
            The systems that turn a found flaw into a fix are strained. <Term k="cve">CVE</Term> submissions to NIST&rsquo;s National
            Vulnerability Database grew 263% from 2020 to 2025. NIST enriched nearly 42,000 in 2025, 45% more than in any
            earlier year. In April 2026 it switched to analyzing the highest-priority entries first, and moved unenriched
            entries published before March 2026 to &ldquo;Not Scheduled&rdquo;.<Cite ids={['nist-nvd-2026']} />
          </p>
          <p>
            Deadlines are getting shorter. In June 2026 CISA ordered federal agencies to patch the highest-risk flaws
            within three days, and said attackers&rsquo; use of AI may narrow the time defenders have to
            react.<Cite ids={['cisa-bod-2026', 'cisa-patch-2026']} /> Its <Term k="kev">catalog of flaws exploited in the wild</Term> grew from 186
            additions in 2024 to 245 in 2025, and 2026 passed that total by 4 October. Of the 2025 additions, 226 carried
            a 21-day federal deadline; of 250 added in 2026, 125 carry 3 days.<Cite ids={['cisa-kev-2026']} /> Those counts
            are mine, from CISA&rsquo;s feed.
          </p>
          <p>
            The people who do the fixing in open source are mostly volunteers. In Tidelift&rsquo;s 2024 report, 60% of
            maintainers call themselves unpaid hobbyists and 12% earn most or all of their income from
            maintenance.<Cite ids={['tidelift-2024']} /> Tidelift sells maintainer funding, so it has a stake in that finding.
          </p>
          <p>
            Two research findings frame the same problem. A study of more than 4,000 security fixes across 682
            open-source projects found that a third of the flaws had sat in the code for over three years before repair,
            and 7% of fixes did not fully close the hole.<Cite ids={['li-2017']} />
          </p>
          <p>
            Most flaws are never attacked, which makes repair partly a sorting problem. Of 25,159 flaws published between
            mid-2016 and mid-2018, 921, or 3.7%, were seen exploited within a year. That counts only what commercial
            intrusion-detection sensors caught, so it is a floor. Patching every flaw rated 7 or higher on the standard
            severity scale had an efficiency of 6.2%, meaning most of that work went to flaws never seen exploited; the
            <Term k="epss">EPSS</Term> prediction model reached the same coverage with 29% to 86% less work. Across about 300 companies, the
            median flaw took 100 days to fix.<Cite ids={['epss-2021']} /> A later preprint by several of the same authors cites
            industry data that companies close a median 15.5% of their open flaws a month.<Cite ids={['jacobs-2023']} /> If AI
            multiplies the flaws found, telling which few matter becomes worth more.
          </p>
          <p>
            Writing a patch is usually not the slow step. A CSET model drawing on historical data found that about 80% of
            flaws have a patch ready by the day they are disclosed, and that installing patches is what lags. In that
            model, making adoption five times faster cut the peak number of exposed flaws by about 25%, while removing
            the patch-writing delay entirely cut it by about 13%.<Cite ids={['lohn-2022']} /> The 2026 AI-found queue sits a
            step earlier: those flaws were not public yet, and the maintainers had to write the fixes.<Cite ids={['glasswing-2026-05']} /> So
            the two bottlenecks stack. AI-found flaws wait for someone to write a fix, then for everyone to install it.
          </p>
          <p>
            Organizations are fixing the most urgent flaws more slowly. In Verizon&rsquo;s 2026 breach report, organizations fully fixed only
            26% of the flaws on CISA&rsquo;s exploited list in 2025, down from 38% the year before, and the median time to a
            full fix rose from 32 to 43 days. The median organization had 16 such flaws to patch, up from 11.<Cite ids={['dbir-2026']} /> Verizon
            sells security services and its data comes from partners, not a random sample, so I read the direction more
            than the exact values.
          </p>
        </Section>
        <Section id="against" number="1.4" eyebrow="evidence" lead={<>The available harm data do not show an AI-driven increase in cybercrime, and several researchers argue that defenders may gain more than attackers.</>} title="What cuts against this">
          <ul className="ml-5 list-disc space-y-3">
            <li>
              <strong className="text-[color:var(--fg)]">Ransomware money fell.</strong>{' '}
              Chainalysis traced $1.25 billion in ransomware payments in 2023 and $813.55 million in 2024, a 35% drop it
              credits mainly to law enforcement and victims refusing to pay.<Cite ids={['chainalysis-2025']} /> In 2025
              payments fell about 8% more, to $820 million against a 2024 figure since revised to $892 million, and the
              share of victims who paid reached a low of about 28%.<Cite ids={['chainalysis-2026']} /> Claimed attacks rose
              50% that year, so attackers were busier for less money.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Mandiant does not see AI behind breaches yet.</strong>{' '}
              Its report on 2025 says it does not consider that the year breaches were the direct result of AI. Exploits
              of software flaws stayed the top way in, at 32% of intrusions.<Cite ids={['mtrends-2026']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">AI is a small tagged share of losses.</strong>{' '}
              The FBI tied $893 million of $20.877 billion in 2025 losses to AI, about 4%.<Cite ids={['ic3-2025']} /> Consumer
              fraud reports to the FTC rose from 2.6 million in 2024 to 3 million in 2025, and reported losses from about $12
              billion to $15.9 billion.<Cite ids={['ftc-2026']} /> These are reports, not counted incidents, and the FTC
              testimony does not attribute any of it to AI. Fraud is rising; these numbers cannot say AI is why. They also
              miss most of it: in a Dutch survey of 97,186 crime victims from 2012 to 2015, only 7.1% of hacking, 24.0% of
              consumer fraud and 26.3% of identity theft reached the police, against 37.5% for all
              crimes.<Cite ids={['vandeweijer-2019']} /> The FBI and FTC collect complaints and consumer reports rather than
              police reports, and the survey predates AI, but the point carries: official counts are a small, lopsided
              sample. So &ldquo;about 4% AI-tagged&rdquo; is a floor that depends on victims noticing AI at all.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Policing rented attack services has worked.</strong>{' '}
              Using five years of attack measurements, Cambridge researchers found that an FBI operation in December 2018
              cut denial-of-service attacks by about a third for at least 10 weeks.<Cite ids={['collier-2019']} /> Malicious AI
              services are sold through similar underground markets,<Cite ids={['malla-2024']} /> so the same lever may
              apply. That last step is my inference. A review of anti-botnet operations adds a caution: arrests and
              takedowns were often short-lived, with one botnet spamming again two days after its servers were seized and
              another back 20 minutes after a takedown.<Cite ids={['dupont-2017']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">A controlled test found no clear help for novice intruders.</strong>{' '}
              Meta had 62 employee volunteers, half security experts, attempt hacking challenges with and without its
              largest open model. Novices completed 22% more steps with the model, a difference that was not statistically
              significant, and none finished a whole challenge; experts did slightly worse.<Cite ids={['cse3-2024']} /> That was a
              2024 model, a small sample, and a company testing its own model, but it is the only controlled uplift study on
              intrusion I found, and it supports keeping the intrusion scores in Figure {FIGURE.barrier} low.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Defense may gain more.</strong>{' '}
              Narayanan and Kapoor argue that giving defenders strong AI tools often shifts the balance their
              way,<Cite ids={['narayanan-2025']} /> and Schneier argued in 2018 that AI could tip the scales toward defense by
              doing at machine speed the analysis humans do poorly.<Cite ids={['schneier-2018']} /> My reply, which is mine and not
              theirs: finding flaws faster helps defense only if fixing and installing keep up, and the repair section above shows
              both lagging.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Open models have not been shown to add risk.</strong>{' '}
              A broad review found current research insufficient to measure the marginal risk of open foundation models,
              cyberattacks included.<Cite ids={['kapoor-2024']} /> That is why amendment A8 reads the open-weight lag as a
              measure of spread, not of harm.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">New computer crime is a small share of the cost.</strong>{' '}
              In 2019, frauds that moved online cost a typical citizen in the low hundreds of dollars a year, payment fraud
              in the tens, and new computer crimes in the tens of cents; the authors argued for spending less on
              anticipation and more on response.<Cite ids={['anderson-2019']} /> Open underground markets were also less
              lucrative than they looked, taxed by cheats, with serious groups trading privately.<Cite ids={['herley-2009']} /> Both
              suggest AI&rsquo;s effect on harm may be smaller than its effect on capability.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">The early record found no new capability.</strong>{' '}
              Through January 2025, the reviews of state-backed misuse found speed-ups to old work and nothing new in
              kind.<Cite ids={['msft-2024', 'gtig-2025-01']} />
            </li>
          </ul>
          <p>
            Vendor reports point the other way. Security vendors report an AI surge: CrowdStrike says operations by
            AI-enabled adversaries rose 89% in 2025,<Cite ids={['crowdstrike-2026']} /> and ENISA says AI-supported phishing
            &ldquo;reportedly&rdquo; made up more than 80% of social engineering by early 2025.<Cite ids={['enisa-2025']} /> I give
            these less weight. CrowdStrike sells the detection it reports on and does not publish how it decides an
            operation is AI-enabled. ENISA&rsquo;s figure is secondhand by its own wording. Neither measures harm. What would
            change my mind: a published definition and denominator for the vendor counts, or an independent measure
            moving the same way, such as the FBI&rsquo;s AI-tagged share rising or Mandiant naming breaches caused directly
            by AI.
          </p>
          <p>
            What this leaves standing: the case for a crime wave already caused by AI is weak, and I am not making it. My
            claims are about who can reach which attacks, and about the race between finding and fixing, where the
            independent data in the section above points the same way as the developers&rsquo; reports.
          </p>
        </Section>
        </PaperAct>

        <PaperAct
          id="act-2"
          numeral="II"
          title="What comes next"
          takeaway="This part derives a dated forecast from measured capability trends and sets out two possible outcomes for 2029 to 2030."
        >
        <Section id="trend" number="2.1" eyebrow="inference" lead={<>The forecast dates are derived from measured trends in how long AI agents can work unassisted, with an expert survey used only as a cross-check.</>} title="From trend to forecast">
          <p>
            The 2025 paper anchored its stages to a survey of 2,778 AI researchers, which gave a 50% chance of
            human-level machine intelligence by 2047, 13 years earlier than the same survey found in
            2022.<Cite ids={['grace-2024']} /> That was a stretch. The survey asks about general milestones, and none of
            them is a cyberattack.
          </p>
          <p>
            So this version leans on a measurement instead. METR tracks an agent&rsquo;s <Term k="timeHorizon">time horizon</Term>: the length of
            software task, in skilled-human time, that it finishes half the time. Over its whole record that length doubles about every 196
            days; since 2024, every 89.<Cite ids={['metr-2026-01']} /> Figure {FIGURE.horizon} projects it forward. The survey stays as a
            cross-check, labelled as one.
          </p>
          <p>
            A government measurement specific to cyber points the same way. The UK AI Security Institute found that the
            best models went from under 9% success on apprentice-level cyber tasks in late 2023 to about 50%, that the
            first model to complete any expert-level task appeared in 2025, and that the length of cyber tasks models
            finish alone doubles roughly every eight months, which it gives as an upper bound.<Cite ids={['aisi-2025']} /> That is
            slower than METR&rsquo;s recent software rate and somewhat slower than its whole-record one.
          </p>
          <HorizonExtrapolator />
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
        <Section id="scenario" number="2.2" eyebrow="scenario" lead={<>The four-stage taxonomy of the 2025 paper is restated as a dated scenario in which the first three stages rest on evidence and the last two are forecasts.</>} title="Four stages, dated">
          <p>
            The taxonomy from the 2025 paper, rebuilt as a dated scenario. The first three chapters are evidence and
            the last two are forecasts. Each states what would trigger it, what changes on both sides and how sure I
            am. The readout tracks where you are and marks every number as measured or scenario.
          </p>
          <p>
            Each stage from 2025 on also has an illustrative scenario, marked as fictional and collapsed by default. It
            follows two composite characters, Alex, 19, on the attacker side, and Ines, a volunteer open-source maintainer,
            on the defender side, and lists the sources it was built from. The scenarios show what a stage would mean for
            one person; they are not evidence.
          </p>
          <ScenarioSection />
        </Section>
        <Section id="endings" number="2.3" eyebrow="forecast" lead={<>The two outcomes considered for 2029 to 2030 share the same capability path and differ in whether repair keeps pace with discovery.</>} title="Two endings, 2029 to 2030">
          <p>
            Both endings assume attackers get the tools. They split on repair, the rate at which found flaws actually
            get fixed, which is the one number from 2026 that looks worst.
          </p>
          <EndingsBranch />
          <div className="border border-dotted border-[color:var(--border-strong)] p-4 text-sm print:border-0 print:p-0" style={{ borderRadius: 'var(--radius)' }}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">a third possibility, theory</p>
            <p className="mt-2">
              The endings may not be a choice at all. Garfinkel and Dafoe argue that as investment grows, the balance tends
              to favor offense at low levels and defense at high ones, with attacks on software flaws as one of their
              cases.<Cite ids={['garfinkel-2019']} /> Applied here, which is my reading, heavily invested defenders could land in
              Ending B while the thinly defended tail lands in Ending A, at the same time.
            </p>
          </div>
        </Section>
        </PaperAct>

        <PaperAct
          id="act-3"
          numeral="III"
          title="What to do"
          takeaway="This part draws policy implications from the evidence and lists the measurements that would falsify the forecast."
        >
        <Section id="implications" number="3.1" eyebrow="implications" lead={<>The evidence points to investment in writing and deploying patches, and to pressure on chokepoints more than on individual offenders.</>} title="What follows for policy and defense">
          <p>
            These follow from the evidence. Where they go past it, I say so.
          </p>
          <ol className="ml-5 list-decimal space-y-3">
            <li>
              <strong className="text-[color:var(--fg)]">Pay for fixing, not only finding.</strong>{' '}
              The measured bottleneck in 2026 is human capacity to triage and patch.<Cite ids={['glasswing-2026-05']} /> Automated
              patching already works in competition at low cost, and the systems are open source.<Cite ids={['aixcc-2025']} /> Pressure
              has sped fixes before. In data from CERT/CC and SecurityFocus, public disclosure made vendors nearly two and
              a half times more likely to release a patch at any given moment.<Cite ids={['arora-2010']} /> A model of
              disclosure policy finds that vendors patch more slowly than is best for society, so the body that sets the
              deadline should shorten it.<Cite ids={['arora-2008']} /> The cost is the surge of attacks that follows
              disclosure.<Cite ids={['bilge-2012']} /> Those studies measured companies with paid staff; whether deadlines
              speed up volunteer maintainers, who wrote the 2026 fixes, is untested.
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
              procedure, such as confirming payments through a second channel, more than software. The same goes for the
              people behind the money: banking-fraud networks were limited by mules, cashers and insiders, not by
              lures.<Cite ids={['leukfeldt-2017']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Press on chokepoints more than on individuals.</strong>{' '}
              In the botnet era, enforcement against operators faded fast: one takedown disrupted only 38% of its
              target&rsquo;s infrastructure. Countries where internet providers notified and cleaned infected customers saw
              large drops, South Korea from 26% to 0.5% of machines infected between 2005 and 2011 and Japan from 2.5% to
              0.6%, though that evidence is correlational.<Cite ids={['dupont-2017']} /> Booter operators were disrupted when
              PayPal closed their accounts.<Cite ids={['hutchings-clayton-2016']} /> Criminologists also argue, as theory without
              new data, that rare and exemplary prosecutions of young low-skill offenders can backfire by weakening the
              law&rsquo;s legitimacy in their eyes.<Cite ids={['holt-2019']} /> My inference: if AI widens the pool of
              low-skill offenders, pressure on model providers, package registries and payment rails is likely to do more
              than prosecuting them one at a time.
            </li>
          </ol>
          <ForecastFrame label="forecast, low confidence">
            <p>
              My guess for 2030 sits between the endings, closer to A for small organizations and closer to B for large
              ones. That is the NCSC&rsquo;s digital divide carried three years further than they took it.<Cite ids={['ncsc-2025']} />
            </p>
          </ForecastFrame>
        </Section>
        <Section id="limitations" number="3.2" eyebrow="limitations" title="Limitations" lead={<>These limits apply to the evidence and to my ratings and model. I keep them beside the claims too.</>}>
          <ul className="ml-5 list-disc space-y-3">
            <li>
              <strong className="text-[color:var(--fg)]">Verizon&rsquo;s sample.</strong>{' '}
              Its data comes from partners, not a random sample, and Verizon sells security services. I read the direction
              more than the exact values.<Cite ids={['dbir-2026']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">The older zero-day record.</strong>{' '}
              Bilge and Dumitraș studied Windows hosts running Symantec products. Their durations are lower bounds, and
              their data miss web-based and highly targeted attacks.<Cite ids={['bilge-2012']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Abstract-only readings.</strong>{' '}
              I read the two Arora disclosure studies only as abstracts because the library did not carry their full text.
              I cite only abstract claims.<Cite ids={['arora-2008', 'arora-2010']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">The backlog model.</strong>{' '}
              Figure {FIGURE.backlog} covers one program&rsquo;s open-source queue, not all software. Its growth rates are my
              guesses. It counts flaws alike and stops at the patch, leaving prioritization and installation outside the
              model.<Cite ids={['glasswing-2026-05', 'epss-2021', 'lohn-2022']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">The Mandiant series.</strong>{' '}
              The 2023 and 2025 values in Figure {FIGURE.exploitWindow} come from different reports and may not be measured
              the same way.<Cite ids={['gtte-2024', 'mtrends-2026']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Official crime counts.</strong>{' '}
              They catch a small, lopsided share of cybercrime. The Dutch reporting study predates AI and measures police
              reports, while the FBI and FTC collect complaints and consumer reports. The FBI&rsquo;s AI-tagged share also
              depends on victims noticing AI.<Cite ids={['vandeweijer-2019', 'ic3-2025', 'ftc-2026']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Tidelift&rsquo;s stake.</strong>{' '}
              Tidelift sells maintainer funding, so it has a stake in its finding about unpaid
              maintenance.<Cite ids={['tidelift-2024']} />
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">My barrier ratings.</strong>{' '}
              The answers and the line between groups in Figure {FIGURE.barrier} are my choices. The scores rate how
              reachable an attack is for a non-expert, not how often it happens or how much harm it causes.
            </li>
          </ul>
        </Section>
        <Section id="wrong" number="3.3" eyebrow="falsification" lead={<>Six regularly published measurements would falsify parts of the forecast; each is listed with its latest value.</>} title="What would prove me wrong">
          <p>
            Each row is a reading someone else publishes on a schedule, the latest value, and what would count against
            me.
          </p>
          <div className="text-sm">
            <div className="hidden grid-cols-[1.1fr_0.8fr_1.5fr] gap-3 border-b border-[color:var(--border-strong)] py-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)] sm:grid">
              <span>Reading</span>
              <span>Latest</span>
              <span>Counts against</span>
            </div>
            <ul>
              {WRONG_ROWS.map((r) => (
                <li key={r.reading} className="grid gap-1 border-b border-[color:var(--border)] py-3 sm:grid-cols-[1.1fr_0.8fr_1.5fr] sm:gap-3">
                  <span className="text-[color:var(--fg)]">{r.reading}</span>
                  <span className="font-mono text-xs text-[color:var(--fg-muted)]">
                    <span className="text-[color:var(--fg-subtle)] sm:hidden">latest: </span>
                    {r.latest}
                  </span>
                  <span className="text-[color:var(--fg-muted)]">
                    <span className="font-mono text-xs text-[color:var(--fg-subtle)] sm:hidden">counts against: </span>
                    {r.against}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
        </PaperAct>

        <section id="back-matter" aria-labelledby="back-matter-title" className="mt-24 scroll-mt-24 border-t border-dashed border-[color:var(--border-strong)] pt-6">
          <h2 id="back-matter-title" className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--fg-subtle)]">Appendices and references</h2>
          <p className="mt-2 text-sm text-[color:var(--fg-muted)]">
            How the argument has changed, what the original reviewer said, how the page has changed, and where every claim
            comes from.
          </p>
        <Section id="amendments" number="Appendix A" eyebrow="amendments" lead={<>The argument has changed {AMENDMENTS.length} times; each change is listed with where the earlier claim came from and the evidence that moved it.</>} title="Amendments log">
          <p>
            Where the argument itself changed, the change is logged here with its date, what I claimed before, what I
            claim now and the evidence that moved it. Each earlier claim names its source: the 2025 paper or an earlier
            draft of this October 2026 revision. Each entry says whether it
            strengthens, narrows or reverses the earlier claim. Presentation changes are in the revision notes further
            down.
          </p>
          <AmendmentsLog />
        </Section>
        <Section id="reviewer-feedback" number="Appendix B" eyebrow="review" lead={<>This appendix records the 2025 reviewer&rsquo;s three critiques and the response to each.</>} title="What the reviewer flagged">
          <p>
            The original paper was a first-time research project. The reviewer (Prof. Suleyman Uludag,
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
              report, study or dataset, and {PAPER_SOURCES.filter((x) => x.kind === 'peer-reviewed' || x.kind === 'preprint').length} are
              academic research, with preprints marked.
            </li>
          </ul>
        </Section>
        <Section id="revision-notes" number="Appendix C" eyebrow="revisions" lead={<>These notes record changes to presentation; changes to the argument are in Appendix A.</>} title="Revision notes, October 2026">
          <ul className="ml-5 list-disc space-y-2">
            <li>
              <strong className="text-[color:var(--fg)]">Amendments checked against the 2025 paper (v2.8).</strong>{' '}
              I reread the 2025 paper and found that several &ldquo;claim before&rdquo; lines described the first web
              version or an earlier draft of this revision, not the 2025 text. Each now quotes or closely paraphrases its
              actual source and names it. Three, on voice impersonation, the open-weight lag and the minus 7 days reading,
              amend earlier drafts of this revision, not the 2025 paper, and are marked that way. References are now numbered alphabetically, with Internet Archive
              copies for web sources. No current claim, number or source changed.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Methods, limitations and presentation (v2.7).</strong>{' '}
              Added Methods and Limitations, removed abstract citations and repeated repair-window figures, and made
              print labels and boxes plain text. No claim, number or source changed.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Written with AI help.</strong>{' '}
              This revision was researched and drafted with Claude, an AI model, working from my 2025 paper and under my
              direction. Every source below was opened and checked against the claim it supports. The 2025 paper was my
              own work.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Independent data added.</strong>{' '}
              Time-to-exploit, vulnerability-database, CISA, maintainer, ransomware-payment and FTC figures from outside
              the AI companies, a section on what cuts against the thesis, and a list of readings that would prove me wrong.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Disclosure studies and a correction (v2.6).</strong>{' '}
              Added a field study of zero-day attacks and two studies of disclosure and vendor patching; the two
              disclosure studies were read as abstracts only, because the library does not carry their full text. They
              added amendment A9. Corrected the Mandiant measure throughout: it counts days from patch release, not from
              disclosure, and the figure caption no longer says the fall came from zero-days, which Mandiant does not
              claim.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Paper and website separated (v2.5).</strong>{' '}
              The text now reads as an academic paper: an abstract, an opening case, numbered parts and sections with
              one-sentence summaries, and lettered appendices. The illustrative scenarios are collapsed by default, and a
              print view produces a plain PDF without the web elements. No claim, number or source changed.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Rebuilt as a story (v2.4).</strong>{' '}
              A cold open, a 60-second summary, three acts with back matter, a one-line point at the top of every
              section, tap-to-define terms, two fictional characters in marked frames, and figures that animate once
              when they enter. No claim, number or source changed.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Literature sweep added (v2.3).</strong>{' '}
              Sixteen more works, including the 2026 International AI Safety Report, the UK AI Security Institute&rsquo;s
              trends report, a CSET patching model, Verizon&rsquo;s 2026 breach report and the strongest arguments against the
              thesis, plus amendment A8.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Library readings added (v2.2).</strong>{' '}
              Six paywalled criminology and security papers read in full through Washington and Lee University&rsquo;s
              library, plus the open journal version of EPSS. They added amendments A6 and A7 and corrected the share of
              flaws exploited from about 5% to 3.7%.
            </li>
            <li>
              <strong className="text-[color:var(--fg)]">Stages renamed.</strong>{' '}
              Unreliable Agent, Reliable Agent, Superhuman Coder and Superhuman Attacker became Assistant, Supervised
              agent, Expert vulnerability work and Unsupervised campaigns, which name what is observable.
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
            Added: the evidence section, the scenario readout, two endings with signposts, the amendments log and this
            list. The next
            revision should re-read the signposts against new reports and replace scenario values with measurements
            as they arrive.
          </p>
        </Section>
        <Section id="sources" number="" eyebrow="references" lead={<>All {PAPER_SOURCES.length} sources cited in the paper, numbered alphabetically by first author.</>} title="References">
          <p className="text-sm">
            Each source was opened and read for this revision. Entries marked library copy are paywalled journal
            articles read in full through Washington and Lee University&rsquo;s library; entries marked abstract only were
            read as their published abstract, and only claims from the abstract are cited; the rest are open copies. Dates
            are publication dates. Web sources were accessed on 7 or 8 October 2026, and each links to an Internet Archive
            copy where one exists; journal articles link to their DOI.
            Entries marked peer-reviewed passed a conference or journal review; preprints have not. Entries marked
            reporting are news accounts of an official statement I could not find in the original.
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
                  {s.kind !== 'primary' && <span className="font-mono text-xs"> · {s.kind}</span>}
                  {'library' in s && s.library && <span className="font-mono text-xs"> · library copy</span>}
                  {'archive' in s && s.archive && (
                    <>
                      {' · '}
                      <a href={s.archive} target="_blank" rel="noreferrer" className="font-mono text-xs underline underline-offset-4 hover:text-[color:var(--accent)]">
                        archived
                      </a>
                    </>
                  )}
                  <span className="hidden break-all font-mono text-[10px] print:block">{s.url}</span>
                  {'archive' in s && s.archive && <span className="hidden break-all font-mono text-[10px] print:block">Archived: {s.archive}</span>}
                </span>
              </li>
            ))}
          </ol>
        </Section>
        </section>

        <div className="mt-16 border-t border-[color:var(--border)] pt-6 text-xs text-[color:var(--fg-subtle)] print:hidden">
          {SITE_LOCKED ? (
            <>← Back to <Link href="/" className="text-[color:var(--accent)] underline underline-offset-4">the front page</Link></>
          ) : (
            <>← Back to <Link href="/wc/papers" className="text-[color:var(--accent)] underline underline-offset-4">/wc/papers</Link></>
          )}
        </div>
      </article>
    </div>
  );
}

const STUDY_ROWS: ReadonlyArray<{ study: string; source: PaperSourceId; result: string; limit: string }> = [
  {
    study: 'Spear phishing, 2024',
    source: 'heiding-2024',
    result: 'Fully AI-written phishing emails drew a 54% click rate, the same as emails written by human experts, against 12% for a generic control.',
    limit: '101 participants recruited at a university, and a preprint.',
  },
  {
    study: 'Known flaws, 2024',
    source: 'fang-2024',
    result: 'A GPT-4 agent exploited 13 of 15 known flaws when handed the public advisory, and 7% without it.',
    limit: 'a small set of 15 flaws, and the agent leaned on the advisory text.',
  },
  {
    study: 'Unknown flaws, 2024',
    source: 'zhu-2024',
    result: 'A team of agents exploited 42% of 14 real web flaws it was not told about, within five tries.',
    limit: '14 web flaws in a test setting, and a preprint.',
  },
  {
    study: 'Capture the flag, 2024',
    source: 'cybench-2024',
    result: 'The best 2024 models only solved competition tasks that took human teams up to 11 minutes.',
    limit: 'competition puzzles with 2024 models; the frontier has moved since.',
  },
  {
    study: 'Web exploits, 2025',
    source: 'cvebench-2025',
    result: 'The best agent framework exploited up to 13% of real web application flaws.',
    limit: 'web applications only, and a preprint.',
  },
  {
    study: 'Real flaws at scale, 2025 to 2026',
    source: 'cybergym-2025',
    result: 'Top agents wrote a working test case for about 20% of 1,507 real vulnerabilities, given a description of each, and the work turned up 34 new ones.',
    limit: 'reproducing a described flaw is a step short of a full attack.',
  },
];

const WRONG_ROWS: ReadonlyArray<{ reading: string; latest: ReactNode; against: string }> = [
  {
    reading: 'Open-weight lag on cyber benchmarks, and criminal use of downloadable models in threat reports',
    latest: <>about 4 months, Sep 2026<Cite ids={['caisi-2026-09']} /></>,
    against: 'The thesis, if the lag reaches about zero by the end of 2027 and reports still find no criminals using those models for exploit work. Then access was not the gate.',
  },
  {
    reading: 'Share of AI-found flaws reported to maintainers that have a patch',
    latest: <>75 of 530, May 2026<Cite ids={['glasswing-2026-05']} /></>,
    against: 'Ending A, if it passes one half within a year. Repair would be keeping up.',
  },
  {
    reading: 'Ransomware payments and the share of victims who pay',
    latest: <>$820M, about 28%, 2025<Cite ids={['chainalysis-2026']} /></>,
    against: 'Ending A, if both keep falling through 2027 while AI tools spread. Defenses against extortion would be holding.',
  },
  {
    reading: 'Mean time from patch release to exploitation',
    latest: <>minus 7 days, 2025<Cite ids={['mtrends-2026']} /></>,
    against: 'Ending B, if it keeps falling. Repair would be starting later each year, however fast it runs.',
  },
  {
    reading: 'Exploited flaws added to CISA\'s catalog per year',
    latest: <>245 in 2025; 250 by 4 Oct 2026<Cite ids={['cisa-kev-2026']} /></>,
    against: 'Ending B, if 2027 adds clearly more than 2026. Exploitation would be outrunning the deadlines.',
  },
  {
    reading: 'AI-tagged share of losses in the FBI\'s annual report',
    latest: <>about 4%, 2025<Cite ids={['ic3-2025']} /></>,
    against: `My fraud ratings in Figure ${FIGURE.barrier}, if it stays near 4% as reporting improves. AI would not be what moved fraud.`,
  },
];

function KeyItem({ kind, children }: { kind: 'evidence' | 'forecast' | 'rating' | 'fiction'; children: ReactNode }) {
  return (
    <div>
      <dt><ClaimTag kind={kind} /></dt>
      <dd className="mt-1.5 text-[color:var(--fg-muted)]">{children}</dd>
    </div>
  );
}

function Section({
  id,
  number,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  lead: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-16 scroll-mt-24">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)] print:hidden">
        [ {eyebrow} ]
      </p>
      <h3 className="themed-heading mt-2 text-2xl font-semibold sm:text-3xl">
        <span className="mr-3 font-mono text-[0.7em] text-[color:var(--fg-muted)]">{number}</span>
        {title}
      </h3>
      <div className="mt-5 space-y-4 text-base leading-relaxed text-[color:var(--fg-muted)]">
        <p className="text-lg leading-snug text-[color:var(--fg)]">{lead}</p>
        {children}
      </div>
    </section>
  );
}
