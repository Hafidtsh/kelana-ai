"use client";

import { FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown";

interface AskResponse {
  question: string;
  answer: string;
  documents: string[];
}

interface TripAskProps {
  apiUrl?: string;
}

export default function TripAsk({
  apiUrl = process.env.NEXT_PUBLIC_API_URL,
}: TripAskProps) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Pertanyaan tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      // NEXT_PUBLIC_API_URL already includes /api/v1 (e.g. http://localhost:8000/api/v1)
      // so we only append /ask
      const endpoint = apiUrl
        ? `${apiUrl}/ask`
        : "/api/v1/ask";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.detail || "Gagal mendapatkan jawaban."
        );
      }

      setResponse(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative p-5">

        {/* Header */}
        <div className="mb-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-xl">
              🤖
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Trip Ask
              </h2>

              <p className="text-sm text-slate-400">
                Tanya apa saja tentang perjalananmu
              </p>
            </div>
          </div>
        </div>

        {/* Question Form */}
        <form
          onSubmit={handleAsk}
          className="space-y-3"
        >
          <textarea
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            disabled={loading}
            rows={4}
            placeholder="Contoh: Apa tempat wisata menarik di Bandung?"
            className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-sm leading-6 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          />

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Ask Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
                  Thinking...
                </span>
              ) : (
                "✨ Ask"
              )}
            </button>
          </div>
        </form>

        {/* Answer */}
        {response && (
          <div className="mt-6 space-y-4 border-t border-white/10 pt-5">

            {/* Question */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pertanyaan
              </p>

              <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300">
                {response.question}
              </div>
            </div>

            {/* Answer */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Jawaban
              </p>

              <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4">
                <div className="prose prose-sm prose-invert max-w-none text-slate-200
                  [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-2 [&_h1]:mt-4
                  [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mb-2 [&_h2]:mt-3
                  [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-cyan-300 [&_h3]:mb-1 [&_h3]:mt-3
                  [&_p]:leading-7 [&_p]:mb-3
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
                  [&_li]:text-slate-300
                  [&_strong]:text-white [&_strong]:font-semibold
                  [&_em]:text-slate-300 [&_em]:italic
                  [&_code]:rounded [&_code]:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-cyan-300
                  [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre]:mb-3
                  [&_blockquote]:border-l-2 [&_blockquote]:border-cyan-500/50 [&_blockquote]:pl-3 [&_blockquote]:text-slate-400 [&_blockquote]:italic
                  [&_hr]:border-white/10 [&_hr]:my-3">
                  <ReactMarkdown>{response.answer}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Documents */}
            {response.documents &&
              response.documents.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Sources
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {response.documents.map(
                      (document, index) => (
                        <span
                          key={`${document}-${index}`}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400"
                        >
                          📄 {document}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
