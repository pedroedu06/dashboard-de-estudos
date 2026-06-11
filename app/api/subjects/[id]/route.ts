import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as { name?: unknown; color?: unknown };
    const data: { name?: string; color?: string } = {};
    if (typeof body.name === "string") {
      const name = body.name.trim();
      if (!name) {
        return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
      }
      if (name.length > 40) {
        return NextResponse.json({ error: "Name must be 40 characters or fewer" }, { status: 400 });
      }
      data.name = name;
    }
    if (typeof body.color === "string") {
      const color = body.color.trim();
      if (!color) {
        return NextResponse.json({ error: "Color cannot be empty" }, { status: 400 });
      }
      data.color = color;
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }
    const subject = await prisma.subject.update({ where: { id }, data });
    return NextResponse.json(subject);
  } catch (error) {
    console.error("PATCH /api/subjects/[id] failed", error);
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    await prisma.subject.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/subjects/[id] failed", error);
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 });
  }
}
