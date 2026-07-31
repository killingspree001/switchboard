import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/app-shell";
import ThemeToggle from "@/components/theme-toggle";
import {
  PhoneIcon,
  ChatIcon,
  CameraIcon,
  SparkIcon,
  ArrowRightIcon,
  UploadIcon,
  BookIcon,
} from "@/components/icons";

// the switchboard feed, written like the ops log the product actually produces
const feed = [
  { time: "14:02:11", channel: "voice", text: "outbound call connected · Amara O.", tag: "hot lead", tagClass: "text-hot" },
  { time: "14:02:38", channel: "whatsapp", text: "auto reply sent in 1.8s · Daniel R.", tag: "qualifying", tagClass: "text-warm" },
  { time: "14:03:02", channel: "instagram", text: "story reply routed to inbox · Priya S.", tag: "demo booked", tagClass: "text-closed" },
  { time: "14:03:19", channel: "voice", text: "inbound call answered after hours · Kwame M.", tag: "recorded", tagClass: "text-faint" },
  { time: "14:03:47", channel: "voice", text: "call summary written · pushed to CRM", tag: "done", tagClass: "text-closed" },
];

function FeedIcon({ channel }: { channel: string }) {
  const cls = "h-3.5 w-3.5";
  if (channel === "voice") return <PhoneIcon className={`${cls} text-voice`} />;
  if (channel === "whatsapp") return <ChatIcon className={`${cls} text-whatsapp`} />;
  return <CameraIcon className={`${cls} text-instagram`} />;
}

export default function LandingPage() {
  return (
    <div className="flex-1 bg-paper">
      {/* minimal nav */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo href="/" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-text hover:text-accent"
            >
              Open the demo
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* hero: terse line, one action, then the real product */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-16 text-center sm:px-6 lg:px-8 lg:pt-24">
        <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Every call answered.
          <br />
          Every DM handled.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
          AI that works your phone line, WhatsApp and Instagram, then files
          every lead into one inbox.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/try"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            Try it in real time
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent"
          >
            Open the demo
          </Link>
        </div>

        <div className="relative mt-12 lg:mt-16">
          <div className="overflow-hidden rounded-xl border border-line-strong shadow-[0_24px_80px_-32px_rgba(0,0,0,0.5)]">
            <Image
              src="/screens/inbox.png"
              alt="The Switchboard inbox with a live AI call summary and conversations from every channel"
              width={1440}
              height={900}
              priority
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* live switchboard feed */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
          the switchboard, one afternoon
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-surface">
          <ul className="min-w-[560px] divide-y divide-line font-mono text-[13px]">
            {feed.map((f) => (
              <li key={f.time} className="flex items-center gap-4 px-4 py-3">
                <span className="tabular-nums text-faint">{f.time}</span>
                <FeedIcon channel={f.channel} />
                <span className="flex-1 text-text">{f.text}</span>
                <span className={`uppercase tracking-wider ${f.tagClass}`}>{f.tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* bento features */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {/* big tile: voice */}
          <div className="rounded-xl border border-line bg-surface p-6 md:col-span-2">
            <PhoneIcon className="h-5 w-5 text-voice" />
            <h2 className="mt-4 font-display text-xl font-semibold">
              A caller that never gets tired
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              Upload a CSV and the AI dials every lead with a natural voice.
              Inbound rings get picked up on the first tone, any hour. Every
              call comes back recorded, transcribed and summarized.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-line bg-paper p-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-voice text-white">
                <PhoneIcon className="h-3.5 w-3.5" />
              </span>
              <div className="flex flex-1 items-end gap-[3px]" aria-hidden>
                {[6, 10, 15, 8, 13, 16, 9, 6, 12, 15, 8, 11, 14, 7, 10, 13, 6, 9, 12, 8, 14, 10].map(
                  (h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full ${i < 10 ? "bg-voice" : "bg-line-strong"}`}
                      style={{ height: `${h * 1.5}px` }}
                    />
                  ),
                )}
              </div>
              <span className="font-mono text-xs tabular-nums text-muted">3:42</span>
            </div>
          </div>

          {/* tall tile: summary */}
          <div className="rounded-xl border border-line bg-surface p-6">
            <SparkIcon className="h-5 w-5 text-accent" />
            <h2 className="mt-4 font-display text-xl font-semibold">
              Notes write themselves
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              After each conversation: what they wanted, how warm they are,
              what to do next.
            </p>
            <p className="mt-4 rounded-lg border border-line bg-paper p-3 text-xs leading-relaxed text-muted">
              &ldquo;Wants pricing callback before Friday. 12 person agency,
              comparing two tools. Tagged{" "}
              <span className="font-semibold text-hot">hot</span>.&rdquo;
            </p>
          </div>

          {/* small tiles */}
          <div className="rounded-xl border border-line bg-surface p-6">
            <ChatIcon className="h-5 w-5 text-whatsapp" />
            <h3 className="mt-4 font-display text-lg font-semibold">Replies in seconds</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              WhatsApp and Instagram messages get instant answers that stay on
              script, day and night.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6">
            <BookIcon className="h-5 w-5 text-instagram" />
            <h3 className="mt-4 font-display text-lg font-semibold">Knows your business</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Paste your pricing and FAQs once. Every agent answer comes from
              your playbook, not guesses.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6">
            <UploadIcon className="h-5 w-5 text-warm" />
            <h3 className="mt-4 font-display text-lg font-semibold">CSV in, calls out</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              A spreadsheet of names and numbers becomes a running campaign in
              one click.
            </p>
          </div>
        </div>
      </section>

      {/* numbers */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            { v: "24/7", k: "line coverage" },
            { v: "< 2s", k: "chat response" },
            { v: "100%", k: "calls summarized" },
            { v: "3", k: "channels, one inbox" },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-display text-3xl font-bold tabular-nums tracking-tight sm:text-4xl">
                {s.v}
              </p>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-faint">
                {s.k}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* closing */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          The demo is already running.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Chat with the real agent, or poke around the dashboard. No signup.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/try"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
          >
            Try it in real time
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-line-strong px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent"
          >
            Open the demo
          </Link>
        </div>
      </section>

      {/* footer with the oversized wordmark */}
      <footer className="overflow-hidden border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-3 pb-6 text-sm text-muted sm:flex-row sm:items-center">
            <p>Demo build. Sample data only until channels are connected.</p>
            <Link href="/dashboard" className="font-medium text-text hover:text-accent">
              Dashboard
            </Link>
          </div>
          <p
            aria-hidden
            className="select-none whitespace-nowrap text-center font-display text-[18vw] font-bold leading-[0.75] tracking-tight text-line lg:text-[13rem]"
          >
            Switchboard
          </p>
        </div>
      </footer>
    </div>
  );
}
