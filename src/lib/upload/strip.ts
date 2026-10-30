import type { AllowedType } from "./env";

// Removes location and camera metadata from an upload without re-encoding the
// pixels. Phone JPEGs carry GPS in EXIF; PNG and WEBP can carry the same in
// text, eXIf, EXIF and XMP chunks. GIF has no standard place for it and passes
// through.
//
// Fails closed: a file this cannot walk is rejected, never stored as-is,
// because storing the original would keep exactly what this exists to remove.

export type StripResult = { ok: true; body: ArrayBuffer } | { ok: false };

export function stripMetadata(body: ArrayBuffer, type: AllowedType): StripResult {
  const bytes = new Uint8Array(body);
  let out: Uint8Array | null;
  if (type === "image/jpeg") out = stripJpeg(bytes);
  else if (type === "image/png") out = stripPng(bytes);
  else if (type === "image/webp") out = stripWebp(bytes);
  else out = bytes;
  if (!out) return { ok: false };
  return { ok: true, body: out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength) as ArrayBuffer };
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.byteLength, 0);
  const out = new Uint8Array(total);
  let at = 0;
  for (const p of parts) {
    out.set(p, at);
    at += p.byteLength;
  }
  return out;
}

function startsWith(bytes: Uint8Array, at: number, ascii: string): boolean {
  if (at + ascii.length > bytes.length) return false;
  for (let i = 0; i < ascii.length; i++) if (bytes[at + i] !== ascii.charCodeAt(i)) return false;
  return true;
}

// JPEG: keep JFIF (APP0), Adobe (APP14) and ICC profiles (APP2 ICC_PROFILE);
// drop every other APPn and comments. EXIF Orientation is the one tag kept,
// written back as a minimal APP1, so portrait phone shots still display upright.
// Everything after the first EOI goes too: iPhone files append a second image
// (MPF gain map) there that carries its own EXIF.
function stripJpeg(b: Uint8Array): Uint8Array | null {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  const kept: Uint8Array[] = [];
  let orientation = 0;
  let pos = 2;
  while (pos + 1 < b.length) {
    if (b[pos] !== 0xff) return null;
    const marker = b[pos + 1];
    if (marker === 0xff) {
      pos++;
      continue;
    }
    if (marker === 0xd8 || marker === 0xd9) return null;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      kept.push(b.subarray(pos, pos + 2));
      pos += 2;
      continue;
    }
    if (pos + 4 > b.length) return null;
    const end = pos + 2 + ((b[pos + 2] << 8) | b[pos + 3]);
    if (end > b.length || end < pos + 4) return null;
    if (marker === 0xda) {
      // Entropy-coded data stuffs a literal FF as FF 00, so the first FF D9
      // from here on is the real end of image, progressive scans included.
      for (let i = end; i + 1 < b.length; i++) {
        if (b[i] === 0xff && b[i + 1] === 0xd9) {
          kept.push(b.subarray(pos, i + 2));
          return concat([b.subarray(0, 2), ...jpegHead(kept, orientation)]);
        }
      }
      return null;
    }
    const segment = b.subarray(pos, end);
    if (marker === 0xe1 && startsWith(b, pos + 4, "Exif\0\0")) {
      orientation = readOrientation(b.subarray(pos + 10, end));
    }
    const keep =
      (marker < 0xe0 || marker > 0xef) && marker !== 0xfe ||
      marker === 0xe0 ||
      marker === 0xee ||
      (marker === 0xe2 && startsWith(b, pos + 4, "ICC_PROFILE\0"));
    if (keep) kept.push(segment);
    pos = end;
  }
  return null;
}

// Puts the Orientation-only APP1 after APP0 when there is one, since JFIF
// readers expect APP0 first.
function jpegHead(kept: Uint8Array[], orientation: number): Uint8Array[] {
  if (orientation < 2 || orientation > 8) return kept;
  const app1 = orientationApp1(orientation);
  const first = kept[0];
  if (first && first[1] === 0xe0) return [first, app1, ...kept.slice(1)];
  return [app1, ...kept];
}

function orientationApp1(orientation: number): Uint8Array {
  // "Exif\0\0", big-endian TIFF header, IFD0 with one SHORT entry (0x0112).
  const payload = [
    0x45, 0x78, 0x69, 0x66, 0, 0,
    0x4d, 0x4d, 0, 0x2a, 0, 0, 0, 8,
    0, 1,
    0x01, 0x12, 0, 3, 0, 0, 0, 1, 0, orientation, 0, 0,
    0, 0, 0, 0,
  ];
  const length = payload.length + 2;
  return new Uint8Array([0xff, 0xe1, length >> 8, length & 0xff, ...payload]);
}

function readOrientation(tiff: Uint8Array): number {
  if (tiff.length < 8) return 0;
  const little = tiff[0] === 0x49 && tiff[1] === 0x49;
  if (!little && !(tiff[0] === 0x4d && tiff[1] === 0x4d)) return 0;
  const u16 = (at: number) => (little ? tiff[at] | (tiff[at + 1] << 8) : (tiff[at] << 8) | tiff[at + 1]);
  const u32 = (at: number) => (little ? u16(at) + u16(at + 2) * 0x10000 : u16(at) * 0x10000 + u16(at + 2));
  const ifd = u32(4);
  if (ifd + 2 > tiff.length) return 0;
  const count = u16(ifd);
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > tiff.length) return 0;
    if (u16(entry) === 0x0112 && u16(entry + 2) === 3) return u16(entry + 8);
  }
  return 0;
}

// PNG: denylist so APNG and colour chunks survive. Stops at IEND and drops any
// trailing bytes.
const PNG_DROP = new Set(["tEXt", "zTXt", "iTXt", "eXIf", "tIME"]);

function stripPng(b: Uint8Array): Uint8Array | null {
  const kept: Uint8Array[] = [b.subarray(0, 8)];
  let pos = 8;
  while (pos + 12 <= b.length) {
    const length = ((b[pos] << 24) >>> 0) + (b[pos + 1] << 16) + (b[pos + 2] << 8) + b[pos + 3];
    const end = pos + 12 + length;
    if (end > b.length) return null;
    const chunk = String.fromCharCode(b[pos + 4], b[pos + 5], b[pos + 6], b[pos + 7]);
    if (!PNG_DROP.has(chunk)) kept.push(b.subarray(pos, end));
    if (chunk === "IEND") return concat(kept);
    pos = end;
  }
  return null;
}

// WEBP: drop the EXIF and "XMP " chunks, clear their VP8X flag bits and
// rewrite the RIFF size. Chunks are padded to an even length.
function stripWebp(b: Uint8Array): Uint8Array | null {
  if (b.length < 12) return null;
  const le32 = (at: number) => b[at] + (b[at + 1] << 8) + (b[at + 2] << 16) + ((b[at + 3] << 24) >>> 0);
  const riffEnd = 8 + le32(4);
  if (riffEnd > b.length) return null;
  const kept: Uint8Array[] = [];
  let pos = 12;
  while (pos < riffEnd) {
    if (pos + 8 > riffEnd) return null;
    const size = le32(pos + 4);
    const end = pos + 8 + size + (size & 1);
    if (end > riffEnd) return null;
    const chunk = String.fromCharCode(b[pos], b[pos + 1], b[pos + 2], b[pos + 3]);
    if (chunk === "VP8X") {
      if (size < 1) return null;
      const copy = b.slice(pos, end);
      copy[8] &= ~0x0c;
      kept.push(copy);
    } else if (chunk !== "EXIF" && chunk !== "XMP ") {
      kept.push(b.subarray(pos, end));
    }
    pos = end;
  }
  const out = concat([b.subarray(0, 12), ...kept]);
  const size = out.length - 8;
  out[4] = size & 0xff;
  out[5] = (size >> 8) & 0xff;
  out[6] = (size >> 16) & 0xff;
  out[7] = (size >>> 24) & 0xff;
  return out;
}
