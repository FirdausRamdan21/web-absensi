"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteStudent } from "@/app/dashboard/students/actions";

export function DeleteStudentButton({ id, name }: { id: string; name: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleDelete() {
    if (!window.confirm(`Hapus ${name}? Data absensi siswa ini juga akan terhapus.`)) return;
    setError("");
    const formData = new FormData();
    formData.set("id", id);
    startTransition(async () => {
      const result = await deleteStudent(formData);
      if (!result.ok) setError(result.message);
    });
  }

  return <><button aria-label={`Hapus ${name}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-700 disabled:opacity-50" disabled={isPending} onClick={handleDelete} title="Hapus siswa" type="button"><Trash2 size={17} /></button>{error && <span className="sr-only" role="alert">{error}</span>}</>;
}