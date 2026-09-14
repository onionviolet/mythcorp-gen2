export const SITE_LOCKED = true;

export function isRequiredSiteRequest(pathname: string): boolean {
  if (pathname === '/') return true;
  if (pathname.startsWith('/_next/') || pathname.startsWith('/api/')) return true;
  return /\/[^/]+\.[^/]+$/.test(pathname);
}
