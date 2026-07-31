// Demo dataset for the dashboard preview.
// Everything in this file is fake and only used while no database is connected.
// Once Supabase + Vapi + WhatsApp keys are set, real records replace these.

export type Channel = "voice" | "whatsapp" | "instagram";

export type LeadStatus = "hot" | "followup" | "not_interested" | "closed";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  channel: Channel;
  status: LeadStatus;
  lastActivity: string;
  note: string;
}

export interface Message {
  id: string;
  from: "ai" | "lead";
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  leadName: string;
  channel: Channel;
  preview: string;
  time: string;
  unread: boolean;
  // voice calls carry extra call info
  call?: {
    direction: "inbound" | "outbound";
    duration: string;
    status: "completed" | "no_answer" | "voicemail";
    summary: string;
  };
  messages: Message[];
}

export interface Campaign {
  id: string;
  name: string;
  total: number;
  called: number;
  connected: number;
  status: "running" | "done" | "draft";
  createdAt: string;
}

export const demoLeads: Lead[] = [
  {
    id: "l1",
    name: "Amara Okafor",
    phone: "+234 803 221 4409",
    channel: "voice",
    status: "hot",
    lastActivity: "12 min ago",
    note: "Asked about pricing twice, wants a callback before Friday",
  },
  {
    id: "l2",
    name: "Daniel Reyes",
    phone: "+1 (415) 830-2214",
    channel: "whatsapp",
    status: "followup",
    lastActivity: "1 hr ago",
    note: "Comparing us with a competitor, send case study",
  },
  {
    id: "l3",
    name: "Priya Sharma",
    phone: "+91 98220 41133",
    channel: "instagram",
    status: "hot",
    lastActivity: "2 hrs ago",
    note: "Came from the reel promo, ready to book a demo",
  },
  {
    id: "l4",
    name: "Tunde Balogun",
    phone: "+234 701 555 8821",
    channel: "voice",
    status: "not_interested",
    lastActivity: "Yesterday",
    note: "Budget frozen this quarter",
  },
  {
    id: "l5",
    name: "Sofia Marchetti",
    phone: "+39 348 220 1187",
    channel: "whatsapp",
    status: "closed",
    lastActivity: "2 days ago",
    note: "Signed the starter plan, onboarding scheduled",
  },
  {
    id: "l6",
    name: "Kwame Mensah",
    phone: "+233 24 887 2210",
    channel: "voice",
    status: "followup",
    lastActivity: "3 days ago",
    note: "Wants the team to hear the demo recording first",
  },
];

export const demoConversations: Conversation[] = [
  {
    id: "c1",
    leadName: "Amara Okafor",
    channel: "voice",
    preview: "AI call summary: strong interest, wants pricing callback",
    time: "12m",
    unread: true,
    call: {
      direction: "outbound",
      duration: "3:42",
      status: "completed",
      summary:
        "Amara runs a 12 person real estate agency. She is actively looking for an outbound calling tool, asked about per minute pricing and whether the AI can hand off to a human. Wants a callback before Friday.",
    },
    messages: [
      {
        id: "m1",
        from: "ai",
        text: "Hi, am I speaking with Amara? This is the assistant from Switchboard Realty Tools, calling about the property outreach service you enquired about.",
        time: "14:02",
      },
      {
        id: "m2",
        from: "lead",
        text: "Yes, this is Amara. I did fill the form, what are your rates like?",
        time: "14:02",
      },
      {
        id: "m3",
        from: "ai",
        text: "Great question. Plans start at a flat monthly rate with per minute call pricing on top. Would you like me to have someone walk you through the exact numbers for a 12 person team?",
        time: "14:03",
      },
      {
        id: "m4",
        from: "lead",
        text: "Yes please, but it has to be before Friday, we decide this week.",
        time: "14:04",
      },
    ],
  },
  {
    id: "c2",
    leadName: "Daniel Reyes",
    channel: "whatsapp",
    preview: "Do you have any case studies with agencies my size?",
    time: "1h",
    unread: true,
    messages: [
      {
        id: "m1",
        from: "lead",
        text: "Hey, I saw your ad. How is this different from the other AI callers out there?",
        time: "12:40",
      },
      {
        id: "m2",
        from: "ai",
        text: "Hi Daniel! The short version: calls, WhatsApp and Instagram all land in one inbox, so no lead falls through. Most tools only do one channel. What does your team mostly use today?",
        time: "12:40",
      },
      {
        id: "m3",
        from: "lead",
        text: "Mostly phone calls honestly. Do you have any case studies with agencies my size?",
        time: "12:58",
      },
    ],
  },
  {
    id: "c3",
    leadName: "Priya Sharma",
    channel: "instagram",
    preview: "Replied to your story: is the demo free?",
    time: "2h",
    unread: false,
    messages: [
      {
        id: "m1",
        from: "lead",
        text: "Replied to your story: is the demo free?",
        time: "11:15",
      },
      {
        id: "m2",
        from: "ai",
        text: "Hi Priya, yes! The demo is free and takes about 15 minutes. Want me to send you the booking link?",
        time: "11:15",
      },
      {
        id: "m3",
        from: "lead",
        text: "Yes send it 🙌",
        time: "11:20",
      },
    ],
  },
  {
    id: "c4",
    leadName: "Tunde Balogun",
    channel: "voice",
    preview: "AI call summary: not interested this quarter",
    time: "1d",
    unread: false,
    call: {
      direction: "outbound",
      duration: "1:12",
      status: "completed",
      summary:
        "Tunde said the company budget is frozen until next quarter. Polite but firm. Suggested checking back in three months. Marked not interested for now.",
    },
    messages: [
      {
        id: "m1",
        from: "ai",
        text: "Good afternoon, is this Tunde? I'm calling from Switchboard about the outreach automation you looked at last month.",
        time: "Yesterday",
      },
      {
        id: "m2",
        from: "lead",
        text: "Ah yes, but honestly our budget is frozen this quarter. Try me again in a few months.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "c5",
    leadName: "Sofia Marchetti",
    channel: "whatsapp",
    preview: "Perfect, see you at onboarding on Monday!",
    time: "2d",
    unread: false,
    messages: [
      {
        id: "m1",
        from: "ai",
        text: "Hi Sofia, your starter plan is live! Your onboarding call is booked for Monday 10:00. Anything you need before then?",
        time: "Tue",
      },
      {
        id: "m2",
        from: "lead",
        text: "Perfect, see you at onboarding on Monday!",
        time: "Tue",
      },
    ],
  },
  {
    id: "c6",
    leadName: "Kwame Mensah",
    channel: "voice",
    preview: "AI call summary: wants team to hear the recording",
    time: "3d",
    unread: false,
    call: {
      direction: "inbound",
      duration: "5:08",
      status: "completed",
      summary:
        "Kwame called in after hours. The AI answered, walked him through features and captured his details. He wants to share the call recording with his team before deciding.",
    },
    messages: [
      {
        id: "m1",
        from: "lead",
        text: "Hello, I'm calling about the AI receptionist service. Are you still open?",
        time: "Mon",
      },
      {
        id: "m2",
        from: "ai",
        text: "We're always open, that's rather the point! I'd be happy to walk you through how the service works. May I ask what kind of business you run?",
        time: "Mon",
      },
    ],
  },
];

export const demoCampaigns: Campaign[] = [
  {
    id: "cp1",
    name: "July property owners list",
    total: 250,
    called: 187,
    connected: 121,
    status: "running",
    createdAt: "Jul 28",
  },
  {
    id: "cp2",
    name: "Webinar no shows follow up",
    total: 80,
    called: 80,
    connected: 52,
    status: "done",
    createdAt: "Jul 21",
  },
  {
    id: "cp3",
    name: "Old CRM export retry",
    total: 140,
    called: 0,
    connected: 0,
    status: "draft",
    createdAt: "Jul 30",
  },
];

export const demoStats = {
  callsToday: 43,
  connectedRate: 64,
  messagesHandled: 128,
  hotLeads: 7,
};
