import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";

// Vapi posts call events here. On end-of-call-report we file the whole
// conversation (summary, transcript, recording) into the inbox and lead list.

interface TranscriptTurn {
  role: string;
  message?: string;
  time?: number;
}

export async function POST(req: Request) {
  let message: {
    type?: string;
    call?: { id?: string; customer?: { number?: string; name?: string } };
    artifact?: { messages?: TranscriptTurn[]; recordingUrl?: string };
    analysis?: { summary?: string };
    durationSeconds?: number;
  };
  try {
    const body = await req.json();
    message = body?.message ?? {};
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (message.type !== "end-of-call-report") {
    return NextResponse.json({ ok: true });
  }

  const db = adminDb();
  if (!db) return NextResponse.json({ ok: true });

  const callId = message.call?.id ?? `call_${Date.now()}`;
  const customer = message.call?.customer;
  const summary = message.analysis?.summary ?? "Call completed.";
  const recordingUrl = message.artifact?.recordingUrl ?? null;
  const turns = (message.artifact?.messages ?? [])
    .filter((t) => (t.role === "bot" || t.role === "user") && t.message)
    .slice(0, 40);

  const seconds = Math.round(message.durationSeconds ?? 0);
  const duration = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  // anything we started from a campaign has extra context stored on the call
  const callRef = db.collection("calls").doc(callId);
  const callSnap = await callRef.get().catch(() => null);
  const callMeta = callSnap?.exists ? callSnap.data() : null;
  const leadName = callMeta?.leadName || customer?.name || customer?.number || "Unknown caller";

  await db.collection("conversations").doc(callId).set({
    leadName,
    channel: "voice",
    preview: `AI call summary: ${summary.slice(0, 80)}`,
    time: "now",
    unread: true,
    call: {
      direction: callMeta ? "outbound" : "inbound",
      duration,
      status: "completed",
      summary,
      recordingUrl,
    },
    messages: turns.map((t, i) => ({
      id: `m${i}`,
      from: t.role === "bot" ? "ai" : "lead",
      text: t.message,
      time: "",
    })),
    sort: -Date.now(),
    demo: false,
  });

  await db.collection("leads").doc(`lead_${(customer?.number ?? callId).replace(/\D/g, "")}`).set(
    {
      name: leadName,
      phone: customer?.number ?? "",
      channel: "voice",
      status: "followup",
      lastActivity: "just now",
      note: summary.slice(0, 140),
      sort: -Date.now(),
      demo: false,
    },
    { merge: true },
  );

  if (callMeta?.campaignId) {
    await db
      .collection("campaigns")
      .doc(callMeta.campaignId)
      .update({ connected: FieldValue.increment(1) })
      .catch(() => {});
    await callRef.update({ status: "completed" }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
