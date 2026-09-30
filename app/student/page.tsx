import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function StudentPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "SISWA") redirect("/dashboard");

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { student: { select: { name: true, className: true, attendances: { orderBy: { date: "desc" }, take: 20, select: { date: true, status: true } } } } } });
  if (!user?.student) return <main className="min-h-screen p-8"><p>Profil siswa belum terhubung.</p></main>;

  return <main className="min-h-screen bg-slate-100 px-5 py-10 sm:px-8"><div className="mx-auto max-w-4xl"><p className="text-sm font-semibold text-cyan-700">Portal siswa</p><h1 className="mt-2 text-3xl font-semibold text-slate-950">Halo, {user.student.name}</h1><p className="mt-2 text-slate-500">Kelas {user.student.className} · Riwayat kehadiran pribadi</p><section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="divide-y divide-slate-100">{user.student.attendances.length === 0 ? <p className="p-8 text-center text-slate-500">Belum ada riwayat absensi.</p> : user.student.attendances.map((attendance) => <div className="flex items-center justify-between gap-4 px-5 py-4" key={attendance.date.toISOString()}><time className="text-sm text-slate-600" dateTime={attendance.date.toISOString()}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeZone: "UTC" }).format(attendance.date)}</time><span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800">{attendance.status}</span></div>)}</div></section></div></main>;
}