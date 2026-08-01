import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { demoConversations, demoLeads, demoCampaigns } from "@/lib/demo-data";

// Fills Firestore with the labeled demo rows so the dashboard has data on
// day one. Dev only unless a SEED_TOKEN is configured and supplied.

const STARTER_PROMPT = `You are the AI sales assistant for Switchboard Realty Tools.

Tone: warm, professional, never pushy. Keep answers short.

What we sell: an outreach automation service for real estate agencies.
Pricing: flat monthly rate per seat plus per minute call pricing. Never
quote exact numbers on a first call, offer a callback from the team instead.

If a lead sounds ready to buy, offer to book a demo. If they object twice,
thank them politely and end the conversation.`;

export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV === "development";
  const token = process.env.SEED_TOKEN;
  const supplied = req.headers.get("x-seed-token");
  if (!isDev && (!token || supplied !== token)) {
    return NextResponse.json({ error: "not allowed" }, { status: 403 });
  }

  const db = adminDb();
  if (!db) {
    return NextResponse.json({ error: "firebase admin is not configured" }, { status: 400 });
  }

  try {
    let written = 0;

    for (const [i, c] of demoConversations.entries()) {
      const { id, ...rest } = c;
      await db.collection("conversations").doc(id).set({ ...rest, sort: i, demo: true });
      written++;
    }
    for (const [i, l] of demoLeads.entries()) {
      const { id, ...rest } = l;
      await db.collection("leads").doc(id).set({ ...rest, sort: i, demo: true });
      written++;
    }
    for (const [i, cp] of demoCampaigns.entries()) {
      const { id, ...rest } = cp;
      await db.collection("campaigns").doc(id).set({ ...rest, sort: i, demo: true });
      written++;
    }

    await db.collection("settings").doc("agent").set({ prompt: STARTER_PROMPT }, { merge: true });
    written++;

    return NextResponse.json({ ok: true, written });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
