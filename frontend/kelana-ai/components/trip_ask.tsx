"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** ISO string */
  timestamp: string;
  documents?: string[];
}

interface AskResponse {
  question: string;
  answer: string;
  documents: string[];
}

interface TripAskProps {
  apiUrl?: string;
  /** Conversation title shown in the header */
  title?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFull(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      {/* AI avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 text-base">
        🤖
      </div>

      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-3">
        <span
          className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
        <span className="ml-2 text-xs text-slate-400">
          AI sedang mengetik…
        </span>
      </div>
    </div>
  );
}

// ─── Chat Bubble ──────────────────────────────────────────────────────────────

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base ${
          isUser
            ? "border border-indigo-400/30 bg-indigo-500/10"
            : "border border-cyan-400/30 bg-cyan-500/10"
        }`}
      >
        {isUser ? "🧑" : "🤖"}
      </div>

      {/* Bubble + timestamp */}
      <div
        className={`flex max-w-[75%] flex-col gap-1 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
            isUser
              ? "rounded-br-sm border border-indigo-500/20 bg-indigo-500/10 text-slate-200"
              : "rounded-bl-sm border border-white/10 bg-white/5 text-slate-200"
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div
              className="prose prose-sm prose-invert max-w-none
                [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-2 [&_h1]:mt-3
                [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mb-2 [&_h2]:mt-3
                [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-cyan-300 [&_h3]:mb-1 [&_h3]:mt-2
                [&_p]:mb-2 [&_p]:leading-6 [&_p]:last:mb-0
                [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2 [&_ul]:space-y-0.5
                [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2 [&_ol]:space-y-0.5
                [&_li]:text-slate-300
                [&_strong]:text-white [&_strong]:font-semibold
                [&_code]:rounded [&_code]:bg-slate-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-cyan-300
                [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:overflow-x-auto [&_pre]:mb-2
                [&_blockquote]:border-l-2 [&_blockquote]:border-cyan-500/50 [&_blockquote]:pl-3 [&_blockquote]:text-slate-400 [&_blockquote]:italic
                [&_hr]:border-white/10 [&_hr]:my-2"
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}

          {/* Source documents – assistant only */}
          {!isUser &&
            message.documents &&
            message.documents.length > 0 && (
              <div className="mt-3 border-t border-white/10 pt-2">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Sources
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {message.documents.map((doc, i) => (
                    <span
                      key={`${doc}-${i}`}
                      className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-400"
                    >
                      📄 {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Timestamp */}
        <time
          dateTime={message.timestamp}
          title={formatFull(message.timestamp)}
          className="px-1 text-[10px] text-slate-600 cursor-default select-none"
        >
          {formatTime(message.timestamp)}
        </time>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TripAsk({
  apiUrl = process.env.NEXT_PUBLIC_API_URL,
  title = "KelanaAI Chat",
}: TripAskProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll: fires on initial open and whenever messages list or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleAsk(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = question.trim();
    if (!trimmed) {
      setError("Pertanyaan tidak boleh kosong.");
      return;
    }

    setError("");

    // Add user message immediately
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");

    // Show typing indicator while waiting for AI
    setIsTyping(true);

    try {
      const endpoint = apiUrl ? `${apiUrl}/ask` : "/api/v1/ask";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      const data: AskResponse = await res.json();

      if (!res.ok) {
        throw new Error(
          (data as unknown as { detail?: string })?.detail ||
            "Gagal mendapatkan jawaban."
        );
      }

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date().toISOString(),
        documents: data.documents,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Terjadi kesalahan."
      );
    } finally {
      setIsTyping(false);
    }
  }

  // Enter submits, Shift+Enter inserts newline
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10">

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* ── Header – Conversation Title ─────────────────────────────────── */}
      <div className="relative flex items-center gap-3 border-b border-white/10 bg-black/20 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-xl">
          🤖
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-white">
            {title}
          </h2>
          <p className="text-xs text-slate-400">
            Tanya apa saja tentang perjalananmu
          </p>
        </div>

        {/* Online status indicator */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="text-xs text-emerald-400">Online</span>
        </div>
      </div>

      {/* ── Message List ────────────────────────────────────────────────── */}
      <div
        className={`relative flex flex-col gap-4 overflow-y-auto px-5 py-5 scroll-smooth ${
          hasMessages ? "h-[420px]" : "h-auto"
        }`}
      >
        {/* Empty state */}
        {!hasMessages && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-4xl">✈️</div>
            <p className="text-sm font-medium text-slate-400">
              Belum ada percakapan
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Kirim pertanyaan pertamamu di bawah
            </p>
          </div>
        )}

        {/* Chat bubbles */}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Invisible anchor for auto-scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ──────────────────────────────────────────────────── */}
      <div className="relative border-t border-white/10 bg-black/10 px-5 py-4">

        {/* Error banner */}
        {error && (
          <div className="mb-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleAsk} className="flex items-end gap-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            rows={1}
            placeholder="Ketik pertanyaan… (Enter kirim, Shift+Enter baris baru)"
            className="min-h-[44px] flex-1 resize-none rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm leading-6 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          />

          <button
            type="submit"
            disabled={isTyping || !question.trim()}
            aria-label="Kirim pesan"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-lg text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isTyping ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 rotate-90"
                aria-hidden="true"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            )}
          </button>
        </form>

        <p className="mt-2 text-center text-[10px] text-slate-600">
          Powered by AWS Bedrock · KelanaAI
        </p>
      </div>
    </div>
  );
}
