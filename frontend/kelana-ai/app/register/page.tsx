"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const password  = form.get("password") as string;
    const confirm   = form.get("confirm") as string;

    if (password !== confirm) {
      setError("Password dan konfirmasi tidak cocok");
      return;
    }

    setLoading(true);
    try {
      await register(
        form.get("name") as string,
        form.get("email") as string,
        password,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-24 text-white">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold">
            Kelana<span className="text-cyan-400">AI</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold">Buat Akun</h1>
          <p className="mt-2 text-slate-400">Mulai rencanakan perjalananmu bersama AI</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid gap-5">

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
                Nama Lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Budi Santoso"
                required
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="kamu@email.com"
                required
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                minLength={8}
                required
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            <div>
              <label htmlFor="confirm" className="mb-2 block text-sm font-medium text-white">
                Konfirmasi Password
              </label>
              <input
                id="confirm"
                name="confirm"
                type="password"
                placeholder="••••••••"
                minLength={8}
                required
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Mendaftar..." : "Daftar Sekarang"}
            </button>

          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Masuk di sini
          </Link>
        </p>

      </div>
    </main>
  );
}
