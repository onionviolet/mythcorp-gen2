import assert from 'node:assert/strict';
import test from 'node:test';

import { POST } from './route';

test('uploads are closed, even with a key', async () => {
  const response = await POST(new Request('https://mythcorp.org/api/upload', {
    method: 'POST',
    headers: { authorization: 'Bearer mc_anything' },
    body: new Uint8Array([0xff, 0xd8, 0xff]),
  }));
  assert.equal(response.status, 410);
});
