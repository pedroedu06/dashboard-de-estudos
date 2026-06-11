"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SubjectSelect } from "@/components/subjects/SubjectSelect";
import { useSubjects } from "@/hooks/useSubjects";
import { useStudySessions } from "@/hooks/useStudySessions";
import { formatTime } from "@/lib/time";

type State = "idle" | "running" | "paused";

export function Stopwatch() {
  const { subjects } = useSubjects();
  const { addSession } = useStudySessions();
  const [subjectId, setSubjectId] = useState<string>("");
  const [seconds, setSeconds] = useState(0);
  const [state, setState] = useState<State>("idle");
  const startedAtRef = useRef<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!subjectId && subjects.length > 0) setSubjectId(subjects[0].id);
  }, [subjects, subjectId]);

  useEffect(() => {
    if (state === "running") {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state]);

  const handleStart = () => {
    if (!startedAtRef.current) startedAtRef.current = new Date();
    setState("running");
  };
  const handlePause = () => setState("paused");
  const handleResume = () => setState("running");

  const handleSave = async () => {
    if (seconds <= 0 || !subjectId) return;
    const startedAt = startedAtRef.current ?? new Date();
    await addSession({
      subjectId,
      type: "stopwatch",
      durationSeconds: seconds,
      startedAt,
      endedAt: new Date(),
    });
    setSeconds(0);
    setState("idle");
    startedAtRef.current = null;
  };

  const noSubjects = subjects.length === 0;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-neutral-900">Stopwatch</h2>
      <SubjectSelect
        subjects={subjects}
        value={subjectId}
        onChange={setSubjectId}
        disabled={state !== "idle"}
      />
      <div className="my-6 text-center">
        <div className="font-mono text-5xl tabular-nums text-neutral-900">
          {formatTime(seconds)}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {state === "idle" && (
          <Button onClick={handleStart} disabled={noSubjects}>Start</Button>
        )}
        {state === "running" && (
          <Button variant="outline" onClick={handlePause}>Pause</Button>
        )}
        {state === "paused" && <Button onClick={handleResume}>Resume</Button>}
        <Button variant="outline" onClick={handleSave} disabled={seconds <= 0 || noSubjects}>
          Save session
        </Button>
      </div>
    </div>
  );
}
