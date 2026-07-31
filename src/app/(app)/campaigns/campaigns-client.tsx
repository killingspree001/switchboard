"use client";

import { useRef, useState } from "react";
import { demoCampaigns } from "@/lib/demo-data";
import { DemoTag } from "@/components/ui";
import { UploadIcon, PhoneOutIcon } from "@/components/icons";

interface ParsedRow {
  name: string;
  phone: string;
  context: string;
}

// reads a simple Name,Phone,Context csv in the browser
function parseCsv(text: string): ParsedRow[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line, i) => !(i === 0 && /name/i.test(line) && /phone/i.test(line)))
    .map((line) => {
      const [name = "", phone = "", ...rest] = line.split(",");
      return { name: name.trim(), phone: phone.trim(), context: rest.join(",").trim() };
    })
    .filter((r) => r.name && r.phone);
}

export default function CampaignsClient() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    const text = await file.text();
    setRows(parseCsv(text));
    setFileName(file.name);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* launcher */}
      <section className="rounded-xl border border-line bg-surface lg:col-span-3">
        <header className="border-b border-line px-5 py-4">
          <h2 className="font-display text-base font-semibold">Launch outbound campaign</h2>
          <p className="mt-0.5 text-sm text-muted">
            Upload a CSV with Name, Phone, Context and the AI calls everyone on it.
          </p>
        </header>

        <div className="p-5">
          {/* CSV parsing here is real and works, the launch button goes live with a Vapi key */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileInput.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              dragging
                ? "border-copper bg-copper-tint/50"
                : "border-line-strong bg-paper hover:border-copper/60"
            }`}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-copper-tint text-copper-deep">
              <UploadIcon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-medium">
              {fileName ? fileName : "Drop your CSV here or click to browse"}
            </p>
            <p className="mt-1 text-xs text-muted">Name, Phone Number, Context or Product</p>
            <input
              ref={fileInput}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>

          {rows.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium">
                {rows.length} leads ready{" "}
                <span className="font-normal text-muted">, first few below</span>
              </p>
              <div className="mt-2 overflow-x-auto rounded-lg border border-line">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line bg-paper text-left text-[11px] font-semibold uppercase tracking-wider text-faint">
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Phone</th>
                      <th className="px-4 py-2.5">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {rows.slice(0, 5).map((r, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2.5 font-medium">{r.name}</td>
                        <td className="px-4 py-2.5 tabular-nums text-muted">{r.phone}</td>
                        <td className="max-w-[200px] truncate px-4 py-2.5 text-muted">
                          {r.context || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <button
            disabled={rows.length === 0}
            title="Goes live once the Vapi key is connected"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-copper px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-copper-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-faint sm:w-auto"
          >
            <PhoneOutIcon className="h-4 w-4" />
            Start calling {rows.length > 0 ? `${rows.length} leads` : ""}
          </button>
          <p className="mt-2 text-xs text-faint">
            Calling starts for real once the Vapi key is added. Until then this screen
            just previews your list.
          </p>
        </div>
      </section>

      {/* past campaigns */}
      <section className="rounded-xl border border-line bg-surface lg:col-span-2">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-base font-semibold">History</h2>
          <DemoTag />
        </header>
        <ul className="divide-y divide-line">
          {demoCampaigns.map((cp) => {
            const pct = cp.total ? Math.round((cp.called / cp.total) * 100) : 0;
            return (
              <li key={cp.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">{cp.name}</p>
                  <span className="shrink-0 text-xs text-faint">{cp.createdAt}</span>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-paper">
                  <div className="h-full rounded-full bg-copper" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className="tabular-nums text-muted">
                    {cp.called}/{cp.total} called · {cp.connected} connected
                  </span>
                  <span
                    className={`font-semibold uppercase tracking-wider ${
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
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
