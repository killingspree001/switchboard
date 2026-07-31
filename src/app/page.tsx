import Link from "next/link";
import { Logo } from "@/components/app-shell";
import ThemeToggle from "@/components/theme-toggle";
import {
  PhoneIcon,
  ChatIcon,
  CameraIcon,
  InboxIcon,
  SparkIcon,
  ArrowRightIcon,
  MegaphoneIcon,
  BookIcon,
} from "@/components/icons";

const features = [
  {
    icon: PhoneIcon,
    title: "AI voice calls, both ways",
    text: "Upload a lead list and the AI dials everyone with a natural voice, or answers your line day and night. Every call gets recorded, transcribed and summarized.",
  },
  {
    icon: ChatIcon,
    title: "WhatsApp and Instagram on autopilot",
    text: "Incoming messages get instant, on brand replies. The AI answers FAQs, qualifies buyers and flags the serious ones for you.",
  },
  {
    icon: InboxIcon,
    title: "One inbox for everything",
    text: "Calls, chats and DMs land in a single stream with lead tags, so your team works one list instead of five apps.",
  },
  {
    icon: MegaphoneIcon,
    title: "Campaigns from a CSV",
    text: "Drop in a spreadsheet of names and numbers, hit start, and watch connect rates roll in live.",
  },
  {
    icon: BookIcon,
    title: "Teach it your business",
    text: "Paste your pricing, FAQs and playbook once. Every call and reply stays on script after that.",
  },
  {
    icon: SparkIcon,
    title: "Summaries, not homework",
    text: "After every conversation the AI writes the note your rep never would: what they wanted, how warm they are, what to do next.",
  },
];

const steps = [
  {
    n: "1",
    title: "Connect your channels",
    text: "Plug in a phone number, WhatsApp and Instagram in minutes.",
  },
  {
    n: "2",
    title: "Give the AI its script",
    text: "Add your business context and the tone you want. That becomes every agent's brain.",
  },
  {
    n: "3",
    title: "Work only the warm ones",
    text: "The AI talks to everyone, tags the leads worth your time, and hands them over.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex-1 bg-surface">
      {/* nav */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo href="/" />
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted md:flex">
            <a href="#features" className="hover:text-text">Features</a>
            <a href="#how" className="hover:text-text">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-deep"
            >
              Open the demo
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        {/* soft lavender wash behind the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 400px at 85% 10%, var(--accent-tint) 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent-soft bg-accent-tint px-3 py-1 text-xs font-semibold text-accent-deep">
              <SparkIcon className="h-3.5 w-3.5" />
              AI sales and support workspace
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[56px]">
              Your phone line and DMs,{" "}
              <span className="text-accent">answered by AI.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Switchboard calls your leads, answers your WhatsApp and Instagram,
              and drops every conversation into one inbox with the hot ones
              already flagged.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-deep"
              >
                Try the live demo
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-accent hover:text-accent-deep"
              >
                See how it works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-medium text-muted">
              <span className="flex items-center gap-1.5 rounded-full bg-voice-tint px-3 py-1.5 text-voice">
                <PhoneIcon className="h-3.5 w-3.5" /> Voice
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-whatsapp-tint px-3 py-1.5 text-whatsapp">
                <ChatIcon className="h-3.5 w-3.5" /> WhatsApp
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-instagram-tint px-3 py-1.5 text-instagram">
                <CameraIcon className="h-3.5 w-3.5" /> Instagram
              </span>
              <span>one inbox, zero missed leads</span>
            </div>
          </div>

          {/* floating product cards */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="space-y-4">
              <div className="translate-x-0 rounded-2xl border border-line bg-surface p-4 shadow-[0_12px_40px_-18px_rgba(27,28,32,0.25)] lg:-translate-x-6">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-deep">
                  <SparkIcon className="h-3.5 w-3.5" /> AI call summary
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  Amara wants a pricing callback before Friday. Strong interest,
                  12 person agency. <span className="font-semibold text-hot">Tagged hot.</span>
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-voice text-white">
                    <PhoneIcon className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex flex-1 items-end gap-[3px]" aria-hidden>
                    {[6, 10, 15, 8, 13, 16, 9, 6, 12, 15, 8, 11, 14, 7, 10, 13, 6, 9].map(
                      (h, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full ${i < 8 ? "bg-voice" : "bg-line-strong"}`}
                          style={{ height: `${h * 1.6}px` }}
                        />
                      ),
                    )}
                  </div>
                  <span className="text-xs tabular-nums text-muted">3:42</span>
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-4 shadow-[0_12px_40px_-18px_rgba(27,28,32,0.25)] lg:translate-x-8">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-whatsapp-tint text-whatsapp">
                    <ChatIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Daniel Reyes</p>
                    <p className="text-xs text-muted">WhatsApp · replied in 2s</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <p className="w-fit max-w-[90%] rounded-2xl rounded-bl-md border border-line bg-paper px-3 py-2 text-sm">
                    Do you have case studies for agencies my size?
                  </p>
                  <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-accent px-3 py-2 text-sm text-white">
                    Yes! Sending two from 10 to 15 person teams. Want a quick
                    call this week?
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-4 shadow-[0_12px_40px_-18px_rgba(27,28,32,0.25)] lg:-translate-x-2">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-instagram-tint text-instagram">
                    <CameraIcon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Priya Sharma</p>
                    <p className="text-xs text-muted">Instagram · booked a demo</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-closed-tint px-2.5 py-1 text-xs font-medium text-closed">
                  <span className="h-1.5 w-1.5 rounded-full bg-closed" /> Closed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="border-t border-line bg-paper">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              A full sales team that never sleeps
            </h2>
            <p className="mt-3 text-lg text-muted">
              Everything a small team needs to answer every lead, on every
              channel, without hiring.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-[0_12px_32px_-20px_rgba(27,28,32,0.35)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-tint text-accent-deep">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Live in an afternoon
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <span className="font-display text-5xl font-bold text-accent-soft">
                  {s.n}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* cta band */}
      <section className="bg-accent">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white">
              See it working right now
            </h2>
            <p className="mt-2 text-white/80">
              The demo dashboard is live with sample conversations. No signup needed.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#1440b8] transition-opacity hover:opacity-90"
          >
            Open the demo
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <Logo href="/" />
          <p>Demo build. Sample data only until channels are connected.</p>
        </div>
      </footer>
    </div>
  );
}
