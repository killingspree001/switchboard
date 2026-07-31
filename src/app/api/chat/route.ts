import { NextResponse } from "next/server";
import { aiReply, type ChatTurn } from "@/lib/ai";

// the try page chat, running on the shared reply brain in lib/ai.ts

export async function POST(req: Request) {
  let messages: ChatTurn[] = [];
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

  const { reply, live } = await aiReply(messages);
  return NextResponse.json({ reply, live });
}
