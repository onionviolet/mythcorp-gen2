import type { MetadataRoute } from 'next';
import { isRequiredSiteRequest, SITE_LOCKED } from '../siteLock';

// The canonical host is mythcorp.ORG. It has been live on Cloudflare the whole
// time; the repo just said mythcorp.DEV in several places, which does not
// resolve, so an earlier pass "corrected" this to the workers.dev origin. That
// was worse: the real domain was then serving a sitemap and a robots Host that
// both pointed somewhere else, splitting the site across two hostnames.
// NEXT_PUBLIC_SITE_URL still overrides, and is inlined at BUILD time, so it has
// to be set for the build rather than as a worker var.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mythcorp.org').replace(/\/$/, '');

type Entry = {
  path: string;
  priority: number;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
};

// Hand-maintained because the route set is small and mostly static. When you add
// a page (see CLAUDE.md "Adding a page"), add it here too.
const ROUTES: Entry[] = [
  { path: '/', priority: 1.0, changeFrequency: 'monthly' },
  { path: '/experience', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/fmhy', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/wc', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/wc/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/wc/papers', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/wc/papers/ai-cybercrime', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/wc/learn', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/wc/learn/theme-system', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/wc/learn/plain-mode', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/wc/lab/canvas', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.3, changeFrequency: 'yearly' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // While the site is locked, every other route 307s to /. Listing them would
  // advertise redirects, so the sitemap follows the same lock as the middleware.
  const live = SITE_LOCKED ? ROUTES.filter((r) => isRequiredSiteRequest(r.path)) : ROUTES;
  return live.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}

