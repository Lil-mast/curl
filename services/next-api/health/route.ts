import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function flaskOrigin() {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

export async function GET() {
  const backend = flaskOrigin();
  let flask: { ok: boolean; status?: number; error?: string } = { ok: false };

  if (backend) {
    try {
      const response = await fetch(`${backend}/health`, {
        signal: AbortSignal.timeout(15000),
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      flask = { ok: response.ok, status: response.status };
    } catch (error) {
      flask = { ok: false, error: error instanceof Error ? error.message : "unreachable" };
    }
  } else {
    flask = { ok: false, error: "API_URL / NEXT_PUBLIC_API_URL is not set" };
  }

  return NextResponse.json({
    ok: true,
    service: "maktab-web",
    flask,
    listings: "/api/listings",
    knowledge: "/api/knowledge"
  });
}
