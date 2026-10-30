/** Locked everywhere unless a local preview sets NEXT_PUBLIC_SITE_UNLOCK=1.
 *  Production builds and the Playwright server never set it. */
export const SITE_LOCKED = process.env.NEXT_PUBLIC_SITE_UNLOCK !== '1';

/** The only pages that stay public while the rest of the site is locked. */
export const LOCKED_OPEN_PATHS = ['/wc/papers/ai-cybercrime'] as const;

/** Upload links already handed out (`/a/<id>` view, `/d/<token>` delete)
 *  have to keep working while the rest of the site is locked. */
const LOCKED_OPEN_PREFIXES = ['/_next/', '/api/', '/a/', '/d/'] as const;

export function isLockedOpenPath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  return LOCKED_OPEN_PATHS.some(open => path === open);
}

export function isRequiredSiteRequest(pathname: string): boolean {
  if (pathname === '/') return true;
  if (isLockedOpenPath(pathname)) return true;
  if (LOCKED_OPEN_PREFIXES.some(prefix => pathname.startsWith(prefix))) return true;
  return /\/[^/]+\.[^/]+$/.test(pathname);
}
