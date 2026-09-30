"use client";

import { useState, useTransition } from "react";
import { X } from "lucide-react";
import { createStudent, updateStudent } from "@/app/dashboard/students/actions";

type StudentFormData = { id?: string; name?: string; className?: string; attendanceNumber?: number; nis?: string; nisn?: string; phone?: string | null; address?: string | null };

export function StudentForm({ student, onClose, onSaved }: { student?: StudentFormData; onClose: () => void; onSaved: () => void }) {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(student?.id);

  function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = isEditing ? await updateStudent(formData) : await createStudent(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      onSaved();
    });
  }

  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-6">
    <div aria-labelledby="student-form-title" aria-modal="true" className="max-h-[95vh] w-full overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-8" role="dialog">
      <div className="mb-6 flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-cyan-700">Data siswa</p><h2 className="mt-1 text-xl font-semibold text-slate-950" id="student-form-title">{isEditing ? "Edit siswa" : "Tambah siswa"}</h2></div><button aria-label="Tutup form" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} title="Tutup" type="button"><X size={20} /></button></div>
      <form action={handleSubmit} className="space-y-5">
        {isEditing && <input name="id" type="hidden" value={student?.id} />}
        <label className="block text-sm font-medium text-slate-700">Nama siswa<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" defaultValue={student?.name} name="name" required /></label>
        <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">Kelas<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" defaultValue={student?.className} name="className" required /></label><label className="block text-sm font-medium text-slate-700">Nomor absen<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" defaultValue={student?.attendanceNumber} min="1" name="attendanceNumber" required type="number" /></label></div>
        <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">NIS<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" defaultValue={student?.nis} inputMode="numeric" name="nis" pattern="[0-9]+" required /></label><label className="block text-sm font-medium text-slate-700">NISN<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" defaultValue={student?.nisn} inputMode="numeric" name="nisn" pattern="[0-9]+" required /></label></div>
        <label className="block text-sm font-medium text-slate-700">Nomor telepon <span className="font-normal text-slate-400">(opsional)</span><input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" defaultValue={student?.phone ?? ""} name="phone" /></label>
        <label className="block text-sm font-medium text-slate-700">Alamat <span className="font-normal text-slate-400">(opsional)</span><textarea className="mt-2 min-h-20 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" defaultValue={student?.address ?? ""} name="address" /></label>
        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end"><button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={onClose} type="button">Batal</button><button className="rounded-xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={isPending} type="submit">{isPending ? "Menyimpan..." : isEditing ? "Simpan perubahan" : "Tambah siswa"}</button></div>
      </form>
    </div>
  </div>;
}