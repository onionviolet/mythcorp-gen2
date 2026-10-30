import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { stripMetadata } from './strip';

// Fixtures are 8x8 images made with Pillow, each carrying a GPS IFD
// (41 52 55 N, 87 37 40 W), Make "FixtureCam" and Orientation 6.
function fixture(name: string): Uint8Array {
  return new Uint8Array(readFileSync(new URL(`./fixtures/${name}`, import.meta.url)));
}

function contains(haystack: Uint8Array, needle: string | number[]): boolean {
  const n = typeof needle === 'string' ? [...needle].map(c => c.charCodeAt(0)) : needle;
  outer: for (let i = 0; i + n.length <= haystack.length; i++) {
    for (let j = 0; j < n.length; j++) if (haystack[i + j] !== n[j]) continue outer;
    return true;
  }
  return false;
}

function strip(bytes: Uint8Array, type: Parameters<typeof stripMetadata>[1]): Uint8Array {
  const result = stripMetadata(bytes.slice().buffer, type);
  assert.equal(result.ok, true);
  return new Uint8Array((result as { body: ArrayBuffer }).body);
}

// GPS IFD tag 0x8825, in either byte order.
const GPS_TAG_BE = [0x88, 0x25];
const GPS_TAG_LE = [0x25, 0x88];

test('JPEG loses GPS, XMP, comments and trailing data but keeps orientation', () => {
  const input = fixture('gps.jpg');
  assert.ok(contains(input, 'FixtureCam'));
  assert.ok(contains(input, GPS_TAG_BE) || contains(input, GPS_TAG_LE));
  // An iPhone-style second image after EOI, with its own EXIF.
  const withTrailer = new Uint8Array([...input, 0xff, 0xd8, 0xff, 0xe1, ...'Exif FixtureCam'].map(v => typeof v === 'string' ? v.charCodeAt(0) : v));
  const out = strip(withTrailer, 'image/jpeg');
  assert.ok(!contains(out, 'FixtureCam'));
  assert.ok(!contains(out, GPS_TAG_BE) && !contains(out, GPS_TAG_LE));
  assert.ok(!contains(out, 'xmpmeta'));
  assert.ok(!contains(out, 'secret comment'));
  assert.deepEqual([...out.subarray(0, 2)], [0xff, 0xd8]);
  assert.deepEqual([...out.subarray(-2)], [0xff, 0xd9]);
  // Orientation 6 survives as the only EXIF tag.
  assert.ok(contains(out, [0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, 0x06]));
  // The scan data is untouched: everything from SOS on matches the input.
  const sos = (b: Uint8Array) => b.findIndex((v, i) => v === 0xff && b[i + 1] === 0xda);
  assert.deepEqual(out.subarray(sos(out)), input.subarray(sos(input)));
});

test('PNG loses text and eXIf chunks, keeps image data', () => {
  const input = fixture('gps.png');
  assert.ok(contains(input, 'eXIf') && contains(input, 'tEXt'));
  const out = strip(input, 'image/png');
  for (const chunk of ['eXIf', 'tEXt', 'iTXt', 'zTXt', 'FixtureCam', 'GPS']) assert.ok(!contains(out, chunk), chunk);
  assert.ok(contains(out, 'IHDR') && contains(out, 'IDAT') && contains(out, 'IEND'));
});

test('WEBP loses EXIF and XMP chunks and flags, with a correct RIFF size', () => {
  const input = fixture('gps.webp');
  assert.ok(contains(input, 'EXIF'));
  const out = strip(input, 'image/webp');
  assert.ok(!contains(out, 'EXIF') && !contains(out, 'XMP ') && !contains(out, 'FixtureCam'));
  const riff = out[4] | (out[5] << 8) | (out[6] << 16) | (out[7] << 24);
  assert.equal(riff, out.length - 8);
  const vp8x = out.findIndex((v, i) => contains(out.subarray(i, i + 4), 'VP8X'));
  if (vp8x >= 0) assert.equal(out[vp8x + 8] & 0x0c, 0);
});

test('a truncated file is rejected, not stored as-is', () => {
  const input = fixture('gps.jpg');
  assert.equal(stripMetadata(input.slice(0, input.length - 40).buffer, 'image/jpeg').ok, false);
  const png = fixture('gps.png');
  assert.equal(stripMetadata(png.slice(0, 40).buffer, 'image/png').ok, false);
});

test('GIF passes through unchanged', () => {
  const gif = new Uint8Array([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 1, 0, 1, 0]);
  assert.deepEqual(strip(gif, 'image/gif'), gif);
});
