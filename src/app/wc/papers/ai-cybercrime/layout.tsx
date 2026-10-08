import type { Metadata } from 'next';

const TITLE = 'The AI-driven democratization of cybercrime';
const DESCRIPTION =
  'A sourced forecast by Weibao Chen, revised October 2026. AI is moving the hard part of cybercrime from skill to access, for the second time. The record so far, a dated scenario to 2030, two endings, and what would prove it wrong.';

export const metadata: Metadata = {
  title: `${TITLE} | Weibao Chen`,
  description: DESCRIPTION,
  authors: [{ name: 'Weibao Chen' }],
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'article', authors: ['Weibao Chen'] },
  twitter: { card: 'summary', title: TITLE, description: DESCRIPTION },
};

export default function AiCybercrimeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
