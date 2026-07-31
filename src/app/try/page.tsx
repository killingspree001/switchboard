import Link from "next/link";
import { Logo } from "@/components/app-shell";
import ThemeToggle from "@/components/theme-toggle";
import { ArrowRightIcon } from "@/components/icons";
import TryClient from "./try-client";

export const metadata = {
  title: "Try Switchboard live",
};

export default function TryPage() {
  const voiceEnabled = Boolean(
    process.env.VAPI_API_KEY &&
      process.env.VAPI_ASSISTANT_ID &&
      process.env.VAPI_PHONE_NUMBER_ID,
  );
  const voiceNumber = process.env.VAPI_PHONE_NUMBER ?? null;
  return (
    <div className="flex-1 bg-paper">
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

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-[28px]">
            Try it in real time
          </h1>
          <p className="mt-1 text-sm text-muted">
            This is the actual agent, not a video. Talk to it.
          </p>
        </div>
        <TryClient voiceEnabled={voiceEnabled} voiceNumber={voiceNumber} />
      </main>
    </div>
  );
}
