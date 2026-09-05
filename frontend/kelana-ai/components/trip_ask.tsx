"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { authHeaders, getToken } from "@/services/AuthService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  documents?: string[];
}

interface ConversationMeta {
  id: number;
  title: string | null;
  created_at: string;
}

interface TripAskProps {
  apiUrl?: string;
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-500/10 text-base">
        🤖
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
        <span className="ml-2 text-xs text-slate-400">AI sedang mengetik…</span>
      </div>
    </div>
  );
}

// ─── Chat Bubble ──────────────────────────────────────────────────────────────

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base ${
          isUser
            ? "border border-indigo-400/30 bg-indigo-500/10"
            : "border border-cyan-400/30 bg-cyan-500/10"
        }`}
      >
        {isUser ? "🧑" : "🤖"}
      </div>

      <div className={`flex max-w-[75%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
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
            <div className="prose prose-sm prose-invert max-w-none
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
              [&_hr]:border-white/10 [&_hr]:my-2">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}

          {!isUser && message.documents && message.documents.length > 0 && (
            <div className="mt-3 border-t border-white/10 pt-2">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {message.documents.map((doc, i) => (
                  <span key={`${doc}-${i}`} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                    📄 {doc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

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

// ─── Conversation Sidebar ─────────────────────────────────────────────────────

interface SidebarProps {
  conversations: ConversationMeta[];
  activeId: number | null;
  loading: boolean;
  onSelect: (id: number) => void;
  onNew: () => void;
  onDelete: (id: number) => void;
}

function ConversationSidebar({
  conversations,
  activeId,
  loading,
  onSelect,
  onNew,
  onDelete,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col border-r border-white/10">
      {/* Sidebar header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-3 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Riwayat
        </span>
        <button
          onClick={onNew}
          title="Percakapan baru"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 transition hover:bg-cyan-500/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex flex-col gap-2 p-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        )}

        {!loading && conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-3 text-center">
            <span className="text-2xl">💬</span>
            <p className="mt-2 text-xs text-slate-500">Belum ada percakapan</p>
          </div>
        )}

        {!loading && conversations.map((c) => (
          <div
            key={c.id}
            className={`group/item relative mx-2 my-1 flex cursor-pointer items-start gap-2 rounded-xl px-3 py-2.5 transition ${
              activeId === c.id
                ? "border border-cyan-500/30 bg-cyan-500/10"
                : "border border-transparent hover:border-white/10 hover:bg-white/5"
            }`}
            onClick={() => onSelect(c.id)}
          >
            <div className="min-w-0 flex-1">
              <p className={`truncate text-xs font-medium leading-5 ${activeId === c.id ? "text-cyan-300" : "text-slate-300"}`}>
                {c.title ?? "Percakapan baru"}
              </p>
              <p className="text-[10px] text-slate-600">{formatDate(c.created_at)}</p>
            </div>

            {/* Delete button – appears on hover */}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
              title="Hapus percakapan"
              className="mt-0.5 shrink-0 opacity-0 transition group-hover/item:opacity-100 text-slate-600 hover:text-red-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5">
                <path fillRule="evenodd" d="M5 3.25V4H2.75a.75.75 0 000 1.5h.3l.815 8.15A1.5 1.5 0 005.357 15h5.285a1.5 1.5 0 001.493-1.35l.815-8.15h.3a.75.75 0 000-1.5H11v-.75A2.25 2.25 0 008.75 1h-1.5A2.25 2.25 0 005 3.25zm2.25-.75a.75.75 0 00-.75.75V4h3v-.75a.75.75 0 00-.75-.75h-1.5zM6.05 6a.75.75 0 01.787.713l.275 5.5a.75.75 0 01-1.498.075l-.275-5.5A.75.75 0 016.05 6zm3.9 0a.75.75 0 01.712.787l-.275 5.5a.75.75 0 01-1.498-.075l.275-5.5a.75.75 0 01.786-.712z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TripAsk({
  apiUrl = process.env.NEXT_PUBLIC_API_URL,
  title = "KelanaAI Chat",
}: TripAskProps) {
  const base = apiUrl ?? "";

  // ── Auth (client-only to avoid hydration mismatch) ────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => { setIsLoggedIn(Boolean(getToken())); }, []);

  // ── Sidebar state ─────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(false);

  // ── Active conversation & messages ────────────────────────────────────────
  const [activeConvo, setActiveConvo] = useState<ConversationMeta | null>(null);
  const conversationIdRef = useRef<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // ── Input state ───────────────────────────────────────────────────────────
  const [question, setQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll: scroll hanya di dalam container chat, tidak scroll halaman utama
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Fetch sidebar list ────────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    if (!isLoggedIn) return;
    setSidebarLoading(true);
    try {
      const res = await fetch(`${base}/api/v1/conversations`, { headers: authHeaders() });
      if (res.ok) setConversations(await res.json());
    } finally {
      setSidebarLoading(false);
    }
  }, [isLoggedIn, base]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // ── Load a conversation into chat ─────────────────────────────────────────
  async function loadConversation(id: number) {
    setError("");
    setMessages([]);
    setActiveConvo(null);
    conversationIdRef.current = null;

    try {
      const res = await fetch(`${base}/api/v1/conversations/${id}`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Gagal memuat percakapan.");
      const data = await res.json();

      conversationIdRef.current = data.id;
      setActiveConvo({ id: data.id, title: data.title, created_at: data.created_at });

      // Map server messages → local Message shape
      const loaded: Message[] = (data.messages ?? []).map((m: {
        id: number; role: string; content: string; created_at: string;
      }) => ({
        id: String(m.id),
        role: m.role as "user" | "assistant",
        content: m.content,
        timestamp: m.created_at,
      }));
      setMessages(loaded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  }

  // ── Start a brand-new conversation ───────────────────────────────────────
  function startNewConversation() {
    setActiveConvo(null);
    conversationIdRef.current = null;
    setMessages([]);
    setError("");
    setQuestion("");
  }

  // ── Delete a conversation ─────────────────────────────────────────────────
  async function deleteConversation(id: number) {
    try {
      await fetch(`${base}/api/v1/conversations/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (conversationIdRef.current === id) startNewConversation();
    } catch {
      // silent – list will still update optimistically
    }
  }

  // ── Ensure a conversation exists, create if needed ────────────────────────
  async function ensureConversation(firstQuestion: string): Promise<number> {
    if (conversationIdRef.current !== null) return conversationIdRef.current;

    const res = await fetch(`${base}/api/v1/conversations`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title: firstQuestion.slice(0, 60) }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.detail ?? "Gagal membuat percakapan.");
    }
    const data: ConversationMeta = await res.json();
    conversationIdRef.current = data.id;
    setActiveConvo(data);
    // Prepend to sidebar
    setConversations((prev) => [data, ...prev]);
    return data.id;
  }

  // ── Send message ──────────────────────────────────────────────────────────
  async function handleAsk(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) { setError("Pertanyaan tidak boleh kosong."); return; }
    setError("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setIsTyping(true);

    try {
      if (isLoggedIn) {
        const convoId = await ensureConversation(trimmed);
        const res = await fetch(`${base}/api/v1/conversations/${convoId}/ask`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ question: trimmed }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail ?? "Gagal mendapatkan jawaban.");

        // Refresh title in sidebar if it just got set
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convoId ? { ...c, title: data.title ?? c.title } : c
          )
        );
        // Also refresh from server for accurate title
        const metaRes = await fetch(`${base}/api/v1/conversations/${convoId}`, { headers: authHeaders() });
        if (metaRes.ok) {
          const meta = await metaRes.json();
          setActiveConvo({ id: meta.id, title: meta.title, created_at: meta.created_at });
          setConversations((prev) =>
            prev.map((c) => c.id === meta.id ? { id: meta.id, title: meta.title, created_at: meta.created_at } : c)
          );
        }

        setMessages((prev) => [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
          timestamp: new Date().toISOString(),
          documents: data.documents,
        }]);
      } else {
        // Guest — stateless
        const res = await fetch(`${base}/api/v1/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmed }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail ?? "Gagal mendapatkan jawaban.");
        setMessages((prev) => [...prev, {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
          timestamp: new Date().toISOString(),
          documents: data.documents,
        }]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  const hasMessages = messages.length > 0;
  const displayTitle = activeConvo?.title ?? title;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition-all duration-300 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10">
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* ── Two-column layout ───────────────────────────────────────────── */}
      <div className={`relative grid ${isLoggedIn && sidebarOpen ? "grid-cols-[220px_1fr]" : "grid-cols-1"} transition-all duration-300`}>

        {/* ── Sidebar (logged-in only) ──────────────────────────────────── */}
        {isLoggedIn && sidebarOpen && (
          <ConversationSidebar
            conversations={conversations}
            activeId={activeConvo?.id ?? null}
            loading={sidebarLoading}
            onSelect={loadConversation}
            onNew={startNewConversation}
            onDelete={deleteConversation}
          />
        )}

        {/* ── Chat panel ───────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col">

          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-black/20 px-4 py-4">
            {/* Toggle sidebar button (logged-in only) */}
            {isLoggedIn && (
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                title={sidebarOpen ? "Sembunyikan riwayat" : "Tampilkan riwayat"}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-500/10 text-lg">
              🤖
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate text-sm font-bold text-white" title={displayTitle}>
                {displayTitle}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isLoggedIn
                  ? activeConvo ? `Percakapan #${activeConvo.id}` : "Percakapan baru"
                  : "Mode tamu · tidak disimpan"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-xs text-emerald-400">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className={`flex flex-col gap-4 overflow-y-auto px-4 py-5 scroll-smooth ${
              hasMessages ? "h-[400px]" : "h-auto"
            }`}
          >
            {!hasMessages && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-3 text-4xl">✈️</div>
                <p className="text-sm font-medium text-slate-400">Belum ada percakapan</p>
                <p className="mt-1 text-xs text-slate-600">
                  {isLoggedIn ? "Kirim pertanyaan atau pilih riwayat di samping" : "Login untuk menyimpan percakapan"}
                </p>
              </div>
            )}

            {messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Input */}
          <div className="border-t border-white/10 bg-black/10 px-4 py-4">
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
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isTyping ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300/30 border-t-cyan-300" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 rotate-90" aria-hidden="true">
                    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                  </svg>
                )}
              </button>
            </form>

            <p className="mt-2 text-center text-[10px] text-slate-600">
              Powered by AWS Bedrock · KelanaAI
              {!isLoggedIn && (
                <span className="ml-1 text-amber-600">
                  {" "}·{" "}
                  <a href="/login" className="underline hover:text-amber-400">Login</a> untuk simpan percakapan
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
