import type { Channel, LeadStatus } from "@/lib/demo-data";
import { PhoneIcon, ChatIcon, CameraIcon } from "./icons";

// channel icon in its brand color, used all over the inbox and tables
export function ChannelBadge({ channel, size = "md" }: { channel: Channel; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const icon = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";
  const styles: Record<Channel, string> = {
    voice: "bg-voice-tint text-voice",
    whatsapp: "bg-whatsapp-tint text-whatsapp",
    instagram: "bg-instagram-tint text-instagram",
  };
  return (
    <span className={`flex ${box} shrink-0 items-center justify-center rounded-lg ${styles[channel]}`}>
      {channel === "voice" && <PhoneIcon className={icon} />}
      {channel === "whatsapp" && <ChatIcon className={icon} />}
      {channel === "instagram" && <CameraIcon className={icon} />}
    </span>
  );
}

const statusMeta: Record<LeadStatus, { label: string; dot: string; pill: string }> = {
  hot: { label: "Hot lead", dot: "bg-hot", pill: "bg-hot-tint text-hot" },
  followup: { label: "Follow up", dot: "bg-warm", pill: "bg-warm-tint text-warm" },
  not_interested: { label: "Not interested", dot: "bg-cold", pill: "bg-cold-tint text-cold" },
  closed: { label: "Closed", dot: "bg-closed", pill: "bg-closed-tint text-closed" },
};

export function StatusPill({ status }: { status: LeadStatus }) {
  const s = statusMeta[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// small amber tag marking anything powered by sample data
export function DemoTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-demo-border bg-demo-bg px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-demo-text">
      Demo
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  demo,
  children,
}: {
  title: string;
  subtitle?: string;
  demo?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-[28px]">
            {title}
          </h1>
          {demo && <DemoTag />}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
