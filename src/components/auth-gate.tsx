"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth, firebaseConfigured } from "@/lib/firebase";

// Wraps the workspace: admins sign in, visitors can browse as guests,
// and without Firebase configured it just lets everyone through.
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(
    firebaseConfigured ? null : true,
  );

  useEffect(() => {
    if (!firebaseConfigured) return;
    let isGuest = false;
    try {
      isGuest = sessionStorage.getItem("guest") === "1";
    } catch {}
    if (isGuest) {
      setAllowed(true);
      return;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
      setAllowed(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setAllowed(true);
      else router.replace("/login");
    });
    return unsub;
  }, [router]);

  if (allowed !== true) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-line-strong border-t-transparent" />
      </div>
    );
  }
  return <>{children}</>;
}
