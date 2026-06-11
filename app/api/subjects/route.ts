import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("GET /api/subjects failed", error);
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: unknown; color?: unknown };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const color = typeof body.color === "string" ? body.color.trim() : "";
    if (!name || !color) {
      return NextResponse.json({ error: "Name and color are required" }, { status: 400 });
    }
    if (name.length > 40) {
      return NextResponse.json({ error: "Name must be 40 characters or fewer" }, { status: 400 });
    }
    const subject = await prisma.subject.create({ data: { name, color } });
    return NextResponse.json(subject, { status: 201 });
  } catch (error) {
    console.error("POST /api/subjects failed", error);
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}
