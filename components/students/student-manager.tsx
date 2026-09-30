"use client";

import { useState } from "react";
import { Edit3, Plus, UserRound } from "lucide-react";
import { DeleteStudentButton } from "./delete-student-button";
import { StudentForm } from "./student-form";

export type StudentRow = { id: string; name: string; nisn: string; photo: string | null; createdAt: string };

export function StudentManager({ students }: { students: StudentRow[] }) {
  const [formStudent, setFormStudent] = useState<StudentRow | null | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openCreate = () => { setFormStudent(null); setIsFormOpen(true); };
  const openEdit = (student: StudentRow) => { setFormStudent(student); setIsFormOpen(true); };
  const closeForm = () => setIsFormOpen(false);

  return <>
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold text-cyan-700">Data kelas</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Daftar Siswa</h2><p className="mt-2 text-sm text-slate-500">Kelola data siswa dalam kelas.</p></div><button className="flex items-center justify-center gap-2 rounded-xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-800" onClick={openCreate} type="button"><Plus size={18} />Tambah Siswa</button></div>
    <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total siswa</p><p className="mt-2 text-3xl font-semibold text-slate-950">{students.length}</p></div>
    {students.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center"><UserRound className="mx-auto text-slate-300" size={38} /><h3 className="mt-4 font-semibold text-slate-800">Belum ada data siswa</h3><p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">Tambahkan siswa pertama untuk mulai mengelola daftar kelas.</p><button className="mt-5 rounded-xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-800" onClick={openCreate} type="button">Tambah Siswa</button></div> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-6 py-4">No.</th><th className="px-6 py-4">Siswa</th><th className="px-6 py-4">NISN</th><th className="px-6 py-4">Ditambahkan</th><th className="px-6 py-4 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-slate-100">{students.map((student, index) => <tr key={student.id}><td className="px-6 py-4 text-slate-400">{index + 1}</td><td className="px-6 py-4"><div className="flex items-center gap-3"><Avatar student={student} /><span className="font-semibold text-slate-800">{student.name}</span></div></td><td className="px-6 py-4 text-slate-500">{student.nisn}</td><td className="px-6 py-4 text-slate-500">{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(student.createdAt))}</td><td className="px-6 py-4"><div className="flex justify-end gap-1"><button aria-label={`Edit ${student.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-cyan-50 hover:text-cyan-700" onClick={() => openEdit(student)} title="Edit siswa" type="button"><Edit3 size={17} /></button><DeleteStudentButton id={student.id} name={student.name} /></div></td></tr>)}</tbody></table></div><div className="divide-y divide-slate-100 md:hidden">{students.map((student, index) => <div className="flex items-center gap-3 p-4" key={student.id}><Avatar student={student} /><div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-800">{index + 1}. {student.name}</p><p className="mt-1 text-sm text-slate-500">NISN {student.nisn}</p></div><button aria-label={`Edit ${student.name}`} className="rounded-lg p-2 text-slate-400 hover:bg-cyan-50 hover:text-cyan-700" onClick={() => openEdit(student)} title="Edit siswa" type="button"><Edit3 size={17} /></button><DeleteStudentButton id={student.id} name={student.name} /></div>)}</div></div>}
    {isFormOpen && <StudentForm student={formStudent ?? undefined} onClose={closeForm} onSaved={() => { closeForm(); window.location.reload(); }} />}
  </>;
}

function Avatar({ student }: { student: StudentRow }) {
  return student.photo ? <div className="size-10 shrink-0 rounded-full bg-cover bg-center" role="img" aria-label={`Foto ${student.name}`} style={{ backgroundImage: `url(${student.photo})` }} /> : <div className="grid size-10 shrink-0 place-items-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-800">{student.name.charAt(0).toUpperCase()}</div>;
}