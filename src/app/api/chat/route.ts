import { NextResponse } from "next/server";

// This route is the real reply pipeline. With GEMINI_API_KEY set it answers
// with live AI; without one it falls back to simulated replies so the try
// page still demos well. The same pipeline will serve WhatsApp later.

const SYSTEM_PROMPT = `You are the AI sales assistant for Switchboard, a unified
sales and support workspace. Switchboard runs AI voice calls (outbound campaigns
from a CSV plus inbound answering), replies to WhatsApp and Instagram messages
automatically, and files every conversation into one inbox with lead tags.

Tone: warm, professional, never pushy. Keep replies to 2-4 short sentences.
If someone asks about pricing, explain plans are being finalized and offer to
take their contact for a callback. If they sound ready to buy, offer to book a
demo. Stay on the topic of Switchboard and what it can do for their business.`;

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

// keyword based fallbacks used only when no API key is configured
function simulatedReply(lastUserText: string): string {
  const t = lastUserText.toLowerCase();
  if (t.includes("pric") || t.includes("cost") || t.includes("how much")) {
    return "Plans are being finalized right now, but I can have someone walk you through numbers for your team size. Want to leave a phone number or email for a callback?";
  }
  if (t.includes("demo") || t.includes("book") || t.includes("call me")) {
    return "Happy to set that up! The live dashboard demo is open right now from the homepage, and I can book a guided walkthrough too. What day works for you?";
  }
  if (t.includes("whatsapp") || t.includes("instagram")) {
    return "Switchboard connects to your WhatsApp and Instagram and answers incoming messages in seconds, using your business info. Everything lands in one inbox with the serious buyers tagged for you.";
  }
  if (t.includes("call") || t.includes("voice") || t.includes("phone")) {
    return "The voice side works both ways: upload a CSV and the AI calls every lead with a natural voice, and it also answers your inbound line around the clock. Every call is recorded, transcribed and summarized.";
  }
  return "Switchboard answers your calls, WhatsApp and Instagram with AI, then files every lead into one inbox so nothing slips. What kind of business are you running? I can tell you exactly how it would fit.";
}

export async function POST(req: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body?.messages)) messages = body.messages.slice(-20);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser?.text?.trim()) {
    return NextResponse.json({ error: "empty message" }, { status: 400 });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ reply: simulatedReply(lastUser.text), live: false });
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: messages.map((m) => ({
            role: m.role === "ai" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
        }),
      },
    );

    if (!res.ok) {
      // key misconfigured or quota hit, degrade to simulation instead of erroring
      return NextResponse.json({ reply: simulatedReply(lastUser.text), live: false });
    }

    const data = await res.json();
    const reply: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      return NextResponse.json({ reply: simulatedReply(lastUser.text), live: false });
    }
    return NextResponse.json({ reply: reply.trim(), live: true });
  } catch {
    return NextResponse.json({ reply: simulatedReply(lastUser.text), live: false });
  }
}
