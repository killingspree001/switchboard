import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { aiReply, type ChatTurn } from "@/lib/ai";

// Meta WhatsApp Cloud API webhook. GET is Meta's one-time verification
// handshake, POST receives incoming messages. Every message gets an AI
// reply through the shared brain and the thread lands in the inbox.

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "verification failed" }, { status: 403 });
}

async function sendWhatsApp(to: string, text: string) {
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_TOKEN;
  if (!phoneId || !token) return;
  await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  }).catch(() => {});
}

export async function POST(req: Request) {
  let value:
    | {
        messages?: { from?: string; type?: string; text?: { body?: string } }[];
        contacts?: { profile?: { name?: string }; wa_id?: string }[];
      }
    | undefined;
  try {
    const body = await req.json();
    value = body?.entry?.[0]?.changes?.[0]?.value;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const msg = value?.messages?.[0];
  if (!msg || msg.type !== "text" || !msg.from || !msg.text?.body) {
    // delivery/status pings and non text messages just get acknowledged
    return NextResponse.json({ ok: true });
  }

  const from = msg.from;
  const name = value?.contacts?.[0]?.profile?.name || `+${from}`;
  const text = msg.text.body;
  const db = getDb();
  const convoId = `wa_${from}`;
  const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  // pull the thread so far so the AI has context
  let history: ChatTurn[] = [];
  if (db) {
    const snap = await getDoc(doc(db, "conversations", convoId)).catch(() => null);
    const existing = snap?.exists() ? snap.data() : null;
    if (existing?.messages) {
      history = existing.messages.map((m: { from: string; text: string }) => ({
        role: m.from === "ai" ? ("ai" as const) : ("user" as const),
        text: m.text,
      }));
    }
  }
  history.push({ role: "user", text });

  const { reply } = await aiReply(history);
  await sendWhatsApp(from, reply);

  if (db) {
    const messages = [
      ...history.map((h, i) => ({
        id: `m${i}`,
        from: h.role === "ai" ? "ai" : "lead",
        text: h.text,
        time: "",
      })),
      { id: `m${history.length}`, from: "ai", text: reply, time: now },
    ];
    await setDoc(doc(db, "conversations", convoId), {
      leadName: name,
      channel: "whatsapp",
      preview: text.slice(0, 80),
      time: "now",
      unread: true,
      messages: messages.slice(-40),
      sort: -Date.now(),
      demo: false,
    });
    await setDoc(
      doc(db, "leads", `lead_${from}`),
      {
        name,
        phone: `+${from}`,
        channel: "whatsapp",
        status: "followup",
        lastActivity: "just now",
        note: `Asked: ${text.slice(0, 120)}`,
        sort: -Date.now(),
        demo: false,
      },
      { merge: true },
    );
  }

  return NextResponse.json({ ok: true });
}
