import { getCloudflareContext } from "@opennextjs/cloudflare";
import { moonPhase, solarPosition } from "@/app/components/plain/sky/solarPosition";

// The viewer's sun, computed from Cloudflare's coarse request geolocation.
// Only the rounded sun, the zone and the moon phase leave this handler; the
// coordinates are never returned, logged or cached.
export const dynamic = "force-dynamic";

const HEADERS = { "Cache-Control": "private, no-store" };

type CfGeo = { latitude?: unknown; longitude?: unknown; timezone?: unknown };

function requestCf(request: Request): CfGeo | undefined {
  const own = (request as unknown as { cf?: CfGeo }).cf;
  if (own) return own;
  try {
    return getCloudflareContext().cf as unknown as CfGeo | undefined;
  } catch {
    return undefined;
  }
}

export async function GET(request: Request): Promise<Response> {
  const cf = requestCf(request);
  const lat = Number(cf?.latitude);
  const lon = Number(cf?.longitude);
  if (!cf || cf.latitude == null || cf.longitude == null || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ error: "unavailable" }, { status: 503, headers: HEADERS });
  }
  const now = new Date();
  const sun = solarPosition(now, lat, lon);
  return Response.json(
    {
      elevation: Math.round(sun.elevation),
      azimuth: Math.round(sun.azimuth),
      timezone: typeof cf.timezone === "string" ? cf.timezone : null,
      moonPhase: Math.round(moonPhase(now) * 100) / 100,
    },
    { headers: HEADERS },
  );
}
