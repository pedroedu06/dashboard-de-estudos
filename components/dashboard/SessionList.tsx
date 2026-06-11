import { Badge } from "@/components/ui/badge";
import { formatClock, formatDuration } from "@/lib/time";

export type SessionListItem = {
  id: string;
  type: string;
  durationSeconds: number;
  startedAt: Date;
  subject: { name: string; color: string };
};

type SessionListProps = {
  sessions: SessionListItem[];
};

export function SessionList({ sessions }: SessionListProps) {
  const recent = [...sessions]
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
    .slice(0, 5);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-neutral-900">Recent sessions</h2>
      {recent.length === 0 ? (
        <p className="text-sm text-neutral-500">No sessions yet. Start a timer to track one.</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {recent.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.subject.color }}
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-neutral-900">
                  {s.subject.name}
                </div>
                <div className="text-xs text-neutral-500">
                  Started at {formatClock(s.startedAt)}
                </div>
              </div>
              <Badge variant={s.type === "pomodoro" ? "default" : "secondary"}>
                {s.type}
              </Badge>
              <div className="w-16 text-right text-sm tabular-nums text-neutral-700">
                {formatDuration(s.durationSeconds)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
