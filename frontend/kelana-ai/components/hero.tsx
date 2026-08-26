import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

      {/* Background image */}
      <Image
        src="/ChatGPT Image 26 Agu 2026, 08.28.06.png"
        alt="KelanaAI hero background"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/50 to-slate-950" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 py-20 text-center">

        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          AI Travel Planner
        </p>

        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Kelana
          <span className="text-cyan-400"> AI</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Rencanakan petualanganmu berikutnya dengan AI. Beri tahu kami
          destinasi, anggaran, dan gaya perjalananmu. Kelana AI akan
          mengurus sisanya.
        </p>

        {/* Scroll hint */}
        <div className="mt-12 flex animate-bounce justify-center">
          <svg
            className="h-6 w-6 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

      </div>

    </section>
  );
}
