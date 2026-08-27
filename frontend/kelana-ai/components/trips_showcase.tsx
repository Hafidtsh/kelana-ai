"use client";

import { useEffect, useState, useMemo } from "react";
import TripCard, { SAMPLE_TRIPS } from "@/components/trip_card";
import { getTrips, deleteTrip, Trip } from "@/services/TripService";

type SortKey = "latest" | "oldest" | "budget_desc";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "latest",      label: "Latest" },
  { key: "oldest",      label: "Oldest" },
  { key: "budget_desc", label: "Highest Budget" },
];

function sortTrips(trips: Trip[], key: SortKey): Trip[] {
  const copy = [...trips];
  switch (key) {
    case "latest":
      return copy.sort((a, b) => b.id - a.id);
    case "oldest":
      return copy.sort((a, b) => a.id - b.id);
    case "budget_desc":
      return copy.sort((a, b) => b.budget - a.budget);
  }
}

export default function TripsShowcase() {
  const [trips, setTrips]   = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(false);
  const [sort, setSort]     = useState<SortKey>("latest");
  const [query, setQuery]   = useState("");

  useEffect(() => {
    getTrips()
      .then(setTrips)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTrip(id);
    } catch {
      getTrips()
        .then(setTrips)
        .catch(() => setError(true));
    }
  }

  const sorted = useMemo(() => {
    const filtered = query.trim()
      ? trips.filter((t) =>
          t.destination.toLowerCase().includes(query.trim().toLowerCase())
        )
      : trips;
    return sortTrips(filtered, sort);
  }, [trips, sort, query]);

  // ── Loading skeleton ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <div className="mb-4 h-28 rounded-2xl bg-white/10" />
            <div className="h-5 w-2/3 rounded bg-white/10" />
            <div className="mt-3 h-3 w-full rounded bg-white/10" />
            <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
            <div className="mt-6 flex gap-4">
              <div className="h-3 w-16 rounded bg-white/10" />
              <div className="h-3 w-20 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Fallback ──────────────────────────────────────────────────
  if (error || trips.length === 0) {
    return (
      <>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_TRIPS.map((trip) => (
            <TripCard key={trip.destination} {...trip} />
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          {error
            ? "(Tidak dapat memuat riwayat trip — menampilkan contoh destinasi)"
            : "Belum ada trip yang dibuat. Generate trip pertamamu di atas!"}
        </p>
      </>
    );
  }

  // ── Real trips ────────────────────────────────────────────────
  return (
    <div>
      {/* Sort + Search bar */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[180px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari destinasi..."
            className="w-full rounded-full border border-white/10 bg-white/5 pl-9 pr-4 py-1.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-400">Urutkan:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSort(opt.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                sort === opt.key
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      {sorted.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <p className="text-lg">Tidak ada trip dengan destinasi &quot;{query}&quot;</p>
          <button
            onClick={() => setQuery("")}
            className="mt-4 text-sm text-cyan-400 hover:underline"
          >
            Reset pencarian
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id}
              destination={trip.destination}
              days={trip.days}
              budget={trip.budget}
              style={trip.travel_style}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
