import { formatDuration } from "@/lib/time";

type StatCardsProps = {
  totalSecondsThisWeek: number;
  weeklyGoalSeconds: number;
  sessionsToday: number;
};

export function StatCards({
  totalSecondsThisWeek,
  weeklyGoalSeconds,
  sessionsToday,
}: StatCardsProps) {
  const pct = weeklyGoalSeconds > 0
    ? Math.min(100, Math.round((totalSecondsThisWeek / weeklyGoalSeconds) * 100))
    : 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card label="Time this week" value={formatDuration(totalSecondsThisWeek)} />
      <Card
        label="Weekly goal progress"
        value={`${pct}%`}
        footer={
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full bg-indigo-600 transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        }
      />
      <Card label="Sessions today" value={sessionsToday.toString()} />
    </div>
  );
}

function Card({
  label,
  value,
  footer,
}: {
  label: string;
  value: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-neutral-500">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
        {value}
      </div>
      {footer}
    </div>
  );
}
