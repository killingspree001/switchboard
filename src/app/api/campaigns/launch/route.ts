import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { normalizePhone, startOutboundCall, vapiConfigured } from "@/lib/vapi";

// takes the parsed CSV rows and starts real AI calls, capped so a stray
// upload can't burn through trial credit

const MAX_CALLS_PER_LAUNCH = 5;

interface Row {
  name: string;
  phone: string;
  context: string;
}

export async function POST(req: Request) {
  if (!vapiConfigured()) {
    return NextResponse.json({ error: "voice is not configured yet" }, { status: 400 });
  }

  let name = "";
  let rows: Row[] = [];
  try {
    const body = await req.json();
    name = String(body?.name ?? "Untitled campaign");
    if (Array.isArray(body?.rows)) rows = body.rows.slice(0, 200);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const callable = rows
    .map((r) => ({ ...r, phone: normalizePhone(r.phone) ?? "" }))
    .filter((r) => r.phone);
  if (callable.length === 0) {
    return NextResponse.json(
      { error: "no valid phone numbers, use international format like +234..." },
      { status: 400 },
    );
  }

  const toCall = callable.slice(0, MAX_CALLS_PER_LAUNCH);
  const db = adminDb();
  const campaignId = `cp_${Date.now()}`;

  let placed = 0;
  const errors: string[] = [];
  for (const row of toCall) {
    try {
      const call = await startOutboundCall({
        phone: row.phone,
        name: row.name,
        context: row.context,
      });
      placed++;
      if (db) {
        await db.collection("calls").doc(call.id).set({
          campaignId,
          leadName: row.name,
          phone: row.phone,
          context: row.context ?? "",
          status: "started",
          createdAt: Date.now(),
        });
      }
    } catch (e) {
      errors.push(e instanceof Error ? e.message : "call failed");
    }
  }

  if (db) {
    await db.collection("campaigns").doc(campaignId).set({
      name,
      total: callable.length,
      called: placed,
      connected: 0,
      status: "running",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sort: -Date.now(), // newest first in the ordered list
      demo: false,
    });
  }

  return NextResponse.json({
    ok: placed > 0,
    placed,
    capped: callable.length > toCall.length ? MAX_CALLS_PER_LAUNCH : null,
    errors: errors.slice(0, 3),
  });
}
