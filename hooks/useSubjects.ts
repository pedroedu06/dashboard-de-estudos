"use client";

import { useEffect, useState } from "react";

export type ApiSubject = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
};

export function useSubjects(): { subjects: ApiSubject[]; loading: boolean } {
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/subjects");
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = (await res.json()) as ApiSubject[];
        if (!cancelled) setSubjects(data);
      } catch (err) {
        console.error("useSubjects fetch failed", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { subjects, loading };
}
