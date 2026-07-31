"use client";

import { useState } from "react";
import { demoConversations, type Channel, type Conversation } from "@/lib/demo-data";
import { useLiveCollection } from "@/lib/use-live-data";
import { ChannelBadge, DemoTag } from "@/components/ui";
import { PlayIcon, SparkIcon, ArrowRightIcon } from "@/components/icons";

const filters: { key: Channel | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "voice", label: "Voice" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "instagram", label: "Instagram" },
];

function ConversationList({
  conversations,
  active,
  onSelect,
  filter,
  setFilter,
}: {
  conversations: Conversation[];
  active: string | null;
  onSelect: (id: string) => void;
  filter: Channel | "all";
  setFilter: (f: Channel | "all") => void;
}) {
  const list =
    filter === "all"
      ? conversations
      : conversations.filter((c) => c.channel === filter);

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1.5 border-b border-line p-3">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.key
                ? "bg-accent text-white"
                : "bg-paper text-muted hover:bg-line/60"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="flex-1 divide-y divide-line overflow-y-auto">
        {list.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c.id)}
              className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors ${
                active === c.id ? "bg-accent-tint/60" : "hover:bg-paper"
              }`}
            >
              <ChannelBadge channel={c.channel} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className={`truncate text-sm ${c.unread ? "font-semibold" : "font-medium"}`}>
                    {c.leadName}
                  </p>
                  <span className="shrink-0 text-xs tabular-nums text-faint">{c.time}</span>
                </div>
                <p className={`mt-0.5 truncate text-sm ${c.unread ? "text-text" : "text-muted"}`}>
                  {c.preview}
                </p>
              </div>
              {c.unread && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />}
            </button>
          </li>
        ))}
        {list.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-muted">
            Nothing on this channel yet.
          </li>
        )}
      </ul>
    </div>
  );
}

function CallCard({ call }: { call: NonNullable<Conversation["call"]> }) {
  return (
    <div className="space-y-3">
      {/* fake recording player, becomes the real Vapi recording once connected */}
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3.5">
        <button
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-voice text-white transition-colors hover:opacity-90"
          aria-label="Play recording"
        >
          <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
        </button>
        <div className="flex flex-1 items-end gap-[3px]" aria-hidden>
          {[5, 9, 14, 8, 12, 16, 10, 6, 13, 9, 15, 7, 11, 14, 6, 10, 12, 8, 5, 9, 13, 7].map(
            (h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full ${i < 9 ? "bg-voice" : "bg-line-strong"}`}
                style={{ height: `${h * 2}px` }}
              />
            ),
          )}
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted">{call.duration}</span>
      </div>

      {/* AI generated call summary */}
      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-deep">
          <SparkIcon className="h-3.5 w-3.5" />
          AI summary
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text">{call.summary}</p>
        <p className="mt-3 text-xs text-faint">
          {call.direction === "outbound" ? "Outbound call" : "Inbound call"} ·{" "}
          {call.status.replace("_", " ")}
        </p>
      </div>
    </div>
  );
}

function ConversationView({ convo, onBack }: { convo: Conversation; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-line px-4 py-3.5">
        <button
          onClick={onBack}
          className="rounded-lg p-1.5 text-muted hover:bg-paper lg:hidden"
          aria-label="Back to list"
        >
          <ArrowRightIcon className="h-4.5 w-4.5 rotate-180" />
        </button>
        <ChannelBadge channel={convo.channel} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{convo.leadName}</p>
          <p className="text-xs capitalize text-muted">
            {convo.channel === "voice" ? "AI voice call" : `${convo.channel} chat`}
          </p>
        </div>
        <DemoTag />
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {convo.call && <CallCard call={convo.call} />}
        <div className="space-y-2.5">
          {convo.messages.map((m) => (
            <div key={m.id} className={`flex ${m.from === "ai" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[70%] ${
                  m.from === "ai"
                    ? "rounded-br-md bg-accent text-white"
                    : "rounded-bl-md border border-line bg-surface"
                }`}
              >
                <p>{m.text}</p>
                <p
                  className={`mt-1 text-[11px] tabular-nums ${
                    m.from === "ai" ? "text-white/65" : "text-faint"
                  }`}
                >
                  {m.from === "ai" ? "AI agent · " : ""}
                  {m.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-line p-3">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3.5 py-1.5">
          <input
            disabled
            placeholder="Human takeover replies unlock when channels are connected"
            className="h-9 flex-1 bg-transparent text-sm outline-none placeholder:text-faint"
          />
          <button
            disabled
            className="rounded-lg bg-line px-3.5 py-1.5 text-sm font-medium text-faint"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function InboxClient() {
  const { data: conversations } = useLiveCollection<Conversation>(
    "conversations",
    demoConversations,
  );
  const [filter, setFilter] = useState<Channel | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  // on mobile only one pane shows at a time, this tracks which
  const [mobileDetail, setMobileDetail] = useState(false);

  const active =
    conversations.find((c) => c.id === activeId) ?? conversations[0] ?? null;

  return (
    <div className="grid h-[calc(100dvh-10.5rem)] min-h-[480px] overflow-hidden rounded-xl border border-line bg-surface lg:h-[calc(100dvh-11rem)] lg:grid-cols-[360px_1fr]">
      <div className={`${mobileDetail ? "hidden" : "flex"} min-h-0 flex-col lg:flex lg:border-r lg:border-line`}>
        <ConversationList
          conversations={conversations}
          active={active?.id ?? null}
          filter={filter}
          setFilter={setFilter}
          onSelect={(id) => {
            setActiveId(id);
            setMobileDetail(true);
          }}
        />
      </div>
      <div className={`${mobileDetail ? "flex" : "hidden"} min-h-0 flex-col lg:flex`}>
        {active ? (
          <ConversationView convo={active} onBack={() => setMobileDetail(false)} />
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-muted">
            Pick a conversation to read it here.
          </div>
        )}
      </div>
    </div>
  );
}
