import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Server side Firestore through the service account, so API routes and
// webhooks keep writing after the public rules are locked down.

let app: App | null = null;

export function adminDb(): Firestore | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;
  if (!b64) return null;
  if (!app) {
    try {
      const creds = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
      app = getApps()[0] ?? initializeApp({ credential: cert(creds) });
    } catch {
      return null;
    }
  }
  return getFirestore(app);
}
