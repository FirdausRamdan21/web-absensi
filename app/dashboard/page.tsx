export default async function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
      <div className="mb-8"><p className="text-sm font-semibold text-cyan-700">Ringkasan hari ini</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Pantau kehadiran kelas dengan cepat.</h2><p className="mt-2 text-slate-500">Data akan muncul setelah daftar siswa dan absensi mulai dicatat.</p></div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {["Total siswa", "Hadir", "Sakit", "Izin", "Alfa"].map((label) => <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-4 text-3xl font-semibold text-slate-950">0</p><p className="mt-2 text-xs text-slate-400">Belum ada data</p></article>)}
      </section>
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold text-slate-950">Aktivitas terbaru</h2><p className="mt-1 text-sm text-slate-500">Perubahan data absensi akan tampil di sini.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">Kosong</span></div><div className="mt-8 rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center"><p className="font-medium text-slate-700">Belum ada aktivitas</p><p className="mt-1 text-sm text-slate-400">Mulai dengan menambahkan data siswa.</p></div></section>
    </div>
  );
}