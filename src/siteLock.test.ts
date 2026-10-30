import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';

import { middleware } from './middleware';
import { isRequiredSiteRequest, SITE_LOCKED } from './siteLock';

function run(path: string) {
  return middleware(new NextRequest(`https://mythcorp.org${path}`));
}

test('the lock is on in tests', () => {
  assert.equal(SITE_LOCKED, true);
});

test('upload view and delete links pass the lock', () => {
  for (const path of ['/a/abc123', '/d/mcd_token']) {
    assert.equal(isRequiredSiteRequest(path), true, path);
    const response = run(path);
    assert.notEqual(response.status, 307, path);
    assert.equal(response.headers.get('location'), null, path);
  }
});

test('an ordinary locked page still redirects home', () => {
  for (const path of ['/about', '/upload', '/a', '/admin/d/x']) {
    assert.equal(isRequiredSiteRequest(path), false, path);
    const response = run(path);
    assert.equal(response.status, 307, path);
    assert.equal(response.headers.get('location'), 'https://mythcorp.org/', path);
  }
});
