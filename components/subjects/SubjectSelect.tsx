"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ApiSubject } from "@/hooks/useSubjects";

type SubjectSelectProps = {
  subjects: ApiSubject[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
};

export function SubjectSelect({ subjects, value, onChange, disabled }: SubjectSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const selected = subjects.find((s) => s.id === value);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  if (subjects.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-neutral-300 bg-neutral-50 p-3 text-sm text-neutral-600">
        No subjects yet.{" "}
        <Link href="/dashboard/subjects" className="font-medium text-indigo-600 hover:underline">
          Create one
        </Link>
        .
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-full items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? (
          <>
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: selected.color }}
              aria-hidden
            />
            <span className="flex-1 truncate text-left">{selected.name}</span>
          </>
        ) : (
          <span className="flex-1 text-left text-neutral-500">Select a subject</span>
        )}
        <span aria-hidden className="text-neutral-400">▾</span>
      </button>
      {open ? (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {subjects.map((s) => {
            const isSelected = s.id === value;
            return (
              <li
                key={s.id}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(s.id);
                  setOpen(false);
                }}
                className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-neutral-50 ${isSelected ? "bg-indigo-50 text-indigo-700" : "text-neutral-900"}`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                  aria-hidden
                />
                <span className="truncate">{s.name}</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
