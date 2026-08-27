"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getTrip, deleteTrip, Trip } from "@/services/TripService";

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-white/10 ${className ?? ""}`} />
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="mb-8 h-6 w-24" />
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-3 h-10 w-64" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-black/20 p-5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-3 h-6 w-24" />
          </div>
        ))}
      </div>
      <div className="mt-10 space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getTrip(Number(id))
      .then((data) => {
        if (!data || data.detail) {
          setNotFound(true);
        } else {
          setTrip(data);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!trip) return;
    setDeleting(true);
    try {
      await deleteTrip(trip.id);
      router.push("/#destinasi");
    } catch {
      setDeleting(false);
      alert("Gagal menghapus trip. Coba lagi.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">

        {/* Back button */}
        <Link
          href="/#destinasi"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
        >
          ← Kembali
        </Link>

        {loading && <LoadingSkeleton />}

        {!loading && notFound && (
          <div className="mt-20 text-center">
            <p className="text-2xl font-bold">Trip tidak ditemukan</p>
            <p className="mt-2 text-slate-400">
              Trip dengan ID ini mungkin sudah dihapus.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
            >
              Kembali ke Beranda
            </Link>
          </div>
        )}

        {!loading && trip && (
          <>
            {/* Header */}
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                Detail Trip
              </p>
              <h1 className="mt-2 text-4xl font-bold">{trip.destination}</h1>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-2xl bg-black/20 p-5">
                <p className="text-sm text-slate-400">Durasi</p>
                <p className="mt-2 text-xl font-semibold">{trip.days} Hari</p>
              </div>
              <div className="rounded-2xl bg-black/20 p-5">
                <p className="text-sm text-slate-400">Budget</p>
                <p className="mt-2 text-xl font-semibold">
                  Rp {trip.budget.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="rounded-2xl bg-black/20 p-5">
                <p className="text-sm text-slate-400">Gaya Perjalanan</p>
                <p className="mt-2 text-xl font-semibold capitalize">
                  {trip.travel_style}
                </p>
              </div>
              <div className="rounded-2xl bg-black/20 p-5">
                <p className="text-sm text-slate-400">Kategori</p>
                <p className="mt-2 text-xl font-semibold capitalize">
                  {trip.category}
                </p>
              </div>
            </div>

            {/* Daily budget */}
            <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-5 py-4">
              <p className="text-sm text-slate-400">Budget Harian</p>
              <p className="mt-1 text-lg font-semibold text-cyan-300">
                Rp {trip.daily_budget.toLocaleString("id-ID")} / hari
              </p>
            </div>

            {/* AI Recommendation */}
            {trip.ai_recommendation && (
              <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h2 className="text-xl font-semibold">✨ AI Travel Plan</h2>
                <div className="mt-4 leading-7 text-slate-300">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => <h1 className="mt-6 mb-3 text-2xl font-bold text-white">{children}</h1>,
                      h2: ({ children }) => <h2 className="mt-6 mb-3 text-xl font-bold text-white">{children}</h2>,
                      h3: ({ children }) => <h3 className="mt-5 mb-2 text-lg font-semibold text-cyan-300">{children}</h3>,
                      h4: ({ children }) => <h4 className="mt-4 mb-2 font-semibold text-slate-200">{children}</h4>,
                      p: ({ children }) => <p className="mb-3 leading-7">{children}</p>,
                      ul: ({ children }) => <ul className="mb-3 ml-4 list-disc space-y-1 text-slate-300">{children}</ul>,
                      ol: ({ children }) => <ol className="mb-3 ml-4 list-decimal space-y-1 text-slate-300">{children}</ol>,
                      li: ({ children }) => <li className="leading-6">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                      hr: () => <hr className="my-5 border-white/10" />,
                    }}
                  >
                    {trip.ai_recommendation}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Delete action */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Menghapus..." : "🗑 Hapus Trip Ini"}
              </button>
            </div>
          </>
        )}

      </div>
    </main>
  );
}
