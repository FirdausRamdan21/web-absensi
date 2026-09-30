"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const registered = searchParams.get("registered") === "1";

  useEffect(() => {
    let active = true;
    getSession().then((session) => {
      if (!active) return;
      if (session?.user) router.replace(session.user.role === "SISWA" ? "/student" : "/dashboard");
      else setIsCheckingSession(false);
    });
    return () => { active = false; };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const normalizedUsername = username.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,30}$/.test(normalizedUsername)) {
      setError("Username harus 3-30 karakter dan hanya boleh berisi huruf kecil, angka, titik, garis bawah, atau tanda hubung.");
      return;
    }
    if (password.length < 8 || password.length > 128) {
      setError("Password harus berisi 8-128 karakter.");
      return;
    }
    setIsLoading(true);
    const result = await signIn("credentials", { username: normalizedUsername, password, redirect: false });
    if (result?.error) {
      setError("Username atau password tidak sesuai.");
      setIsLoading(false);
      return;
    }
    const session = await getSession();
    router.replace(session?.user.role === "SISWA" ? "/student" : "/dashboard");
    router.refresh();
  }

  if (isCheckingSession) return <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center text-sm text-slate-500 shadow-2xl shadow-slate-950/30">Memeriksa sesi...</div>;

  return <Reveal className="w-full max-w-md"><section className="w-full rounded-3xl bg-white p-8 shadow-2xl shadow-slate-950/30 sm:p-10"><div className="mb-8"><p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Absensi Kelas</p><h1 className="text-3xl font-semibold tracking-tight text-slate-950">Masuk ke akun</h1><p className="mt-3 text-sm leading-6 text-slate-500">Gunakan akun terdaftar untuk mengelola atau melihat absensi.</p></div>{registered && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">Pendaftaran berhasil. Silakan masuk dengan akun baru.</p>}<form className="space-y-5" onSubmit={handleSubmit}><label className="block text-sm font-medium text-slate-700">Username<span className="mt-1 block text-xs font-normal text-slate-400">3-30 karakter: a-z, 0-9, titik, garis bawah, atau tanda hubung.</span><input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" maxLength={30} required /></label><label className="block text-sm font-medium text-slate-700">Password<div className="relative mt-2"><input className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" maxLength={128} required /><button aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={() => setShowPassword((value) => !value)} title={showPassword ? "Sembunyikan password" : "Tampilkan password"} type="button">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><span className="mt-1 block text-xs font-normal text-slate-400">Minimal 8 karakter.</span></label>{error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}<button className="w-full rounded-xl bg-cyan-700 px-4 py-3 font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-cyan-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading} type="submit">{isLoading ? "Memeriksa..." : "Masuk"}</button><p className="text-center text-sm text-slate-500">Belum punya akun? <Link className="font-semibold text-cyan-700 hover:text-cyan-900" href="/sign-in">Daftar sebagai siswa</Link></p></form></section></Reveal>;
}