"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

export type NewSessionInput = {
  subjectId: string;
  type: "stopwatch" | "pomodoro";
  durationSeconds: number;
  startedAt: Date;
  endedAt: Date;
};

export type UseStudySessions = {
  addSession: (input: NewSessionInput) => Promise<void>;
};

export function useStudySessions(): UseStudySessions {
  const router = useRouter();

  const addSession = useCallback(
    async (input: NewSessionInput) => {
      try {
        const res = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subjectId: input.subjectId,
            type: input.type,
            durationSeconds: input.durationSeconds,
            startedAt: input.startedAt.toISOString(),
            endedAt: input.endedAt.toISOString(),
          }),
        });
        if (!res.ok) {
          console.error("Failed to save session", await res.text());
          return;
        }
        router.refresh();
      } catch (err) {
        console.error("addSession network error", err);
      }
    },
    [router]
  );

  return { addSession };
}
