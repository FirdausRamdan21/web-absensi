"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck, Save, UserRound } from "lucide-react";
import { saveAttendance } from "@/app/dashboard/attendance/actions";
import { AttendanceStatusSelect, labels } from "./attendance-status-select";
import type { AttendanceStatus } from "@prisma/client";

export type AttendanceStudent = { id: string; name: string; nisn: string; photo: string | null; status: AttendanceStatus };

export function AttendanceManager({ date, students }: { date: string; students: AttendanceStudent[] }) {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(() => Object.fromEntries(students.map((student) => [student.id, student.status])));
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const setAllPresent = () => setStatuses(Object.fromEntries(students.map((student) => [student.id, "HADIR" as AttendanceStatus])));

  function handleSubmit() {
    setMessage(null);
    const formData = new FormData();
    formData.set("date", date);
    formData.set("statuses", JSON.stringify(statuses));
    startTransition(async () => {
      const result = await saveAttendance(formData);
      setMessage(result.ok ? { type: "success", text: "Absensi berhasil disimpan." } : { type: "error", text: result.message });
    });
  }

  return <>
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-cyan-700">Pencatatan harian</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Absensi Siswa</h2><p className="mt-2 text-sm text-slate-500">Atur status kehadiran untuk tanggal yang dipilih.</p></div><div className="flex flex-col gap-3 sm:flex-row"><label className="text-sm font-medium text-slate-600">Tanggal<input className="mt-2 block rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" type="date" value={date} onChange={(event) => router.push(`/dashboard/attendance?date=${event.target.value}`)} /></label><button className="flex items-center justify-center gap-2 self-end rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800 hover:bg-cyan-100" onClick={setAllPresent} type="button"><CheckCheck size={17} />Hadir Semua</button></div></div>
    {message && <p className={`mb-5 rounded-xl px-4 py-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`} role="status">{message.text}</p>}
    {students.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><UserRound className="mx-auto text-slate-300" size={38} /><h3 className="mt-4 font-semibold text-slate-800">Belum ada data siswa</h3><p className="mt-2 text-sm text-slate-500">Tambahkan siswa terlebih dahulu sebelum mencatat absensi.</p></div> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="divide-y divide-slate-100">{students.map((student, index) => <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-6" key={student.id}><div className="flex min-w-0 flex-1 items-center gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-800">{student.name.charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="truncate font-semibold text-slate-800">{index + 1}. {student.name}</p><p className="text-sm text-slate-500">NISN {student.nisn} · {labels[statuses[student.id]]}</p></div></div><AttendanceStatusSelect name={student.name} value={statuses[student.id]} onChange={(value) => setStatuses((current) => ({ ...current, [student.id]: value }))} /></div>)}</div><div className="flex justify-end border-t border-slate-100 p-4 sm:p-5"><button className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-700 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto" disabled={isPending} onClick={handleSubmit} type="button"><Save size={17} />{isPending ? "Menyimpan..." : "Simpan Absensi"}</button></div></div>}
  </>;
}