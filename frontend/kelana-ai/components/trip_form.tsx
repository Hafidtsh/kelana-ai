"use client";

import { FormEvent, useState } from "react";
import { authHeaders } from "@/services/AuthService";

interface TripFormProps {
  onResult: (result: any) => void;
  onLoadingChange: (loading: boolean) => void;
}

export default function TripForm({
  onResult,
  onLoadingChange,
}: TripFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateLoading(value: boolean) {
    setLoading(value);
    onLoadingChange(value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const data = {
      destination: formData.get("destination"),
      budget: Number(formData.get("budget")),
      days: Number(formData.get("days")),
      travel_style: formData.get("travel_style"),
    };

    try {
      const response = await fetch("http://localhost:8000/api/v1/trips", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
          errorData?.detail ?? `Server error (${response.status})`;
        throw new Error(message);
      }

      const result = await response.json();

      onResult(result);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (err) {
      if (err instanceof TypeError) {
        // network error / backend not running
        setError("Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      updateLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl"
    >
      <div className="grid gap-5">
        {/* Destination */}
        <div>
          <label
            htmlFor="destination"
            className="mb-2 block text-sm font-medium text-white"
          >
            Destination
          </label>

          <input
            id="destination"
            name="destination"
            type="text"
            placeholder="e.g. Bali"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        {/* Budget + Days */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="budget"
              className="mb-2 block text-sm font-medium text-white"
            >
              Budget
            </label>

            <input
              id="budget"
              name="budget"
              type="number"
              placeholder="5000000"
              required
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          <div>
            <label
              htmlFor="days"
              className="mb-2 block text-sm font-medium text-white"
            >
              Days
            </label>

            <input
              id="days"
              name="days"
              type="number"
              min="1"
              placeholder="5"
              required
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>
        </div>

        {/* Travel Style */}
        <div>
          <label
            htmlFor="travel_style"
            className="mb-2 block text-sm font-medium text-white"
          >
            Travel Style
          </label>

          <select
            id="travel_style"
            name="travel_style"
            required
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
          >
            <option value="">Choose your style</option>
            <option value="adventure">Adventure</option>
            <option value="relaxation">Relaxation</option>
            <option value="culture">Culture</option>
            <option value="luxury">Luxury</option>
            <option value="budget">Budget</option>
          </select>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-cyan-500 px-6 py-3.5 font-semibold text-black transition hover:scale-[1.01] hover:bg-cyan-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Generating..." : "✨ Generate AI Trips"}
        </button>

        {/* Error message */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            ⚠️ {error}
          </div>
        )}
      </div>
    </form>
  );
}