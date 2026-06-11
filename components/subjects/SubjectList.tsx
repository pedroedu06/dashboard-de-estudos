import { prisma } from "@/lib/prisma";
import { SubjectRow } from "@/components/subjects/SubjectRow";

export async function SubjectList() {
  const subjects = await prisma.subject.findMany({ orderBy: { createdAt: "asc" } });

  if (subjects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center">
        <p className="text-sm text-neutral-500">
          No subjects yet. Create your first one to get started.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white px-5 shadow-sm">
      {subjects.map((s) => (
        <SubjectRow key={s.id} id={s.id} name={s.name} color={s.color} />
      ))}
    </ul>
  );
}
