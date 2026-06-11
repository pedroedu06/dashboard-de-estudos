import Link from "next/link";
import { SubjectList } from "@/components/subjects/SubjectList";
import { NewSubjectButton } from "@/components/subjects/NewSubjectButton";

export default function SubjectsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/dashboard" className="hover:text-neutral-900">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-neutral-900">Subjects</span>
      </div>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">Subjects</h1>
        <NewSubjectButton />
      </header>
      <SubjectList />
    </main>
  );
}
