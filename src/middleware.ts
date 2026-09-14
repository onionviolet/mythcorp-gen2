import { NextResponse, type NextRequest } from 'next/server';
import { isRequiredSiteRequest, SITE_LOCKED } from './siteLock';

// i.mythcorp.org is the image hostname. It points at this same worker, so the
// only thing separating it from the main site is the Host header: a request for
// i.mythcorp.org/<key>.png is rewritten to the /api/img/<key> route, which
// streams the object out of R2.
//
// Why a hostname and not a path: an image URL ending in .png should be raw
// bytes everywhere on the internet, which is the same reasoning that moved the
// view page from /i/<key>.png to /a/<id> (see STATUS, upload conventions).
//
// This runs on every matched request to the main site too, so it stays a single
// string comparison and gets out of the way. A mistake in here takes down every
// route, not just the images.
const IMAGE_HOST = 'i.mythcorp.org';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') ?? '').toLowerCase().split(':')[0];
  if (host !== IMAGE_HOST) {
    if (SITE_LOCKED && !isRequiredSiteRequest(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/', request.url), 307);
    }
    return NextResponse.next();
  }

  const key = request.nextUrl.pathname.replace(/^\/+/, '');
  // The bare hostname is not a gallery. Send anyone poking at it to the site.
  if (!key) return NextResponse.redirect('https://mythcorp.org/', 308);

  return NextResponse.rewrite(new URL(`/api/img/${key}`, request.url));
}

export const config = {
  // Skip Next's own static output and the favicon. Everything else has to pass
  // through so the image host can claim its paths.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
