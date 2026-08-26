import ReactMarkdown from "react-markdown";

interface TripResultsProps {
  result: any;
  loading: boolean;
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/10 ${className ?? ""}`}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      {/* Header */}
      <div className="mb-6">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="mt-3 h-9 w-56" />
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-black/20 p-5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-3 h-6 w-24" />
          </div>
        ))}
      </div>

      {/* AI content */}
      <div className="mt-8">
        <Skeleton className="h-6 w-40" />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-[70%]" />
        </div>
      </div>

      {/* Generating label */}
      <div className="mt-6 flex items-center gap-2 text-sm text-cyan-400">
        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:0ms]" />
        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:150ms]" />
        <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />
        <span className="ml-1">AI sedang membuat rencana perjalananmu...</span>
      </div>

    </div>
  );
}

export default function TripResults({
  result,
  loading,
}: TripResultsProps) {

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
        <p className="text-slate-500">
          Generate your trip to see the AI recommendation.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <div className="mb-6">
        <p className="text-sm uppercase tracking-widest text-cyan-400">
          AI Recommendation
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {result.destination}
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl bg-black/20 p-5">
          <p className="text-sm text-slate-400">
            Duration
          </p>

          <p className="mt-2 text-xl font-semibold">
            {result.days} Days
          </p>
        </div>

        <div className="rounded-2xl bg-black/20 p-5">
          <p className="text-sm text-slate-400">
            Budget
          </p>

          <p className="mt-2 text-xl font-semibold">
            Rp {result.budget?.toLocaleString("id-ID")}
          </p>
        </div>

        <div className="rounded-2xl bg-black/20 p-5">
          <p className="text-sm text-slate-400">
            Style
          </p>

          <p className="mt-2 text-xl font-semibold capitalize">
            {result.travel_style}
          </p>
        </div>

      </div>

      <div className="mt-8">
        <h4 className="text-xl font-semibold">
          ✨ AI Travel Plan
        </h4>

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
            {result.ai_recommendation}
          </ReactMarkdown>
        </div>
      </div>

    </div>
  );
}
