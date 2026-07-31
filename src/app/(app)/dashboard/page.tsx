import Link from "next/link";
import { demoStats, demoConversations, demoCampaigns } from "@/lib/demo-data";
import { PageHeader, ChannelBadge, DemoTag } from "@/components/ui";
import { PhoneOutIcon, ArrowRightIcon, SparkIcon } from "@/components/icons";

const stats = [
  { label: "Calls today", value: demoStats.callsToday, hint: "outbound + inbound" },
  { label: "Connect rate", value: `${demoStats.connectedRate}%`, hint: "of dialed calls" },
  { label: "Messages handled", value: demoStats.messagesHandled, hint: "WhatsApp + Instagram" },
  { label: "Hot leads", value: demoStats.hotLeads, hint: "waiting on you" },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="What your AI agents did across every channel."
        demo
      >
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-2 rounded-lg bg-copper px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-copper-deep"
        >
          <PhoneOutIcon className="h-4 w-4" />
          New campaign
        </Link>
      </PageHeader>

      {/* stat tiles */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-surface p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">
              {s.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
              {s.value}
            </p>
            <p className="mt-1 text-xs text-muted">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* latest conversations */}
        <section className="rounded-xl border border-line bg-surface lg:col-span-3">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-base font-semibold">Latest activity</h2>
            <Link
              href="/inbox"
              className="inline-flex items-center gap-1 text-sm font-medium text-copper-deep hover:underline"
            >
              Open inbox <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </header>
          <ul className="divide-y divide-line">
            {demoConversations.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link
                  href="/inbox"
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-paper"
                >
                  <ChannelBadge channel={c.channel} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.leadName}</p>
                    <p className="truncate text-sm text-muted">{c.preview}</p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-faint">{c.time}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* running campaigns */}
        <section className="rounded-xl border border-line bg-surface lg:col-span-2">
          <header className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-base font-semibold">Campaigns</h2>
            <DemoTag />
          </header>
          <ul className="divide-y divide-line">
            {demoCampaigns.map((cp) => {
              const pct = cp.total ? Math.round((cp.called / cp.total) * 100) : 0;
              return (
                <li key={cp.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium">{cp.name}</p>
                    <span
                      className={`shrink-0 text-[11px] font-semibold uppercase tracking-wider ${
                        cp.status === "running"
                          ? "text-copper-deep"
                          : cp.status === "done"
                            ? "text-closed"
                            : "text-faint"
                      }`}
                    >
                      {cp.status}
                    </span>
                  </div>
                  <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-paper">
                    <div
                      className="h-full rounded-full bg-copper"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs tabular-nums text-muted">
                    {cp.called}/{cp.total} called · {cp.connected} connected
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* how it works strip */}
      <section className="mt-6 rounded-xl border border-line bg-ink p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-copper/20 text-copper">
            <SparkIcon className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold text-white">
              Every channel, one pipeline
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Outbound AI calls, an always on receptionist, and instant WhatsApp and
              Instagram replies all feed the same inbox, so your team only ever works
              from one list of leads.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
