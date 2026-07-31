"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDb } from "./firebase";

// Subscribes to a Firestore collection and falls back to the bundled demo
// rows when Firebase isn't configured or the collection is still empty.
// live=true means the rows on screen are coming from the database.
export function useLiveCollection<T extends { id: string }>(
  name: string,
  fallback: T[],
): { data: T[]; live: boolean } {
  const [state, setState] = useState<{ data: T[]; live: boolean }>({
    data: fallback,
    live: false,
  });

  useEffect(() => {
    const db = getDb();
    if (!db) return;
    const q = query(collection(db, name), orderBy("sort"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          const rows = snap.docs.map((d) => ({ ...(d.data() as T), id: d.id }));
          setState({ data: rows, live: true });
        }
      },
      () => {
        // permissions or network issue: stay on fallback data
      },
    );
    return unsub;
  }, [name]);

  return state;
}
