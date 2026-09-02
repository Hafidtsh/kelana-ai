"use client";

import { useState } from "react";
import Hero from "@/components/hero";
import TripForm from "@/components/trip_form";
import TripResults from "@/components/trip_results";
import TripsShowcase from "@/components/trips_showcase";
import Footer from "@/components/footer";
import TripAsk from "@/components/trip_ask";

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
              Trip Kamu
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Semua itinerary yang pernah kamu generate akan muncul di sini.
            </p>
          </div>

          <TripsShowcase />

        </div>
      </section>
      <section id="results" className="px-6 py-20">
           <div className="mx-auto max-w-6xl">

             <div className="mb-12 text-center">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                  Tempat Bertanya 👌
                </p>
                <h2 className="text-3xl font-bold sm:text-4xl">
                  Pertanyaan Kamu
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-slate-400">
                  Karena takut bertanya sesat di jalan 😓
                </p>
          </div>
          
          <TripAsk/>
        </div>
      </section>

      <Footer />
    </main>
  );
}