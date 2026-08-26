const FOOTER_LINKS = {
  Product: [
    { label: "Fitur", href: "#" },
    { label: "Cara Kerja", href: "#" },
    { label: "Destinasi", href: "#" },
  ],
  Dukungan: [
    { label: "FAQ", href: "#" },
    { label: "Hubungi Kami", href: "#" },
    { label: "Kebijakan Privasi", href: "#" },
  ],
  Teknologi: [
    { label: "Amazon Bedrock", href: "https://aws.amazon.com/bedrock/" },
    { label: "Next.js", href: "https://nextjs.org/" },
    { label: "FastAPI", href: "https://fastapi.tiangolo.com/" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 pt-16 pb-8 text-white">
      <div className="mx-auto max-w-6xl">

        {/* Top row */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="text-2xl font-bold">
              Kelana<span className="text-cyan-400">AI</span>
            </p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              Perencana perjalanan berbasis AI yang merancang itinerary
              personal sesuai destinasi, anggaran, dan gaya perjalananmu.
            </p>

            {/* Powered by badge */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Powered by Amazon Bedrock
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cyan-400">
                {group}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Divider */}
        <div className="my-10 border-t border-white/10" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} KelanaAI. Dibuat dengan ☕ dan AI.
          </p>

          <div className="flex items-center gap-1 text-sm text-slate-500">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span>API Online</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
