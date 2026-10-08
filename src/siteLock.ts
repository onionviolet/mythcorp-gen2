/** Locked everywhere unless a local preview sets NEXT_PUBLIC_SITE_UNLOCK=1.
 *  Production builds and the Playwright server never set it. */
export const SITE_LOCKED = process.env.NEXT_PUBLIC_SITE_UNLOCK !== '1';

export function isRequiredSiteRequest(pathname: string): boolean {
  if (pathname === '/') return true;
  if (pathname.startsWith('/_next/') || pathname.startsWith('/api/')) return true;
  return /\/[^/]+\.[^/]+$/.test(pathname);
}
