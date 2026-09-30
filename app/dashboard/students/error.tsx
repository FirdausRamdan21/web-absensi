"use client";

export default function StudentsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="mx-auto max-w-2xl px-5 py-16 text-center sm:px-8"><h2 className="text-xl font-semibold text-slate-950">Daftar siswa belum dapat dimuat</h2><p className="mt-2 text-sm text-slate-500">Terjadi kendala saat mengambil data. Silakan coba lagi.</p><button className="mt-6 rounded-xl bg-cyan-700 px-4 py-3 text-sm font-semibold text-white hover:bg-cyan-800" onClick={() => reset()} type="button">Coba lagi</button></div>;
}