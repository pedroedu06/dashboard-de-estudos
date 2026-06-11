"use client";

import { useEffect, useRef, useState } from "react";
import { WEEKDAY_LABELS, weekdayIndex, getWeekStart, formatClock, formatDuration } from "@/lib/time";

const ROW_HEIGHT = 28;
const TOTAL_HEIGHT = ROW_HEIGHT * 24;
const HOUR_COL_W = 44;

export type TimelineSession = {
  id: string;
  startedAt: Date;
  endedAt: Date;
  durationSeconds: number;
  subject: { name: string; color: string };
};

type TimelineChartProps = {
  sessions: TimelineSession[];
};

export function TimelineChart({ sessions }: TimelineChartProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const targetRow = Math.max(0, new Date().getHours() - 3);
    scrollRef.current.scrollTop = targetRow * ROW_HEIGHT;
  }, []);

  const weekStart = getWeekStart(new Date());
  const todayIdx = weekdayIndex(new Date());

  const byDay: TimelineSession[][] = Array.from({ length: 7 }, () => []);
  for (const s of sessions) {
    if (s.startedAt < weekStart) continue;
    byDay[weekdayIndex(s.startedAt)].push(s);
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-200 p-4">
        <h2 className="text-sm font-semibold text-neutral-900">This week timeline</h2>
      </div>

      {/* Day headers */}
      <div
        className="grid border-b border-neutral-200 bg-neutral-50 text-xs font-medium"
        style={{ gridTemplateColumns: `${HOUR_COL_W}px repeat(7, 1fr)` }}
      >
        <div />
        {WEEKDAY_LABELS.map((label, i) => {
          const isToday = i === todayIdx;
          return (
            <div
              key={label}
              className={`px-2 py-2 text-center ${isToday ? "bg-indigo-50 text-indigo-700" : "text-neutral-600"}`}
            >
              {label}
            </div>
          );
        })}
      </div>

      {/* Scrollable grid */}
      <div
        ref={scrollRef}
        className="overflow-y-auto"
        style={{ maxHeight: 400 }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `${HOUR_COL_W}px repeat(7, 1fr)`,
            height: TOTAL_HEIGHT,
          }}
        >
          {/* Hour labels column */}
          <div className="relative border-r border-neutral-200">
            {Array.from({ length: 24 }).map((_, h) => (
              <div
                key={h}
                className="border-b border-neutral-100 px-2 text-[10px] text-neutral-500"
                style={{ height: ROW_HEIGHT, lineHeight: `${ROW_HEIGHT}px` }}
              >
                {h.toString().padStart(2, "0")}h
              </div>
            ))}
          </div>

          {/* Day columns */}
          {WEEKDAY_LABELS.map((label, dayIdx) => (
            <div key={label} className="relative border-r border-neutral-100">
              {Array.from({ length: 24 }).map((_, h) => (
                <div
                  key={h}
                  className="border-b border-neutral-100"
                  style={{ height: ROW_HEIGHT }}
                />
              ))}
              {byDay[dayIdx].map((s) => {
                const startHrs = s.startedAt.getHours() + s.startedAt.getMinutes() / 60;
                const top = startHrs * ROW_HEIGHT;
                const height = Math.max(14, (s.durationSeconds / 3600) * ROW_HEIGHT);
                return (
                  <div
                    key={s.id}
                    className="absolute left-1 right-1 cursor-pointer rounded-md px-2 py-1 text-[10px] font-medium text-white shadow-sm"
                    style={{
                      top,
                      height,
                      backgroundColor: s.subject.color,
                    }}
                    onMouseEnter={() => setHoverId(s.id)}
                    onMouseLeave={() => setHoverId((id) => (id === s.id ? null : id))}
                  >
                    <div className="truncate">{s.subject.name}</div>
                    {hoverId === s.id ? (
                      <div className="absolute left-full top-0 z-10 ml-2 w-44 rounded-md border border-neutral-200 bg-white p-2 text-xs text-neutral-900 shadow-lg">
                        <div className="font-semibold">{s.subject.name}</div>
                        <div className="mt-0.5 text-neutral-600">
                          {formatClock(s.startedAt)} → {formatClock(s.endedAt)}
                        </div>
                        <div className="text-neutral-600">
                          {formatDuration(s.durationSeconds)}
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
