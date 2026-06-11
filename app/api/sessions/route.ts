import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWeekStart } from "@/lib/time";

const VALID_TYPES = new Set(["stopwatch", "pomodoro"]);

export async function GET() {
  try {
    const weekStart = getWeekStart(new Date());
    const sessions = await prisma.session.findMany({
      where: { startedAt: { gte: weekStart } },
      include: { subject: true },
      orderBy: { startedAt: "asc" },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    console.error("GET /api/sessions failed", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      subjectId?: unknown;
      type?: unknown;
      durationSeconds?: unknown;
      startedAt?: unknown;
      endedAt?: unknown;
    };

    const subjectId = typeof body.subjectId === "string" ? body.subjectId : "";
    const type = typeof body.type === "string" ? body.type : "";
    const durationSeconds =
      typeof body.durationSeconds === "number" ? body.durationSeconds : NaN;
    const startedAt = typeof body.startedAt === "string" ? new Date(body.startedAt) : null;
    const endedAt = typeof body.endedAt === "string" ? new Date(body.endedAt) : null;

    if (!subjectId || !type || !startedAt || !endedAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!VALID_TYPES.has(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
    if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
      return NextResponse.json({ error: "durationSeconds must be > 0" }, { status: 400 });
    }
    if (Number.isNaN(startedAt.getTime()) || Number.isNaN(endedAt.getTime())) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }

    const session = await prisma.session.create({
      data: {
        subjectId,
        type,
        durationSeconds: Math.round(durationSeconds),
        startedAt,
        endedAt,
      },
    });
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("POST /api/sessions failed", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
