"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setIsLoading(true);
    const result = await signIn("credentials", {
      username: username.trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Username atau password tidak sesuai.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-slate-950/30 sm:p-10">
        <div className="mb-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">Absensi Kelas</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Masuk ke ruang kerja</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">Kelola kehadiran siswa dengan data yang rapi dan mudah ditinjau.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Username
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          </label>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</p>}

          <button className="w-full rounded-xl bg-cyan-700 px-4 py-3 font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading} type="submit">
            {isLoading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </section>
    </main>
  );
}