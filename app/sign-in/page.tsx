"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { registerStudent } from "./actions";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    getSession().then((session) => {
      if (!active) return;
      if (session?.user) router.replace(session.user.role === "SISWA" ? "/student" : "/dashboard");
      else setCheckingSession(false);
    });
    return () => { active = false; };
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await registerStudent(formData);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push("/login?registered=1");
    });
  }

  if (checkingSession) return <main className="grid min-h-screen place-items-center bg-slate-950 p-6"><p className="rounded-xl bg-white px-6 py-4 text-sm text-slate-500">Memeriksa sesi...</p></main>;

  return <main className="min-h-screen bg-slate-950 px-5 py-10 sm:px-8"><section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-10"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Absensi Kelas</p><h1 className="mt-3 text-3xl font-semibold text-slate-950">Buat akun siswa</h1><p className="mt-2 text-sm text-slate-500">Daftarkan akun untuk melihat riwayat kehadiran pribadi.</p><form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}><label className="text-sm font-medium text-slate-700 sm:col-span-2">Nama lengkap<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" name="name" required /></label><label className="text-sm font-medium text-slate-700">Kelas<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" name="className" required /></label><label className="text-sm font-medium text-slate-700">NIS<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" inputMode="numeric" name="nis" pattern="[0-9]+" required /></label><label className="text-sm font-medium text-slate-700">NISN<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" inputMode="numeric" name="nisn" pattern="[0-9]+" required /></label><label className="text-sm font-medium text-slate-700">Username<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" autoComplete="username" name="username" required /></label><label className="text-sm font-medium text-slate-700">Password<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" autoComplete="new-password" minLength={8} name="password" required type="password" /></label><label className="text-sm font-medium text-slate-700 sm:col-span-2">Konfirmasi password<input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" autoComplete="new-password" minLength={8} name="confirmation" required type="password" /></label>{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2" role="alert">{error}</p>}<button className="rounded-xl bg-cyan-700 px-4 py-3 font-semibold text-white hover:bg-cyan-800 disabled:opacity-60 sm:col-span-2" disabled={isPending} type="submit">{isPending ? "Mendaftarkan..." : "Daftar sebagai siswa"}</button></form><p className="mt-6 text-center text-sm text-slate-500">Sudah punya akun? <Link className="font-semibold text-cyan-700 hover:text-cyan-900" href="/login">Masuk di sini</Link></p></section></main>;
}