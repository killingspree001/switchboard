"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { Logo } from "@/components/app-shell";
import { ArrowRightIcon } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    const auth = getFirebaseAuth();
    if (!auth) {
      setError("Auth is not configured");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch {
      setError("Wrong email or password");
      setBusy(false);
    }
  }

  function guest() {
    try {
      sessionStorage.setItem("guest", "1");
    } catch {}
    router.push("/dashboard");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo href="/" />
        </div>
        <form
          onSubmit={signIn}
          className="mt-8 rounded-xl border border-line bg-surface p-6"
        >
          <h1 className="font-display text-xl font-semibold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">
            Workspace access for the business owner.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="mt-5 w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent placeholder:text-faint"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mt-3 w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent placeholder:text-faint"
          />
          {error && <p className="mt-2 text-xs text-hot">{error}</p>}
          <button
            type="submit"
            disabled={busy || !email || !password}
            className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-deep disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <button
          onClick={guest}
          className="group mt-4 flex w-full items-center justify-center gap-1.5 text-sm font-medium text-muted hover:text-accent"
        >
          Just looking? Browse as guest
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </main>
  );
}
