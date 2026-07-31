// Server side Vapi helpers. Everything here needs VAPI_API_KEY set.

export const vapiConfigured = () =>
  Boolean(
    process.env.VAPI_API_KEY &&
      process.env.VAPI_ASSISTANT_ID &&
      process.env.VAPI_PHONE_NUMBER_ID,
  );

interface OutboundCallInput {
  phone: string;
  name?: string;
  context?: string;
}

// kicks off one outbound AI call and returns Vapi's call record
export async function startOutboundCall({ phone, name, context }: OutboundCallInput) {
  const res = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assistantId: process.env.VAPI_ASSISTANT_ID,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: { number: phone, name: name || undefined },
      assistantOverrides: context
        ? {
            variableValues: { context },
            firstMessage: `Hi${name ? " " + name.split(" ")[0] : ""}, this is the assistant calling from Switchboard. How are you today?`,
          }
        : undefined,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`vapi call failed (${res.status}): ${body.slice(0, 300)}`);
  }
  return res.json();
}

// loose sanity check, Vapi wants E.164 like +16035551234
export function normalizePhone(raw: string): string | null {
  const cleaned = raw.replace(/[\s()-]/g, "");
  if (/^\+\d{8,15}$/.test(cleaned)) return cleaned;
  return null;
}
