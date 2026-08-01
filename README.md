# Switchboard

One inbox for every conversation your business has. Switchboard runs AI voice
calls, answers WhatsApp automatically, and files everything into a single
dashboard with leads tagged by how warm they are.

**Live demo:** https://switchboard-lemon.vercel.app

## What it does

- **AI voice calls, both ways** — upload a CSV of leads and the AI calls each
  one with a natural voice. Inbound calls get answered 24/7. Every call comes
  back with a recording, transcript and an AI written summary.
- **WhatsApp on autopilot** — incoming messages get instant AI replies based on
  the business knowledge base. Full threads land in the inbox.
- **Unified inbox** — voice, WhatsApp and Instagram in one stream, with a lead
  table (hot lead, follow up, not interested, closed) fed automatically.
- **Knowledge base** — paste your pricing and FAQs once, every channel answers
  from the same playbook. Saved instructions update the live agent immediately.
- **Try it live** — a public page where anyone can chat with the actual agent
  or get a real phone call from it.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Firebase Firestore for data, realtime listeners on every screen
- Vapi for voice calls and telephony
- Gemini for chat replies and summaries
- Meta WhatsApp Cloud API for messaging
- Deployed on Vercel

## Running it

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev
```

The app runs fine with no keys at all — every screen falls back to labeled
demo data. Add keys as you get them:

| Key | Unlocks |
| --- | --- |
| `GEMINI_API_KEY` | live AI chat replies |
| `NEXT_PUBLIC_FIREBASE_*` | real database behind every screen |
| `VAPI_*` | outbound campaigns, inbound line, call me button |
| `WHATSAPP_*` | WhatsApp auto replies |

Seed the database once Firebase is connected:

```bash
curl -X POST http://localhost:3000/api/seed
```

## How the pieces talk

```
CSV upload ──▶ /api/campaigns/launch ──▶ Vapi ──▶ phone call
                                                      │
WhatsApp message ──▶ /api/whatsapp/webhook            ▼
                        │                    /api/vapi/webhook
                        ▼                             │
                shared AI brain (lib/ai.ts) ──▶ Firestore ──▶ inbox UI
```

One reply pipeline serves every channel, so the agent behaves the same
everywhere and the knowledge base only needs updating once.
