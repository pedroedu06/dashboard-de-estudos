import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getWeekStart, startOfDay } from "@/lib/time";
import { StatCards } from "@/components/dashboard/StatCards";
import { SessionList } from "@/components/dashboard/SessionList";
import { TimelineChart } from "@/components/charts/TimelineChart";
import { Stopwatch } from "@/components/timers/Stopwatch";
import { Pomodoro } from "@/components/timers/Pomodoro";

const DAY_STREAK = 7;
const WEEKLY_GOAL_SECONDS = 20 * 3600;

export default async function DashboardPage() {
  const weekStart = getWeekStart(new Date());
  const today = startOfDay(new Date());

  const sessions = await prisma.session.findMany({
    where: { startedAt: { gte: weekStart } },
    include: { subject: true },
    orderBy: { startedAt: "asc" },
  });

  const totalSecondsThisWeek = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const sessionsToday = sessions.filter((s) => s.startedAt >= today).length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Study Dashboard
          </h1>
          <nav className="text-sm">
            <Link
              href="/dashboard/subjects"
              className="font-medium text-neutral-600 hover:text-neutral-900"
            >
              Subjects
            </Link>
          </nav>
        </div>
        <div
          className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700"
          title="Day streak"
        >
          <span aria-hidden>🔥</span>
          <span>{DAY_STREAK}-day streak</span>
        </div>
      </header>

      <StatCards
        totalSecondsThisWeek={totalSecondsThisWeek}
        weeklyGoalSeconds={WEEKLY_GOAL_SECONDS}
        sessionsToday={sessionsToday}
      />

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Stopwatch />
        <Pomodoro />
      </section>

      <section className="mt-6">
        <TimelineChart sessions={sessions} />
      </section>

      <section className="mt-6">
        <SessionList sessions={sessions} />
      </section>
    </main>
  );
}
