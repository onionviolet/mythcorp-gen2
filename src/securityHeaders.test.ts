import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';

import { middleware } from './middleware';
import { SECURITY_HEADERS } from './securityHeaders';

test('every middleware response carries the security headers', () => {
  const urls = [
    'https://mythcorp.org/',
    'https://mythcorp.org/about',
    'https://mythcorp.org/a/abc123',
    'https://i.mythcorp.org/abc.png',
    'https://i.mythcorp.org/',
  ];
  for (const url of urls) {
    const response = middleware(new NextRequest(url));
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      assert.equal(response.headers.get(name), value, `${url} ${name}`);
    }
  }
});

test('only frame-ancestors is enforced, so inline scripts are never blocked', () => {
  assert.equal(SECURITY_HEADERS['Content-Security-Policy'], "frame-ancestors 'self'");
  assert.match(SECURITY_HEADERS['Content-Security-Policy-Report-Only'], /script-src 'self' 'unsafe-inline'/);
});
