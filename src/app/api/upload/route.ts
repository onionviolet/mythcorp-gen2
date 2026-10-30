import { verifyKey } from "@/lib/upload/keys";
import { readUploadBody } from "@/lib/upload/body";
import { validateUpload } from "@/lib/upload/validate";
import { checkCaps, commitUsage } from "@/lib/upload/caps";
import { newDeleteToken, objectId, randomObjectKey } from "@/lib/upload/ids";
import { putObject, publicUrl } from "@/lib/upload/r2";
import { recordDeleteToken, recordObject } from "@/lib/upload/objects";

function bearer(request: Request): string {
  return (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
}
function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}
// `?format=text` returns the bare URL, which is what 0x0.st and catbox do and
// what makes `curl ... | clip` a one-liner instead of a jq pipeline. The delete
// URL rides in a header, the way 0x0 uses X-Token and transfer.sh uses
// X-Url-Delete, since a plain-text body can only carry one thing.
//
// JSON stays the DEFAULT and text is opt-in, which is the one place this
// deliberately parts from those two hosts: they are curl-first, this is
// ShareX-first, and every issued .sxcu reads {json:url}. Negotiating on Accept
// instead would flip ShareX's output the moment it sent `Accept: */*`.
function text(url: string, deleteUrl: string): Response {
  return new Response(`${url}\n`, {
    status: 201,
    headers: { "content-type": "text/plain; charset=utf-8", "x-url-delete": deleteUrl },
  });
}
// Uploads are closed while the site is locked (decided 2026-10-29). Existing
// links keep working: /a/<id>, /d/<token> and i.mythcorp.org are untouched.
// Flip this to reopen; the rest of the pipeline below is unchanged.
const UPLOADS_OPEN = false;

export async function POST(request: Request): Promise<Response> {
  if (!UPLOADS_OPEN) return json({ error: "Uploads are closed. Existing links still work." }, 410);
  const key = await verifyKey(bearer(request));
  if (!key) return json({ error: "Unauthorized" }, 401);
  // Accepts raw binary (ShareX) or multipart/form-data (curl -F, HTML forms).
  const read = await readUploadBody(request);
  if (!read.ok) return json({ error: read.message }, read.status);
  const body = read.body;
  const check = validateUpload(body);
  if (!check.ok) return json({ error: check.message }, check.status);
  const cap = await checkCaps(key.label, body.byteLength);
  if (!cap.ok) return json({ error: cap.message }, cap.status);
  const objectKey = randomObjectKey(check.type);
  await putObject(objectKey, body, check.type);
  // Mint the delete token before recording, so the hash is part of the record
  // from the start and no object exists that a token cannot reach.
  const token = newDeleteToken();
  const deleteHash = await recordDeleteToken(token, objectKey);
  await recordObject({ key: objectKey, uploader: key.label, size: body.byteLength, type: check.type, uploadedAt: new Date().toISOString(), deleteHash });
  await commitUsage(key.label, body.byteLength);
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const publicLink = publicUrl(objectKey);
  const deleteLink = `${origin}/d/${token}`;
  if (requestUrl.searchParams.get("format") === "text") return text(publicLink, deleteLink);
  return json({
    url: publicLink,
    viewUrl: `${origin}/a/${objectId(objectKey)}`,
    deleteUrl: deleteLink,
    key: objectKey,
  }, 201);
}
