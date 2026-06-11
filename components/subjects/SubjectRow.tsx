"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { SubjectDialog } from "@/components/subjects/SubjectDialog";

type SubjectRowProps = {
  id: string;
  name: string;
  color: string;
};

export function SubjectRow({ id, name, color }: SubjectRowProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    const res = await fetch(`/api/subjects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      console.error("Failed to delete subject", await res.text());
      return;
    }
    router.refresh();
  };

  return (
    <li className="flex items-center gap-3 py-3">
      <span
        className="h-4 w-4 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <div className="flex-1 text-sm font-medium text-neutral-900">{name}</div>
      <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
        Edit
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(true)}>
        Delete
      </Button>

      <SubjectDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initial={{ id, name, color }}
      />
      <AlertDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`Delete ${name}?`}
        description="This permanently deletes the subject and all its recorded sessions."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </li>
  );
}
