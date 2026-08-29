import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function flaskOrigin() {
  return (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
}

export async function GET(request: Request) {
  const backend = flaskOrigin();
  if (!backend) {
    return NextResponse.json({ error: "API_URL / NEXT_PUBLIC_API_URL is not set" }, { status: 503 });
  }

  const incoming = new URL(request.url);
  const target = new URL("/api/knowledge", `${backend}/`);
  incoming.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });

  try {
    const response = await fetch(target, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
    const body = await response.json().catch(() => ({ error: "invalid backend response" }));
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Flask API unreachable", backend }, { status: 502 });
  }
}
