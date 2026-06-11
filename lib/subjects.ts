import type { Subject } from "@/types/session";

export const SUBJECTS: readonly Subject[] = [
  { id: "math", name: "Mathematics", color: "#6366f1" },
  { id: "physics", name: "Physics", color: "#10b981" },
  { id: "english", name: "English", color: "#f59e0b" },
  { id: "history", name: "History", color: "#ef4444" },
  { id: "chemistry", name: "Chemistry", color: "#8b5cf6" },
] as const;

export function getSubject(id: string): Subject | undefined {
  return SUBJECTS.find((s) => s.id === id);
}
