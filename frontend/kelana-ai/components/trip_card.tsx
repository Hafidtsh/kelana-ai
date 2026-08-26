import Image from "next/image";

interface TripCardProps {
  image: string;
  destination: string;
  description: string;
  days: number;
  budget: string;
  style: string;
}

export default function TripCard({
  image,
  destination,
  description,
  days,
  budget,
  style,
}: TripCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-cyan-500/10 hover:shadow-2xl">

      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={image}
          alt={destination}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Style badge */}
        <span className="absolute left-4 top-4 rounded-full border border-cyan-400/30 bg-cyan-500/20 px-3 py-1 text-xs font-semibold capitalize text-cyan-300 backdrop-blur-sm">
          {style}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-bold text-white">
          {destination}
        </h3>

        <p className="flex-1 text-sm leading-6 text-slate-400">
          {description}
        </p>

        {/* Stats */}
        <div className="mt-2 flex items-center gap-4 border-t border-white/10 pt-4 text-sm text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400">🗓</span>
            <span>{days} hari</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-cyan-400">💰</span>
            <span>{budget}</span>
          </div>
        </div>
      </div>

    </div>
  );
}


// =========================
// Sample data for showcase
// =========================
export const SAMPLE_TRIPS: TripCardProps[] = [
  {
    image: "/pexels-satoshi-13598678.jpg",
    destination: "Tokyo, Jepang",
    description:
      "Jelajahi kota yang memadukan tradisi dan teknologi futuristik. Dari kuil Senso-ji hingga lampu neon Shibuya.",
    days: 7,
    budget: "Rp 15.000.000",
    style: "culture",
  },
  {
    image: "/pexels-i-gede-anggara-upadana-415018356-15106473.jpg",
    destination: "Bali, Indonesia",
    description:
      "Surga tropis dengan sawah berundak, pantai memukau, dan budaya Hindu yang kaya. Sempurna untuk relaksasi.",
    days: 5,
    budget: "Rp 8.000.000",
    style: "relaxation",
  },
  {
    image: "/pexels-alejandro-aznar-155337093-20413295.jpg",
    destination: "Patagonia, Argentina",
    description:
      "Petualangan ekstrem di ujung dunia. Glacier megah, puncak Torres del Paine, dan alam liar yang belum terjamah.",
    days: 10,
    budget: "Rp 25.000.000",
    style: "adventure",
  },
  {
    image: "/pexels-alleksana-4239627.jpg",
    destination: "Santorini, Yunani",
    description:
      "Pulau Aegea dengan bangunan putih ikonik, sunset terbaik di dunia, dan wine lokal yang tak terlupakan.",
    days: 6,
    budget: "Rp 20.000.000",
    style: "luxury",
  },
  {
    image: "/pexels-nguyen-khac-tien-252426281-12544861.jpg",
    destination: "Ha Long Bay, Vietnam",
    description:
      "Ribuan pulau karst menjulang dari lautan hijau toska. Nikmati cruise dan kayak di antara tebing-tebing dramatis.",
    days: 4,
    budget: "Rp 6.000.000",
    style: "adventure",
  },
  {
    image: "/pexels-boris-dahm-2150922402-31729742.jpg",
    destination: "Swiss Alps, Swiss",
    description:
      "Pegunungan bersalju, desa-desa cozy, dan udara pegunungan yang segar. Surga bagi pecinta alam dan ski.",
    days: 8,
    budget: "Rp 30.000.000",
    style: "luxury",
  },
];
