"use client";

import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Beranda", href: "#" },
  { label: "Buat Trip", href: "#results" },
  { label: "Destinasi", href: "#destinasi" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add background blur when scrolled
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-slate-950/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <a href="#" className="text-xl font-bold text-white">
          Kelana<span className="text-cyan-400">AI</span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#results"
          className="hidden rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-cyan-400 md:block"
        >
          Mulai Gratis
        </a>

        {/* Hamburger button (mobile) */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white md:hidden"
        >
          {menuOpen ? (
            // X icon
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Hamburger icon
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-6 py-4 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#results"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-xl bg-cyan-500 px-3 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-cyan-400"
            >
              Mulai Gratis
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
