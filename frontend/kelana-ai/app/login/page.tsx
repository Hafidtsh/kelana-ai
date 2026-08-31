"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    try {
      await login(
        form.get("email") as string,
        form.get("password") as string,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
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
          <h1 className="mt-6 text-3xl font-bold">Selamat Datang</h1>
          <p className="mt-2 text-slate-400">Masuk untuk melanjutkan perjalananmu</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="grid gap-5">

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
              {loading ? "Masuk..." : "Masuk"}
            </button>

          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Belum punya akun?{" "}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Daftar sekarang
          </Link>
        </p>

      </div>
    </main>
  );
}
