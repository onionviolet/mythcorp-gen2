// mythcorp.ORG, not .dev and not the workers.dev origin. See the note in
// sitemap.ts: this is the live custom domain, and `host` here is what tells
// crawlers which of the several hostnames serving this worker is canonical.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mythcorp.org').replace(/\/$/, '');

export const dynamic = 'force-static';

export function GET() {
  // Keep /a crawlable for rich embeds; its own noindex handles search.
  const body = [
    '#     [0w0]',
    '#      /|\\',
    '#      / \\',
    '# MYTHCORP / machine reception',
    '#',
    '# If you are reading this with eyes, hello.',
    '# The front door is still being built. The side door works.',
    '#',
    '# Back on /, press / and enter: cat readme',
    '# No keyboard? The 0w0 mark opens the same console.',
    '# Then try: ls',
    '# Please leave the spectre where you found it.',
    '',
    'User-Agent: *',
    'Allow: /',
    'Disallow: /og',
    'Disallow: /d',
    'Disallow: /upload',
    '',
    `Host: ${SITE_URL}`,
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
