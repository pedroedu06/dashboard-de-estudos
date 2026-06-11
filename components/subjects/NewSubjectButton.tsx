"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SubjectDialog } from "@/components/subjects/SubjectDialog";

export function NewSubjectButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>New subject</Button>
      <SubjectDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
