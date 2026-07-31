"use client";

import { useState } from "react";
import { demoLeads, type LeadStatus } from "@/lib/demo-data";
import { ChannelBadge, StatusPill } from "@/components/ui";
import { SearchIcon } from "@/components/icons";

const statusFilters: { key: LeadStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "hot", label: "Hot" },
  { key: "followup", label: "Follow up" },
  { key: "not_interested", label: "Not interested" },
  { key: "closed", label: "Closed" },
];

export default function LeadsClient() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");

  const leads = demoLeads.filter((l) => {
    const matchesText =
      l.name.toLowerCase().includes(query.toLowerCase()) || l.phone.includes(query);
    const matchesStatus = status === "all" || l.status === status;
    return matchesText && matchesStatus;
  });

  return (
    <div className="rounded-xl border border-line bg-surface">
      {/* toolbar */}
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2">
          <SearchIcon className="h-4 w-4 shrink-0 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or phone"
            className="w-full bg-transparent text-sm outline-none placeholder:text-faint"
          />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                status === f.key
                  ? "bg-accent text-white"
                  : "bg-paper text-muted hover:bg-line/60"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] font-semibold uppercase tracking-wider text-faint">
              <th className="px-5 py-3">Lead</th>
              <th className="px-5 py-3">Channel</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Last activity</th>
              <th className="px-5 py-3">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.map((l) => (
              <tr key={l.id} className="transition-colors hover:bg-paper">
                <td className="px-5 py-3.5">
                  <p className="font-medium">{l.name}</p>
                  <p className="text-xs tabular-nums text-muted">{l.phone}</p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-2 capitalize">
                    <ChannelBadge channel={l.channel} size="sm" />
                    <span className="text-muted">{l.channel}</span>
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusPill status={l.status} />
                </td>
                <td className="px-5 py-3.5 text-muted">{l.lastActivity}</td>
                <td className="max-w-[280px] px-5 py-3.5 text-muted">
                  <p className="truncate">{l.note}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <ul className="divide-y divide-line md:hidden">
        {leads.map((l) => (
          <li key={l.id} className="space-y-2 p-4">
            <div className="flex items-center gap-3">
              <ChannelBadge channel={l.channel} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{l.name}</p>
                <p className="text-xs tabular-nums text-muted">{l.phone}</p>
              </div>
              <StatusPill status={l.status} />
            </div>
            <p className="text-sm text-muted">{l.note}</p>
            <p className="text-xs text-faint">{l.lastActivity}</p>
          </li>
        ))}
      </ul>

      {leads.length === 0 && (
        <div className="p-10 text-center">
          <p className="text-sm font-medium">No leads match</p>
          <p className="mt-1 text-sm text-muted">Try a different search or filter.</p>
        </div>
      )}
    </div>
  );
}
