import { SITE_LOCKED } from '../../../siteLock';

/**
 * Plain mode doubles as the site's holding mode: every route collapses to a
 * work-in-progress screen except the ones listed here.
 *
 * A prefix opens itself and everything under it, which is what the image
 * routes need: `/a/<id>` links are already out in the world, and a shared
 * image resolving to a holding screen would be a broken link, not a tease.
 */
export const PLAIN_OPEN_PREFIXES = ['/contact', '/upload', '/a', '/d', '/i'] as const;

/** The attribute the pre-paint script and React both write to <html>. */
export const HOLD_ATTR = 'data-hold';

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

export function isOpenRoute(pathname: string): boolean {
  const p = normalizePath(pathname);
  return PLAIN_OPEN_PREFIXES.some((open) => p === open || p.startsWith(`${open}/`));
}

export function isHeld(theme: string | undefined, pathname: string): boolean {
  if (SITE_LOCKED) return true;
  if (theme !== 'plain') return false;
  return !isOpenRoute(pathname);
}
