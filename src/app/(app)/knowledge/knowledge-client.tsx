"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { DemoTag } from "@/components/ui";
import { BookIcon, SparkIcon, UploadIcon } from "@/components/icons";

const starterPrompt = `You are the AI sales assistant for Switchboard Realty Tools.

Tone: warm, professional, never pushy. Keep answers short.

What we sell: an outreach automation service for real estate agencies.
Pricing: flat monthly rate per seat plus per minute call pricing. Never
quote exact numbers on a first call, offer a callback from the team instead.

If a lead sounds ready to buy, offer to book a demo. If they object twice,
thank them politely and end the conversation.`;

// sample uploaded docs, replaced by real files once storage is connected
const demoDocs = [
  { name: "pricing-sheet-2026.pdf", size: "84 KB", added: "Jul 24" },
  { name: "objection-handling.pdf", size: "112 KB", added: "Jul 22" },
  { name: "product-faq.txt", size: "9 KB", added: "Jul 20" },
];

export default function KnowledgeClient() {
  const [prompt, setPrompt] = useState(starterPrompt);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [synced, setSynced] = useState(false);

  // pull the saved instructions from Firestore when it's connected
  useEffect(() => {
    const db = getDb();
    if (!db) return;
    getDoc(doc(db, "settings", "agent"))
      .then((snap) => {
        const stored = snap.data()?.prompt;
        if (typeof stored === "string" && stored.trim()) setPrompt(stored);
        setSynced(true);
      })
      .catch(() => {});
  }, []);

  async function save() {
    const db = getDb();
    if (!db) {
      setSaved(true);
      return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, "settings", "agent"), { prompt }, { merge: true });
      setSaved(true);
    } catch {
      // keep the button re-clickable if the write fails
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* system prompt editor */}
      <section className="rounded-xl border border-line bg-surface lg:col-span-3">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold">
              <SparkIcon className="h-4.5 w-4.5 text-accent-deep" />
              Agent instructions
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              This text steers every call and chat reply the AI makes.
            </p>
          </div>
        </header>
        <div className="p-5">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setSaved(false);
            }}
            rows={14}
            spellCheck={false}
            className="w-full resize-y rounded-lg border border-line bg-paper p-4 font-mono text-[13px] leading-relaxed outline-none transition-colors focus:border-accent"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-faint">
              {synced
                ? "Synced with Firestore — the live chat agent reads this."
                : "Saved locally for now, syncs once Firebase is connected."}
            </p>
            <button
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
            >
              {saving ? "Saving..." : saved ? "Saved ✓" : "Save instructions"}
            </button>
          </div>
        </div>
      </section>

      {/* context documents */}
      <section className="rounded-xl border border-line bg-surface lg:col-span-2">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold">
              <BookIcon className="h-4.5 w-4.5 text-accent-deep" />
              Business documents
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              PDFs and notes the AI can pull answers from.
            </p>
          </div>
          <DemoTag />
        </header>

        <div className="p-5">
          <button className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-line-strong bg-paper px-4 py-7 text-center transition-colors hover:border-accent/60">
            <UploadIcon className="h-5 w-5 text-faint" />
            <span className="mt-2 text-sm font-medium">Upload PDF or text</span>
            <span className="mt-0.5 text-xs text-muted">
              File storage goes live with Supabase
            </span>
          </button>

          <ul className="mt-4 divide-y divide-line">
            {demoDocs.map((d) => (
              <li key={d.name} className="flex items-center gap-3 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-paper text-muted">
                  <BookIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-muted">
                    {d.size} · added {d.added}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
