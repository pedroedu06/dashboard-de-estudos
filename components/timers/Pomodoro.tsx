"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SubjectSelect } from "@/components/subjects/SubjectSelect";
import { useSubjects } from "@/hooks/useSubjects";
import { useStudySessions } from "@/hooks/useStudySessions";
import { formatTime } from "@/lib/time";

const FOCUS = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const CYCLE = 4;

type Phase = "focus" | "short" | "long";

function phaseDuration(p: Phase): number {
  if (p === "focus") return FOCUS;
  if (p === "short") return SHORT_BREAK;
  return LONG_BREAK;
}

function beep(): void {
  try {
    const Ctx = window.AudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.warn("Beep failed", e);
  }
}

export function Pomodoro() {
  const { subjects } = useSubjects();
  const { addSession } = useStudySessions();
  const [subjectId, setSubjectId] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("focus");
  const [remaining, setRemaining] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const startedAtRef = useRef<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!subjectId && subjects.length > 0) setSubjectId(subjects[0].id);
  }, [subjects, subjectId]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => (r > 0 ? r - 1 : 0));
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  useEffect(() => {
    if (remaining > 0) return;
    if (!running && !startedAtRef.current) return;
    finishPhase(false);
  }, [remaining]); // eslint-disable-line react-hooks/exhaustive-deps

  const finishPhase = async (skipped: boolean) => {
    beep();
    if (phase === "focus" && subjectId) {
      const startedAt = startedAtRef.current ?? new Date(Date.now() - FOCUS * 1000);
      const elapsed = skipped ? FOCUS - remaining : FOCUS;
      if (elapsed > 0) {
        await addSession({
          subjectId,
          type: "pomodoro",
          durationSeconds: elapsed,
          startedAt,
          endedAt: new Date(),
        });
      }
      const nextCompleted = completed + 1;
      const nextPhase: Phase = nextCompleted >= CYCLE ? "long" : "short";
      setCompleted(nextCompleted >= CYCLE ? 0 : nextCompleted);
      setPhase(nextPhase);
      setRemaining(phaseDuration(nextPhase));
    } else {
      setPhase("focus");
      setRemaining(FOCUS);
    }
    setRunning(false);
    startedAtRef.current = null;
  };

  const handleStart = () => {
    if (phase === "focus" && !startedAtRef.current) startedAtRef.current = new Date();
    setRunning(true);
  };
  const handlePause = () => setRunning(false);
  const handleSkip = () => finishPhase(true);

  const total = phaseDuration(phase);
  const progress = 1 - remaining / total;
  const noSubjects = subjects.length === 0;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Pomodoro</h2>
        <span className="text-xs uppercase tracking-wide text-neutral-500">
          {phase === "focus" ? "Focus" : phase === "short" ? "Short break" : "Long break"}
        </span>
      </div>
      <SubjectSelect
        subjects={subjects}
        value={subjectId}
        onChange={setSubjectId}
        disabled={running}
      />
      <div className="my-4 flex flex-col items-center">
        <Ring progress={progress} label={formatTime(remaining)} />
        <div className="mt-3 text-lg tracking-widest" aria-label={`${completed} of ${CYCLE} pomodoros complete`}>
          {Array.from({ length: CYCLE }).map((_, i) => (
            <span key={i} className={i < completed ? "text-indigo-600" : "text-neutral-300"}>
              {i < completed ? "●" : "○"}{" "}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {running ? (
          <Button variant="outline" onClick={handlePause}>Pause</Button>
        ) : (
          <Button onClick={handleStart} disabled={noSubjects}>Start</Button>
        )}
        <Button variant="outline" onClick={handleSkip} disabled={noSubjects}>Skip</Button>
      </div>
    </div>
  );
}

function Ring({ progress, label }: { progress: number; label: string }) {
  const size = 160;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * progress;
  return (
    <svg width={size} height={size} role="img" aria-label={`Time remaining ${label}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#6366f1"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 500ms linear" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontFamily="ui-monospace, monospace" fontSize="22" fill="#111827">
        {label}
      </text>
    </svg>
  );
}
