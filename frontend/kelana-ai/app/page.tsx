"use client";

import { useState } from "react";
import Hero from "@/components/hero";
import TripForm from "@/components/trip_form";
import TripResults from "@/components/trip_results";
import TripCard, { SAMPLE_TRIPS } from "@/components/trip_card";
import Footer from "@/components/footer";

export default function Home() {
  const [tripResult, setTripResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Hero with background image */}
      <Hero />

      {/* Form + Results side by side */}
      <section id="results" className="px-6 py-20">
        <div className="mx-auto w-full max-w-6xl">

          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Mulai Rencanakan
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Buat Itinerary Kamu
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Isi detail perjalananmu dan biarkan AI merancang rencana yang sempurna.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2 lg:items-start">

            {/* Left — Form */}
            <div>
              <TripForm onResult={setTripResult} onLoadingChange={setLoading} />
            </div>

            {/* Right — Results */}
            <div>
              <TripResults result={tripResult} loading={loading} />
            </div>

          </div>

        </div>
      </section>

      {/* Destination Showcase */}
      <section id="destinasi" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Inspirasi Perjalanan
            </p>
            <h2 className="text-3xl font-bold sm:text-4xl">
              Destinasi Populer
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Temukan destinasi impianmu dan biarkan AI merancang itinerary yang sempurna untukmu.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_TRIPS.map((trip) => (
              <TripCard key={trip.destination} {...trip} />
            ))}
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}