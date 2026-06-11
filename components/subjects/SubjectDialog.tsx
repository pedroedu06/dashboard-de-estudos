"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export const PRESET_COLORS = [
  "#185FA5",
  "#0F6E56",
  "#854F0B",
  "#993556",
  "#534AB7",
  "#993C1D",
  "#A32D2D",
  "#3B6D11",
  "#638AB7",
  "#5F5E5A",
  "#1D9E75",
  "#D85A30",
] as const;

export type SubjectInput = { id?: string; name: string; color: string };

type SubjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: SubjectInput | null;
};

export function SubjectDialog({ open, onOpenChange, initial }: SubjectDialogProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(PRESET_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setColor(initial?.color ?? PRESET_COLORS[0]);
      setError(null);
    }
  }, [open, initial]);

  const isEdit = Boolean(initial?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const url = isEdit ? `/api/subjects/${initial?.id}` : "/api/subjects";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, color }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Request failed");
        return;
      }
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      console.error("SubjectDialog submit failed", err);
      setError("Network error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit subject" : "New subject"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700" htmlFor="subject-name">
            Name
          </label>
          <input
            id="subject-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            autoFocus
            className="h-9 w-full rounded-md border border-neutral-300 px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            placeholder="Mathematics"
          />
          <p className="mt-1 text-xs text-neutral-500">{name.length}/40</p>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-neutral-700">Color</span>
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((c) => {
              const selected = c === color;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  aria-pressed={selected}
                  style={{
                    backgroundColor: c,
                    boxShadow: selected ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined,
                  }}
                  className="h-7 w-7 rounded-full transition-transform hover:scale-110"
                />
              );
            })}
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : isEdit ? "Save changes" : "Create subject"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
