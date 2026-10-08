export type PaperSource = {
  id: string;
  author: string;
  title: string;
  date: string;
  url: string;
  kind: 'primary' | 'reporting';
};

export const PAPER_SOURCES = [
  {
    id: 'grace-2024',
    author: 'Grace, Stewart, Sandkühler, Thomas, Weinstein-Raun, Brauner, Korzekwa',
    title: 'Thousands of AI Authors on the Future of AI (survey of 2,778 researchers), arXiv:2401.02843',
    date: '2024-01-05 (v1; v3 revised 2025-10-08)',
    url: 'https://arxiv.org/abs/2401.02843',
    kind: 'primary',
  },
  {
    id: 'ncsc-2024',
    author: 'UK National Cyber Security Centre',
    title: 'The near-term impact of AI on the cyber threat',
    date: '2024-01-24',
    url: 'https://www.ncsc.gov.uk/report/impact-of-ai-on-cyber-threat',
    kind: 'primary',
  },
  {
    id: 'hk-2024',
    author: 'Hong Kong Free Press, reporting a Hong Kong Police briefing',
    title: 'Multinational loses HK$200 million to deepfake video conference scam, Hong Kong police say',
    date: '2024-02-05',
    url: 'https://hongkongfp.com/2024/02/05/multinational-loses-hk200-million-to-deepfake-video-conference-scam-hong-kong-police-say/',
    kind: 'reporting',
  },
  {
    id: 'msft-2024',
    author: 'Microsoft Threat Intelligence, with OpenAI',
    title: 'Staying ahead of threat actors in the age of AI',
    date: '2024-02-14',
    url: 'https://www.microsoft.com/en-us/security/blog/2024/02/14/staying-ahead-of-threat-actors-in-the-age-of-ai/',
    kind: 'primary',
  },
  {
    id: 'bigsleep-2024',
    author: 'Google Project Zero and Google DeepMind',
    title: 'From Naptime to Big Sleep: Using Large Language Models To Catch Vulnerabilities In Real-World Code',
    date: '2024-11-01',
    url: 'https://projectzero.google/2024/10/from-naptime-to-big-sleep.html',
    kind: 'primary',
  },
  {
    id: 'gtig-2025-01',
    author: 'Google Threat Intelligence Group',
    title: 'Adversarial Misuse of Generative AI',
    date: '2025-01-29',
    url: 'https://cloud.google.com/blog/topics/threat-intelligence/adversarial-misuse-generative-ai',
    kind: 'primary',
  },
  {
    id: 'metr-2025',
    author: 'METR',
    title: 'Measuring AI Ability to Complete Long Tasks',
    date: '2025-03-19',
    url: 'https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/',
    kind: 'primary',
  },
  {
    id: 'ncsc-2025',
    author: 'UK National Cyber Security Centre',
    title: 'Impact of AI on cyber threat from now to 2027',
    date: '2025-05-07',
    url: 'https://www.ncsc.gov.uk/report/impact-ai-cyber-threat-now-2027',
    kind: 'primary',
  },
  {
    id: 'xbow-2025',
    author: 'XBOW',
    title: 'The road to Top 1: How XBOW did it',
    date: '2025-06-24',
    url: 'https://xbow.com/blog/top-1-how-xbow-did-it/',
    kind: 'primary',
  },
  {
    id: 'aixcc-2025',
    author: 'DARPA',
    title: 'AI Cyber Challenge marks pivotal inflection point for cyber defense',
    date: '2025-08-08',
    url: 'https://www.darpa.mil/news/2025/aixcc-results',
    kind: 'primary',
  },
  {
    id: 'anthropic-2025-08',
    author: 'Anthropic',
    title: 'Detecting and countering misuse of AI: August 2025',
    date: '2025-08-27',
    url: 'https://www.anthropic.com/news/detecting-countering-misuse-aug-2025',
    kind: 'primary',
  },
  {
    id: 'gtig-2025-11',
    author: 'Google Threat Intelligence Group',
    title: 'GTIG AI Threat Tracker: Advances in Threat Actor Usage of AI Tools',
    date: '2025-11-05',
    url: 'https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools',
    kind: 'primary',
  },
  {
    id: 'anthropic-2025-11',
    author: 'Anthropic',
    title: 'Disrupting the first reported AI-orchestrated cyber espionage campaign',
    date: '2025-11-13',
    url: 'https://www.anthropic.com/news/disrupting-AI-espionage',
    kind: 'primary',
  },
  {
    id: 'metr-2026-01',
    author: 'METR',
    title: 'Time Horizon 1.1',
    date: '2026-01-29',
    url: 'https://metr.org/blog/2026-1-29-time-horizon-1-1/',
    kind: 'primary',
  },
  {
    id: 'glasswing-2026-04',
    author: 'Anthropic',
    title: 'Project Glasswing: Securing critical software for the AI era',
    date: '2026-04-07',
    url: 'https://www.anthropic.com/glasswing',
    kind: 'primary',
  },
  {
    id: 'mythos-2026-04',
    author: 'Anthropic',
    title: "Claude Mythos Preview's cybersecurity capabilities",
    date: '2026-04-07',
    url: 'https://www.anthropic.com/research/mythos-preview',
    kind: 'primary',
  },
  {
    id: 'ic3-2025',
    author: 'FBI Internet Crime Complaint Center',
    title: '2025 Internet Crime Report',
    date: '2026-04 (PDF dated 2026-04-16)',
    url: 'https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf',
    kind: 'primary',
  },
  {
    id: 'metr-2026-05',
    author: 'METR',
    title: 'Frontier Risk Report (February to March 2026)',
    date: '2026-05-19',
    url: 'https://metr.org/blog/2026-05-19-frontier-risk-report/',
    kind: 'primary',
  },
  {
    id: 'glasswing-2026-05',
    author: 'Anthropic',
    title: 'Project Glasswing: An initial update',
    date: '2026-05-22',
    url: 'https://www.anthropic.com/research/glasswing-initial-update',
    kind: 'primary',
  },
  {
    id: 'glasswing-2026-06',
    author: 'Anthropic',
    title: 'Expanding Project Glasswing',
    date: '2026-06-02',
    url: 'https://www.anthropic.com/news/expanding-project-glasswing',
    kind: 'primary',
  },
  {
    id: 'caisi-2026-09',
    author: 'NIST Center for AI Standards and Innovation (CAISI)',
    title: "CAISI's Assessment of Z.ai's GLM-5.3 Cyber Capabilities",
    date: '2026-09-17',
    url: 'https://www.nist.gov/news-events/news/2026/09/caisis-assessment-zais-glm-53-cyber-capabilities',
    kind: 'primary',
  },
  {
    id: 'anthropic-2026-09',
    author: 'Anthropic',
    title: 'GLM-5.3 and the spread of advanced cyber capabilities',
    date: '2026-09-29',
    url: 'https://anthropic.com/research/glm-5-3-and-the-spread-of-advanced-cyber-capabilities',
    kind: 'primary',
  },
] as const satisfies ReadonlyArray<PaperSource>;

export type PaperSourceId = (typeof PAPER_SOURCES)[number]['id'];

export function sourceNumber(id: PaperSourceId): number {
  return PAPER_SOURCES.findIndex((s) => s.id === id) + 1;
}

export function sourceById(id: PaperSourceId): PaperSource {
  return PAPER_SOURCES.find((s) => s.id === id) as PaperSource;
}
