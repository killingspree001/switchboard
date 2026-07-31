import { NextResponse } from "next/server";
import { normalizePhone, startOutboundCall, vapiConfigured } from "@/lib/vapi";

// powers the "get a real call from the AI" card on the try page

export async function GET() {
  return NextResponse.json({ enabled: vapiConfigured() });
}

export async function POST(req: Request) {
  if (!vapiConfigured()) {
    return NextResponse.json({ error: "voice is not configured yet" }, { status: 400 });
  }

  let phone = "";
  let name = "";
  try {
    const body = await req.json();
    phone = String(body?.phone ?? "");
    name = String(body?.name ?? "");
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const normalized = normalizePhone(phone);
  if (!normalized) {
    return NextResponse.json(
      { error: "use international format, like +2348031234567" },
      { status: 400 },
    );
  }

  try {
    const call = await startOutboundCall({
      phone: normalized,
      name,
      context: "This person is trying the live demo and asked the AI to call them right now. Introduce Switchboard briefly and answer their questions.",
    });
    return NextResponse.json({ ok: true, callId: call.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "call failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
