"use client";

import { useEffect, useRef, useState } from "react";
import { PhoneIcon, SparkIcon } from "@/components/icons";

interface Msg {
  role: "user" | "ai";
  text: string;
}

const starters = [
  "What does Switchboard actually do?",
  "How do the AI phone calls work?",
  "Can it answer my WhatsApp?",
  "What will it cost me?",
];

function CallMeCard({
  voiceEnabled,
  voiceNumber,
}: {
  voiceEnabled: boolean;
  voiceNumber: string | null;
}) {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "calling" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function requestCall() {
    setState("calling");
    setError("");
    try {
      const res = await fetch("/api/call-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "call failed");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setError("connection hiccup, try again");
      setState("error");
    }
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-voice-tint text-voice">
        <PhoneIcon className="h-5 w-5" />
      </span>
      <h2 className="mt-4 font-display text-lg font-semibold">
        Get a real call from the AI
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Drop your number and the voice agent calls you within a minute, talks
        like a person, and a summary of your own call lands in the inbox.
      </p>
      {state === "done" ? (
        <div className="mt-4 rounded-lg bg-closed-tint p-3.5 text-sm text-closed">
          Calling you now — pick up! Check the inbox afterwards for your call
          summary.
        </div>
      ) : (
        <>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!voiceEnabled || state === "calling"}
            placeholder="+234 803 000 0000"
            className="mt-4 w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-voice placeholder:text-faint"
          />
          <button
            onClick={requestCall}
            disabled={!voiceEnabled || !phone.trim() || state === "calling"}
            className="mt-3 w-full rounded-lg bg-voice px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:bg-line disabled:text-faint"
          >
            {state === "calling" ? "Dialing..." : "Call me"}
          </button>
          {state === "error" && <p className="mt-2 text-xs text-hot">{error}</p>}
        </>
      )}
      <p className="mt-3 text-xs leading-relaxed text-faint">
        {voiceEnabled
          ? voiceNumber
            ? `Use international format with country code. Or call the AI yourself: ${voiceNumber}`
            : "Use international format with country code."
          : "This unlocks in the voice phase — it goes live the moment the Vapi key is connected."}
      </p>
    </section>
  );
}

export default function TryClient({
  voiceEnabled,
  voiceNumber,
}: {
  voiceEnabled: boolean;
  voiceNumber: string | null;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "Hi! I'm the Switchboard agent — the same AI that answers calls and DMs for businesses using this platform. Ask me anything about how it works.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  // null until the first reply tells us whether a real model is connected
  const [live, setLive] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    const clean = text.trim();
    if (!clean || sending) return;
    const next: Msg[] = [...messages, { role: "user", text: clean }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setLive(Boolean(data.live));
      setMessages((m) => [
        ...m,
        { role: "ai", text: data.reply ?? "Sorry, something glitched. Try that again?" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Connection hiccup — give it another go." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* live chat */}
      <section className="flex h-[calc(100dvh-16rem)] min-h-[440px] flex-col overflow-hidden rounded-xl border border-line bg-surface lg:col-span-2">
        <header className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-tint text-accent">
              <SparkIcon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Switchboard agent</p>
              <p className="text-xs text-muted">text version of the call and DM agent</p>
            </div>
          </div>
          {live === null ? (
            <span className="text-xs text-faint">say something to start</span>
          ) : live ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-closed-tint px-2.5 py-1 text-xs font-medium text-closed">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-closed" />
              Live AI
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-demo-border bg-demo-bg px-2.5 py-1 text-xs font-medium text-demo-text">
              Simulated
            </span>
          )}
        </header>

        <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[75%] ${
                  m.role === "user"
                    ? "rounded-br-md bg-accent text-white"
                    : "rounded-bl-md border border-line bg-paper"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-line bg-paper px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-faint [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-faint [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-faint [animation-delay:240ms]" />
              </div>
            </div>
          )}
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {starters.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <footer className="border-t border-line p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3.5 py-1.5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the agent anything..."
              className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-faint"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep disabled:bg-line disabled:text-faint"
            >
              Send
            </button>
          </form>
        </footer>
      </section>

      {/* the real call card */}
      <CallMeCard voiceEnabled={voiceEnabled} voiceNumber={voiceNumber} />
    </div>
  );
}
