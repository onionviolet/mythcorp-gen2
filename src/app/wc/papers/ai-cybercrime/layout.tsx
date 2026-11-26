import type { Metadata } from 'next';

const TITLE = 'The AI-driven democratization of cybercrime';
const DESCRIPTION =
  'A sourced forecast by Weibao Chen, revised November 2026. AI is moving the hard part of cybercrime from skill to access, for the second time. The record so far, a dated scenario to 2030, two endings, and what would prove it wrong.';

const image = { url: '/share/ai-cybercrime.png', width: 1200, height: 630, alt: TITLE + ' by Weibao Chen' };

export const metadata: Metadata = {
  title: `${TITLE} | Weibao Chen`,
  description: DESCRIPTION,
  authors: [{ name: 'Weibao Chen' }],
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'article', images: [image], authors: ['Weibao Chen'] },
  twitter: { card: 'summary_large_image', images: [image], title: TITLE, description: DESCRIPTION },
};

export default function AiCybercrimeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
